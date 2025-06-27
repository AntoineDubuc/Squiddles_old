/**
 * Jira Ticket and Comment Indexer for Pinecone
 * Converts Jira tickets and comments to indexed documents with metadata
 */

import { JiraDocument, DocumentType, getMultiSourcePineconeService } from '../multiSourceService';

// Import existing Jira utilities
import { getJiraClient, JiraClient } from '../../../../development-archive/integrations/jira/jiraClient';

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: string;
    issuetype: { name: string; id: string };
    status: { name: string; id: string };
    priority: { name: string; id: string };
    assignee?: { accountId: string; displayName: string; emailAddress?: string };
    reporter: { accountId: string; displayName: string; emailAddress?: string };
    created: string;
    updated: string;
    labels: string[];
    components: Array<{ name: string }>;
    project: { key: string; name: string };
    comment?: {
      comments: Array<{
        id: string;
        author: { accountId: string; displayName: string; emailAddress?: string };
        body: any; // ADF format
        created: string;
        updated: string;
      }>;
    };
  };
}

export class JiraIndexer {
  private pineconeService = getMultiSourcePineconeService();
  private jiraClient: JiraClient | null = null;

  private getJiraClient(): JiraClient {
    if (!this.jiraClient) {
      this.jiraClient = getJiraClient();
    }
    return this.jiraClient;
  }

  /**
   * Enhanced search with pagination support
   */
  private async searchIssuesWithPagination(jql: string, fields: string[], startAt: number = 0, maxResults: number = 50): Promise<{ issues: any[], total: number }> {
    const response = await fetch(`${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql,
        fields,
        startAt,
        maxResults,
        expand: ['comment']
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to search issues: ${error}`);
    }

    const data = await response.json();
    return {
      issues: data.issues || [],
      total: data.total || 0
    };
  }

  /**
   * Index recent tickets (updated in last N days)
   */
  async indexRecentTickets(daysBack: number = 30): Promise<void> {
    try {
      console.log(`🎫 Starting Jira indexing for tickets updated in last ${daysBack} days`);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);
      
      const jql = `updated >= "${cutoffDate.toISOString().split('T')[0]}" ORDER BY updated DESC`;
      await this.indexTicketsByJQL(jql);

    } catch (error) {
      console.error('❌ Error indexing recent Jira tickets:', error);
      throw error;
    }
  }

  /**
   * Index tickets matching a JQL query
   */
  async indexTicketsByJQL(jql: string): Promise<void> {
    try {
      console.log(`🎫 Indexing Jira tickets with JQL: ${jql}`);

      let startAt = 0;
      const maxResults = 50;
      let hasMore = true;

      while (hasMore) {
        const { issues, total } = await this.searchIssuesWithPagination(jql, [
          'summary', 'description', 'issuetype', 'status', 'priority',
          'assignee', 'reporter', 'created', 'updated', 'labels',
          'components', 'project', 'comment'
        ], startAt, maxResults);
        
        if (issues.length === 0) {
          hasMore = false;
          break;
        }

        console.log(`📦 Processing ${issues.length} tickets (offset: ${startAt})`);
        
        const documents: JiraDocument[] = [];
        
        for (const issue of issues) {
          try {
            // Index the ticket itself
            const ticketDoc = this.convertTicketToDocument(issue);
            if (ticketDoc) {
              documents.push(ticketDoc);
            }

            // Index comments
            if (issue.fields.comment?.comments) {
              for (const comment of issue.fields.comment.comments) {
                const commentDoc = this.convertCommentToDocument(issue, comment);
                if (commentDoc) {
                  documents.push(commentDoc);
                }
              }
            }

          } catch (error) {
            console.error(`❌ Error processing ticket ${issue.key}:`, error);
          }
        }

        if (documents.length > 0) {
          await this.pineconeService.indexDocuments(documents);
          console.log(`✅ Indexed ${documents.length} Jira documents (tickets + comments)`);
        }

        startAt += maxResults;
        hasMore = issues.length === maxResults;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log(`✅ Completed Jira indexing for JQL: ${jql}`);

    } catch (error) {
      console.error('❌ Error indexing Jira tickets:', error);
      throw error;
    }
  }

  /**
   * Index a single ticket by key
   */
  async indexTicketByKey(ticketKey: string): Promise<void> {
    try {
      // Use the API directly for single issue
      const response = await fetch(`${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/issue/${ticketKey}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`,
          'Accept': 'application/json',
        },
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to get issue ${ticketKey}: ${response.statusText}`);
      }

      const issue = await response.json();

      const documents: JiraDocument[] = [];

      // Index the ticket
      const ticketDoc = this.convertTicketToDocument(issue);
      if (ticketDoc) {
        documents.push(ticketDoc);
      }

      // Index comments
      if (issue.fields.comment?.comments) {
        for (const comment of issue.fields.comment.comments) {
          const commentDoc = this.convertCommentToDocument(issue, comment);
          if (commentDoc) {
            documents.push(commentDoc);
          }
        }
      }

      if (documents.length > 0) {
        await this.pineconeService.indexDocuments(documents);
        console.log(`✅ Indexed ticket ${ticketKey} with ${documents.length} documents`);
      }

    } catch (error) {
      console.error(`❌ Error indexing ticket ${ticketKey}:`, error);
      throw error;
    }
  }

  /**
   * Index tickets with mentions of a specific user
   */
  async indexTicketsWithMentions(userAccountId: string, daysBack: number = 90): Promise<void> {
    try {
      console.log(`🎫 Indexing tickets with mentions of user: ${userAccountId}`);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);
      
      // Search for tickets with comments mentioning the user
      const jql = `comment ~ "${userAccountId}" AND updated >= "${cutoffDate.toISOString().split('T')[0]}" ORDER BY updated DESC`;
      
      await this.indexTicketsByJQL(jql);

    } catch (error) {
      console.error('❌ Error indexing tickets with mentions:', error);
      throw error;
    }
  }

  /**
   * Convert Jira issue to ticket document
   */
  private convertTicketToDocument(issue: JiraIssue): JiraDocument | null {
    try {
      const fields = issue.fields;
      
      // Extract description text (handle ADF format)
      const description = this.extractTextFromADF(fields.description) || '';
      const content = `${fields.summary}\n\n${description}`.trim();

      if (!content) {
        console.log(`⚠️ Skipping ticket ${issue.key} - no content`);
        return null;
      }

      // Detect mentioned users in description
      const mentions = this.extractMentions(description);
      
      // Detect related emails and pages
      const relatedEmails = this.extractEmailReferences(content);
      const relatedPages = this.extractConfluenceReferences(content);

      // Determine urgency level
      const urgencyLevel = this.determineUrgencyLevel(fields.priority.name, content);

      // Check for rich content
      const hasRichContent = this.hasRichContent(fields.description);

      const createdAt = new Date(fields.created);
      const updatedAt = new Date(fields.updated);

      return {
        id: `jira_ticket_${issue.key}`,
        type: DocumentType.JIRA_TICKET,
        title: `${issue.key}: ${fields.summary}`,
        content,
        url: `${process.env.JIRA_HOST}/browse/${issue.key}`,
        createdAt,
        updatedAt,
        author: {
          id: fields.reporter.accountId,
          name: fields.reporter.displayName,
          email: fields.reporter.emailAddress
        },
        ticketKey: issue.key,
        projectKey: fields.project.key,
        projectName: fields.project.name,
        metadata: {
          issueType: fields.issuetype.name,
          status: fields.status.name,
          priority: fields.priority.name,
          assignee: fields.assignee?.accountId,
          reporter: fields.reporter.accountId,
          labels: fields.labels || [],
          components: fields.components?.map(c => c.name) || [],
          mentions,
          hasRichContent,
          urgencyLevel,
          relatedEmails,
          relatedPages
        }
      };

    } catch (error) {
      console.error(`Error converting ticket ${issue.key} to document:`, error);
      return null;
    }
  }

  /**
   * Convert Jira comment to comment document
   */
  private convertCommentToDocument(issue: JiraIssue, comment: any): JiraDocument | null {
    try {
      // Extract comment text (handle ADF format)
      const content = this.extractTextFromADF(comment.body);
      
      if (!content || content.trim().length === 0) {
        return null;
      }

      // Detect mentioned users
      const mentions = this.extractMentions(content);
      
      // Detect related emails and pages
      const relatedEmails = this.extractEmailReferences(content);
      const relatedPages = this.extractConfluenceReferences(content);

      // Determine urgency level
      const urgencyLevel = this.determineUrgencyLevel(issue.fields.priority.name, content);

      // Check for rich content
      const hasRichContent = this.hasRichContent(comment.body);

      const createdAt = new Date(comment.created);
      const updatedAt = new Date(comment.updated);

      return {
        id: `jira_comment_${issue.key}_${comment.id}`,
        type: DocumentType.JIRA_COMMENT,
        title: `Comment on ${issue.key}`,
        content,
        url: `${process.env.JIRA_HOST}/browse/${issue.key}?focusedCommentId=${comment.id}`,
        createdAt,
        updatedAt,
        author: {
          id: comment.author.accountId,
          name: comment.author.displayName,
          email: comment.author.emailAddress
        },
        ticketKey: issue.key,
        projectKey: issue.fields.project.key,
        projectName: issue.fields.project.name,
        metadata: {
          issueType: issue.fields.issuetype.name,
          status: issue.fields.status.name,
          priority: issue.fields.priority.name,
          assignee: issue.fields.assignee?.accountId,
          reporter: issue.fields.reporter.accountId,
          labels: issue.fields.labels || [],
          components: issue.fields.components?.map(c => c.name) || [],
          mentions,
          hasRichContent,
          urgencyLevel,
          relatedEmails,
          relatedPages
        }
      };

    } catch (error) {
      console.error(`Error converting comment ${comment.id} to document:`, error);
      return null;
    }
  }

  /**
   * Extract plain text from Atlassian Document Format (ADF)
   */
  private extractTextFromADF(adf: any): string {
    if (!adf) return '';
    
    if (typeof adf === 'string') return adf;
    
    // Handle ADF structure
    if (adf.type === 'doc' && adf.content) {
      return this.extractTextFromADFContent(adf.content);
    }
    
    return JSON.stringify(adf);
  }

  /**
   * Recursively extract text from ADF content array
   */
  private extractTextFromADFContent(content: any[]): string {
    if (!Array.isArray(content)) return '';
    
    return content.map(node => {
      if (node.type === 'text') {
        return node.text || '';
      } else if (node.type === 'paragraph' && node.content) {
        return this.extractTextFromADFContent(node.content);
      } else if (node.type === 'mention' && node.attrs) {
        return `@${node.attrs.text || node.attrs.displayName || ''}`;
      } else if (node.content) {
        return this.extractTextFromADFContent(node.content);
      }
      return '';
    }).join(' ');
  }

  /**
   * Extract user mentions from text
   */
  private extractMentions(text: string): string[] {
    const mentions: string[] = [];
    
    // ADF mentions pattern: account IDs
    const accountIdMatches = text.match(/712020:[a-f0-9-]+/g) || [];
    mentions.push(...accountIdMatches);
    
    // Legacy mention patterns
    const legacyMatches = text.match(/@\w+/g) || [];
    mentions.push(...legacyMatches);
    
    return [...new Set(mentions)];
  }

  /**
   * Extract email references from text
   */
  private extractEmailReferences(text: string): string[] {
    const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    return [...new Set(emailMatches)];
  }

  /**
   * Extract Confluence page references from text
   */
  private extractConfluenceReferences(text: string): string[] {
    const confluenceMatches = text.match(/\/wiki\/spaces\/[A-Z]+\/pages\/\d+/g) || [];
    return [...new Set(confluenceMatches.map(match => match.split('/').pop() || ''))];
  }

  /**
   * Determine urgency level based on priority and content
   */
  private determineUrgencyLevel(priority: string, content: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerContent = content.toLowerCase();
    const urgentKeywords = ['urgent', 'critical', 'asap', 'immediately', 'emergency', 'blocked'];
    const hasUrgentKeywords = urgentKeywords.some(keyword => lowerContent.includes(keyword));
    
    if (priority === 'Highest' || priority === 'Critical' || hasUrgentKeywords) {
      return 'critical';
    } else if (priority === 'High') {
      return 'high';
    } else if (priority === 'Medium') {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Check if content has rich formatting
   */
  private hasRichContent(adf: any): boolean {
    if (!adf || typeof adf !== 'object') return false;
    
    const contentString = JSON.stringify(adf);
    
    // Check for rich content indicators
    return contentString.includes('table') ||
           contentString.includes('media') ||
           contentString.includes('codeblock') ||
           contentString.includes('panel') ||
           contentString.includes('expand');
  }

  /**
   * Get indexing statistics
   */
  async getIndexingStats(projectKey?: string): Promise<{ totalTickets: number; recentTickets: number; totalComments: number }> {
    try {
      // Get total tickets
      const totalJql = projectKey ? `project = "${projectKey}"` : 'project is not empty';
      const { total: totalTickets } = await this.searchIssuesWithPagination(totalJql, ['key'], 0, 1);

      // Get recent tickets (last 7 days)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      const recentJql = projectKey 
        ? `project = "${projectKey}" AND updated >= "${cutoffDate.toISOString().split('T')[0]}"`
        : `updated >= "${cutoffDate.toISOString().split('T')[0]}"`;
      
      const { total: recentTickets } = await this.searchIssuesWithPagination(recentJql, ['key'], 0, 1);

      // Estimate comments (rough calculation)
      const totalComments = Math.floor(totalTickets * 2.5); // Average comments per ticket

      return {
        totalTickets,
        recentTickets,
        totalComments
      };

    } catch (error) {
      console.error('Error getting Jira stats:', error);
      return { totalTickets: 0, recentTickets: 0, totalComments: 0 };
    }
  }

  /**
   * Test Jira connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.getJiraClient().getCurrentUser();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown connection error'
      };
    }
  }
}

export function getJiraIndexer(): JiraIndexer {
  return new JiraIndexer();
}