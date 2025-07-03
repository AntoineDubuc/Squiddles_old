/**
 * Jira API Client
 * Handles authentication and requests to Jira REST API
 */

import { z } from 'zod';
import axios, { AxiosInstance } from 'axios';

// Types
export interface JiraConfig {
  host: string;
  email: string;
  apiToken: string;
}

export interface JiraTicket {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string | null;
    status: {
      name: string;
      statusCategory: {
        key: string;
      };
    };
    priority: {
      name: string;
      id: string;
    };
    issuetype: {
      name: string;
      id: string;
    };
    assignee?: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
    };
    reporter: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
    };
    created: string;
    updated: string;
    project: {
      key: string;
      name: string;
    };
    sprint?: {
      id: number;
      name: string;
      state: string;
    };
  };
}

export interface JiraComment {
  id: string;
  author: {
    accountId: string;
    displayName: string;
    avatarUrls?: {
      '48x48': string;
    };
  };
  body: any; // ADF format or string
  created: string;
  updated: string;
}

// ADF (Atlassian Document Format) types for rich comments
export interface AdfDocument {
  type: 'doc';
  version: 1;
  content: AdfNode[];
}

export interface AdfNode {
  type: string;
  attrs?: Record<string, any>;
  content?: AdfNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

export interface CommentInput {
  body: AdfDocument | string;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
}

export class JiraClient {
  private config: JiraConfig;
  private client: AxiosInstance;

  constructor() {
    this.config = {
      host: process.env.JIRA_HOST || process.env.JIRA_BASE_URL || '',
      email: process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL || '',
      apiToken: process.env.JIRA_API_TOKEN || '',
    };

    // Debug logging for server-side only
    if (typeof window === 'undefined') {
      console.log('🔧 JiraClient initialized:', {
        host: this.config.host ? 'configured' : 'missing',
        email: this.config.email ? 'configured' : 'missing',
        apiToken: this.config.apiToken ? 'configured' : 'missing'
      });
    }

    if (!this.config.host || !this.config.email || !this.config.apiToken) {
      throw new Error('Missing Jira configuration. Please set JIRA_HOST/JIRA_BASE_URL, JIRA_EMAIL/JIRA_USER_EMAIL, and JIRA_API_TOKEN');
    }

    // Create axios client with authentication
    const auth = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString('base64');
    
    this.client = axios.create({
      baseURL: `${this.config.host}/rest/api/3`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  // Expose axios client for API route compatibility
  get = this.client.get.bind(this.client);
  post = this.client.post.bind(this.client);
  put = this.client.put.bind(this.client);
  delete = this.client.delete.bind(this.client);

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<JiraUser> {
    const response = await this.client.get('/myself');
    return response.data;
  }

  /**
   * Get tickets for current sprint
   */
  async getSprintTickets(projectKey: string, sprintId?: number): Promise<JiraTicket[]> {
    let jql = `project = ${projectKey}`;
    
    if (sprintId) {
      jql += ` AND sprint = ${sprintId}`;
    } else {
      // Get active sprint tickets
      jql += ' AND sprint in openSprints()';
    }

    const response = await this.client.post('/search', {
      jql,
      fields: [
        'summary',
        'description',
        'status',
        'priority',
        'issuetype',
        'assignee',
        'reporter',
        'created',
        'updated',
        'project',
        'sprint',
      ],
      maxResults: 100,
    });

    return response.data.issues || [];
  }

  /**
   * Get comments for a ticket
   */
  async getTicketComments(ticketKey: string): Promise<JiraComment[]> {
    const response = await this.client.get(`/issue/${ticketKey}/comment`);
    return response.data.comments || [];
  }

  /**
   * Get comments for multiple tickets
   */
  async getBatchComments(ticketKeys: string[]): Promise<Map<string, JiraComment[]>> {
    const commentMap = new Map<string, JiraComment[]>();

    // Batch requests to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < ticketKeys.length; i += batchSize) {
      const batch = ticketKeys.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (key) => {
          try {
            const comments = await this.getTicketComments(key);
            commentMap.set(key, comments);
          } catch (error) {
            console.error(`Failed to get comments for ${key}:`, error);
            commentMap.set(key, []);
          }
        })
      );
      
      // Small delay to respect rate limits
      if (i + batchSize < ticketKeys.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return commentMap;
  }

  /**
   * Get user's teams (projects where user is a member)
   */
  async getUserProjects(): Promise<Array<{ key: string; name: string }>> {
    const response = await this.client.get('/project/search');
    return (response.data.values || []).map((project: any) => ({
      key: project.key,
      name: project.name,
    }));
  }

  /**
   * Search for tickets with JQL
   */
  async searchTickets(jql: string, fields?: string[]): Promise<JiraTicket[]> {
    const response = await this.client.post('/search', {
      jql,
      fields: fields || [
        'summary',
        'description',
        'status',
        'priority',
        'issuetype',
        'assignee',
        'reporter',
        'created',
        'updated',
      ],
      maxResults: 50,
    });

    return response.data.issues || [];
  }

  /**
   * Parse mentions from comment body
   */
  parseMentions(body: string): string[] {
    // Jira mentions format: [~accountid:123456]
    const mentionRegex = /\[~accountid:([^\]]+)\]/g;
    const mentions: string[] = [];
    
    let match;
    while ((match = mentionRegex.exec(body)) !== null) {
      mentions.push(match[1]);
    }
    
    return mentions;
  }

  /**
   * Check if comment mentions a specific user
   */
  isUserMentioned(comment: JiraComment, userAccountId: string): boolean {
    const mentions = this.parseMentions(comment.body);
    return mentions.includes(userAccountId);
  }

  /**
   * Create ADF document from plain text
   */
  private createPlainTextAdf(text: string): AdfDocument {
    return {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: text
            }
          ]
        }
      ]
    };
  }

  /**
   * Add a comment to a Jira ticket
   */
  async addComment(ticketKey: string, comment: string | AdfDocument): Promise<JiraComment> {
    // Convert string to ADF format if needed
    const commentBody = typeof comment === 'string' 
      ? this.createPlainTextAdf(comment)
      : comment;

    const payload = {
      body: commentBody
    };

    try {
      const response = await this.client.post(`/issue/${ticketKey}/comment`, payload);
      
      // Log success for debugging (server-side only)
      if (typeof window === 'undefined') {
        console.log(`✅ Comment added to ${ticketKey}:`, {
          commentId: response.data.id,
          author: response.data.author.displayName,
          created: response.data.created
        });
      }

      return response.data;
    } catch (error) {
      // Log error for debugging (server-side only)
      if (typeof window === 'undefined') {
        console.error(`❌ Failed to add comment to ${ticketKey}:`, error);
      }
      throw error;
    }
  }

  /**
   * Update an existing comment
   */
  async updateComment(ticketKey: string, commentId: string, comment: string | AdfDocument): Promise<JiraComment> {
    // Convert string to ADF format if needed
    const commentBody = typeof comment === 'string' 
      ? this.createPlainTextAdf(comment)
      : comment;

    const payload = {
      body: commentBody
    };

    try {
      const response = await this.client.put(`/issue/${ticketKey}/comment/${commentId}`, payload);
      return response.data;
    } catch (error) {
      if (typeof window === 'undefined') {
        console.error(`❌ Failed to update comment ${commentId} on ${ticketKey}:`, error);
      }
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(ticketKey: string, commentId: string): Promise<void> {
    try {
      await this.client.delete(`/issue/${ticketKey}/comment/${commentId}`);

      if (typeof window === 'undefined') {
        console.log(`✅ Comment ${commentId} deleted from ${ticketKey}`);
      }
    } catch (error) {
      if (typeof window === 'undefined') {
        console.error(`❌ Failed to delete comment ${commentId} on ${ticketKey}:`, error);
      }
      throw error;
    }
  }

  /**
   * Create a comment with user mention
   */
  createMentionComment(text: string, userAccountId: string, userName: string): AdfDocument {
    return {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'mention',
              attrs: {
                id: userAccountId,
                text: `@${userName}`,
                userType: 'DEFAULT'
              }
            },
            {
              type: 'text',
              text: ` ${text}`
            }
          ]
        }
      ]
    };
  }
}

// Export singleton instance
let jiraClient: JiraClient | null = null;

export function getJiraClient(): JiraClient {
  if (!jiraClient) {
    jiraClient = new JiraClient();
  }
  return jiraClient;
}