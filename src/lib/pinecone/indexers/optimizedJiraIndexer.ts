/**
 * Optimized Jira Indexer using minimal metadata pattern
 * Only stores filtering fields in Pinecone metadata
 * Full document data stored separately
 */

import { 
  OptimizedPineconeService, 
  PineconeMetadata, 
  DocumentData 
} from '../optimizedMultiSourceService';
import { getJiraClient } from '../../../../development-archive/integrations/jira/jiraClient';

interface IndexDocument {
  id: string;
  content: string;
  metadata: PineconeMetadata;
  documentData: DocumentData;
}

export class OptimizedJiraIndexer {
  private pineconeService: OptimizedPineconeService;
  private jiraClient = getJiraClient();

  constructor(pineconeService: OptimizedPineconeService) {
    this.pineconeService = pineconeService;
  }

  /**
   * Index tickets for a specific project since a date
   */
  async indexProjectTicketsSince(projectKey: string, since: Date): Promise<void> {
    const jql = `project = ${projectKey} AND updated >= "${since.toISOString().split('T')[0]}" ORDER BY updated DESC`;
    await this.indexTicketsByJQL(jql);
  }

  /**
   * Index tickets by JQL query
   */
  async indexTicketsByJQL(jql: string): Promise<void> {
    console.log(`🎫 Indexing Jira tickets with JQL: ${jql}`);
    
    let startAt = 0;
    const maxResults = 50;
    let hasMore = true;

    while (hasMore) {
      const { issues, total } = await this.searchIssuesWithPagination(
        jql,
        ['key', 'summary', 'description', 'issuetype', 'status', 'priority',
         'assignee', 'reporter', 'created', 'updated', 'labels',
         'components', 'project', 'comment', 'attachment'],
        startAt,
        maxResults
      );

      if (issues.length === 0) {
        hasMore = false;
        break;
      }

      const documents: IndexDocument[] = [];

      for (const issue of issues) {
        // Convert ticket to optimized document
        const ticketDoc = this.convertTicketToDocument(issue);
        if (ticketDoc) {
          documents.push(ticketDoc);
        }

        // Convert comments
        if (issue.fields.comment?.comments) {
          for (const comment of issue.fields.comment.comments) {
            const commentDoc = this.convertCommentToDocument(issue, comment);
            if (commentDoc) {
              documents.push(commentDoc);
            }
          }
        }
      }

      // Batch index with minimal metadata
      if (documents.length > 0) {
        await this.pineconeService.indexDocuments(documents);
        console.log(`✅ Indexed ${documents.length} documents`);
      }

      startAt += maxResults;
      hasMore = startAt < total;
    }
  }

  /**
   * Convert Jira ticket to optimized document format
   */
  private convertTicketToDocument(issue: any): IndexDocument | null {
    try {
      const fields = issue.fields;
      
      // Build content for embedding (what users will search for)
      const contentParts = [
        issue.key,
        fields.summary,
        this.extractTextFromADF(fields.description),
        fields.project.name,
        fields.issuetype.name,
        fields.status.name,
        fields.priority.name,
        fields.labels?.join(' '),
        fields.components?.map((c: any) => c.name).join(' ')
      ].filter(Boolean);
      
      const content = contentParts.join('\n');

      // Minimal metadata for filtering
      const metadata: PineconeMetadata = {
        type: 'jira_ticket',
        source: 'jira',
        ticketKey: issue.key,
        projectKey: fields.project.key,
        status: fields.status.name,
        priority: fields.priority.name,
        authorId: fields.reporter.accountId,
        createdAt: new Date(fields.created).getTime(),
        updatedAt: new Date(fields.updated).getTime(),
        hasAttachments: !!(fields.attachment?.length > 0),
        isUrgent: this.isUrgent(fields.priority.name, content),
        labels: fields.labels?.slice(0, 10) // Limit labels
      };

      // Extract mentions as just IDs
      if (fields.assignee) {
        metadata.mentionIds = [fields.assignee.accountId];
      }

      // Full document data for display (stored separately)
      const documentData: DocumentData = {
        id: `jira_ticket_${issue.key}`,
        title: `${issue.key}: ${fields.summary}`,
        content: this.extractTextFromADF(fields.description) || fields.summary,
        url: `${process.env.JIRA_HOST}/browse/${issue.key}`,
        author: {
          id: fields.reporter.accountId,
          name: fields.reporter.displayName,
          email: fields.reporter.emailAddress
        },
        assignee: fields.assignee ? {
          id: fields.assignee.accountId,
          name: fields.assignee.displayName,
          email: fields.assignee.emailAddress
        } : undefined,
        attachments: fields.attachment?.map((att: any) => ({
          id: att.id,
          filename: att.filename,
          mimeType: att.mimeType,
          size: att.size
        })),
        components: fields.components?.map((c: any) => c.name),
        customFields: {
          issueType: fields.issuetype.name,
          issueTypeId: fields.issuetype.id,
          statusId: fields.status.id,
          priorityId: fields.priority.id,
          projectName: fields.project.name
        }
      };

      return {
        id: `jira_ticket_${issue.key}`,
        content,
        metadata,
        documentData
      };

    } catch (error) {
      console.error(`Error converting ticket ${issue.key}:`, error);
      return null;
    }
  }

  /**
   * Convert Jira comment to optimized document format
   */
  private convertCommentToDocument(issue: any, comment: any): IndexDocument | null {
    try {
      const content = this.extractTextFromADF(comment.body);
      if (!content || content.trim().length === 0) {
        return null;
      }

      // Build searchable content
      const searchContent = [
        `Comment on ${issue.key}`,
        content,
        issue.fields.summary // Include ticket context
      ].join('\n');

      // Minimal metadata
      const metadata: PineconeMetadata = {
        type: 'jira_comment',
        source: 'jira',
        ticketKey: issue.key,
        projectKey: issue.fields.project.key,
        authorId: comment.author.accountId,
        createdAt: new Date(comment.created).getTime(),
        updatedAt: new Date(comment.updated).getTime(),
        // Inherit ticket status/priority for filtering
        status: issue.fields.status.name,
        priority: issue.fields.priority.name,
        isUrgent: this.isUrgent(issue.fields.priority.name, content)
      };

      // Extract mention IDs from comment
      const mentionIds = this.extractMentionIds(comment.body);
      if (mentionIds.length > 0) {
        metadata.mentionIds = mentionIds.slice(0, 10);
      }

      // Full document data
      const documentData: DocumentData = {
        id: `jira_comment_${issue.key}_${comment.id}`,
        title: `Comment on ${issue.key}`,
        content,
        url: `${process.env.JIRA_HOST}/browse/${issue.key}?focusedCommentId=${comment.id}`,
        author: {
          id: comment.author.accountId,
          name: comment.author.displayName,
          email: comment.author.emailAddress,
          avatarUrl: comment.author.avatarUrls?.['48x48']
        },
        customFields: {
          ticketSummary: issue.fields.summary,
          commentId: comment.id
        }
      };

      return {
        id: `jira_comment_${issue.key}_${comment.id}`,
        content: searchContent,
        metadata,
        documentData
      };

    } catch (error) {
      console.error(`Error converting comment ${comment.id}:`, error);
      return null;
    }
  }

  /**
   * Extract text from ADF (Atlassian Document Format)
   */
  private extractTextFromADF(adf: any): string {
    if (!adf) return '';
    if (typeof adf === 'string') return adf;
    
    if (adf.type === 'doc' && adf.content) {
      return this.extractTextFromADFNodes(adf.content);
    }
    
    return '';
  }

  private extractTextFromADFNodes(nodes: any[]): string {
    if (!Array.isArray(nodes)) return '';
    
    return nodes.map(node => {
      if (node.type === 'text') {
        return node.text || '';
      } else if (node.type === 'mention' && node.attrs) {
        return `@${node.attrs.text || node.attrs.displayName || ''}`;
      } else if (node.content) {
        return this.extractTextFromADFNodes(node.content);
      }
      return '';
    }).join(' ').trim();
  }

  /**
   * Extract mention IDs from ADF
   */
  private extractMentionIds(adf: any): string[] {
    const ids: string[] = [];
    
    const extractFromNodes = (nodes: any[]) => {
      if (!Array.isArray(nodes)) return;
      
      nodes.forEach(node => {
        if (node.type === 'mention' && node.attrs?.id) {
          ids.push(node.attrs.id);
        } else if (node.content) {
          extractFromNodes(node.content);
        }
      });
    };
    
    if (adf?.type === 'doc' && adf.content) {
      extractFromNodes(adf.content);
    }
    
    return [...new Set(ids)]; // Unique IDs
  }

  /**
   * Determine if content is urgent
   */
  private isUrgent(priority: string, content: string): boolean {
    if (['Highest', 'Critical', 'P1', 'P0'].includes(priority)) {
      return true;
    }
    
    const urgentKeywords = ['urgent', 'critical', 'asap', 'emergency', 'blocker'];
    const lowerContent = content.toLowerCase();
    return urgentKeywords.some(keyword => lowerContent.includes(keyword));
  }

  /**
   * Search issues with pagination
   */
  private async searchIssuesWithPagination(
    jql: string, 
    fields: string[], 
    startAt: number = 0, 
    maxResults: number = 50
  ): Promise<{ issues: any[], total: number }> {
    const response = await fetch(
      `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString('base64')}`,
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
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search issues: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      issues: data.issues || [],
      total: data.total || 0
    };
  }
}