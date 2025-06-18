/**
 * Jira Service - Fetches Real Jira Comments with ADF Processing
 * Integrates existing JiraClient with new enhanced data models
 */

import { getJiraClient } from '../../../development-archive/integrations/jira/jiraClient';
import type { JiraComment as LegacyJiraComment, JiraTicket as LegacyJiraTicket } from '../../../development-archive/integrations/jira/jiraClient';
import {
  JiraComment,
  JiraUser,
  JiraUserMention,
  ADFDocument,
  DashboardMentionItem,
  DashboardActivityFeed,
  EnhancedJiraTicket,
  JiraActivity,
  JiraIntegrationConfig
} from '../types/jira-models';
import {
  analyzeADFContent,
  createDashboardMentionItem,
  getCommentsWithMentions,
  isUserMentioned,
  extractMentions
} from '../lib/jira-utils';

export class JiraService {
  private client = getJiraClient();
  private currentUser: JiraUser | null = null;
  private userCache = new Map<string, JiraUser>();
  private commentsCache = new Map<string, JiraComment[]>();
  private lastRefresh = 0;
  private refreshInterval = 5 * 60 * 1000; // 5 minutes

  /**
   * Initialize service and get current user
   */
  async initialize(): Promise<void> {
    try {
      const user = await this.client.getCurrentUser();
      this.currentUser = {
        accountId: user.accountId,
        displayName: user.displayName,
        emailAddress: user.emailAddress,
        active: true,
        accountType: 'atlassian'
      };
      console.log('✅ Jira service initialized for user:', this.currentUser.displayName);
    } catch (error) {
      console.error('❌ Failed to initialize Jira service:', error);
      throw error;
    }
  }

  /**
   * Get current user account ID
   */
  getCurrentUserAccountId(): string {
    if (!this.currentUser) {
      throw new Error('Jira service not initialized. Call initialize() first.');
    }
    return this.currentUser.accountId;
  }

  /**
   * Get enhanced dashboard activity feed with real Jira data
   */
  async getDashboardActivityFeed(maxItems = 20): Promise<DashboardActivityFeed> {
    try {
      // Get recent tickets from multiple projects
      const projects = await this.client.getUserProjects();
      const recentTickets = await this.getRecentTicketsWithComments(projects.slice(0, 5), maxItems);
      
      // Process all comments for mentions and activity
      const allComments: JiraComment[] = [];
      const ticketMap = new Map<string, EnhancedJiraTicket>();

      for (const ticket of recentTickets) {
        ticketMap.set(ticket.key, ticket);
        allComments.push(...ticket.comments);
      }

      // Filter comments with mentions for current user
      const currentUserAccountId = this.getCurrentUserAccountId();
      const mentionComments = getCommentsWithMentions(allComments, currentUserAccountId);

      // Convert to dashboard mention items
      const mentions: DashboardMentionItem[] = [];
      for (const comment of mentionComments) {
        const ticket = Array.from(ticketMap.values()).find(t => 
          t.comments.some(c => c.id === comment.id)
        );
        
        if (ticket) {
          const mentionItem = createDashboardMentionItem(
            comment,
            ticket.key,
            ticket.summary,
            currentUserAccountId
          );
          
          if (mentionItem) {
            mentions.push(mentionItem);
          }
        }
      }

      // Sort by timestamp (newest first)
      mentions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Create activity items for recent ticket updates
      const ticketUpdates: JiraActivity[] = recentTickets.slice(0, 10).map(ticket => ({
        id: `activity_${ticket.key}_${Date.now()}`,
        type: 'ticket_updated',
        ticketKey: ticket.key,
        ticketTitle: ticket.summary,
        actor: ticket.creator,
        timestamp: new Date(ticket.updated),
        isRead: false,
        priority: this.determinePriority(ticket),
        actionRequired: false
      }));

      return {
        mentions: mentions.slice(0, maxItems),
        recentComments: allComments.slice(0, 10),
        ticketUpdates: ticketUpdates.slice(0, 5),
        unreadCount: mentions.filter(m => !m.isRead).length,
        lastRefresh: new Date(),
        hasMore: mentions.length > maxItems
      };

    } catch (error) {
      console.error('❌ Failed to get dashboard activity feed:', error);
      throw error;
    }
  }

  /**
   * Get recent tickets with their comments from multiple projects
   */
  private async getRecentTicketsWithComments(
    projects: Array<{ key: string; name: string }>,
    maxTickets = 20
  ): Promise<EnhancedJiraTicket[]> {
    
    const allTickets: EnhancedJiraTicket[] = [];
    
    for (const project of projects) {
      try {
        // Get recent tickets from this project
        const jql = `project = "${project.key}" AND updated >= -7d ORDER BY updated DESC`;
        const tickets = await this.client.searchTickets(jql);
        
        // Process each ticket
        for (const ticket of tickets.slice(0, Math.ceil(maxTickets / projects.length))) {
          const enhancedTicket = await this.enhanceTicket(ticket);
          if (enhancedTicket) {
            allTickets.push(enhancedTicket);
          }
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Failed to get tickets from ${project.key}:`, error);
      }
    }

    // Sort by update time and return top results
    return allTickets
      .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
      .slice(0, maxTickets);
  }

  /**
   * Enhance legacy ticket with new data model features
   */
  private async enhanceTicket(legacyTicket: LegacyJiraTicket): Promise<EnhancedJiraTicket | null> {
    try {
      // Get comments for this ticket
      const legacyComments = await this.client.getTicketComments(legacyTicket.key);
      
      // Convert comments to enhanced format
      const enhancedComments: JiraComment[] = [];
      for (const legacyComment of legacyComments) {
        const enhancedComment = await this.enhanceComment(legacyComment, legacyTicket.key);
        if (enhancedComment) {
          enhancedComments.push(enhancedComment);
        }
      }

      // Calculate mention analytics
      const currentUserAccountId = this.getCurrentUserAccountId();
      const mentionAnalytics = this.calculateMentionAnalytics(enhancedComments, currentUserAccountId);

      const enhancedTicket: EnhancedJiraTicket = {
        id: legacyTicket.id,
        key: legacyTicket.key,
        summary: legacyTicket.fields.summary,
        description: legacyTicket.fields.description,
        
        issueType: {
          id: legacyTicket.fields.issuetype.id,
          name: legacyTicket.fields.issuetype.name,
          iconUrl: '',
          subtask: false
        },
        
        status: {
          id: legacyTicket.fields.status.statusCategory.key,
          name: legacyTicket.fields.status.name,
          categoryId: legacyTicket.fields.status.statusCategory.key,
          category: this.mapStatusCategory(legacyTicket.fields.status.statusCategory.key)
        },
        
        priority: {
          id: legacyTicket.fields.priority.id,
          name: legacyTicket.fields.priority.name,
          iconUrl: ''
        },
        
        assignee: legacyTicket.fields.assignee ? {
          accountId: legacyTicket.fields.assignee.accountId,
          displayName: legacyTicket.fields.assignee.displayName,
          emailAddress: legacyTicket.fields.assignee.emailAddress,
          active: true,
          accountType: 'atlassian'
        } : undefined,
        
        reporter: {
          accountId: legacyTicket.fields.reporter.accountId,
          displayName: legacyTicket.fields.reporter.displayName,
          emailAddress: legacyTicket.fields.reporter.emailAddress,
          active: true,
          accountType: 'atlassian'
        },
        
        creator: {
          accountId: legacyTicket.fields.reporter.accountId,
          displayName: legacyTicket.fields.reporter.displayName,
          emailAddress: legacyTicket.fields.reporter.emailAddress,
          active: true,
          accountType: 'atlassian'
        },
        
        project: {
          id: legacyTicket.fields.project.key,
          key: legacyTicket.fields.project.key,
          name: legacyTicket.fields.project.name
        },
        
        sprint: legacyTicket.fields.sprint ? {
          id: legacyTicket.fields.sprint.id.toString(),
          name: legacyTicket.fields.sprint.name,
          state: legacyTicket.fields.sprint.state as 'closed' | 'active' | 'future'
        } : undefined,
        
        comments: enhancedComments,
        totalComments: enhancedComments.length,
        commentsWithMentions: enhancedComments.filter(c => c.mentions.length > 0).length,
        currentUserMentions: enhancedComments.filter(c => 
          isUserMentioned(c, currentUserAccountId)
        ).length,
        lastCommentDate: enhancedComments.length > 0 
          ? new Date(Math.max(...enhancedComments.map(c => new Date(c.created).getTime())))
          : undefined,
        
        attachments: [], // TODO: Implement attachment fetching
        
        created: legacyTicket.fields.created,
        updated: legacyTicket.fields.updated,
        
        labels: [],
        components: [],
        fixVersions: [],
        
        mentionAnalytics
      };

      return enhancedTicket;
      
    } catch (error) {
      console.error(`Failed to enhance ticket ${legacyTicket.key}:`, error);
      return null;
    }
  }

  /**
   * Enhance legacy comment with ADF processing and mention analysis
   */
  private async enhanceComment(legacyComment: LegacyJiraComment, ticketKey: string): Promise<JiraComment | null> {
    try {
      // Try to parse as ADF, fallback to plain text
      let adfBody: ADFDocument | string = legacyComment.body;
      let adfAnalysis;
      
      try {
        // Attempt to parse as ADF JSON
        const parsed = JSON.parse(legacyComment.body);
        if (parsed.type === 'doc' && parsed.content) {
          adfBody = parsed as ADFDocument;
          adfAnalysis = analyzeADFContent(adfBody);
        } else {
          adfAnalysis = analyzeADFContent(legacyComment.body);
        }
      } catch {
        // Not valid JSON, treat as plain text
        adfAnalysis = analyzeADFContent(legacyComment.body);
      }

      // Extract mentions from the comment
      const textForMentions = typeof adfBody === 'string' ? adfBody : adfAnalysis.text;
      const mentions = await this.resolveMentions(extractMentions(textForMentions));

      const enhancedComment: JiraComment = {
        id: legacyComment.id,
        author: {
          accountId: legacyComment.author.accountId,
          displayName: legacyComment.author.displayName,
          avatarUrls: legacyComment.author.avatarUrls,
          active: true,
          accountType: 'atlassian'
        },
        body: adfBody,
        created: legacyComment.created,
        updated: legacyComment.updated,
        adfAnalysis,
        mentions
      };

      return enhancedComment;
      
    } catch (error) {
      console.error(`Failed to enhance comment ${legacyComment.id}:`, error);
      return null;
    }
  }

  /**
   * Resolve mention account IDs to user objects
   */
  private async resolveMentions(mentions: Array<{ accountId: string; displayName: string }>): Promise<JiraUserMention[]> {
    const resolvedMentions: JiraUserMention[] = [];
    
    for (const mention of mentions) {
      // Check cache first
      let user = this.userCache.get(mention.accountId);
      
      if (!user) {
        // For now, create a basic user object
        // In production, you might want to fetch full user details
        user = {
          accountId: mention.accountId,
          displayName: mention.displayName,
          active: true,
          accountType: 'atlassian'
        };
        this.userCache.set(mention.accountId, user);
      }

      resolvedMentions.push({
        accountId: user.accountId,
        displayName: user.displayName,
        avatarUrl: user.avatarUrls?.['48x48'],
        isCurrentUser: user.accountId === this.getCurrentUserAccountId(),
        mentionCount: 1,
        lastMentioned: new Date()
      });
    }
    
    return resolvedMentions;
  }

  /**
   * Calculate mention analytics for a ticket
   */
  private calculateMentionAnalytics(comments: JiraComment[], currentUserAccountId: string) {
    const mentionFrequency: Record<string, number> = {};
    let totalMentions = 0;
    let lastMentionDate: Date | undefined;

    for (const comment of comments) {
      if (isUserMentioned(comment, currentUserAccountId)) {
        totalMentions++;
        const commentDate = new Date(comment.created);
        if (!lastMentionDate || commentDate > lastMentionDate) {
          lastMentionDate = commentDate;
        }
        
        const authorId = comment.author.accountId;
        mentionFrequency[authorId] = (mentionFrequency[authorId] || 0) + 1;
      }
    }

    return {
      totalMentions,
      uniqueUsersWhoMentioned: Object.keys(mentionFrequency).length,
      lastMentionDate,
      mentionFrequency
    };
  }

  /**
   * Helper methods
   */
  private mapStatusCategory(key: string): 'new' | 'indeterminate' | 'done' {
    switch (key.toLowerCase()) {
      case 'new': return 'new';
      case 'done': return 'done';
      default: return 'indeterminate';
    }
  }

  private determinePriority(ticket: EnhancedJiraTicket): 'low' | 'medium' | 'high' | 'urgent' {
    const priorityName = ticket.priority.name.toLowerCase();
    if (priorityName.includes('critical') || priorityName.includes('highest')) return 'urgent';
    if (priorityName.includes('high')) return 'high';
    if (priorityName.includes('low') || priorityName.includes('lowest')) return 'low';
    return 'medium';
  }

  /**
   * Check if cached data is still fresh
   */
  private isCacheStale(): boolean {
    return Date.now() - this.lastRefresh > this.refreshInterval;
  }

  /**
   * Force refresh cached data
   */
  async refresh(): Promise<void> {
    this.commentsCache.clear();
    this.lastRefresh = 0;
  }
}

// Export singleton instance
let jiraService: JiraService | null = null;

export function getJiraService(): JiraService {
  if (!jiraService) {
    jiraService = new JiraService();
  }
  return jiraService;
}

// React hook for dashboard integration with pagination
export function useJiraActivityFeed() {
  const [activityFeed, setActivityFeed] = React.useState<DashboardActivityFeed | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(0);

  const loadActivityFeed = React.useCallback(async (page = 0, limit = 5) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔧 Fetching Jira activity from API... Page ${page}`);
      
      // Use the server-side API route with pagination
      const response = await fetch(`/api/jira/activity?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      const feed = await response.json();
      console.log('✅ Activity feed loaded:', feed);
      setActivityFeed(feed);
      setCurrentPage(page);
      
    } catch (err) {
      console.error('❌ Failed to load Jira activity feed:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activity feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPage = React.useCallback((page: number) => {
    loadActivityFeed(page, 5);
  }, [loadActivityFeed]);

  const nextPage = React.useCallback(() => {
    if (activityFeed?.hasMore) {
      loadPage(currentPage + 1);
    }
  }, [currentPage, activityFeed?.hasMore, loadPage]);

  const prevPage = React.useCallback(() => {
    if (currentPage > 0) {
      loadPage(currentPage - 1);
    }
  }, [currentPage, loadPage]);

  React.useEffect(() => {
    loadActivityFeed(0, 5);
  }, []);

  return {
    activityFeed,
    isLoading,
    error,
    currentPage,
    refresh: () => loadActivityFeed(currentPage, 5),
    loadPage,
    nextPage,
    prevPage
  };
}

// We need to import React for the hook
import React from 'react';