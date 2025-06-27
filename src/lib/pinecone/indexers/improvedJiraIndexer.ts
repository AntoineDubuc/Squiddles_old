/**
 * Improved Jira Indexer that preserves links and rich content
 */

import { JiraDocument, DocumentType, getMultiSourcePineconeService } from '../multiSourceService';

export class ImprovedJiraIndexer {
  private pineconeService = getMultiSourcePineconeService();

  /**
   * Extract text from ADF while preserving links
   */
  private extractTextFromADF(adf: any): string {
    if (!adf) return '';
    
    if (typeof adf === 'string') return adf;
    
    // Handle ADF structure
    if (adf.type === 'doc' && adf.content) {
      return this.extractTextFromADFContent(adf.content);
    }
    
    return '';
  }

  /**
   * Recursively extract text from ADF content array WITH LINKS
   */
  private extractTextFromADFContent(content: any[]): string {
    if (!Array.isArray(content)) return '';
    
    return content.map(node => {
      if (node.type === 'text') {
        let text = node.text || '';
        
        // Check for link marks
        if (node.marks && Array.isArray(node.marks)) {
          const linkMark = node.marks.find((mark: any) => mark.type === 'link');
          if (linkMark && linkMark.attrs && linkMark.attrs.href) {
            // Include both the text and the URL
            text = `${text} (${linkMark.attrs.href})`;
          }
        }
        
        return text;
      } else if (node.type === 'paragraph' && node.content) {
        return this.extractTextFromADFContent(node.content);
      } else if (node.type === 'mention' && node.attrs) {
        return `@${node.attrs.text || node.attrs.displayName || ''}`;
      } else if (node.type === 'inlineCard' && node.attrs) {
        // Handle inline cards (like Confluence links)
        return `[${node.attrs.url || 'link'}]`;
      } else if (node.type === 'blockCard' && node.attrs) {
        // Handle block cards (like embedded links)
        return `[${node.attrs.url || 'link'}]`;
      } else if (node.type === 'mediaGroup' && node.content) {
        // Handle media/attachments
        return '[attachment]';
      } else if (node.type === 'media' && node.attrs) {
        // Handle individual media items
        const filename = node.attrs.filename || node.attrs.id || 'media';
        return `[${filename}]`;
      } else if (node.type === 'codeBlock' && node.content) {
        // Preserve code blocks
        const codeText = this.extractTextFromADFContent(node.content);
        return `\`\`\`\n${codeText}\n\`\`\``;
      } else if (node.type === 'bulletList' || node.type === 'orderedList') {
        if (node.content) {
          return this.extractTextFromADFContent(node.content);
        }
      } else if (node.type === 'listItem' && node.content) {
        return '• ' + this.extractTextFromADFContent(node.content);
      } else if (node.type === 'heading' && node.content) {
        const level = node.attrs?.level || 1;
        const prefix = '#'.repeat(level) + ' ';
        return prefix + this.extractTextFromADFContent(node.content);
      } else if (node.type === 'table' && node.content) {
        return '[table content]\n' + this.extractTextFromADFContent(node.content);
      } else if (node.type === 'tableRow' && node.content) {
        return this.extractTextFromADFContent(node.content) + '\n';
      } else if (node.type === 'tableCell' && node.content) {
        return this.extractTextFromADFContent(node.content) + ' | ';
      } else if (node.type === 'panel' && node.content) {
        const panelType = node.attrs?.panelType || 'info';
        return `[${panelType} panel] ` + this.extractTextFromADFContent(node.content);
      } else if (node.content) {
        // Fallback for any other node with content
        return this.extractTextFromADFContent(node.content);
      }
      
      return '';
    }).join(' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Extract all links from ADF
   */
  private extractLinksFromADF(adf: any): string[] {
    const links: string[] = [];
    
    const extractFromNodes = (nodes: any[]) => {
      if (!Array.isArray(nodes)) return;
      
      nodes.forEach(node => {
        // Check text nodes for link marks
        if (node.type === 'text' && node.marks) {
          const linkMark = node.marks.find((mark: any) => mark.type === 'link');
          if (linkMark?.attrs?.href) {
            links.push(linkMark.attrs.href);
          }
        }
        
        // Check inline/block cards
        if ((node.type === 'inlineCard' || node.type === 'blockCard') && node.attrs?.url) {
          links.push(node.attrs.url);
        }
        
        // Recursively check child nodes
        if (node.content) {
          extractFromNodes(node.content);
        }
      });
    };
    
    if (adf?.type === 'doc' && adf.content) {
      extractFromNodes(adf.content);
    }
    
    return [...new Set(links)]; // Return unique links
  }

  /**
   * Index a single ticket by key with improved link extraction
   */
  async indexTicketByKey(ticketKey: string): Promise<void> {
    try {
      console.log(`🎫 Fetching ticket ${ticketKey}...`);
      
      const response = await fetch(
        `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/issue/${ticketKey}?expand=renderedFields`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(
              `${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`
            ).toString('base64')}`,
            'Accept': 'application/json',
          },
          method: 'GET'
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get issue ${ticketKey}: ${response.statusText}`);
      }

      const issue = await response.json();
      
      // Log the raw description to debug
      console.log('📄 Raw description ADF:', JSON.stringify(issue.fields.description, null, 2));

      const documents: JiraDocument[] = [];

      // Convert ticket with improved extraction
      const ticketDoc = this.convertTicketToDocument(issue);
      if (ticketDoc) {
        documents.push(ticketDoc);
        
        // Log what we extracted
        console.log('\n📝 Extracted content:');
        console.log(ticketDoc.content);
        
        const links = this.extractLinksFromADF(issue.fields.description);
        if (links.length > 0) {
          console.log('\n🔗 Extracted links:');
          links.forEach(link => console.log(`  - ${link}`));
        }
      }

      // Index comments if any
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
   * Convert ticket to document with improved content extraction
   */
  private convertTicketToDocument(issue: any): JiraDocument | null {
    try {
      const fields = issue.fields;
      
      // Extract description with links preserved
      const description = this.extractTextFromADF(fields.description) || '';
      const links = this.extractLinksFromADF(fields.description);
      
      // Build content including links
      let content = `${fields.summary}\n\n${description}`;
      
      // Add links section if any exist
      if (links.length > 0) {
        content += '\n\nLinks:\n' + links.map(link => `- ${link}`).join('\n');
      }

      if (!content.trim()) {
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
          components: fields.components?.map((c: any) => c.name) || [],
          mentions,
          hasRichContent,
          urgencyLevel,
          relatedEmails,
          relatedPages,
          links // Store extracted links in metadata
        }
      };

    } catch (error) {
      console.error(`Error converting ticket ${issue.key} to document:`, error);
      return null;
    }
  }

  /**
   * Convert comment to document (reuse from original)
   */
  private convertCommentToDocument(issue: any, comment: any): JiraDocument | null {
    // Same as original implementation but using improved extraction
    try {
      const content = this.extractTextFromADF(comment.body);
      
      if (!content || content.trim().length === 0) {
        return null;
      }

      const mentions = this.extractMentions(content);
      const relatedEmails = this.extractEmailReferences(content);
      const relatedPages = this.extractConfluenceReferences(content);
      const urgencyLevel = this.determineUrgencyLevel(issue.fields.priority.name, content);
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
          components: issue.fields.components?.map((c: any) => c.name) || [],
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

  // Helper methods (same as original)
  private extractMentions(text: string): string[] {
    const mentions: string[] = [];
    const accountIdMatches = text.match(/712020:[a-f0-9-]+/g) || [];
    mentions.push(...accountIdMatches);
    const legacyMatches = text.match(/@\w+/g) || [];
    mentions.push(...legacyMatches);
    return [...new Set(mentions)];
  }

  private extractEmailReferences(text: string): string[] {
    const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    return [...new Set(emailMatches)];
  }

  private extractConfluenceReferences(text: string): string[] {
    const confluenceMatches = text.match(/\/wiki\/spaces\/[A-Z]+\/pages\/\d+/g) || [];
    return [...new Set(confluenceMatches.map(match => match.split('/').pop() || ''))];
  }

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

  private hasRichContent(adf: any): boolean {
    if (!adf || typeof adf !== 'object') return false;
    
    const contentString = JSON.stringify(adf);
    
    return contentString.includes('table') ||
           contentString.includes('media') ||
           contentString.includes('codeblock') ||
           contentString.includes('panel') ||
           contentString.includes('expand') ||
           contentString.includes('inlineCard') ||
           contentString.includes('blockCard');
  }
}

export function getImprovedJiraIndexer(): ImprovedJiraIndexer {
  return new ImprovedJiraIndexer();
}