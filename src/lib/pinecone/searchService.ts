/**
 * Cross-Reference Search Service for Pinecone
 * Provides intelligent search across emails, Confluence, and Jira with relationship detection
 */

import { 
  getMultiSourcePineconeService, 
  DocumentType, 
  SearchResult, 
  SearchFilters 
} from './multiSourceService';

export interface CrossReferenceQuery {
  query: string;
  context?: {
    ticketKey?: string;
    emailId?: string;
    pageId?: string;
    userAccountId?: string;
  };
  filters?: SearchFilters;
  includeRelated?: boolean;
  maxResults?: number;
}

export interface SearchSummary {
  totalResults: number;
  resultsByType: Record<DocumentType, number>;
  topKeywords: string[];
  relatedTickets: string[];
  relatedEmails: string[];
  relatedPages: string[];
  urgentItems: SearchResult[];
  mentionsUser: SearchResult[];
}

export class CrossReferenceSearchService {
  private pineconeService = getMultiSourcePineconeService();

  /**
   * Main cross-reference search method
   */
  async search(searchQuery: CrossReferenceQuery): Promise<{
    results: SearchResult[];
    summary: SearchSummary;
    suggestions: string[];
  }> {
    const { 
      query, 
      context, 
      filters = {}, 
      includeRelated = true, 
      maxResults = 20 
    } = searchQuery;

    try {
      console.log(`🔍 Cross-reference search: "${query}"`);
      if (context) {
        console.log(`📄 Context:`, context);
      }

      // Build enhanced search filters based on context
      const enhancedFilters = this.buildEnhancedFilters(filters, context);

      // Perform primary search
      const primaryResults = await this.pineconeService.search(
        query, 
        enhancedFilters, 
        maxResults
      );

      let allResults = [...primaryResults];

      // If context is provided, find related documents
      if (includeRelated && context) {
        const relatedResults = await this.findRelatedDocuments(context, query);
        
        // Merge and deduplicate results
        const existingIds = new Set(allResults.map(r => r.document.id));
        const newRelated = relatedResults.filter(r => !existingIds.has(r.document.id));
        
        allResults = [...allResults, ...newRelated];
      }

      // Sort by relevance score
      allResults.sort((a, b) => b.score - a.score);
      allResults = allResults.slice(0, maxResults);

      // Generate summary
      const summary = this.generateSearchSummary(allResults, query);

      // Generate search suggestions
      const suggestions = this.generateSearchSuggestions(allResults, query, context);

      return {
        results: allResults,
        summary,
        suggestions
      };

    } catch (error) {
      console.error('❌ Cross-reference search error:', error);
      throw new Error('Failed to perform cross-reference search');
    }
  }

  /**
   * Find email threads related to a specific Jira ticket
   */
  async findEmailThreadsForTicket(ticketKey: string): Promise<SearchResult[]> {
    console.log(`📧 Finding email threads for ticket: ${ticketKey}`);

    const results = await this.pineconeService.search(ticketKey, {
      types: [DocumentType.EMAIL]
    }, 50);

    // Filter for emails that actually mention the ticket
    const relevantEmails = results.filter(result => {
      const email = result.document;
      if (email.type !== DocumentType.EMAIL) return false;

      return (
        email.metadata.mentionedTickets?.includes(ticketKey) ||
        email.content.includes(ticketKey) ||
        email.title.includes(ticketKey) ||
        email.subject?.includes(ticketKey)
      );
    });

    console.log(`📧 Found ${relevantEmails.length} email threads for ${ticketKey}`);
    return relevantEmails;
  }

  /**
   * Find Confluence pages related to a specific ticket
   */
  async findPagesForTicket(ticketKey: string): Promise<SearchResult[]> {
    console.log(`📖 Finding Confluence pages for ticket: ${ticketKey}`);

    const results = await this.pineconeService.search(ticketKey, {
      types: [DocumentType.CONFLUENCE]
    }, 30);

    // Filter for pages that actually mention the ticket
    const relevantPages = results.filter(result => {
      const page = result.document;
      if (page.type !== DocumentType.CONFLUENCE) return false;

      return (
        page.metadata.relatedTickets?.includes(ticketKey) ||
        page.content.includes(ticketKey) ||
        page.title.includes(ticketKey)
      );
    });

    console.log(`📖 Found ${relevantPages.length} Confluence pages for ${ticketKey}`);
    return relevantPages;
  }

  /**
   * Find all mentions of a specific user across all document types
   */
  async findUserMentions(userAccountId: string, daysBack: number = 30): Promise<{
    emails: SearchResult[];
    tickets: SearchResult[];
    comments: SearchResult[];
    pages: SearchResult[];
  }> {
    console.log(`👤 Finding mentions for user: ${userAccountId} (last ${daysBack} days)`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const filters: SearchFilters = {
      dateRange: {
        start: cutoffDate,
        end: new Date()
      },
      mentions: [userAccountId]
    };

    // Search across all document types
    const allResults = await this.pineconeService.search(
      `@${userAccountId}`, 
      filters, 
      100
    );

    // Group by document type
    const grouped = {
      emails: allResults.filter(r => r.document.type === DocumentType.EMAIL),
      tickets: allResults.filter(r => r.document.type === DocumentType.JIRA_TICKET),
      comments: allResults.filter(r => r.document.type === DocumentType.JIRA_COMMENT),
      pages: allResults.filter(r => r.document.type === DocumentType.CONFLUENCE)
    };

    console.log(`👤 Found mentions: ${grouped.emails.length} emails, ${grouped.tickets.length} tickets, ${grouped.comments.length} comments, ${grouped.pages.length} pages`);

    return grouped;
  }

  /**
   * Search for urgent items requiring attention
   */
  async findUrgentItems(userAccountId?: string): Promise<SearchResult[]> {
    console.log(`🚨 Finding urgent items${userAccountId ? ` for user: ${userAccountId}` : ''}`);

    const filters: SearchFilters = {
      priority: ['high', 'highest', 'critical']
    };

    if (userAccountId) {
      filters.mentions = [userAccountId];
    }

    const urgentResults = await this.pineconeService.search(
      'urgent critical asap important priority blocked', 
      filters, 
      50
    );

    // Filter for truly urgent items
    const filtered = urgentResults.filter(result => {
      const metadata = result.document.metadata;
      return (
        metadata.urgencyLevel === 'high' ||
        metadata.urgencyLevel === 'critical' ||
        metadata.priority === 'high' ||
        metadata.priority === 'highest' ||
        result.document.content.toLowerCase().includes('urgent') ||
        result.document.content.toLowerCase().includes('critical')
      );
    });

    console.log(`🚨 Found ${filtered.length} urgent items`);
    return filtered;
  }

  /**
   * Find documents related to a specific project
   */
  async findProjectDocuments(projectKey: string): Promise<{
    tickets: SearchResult[];
    emails: SearchResult[];
    pages: SearchResult[];
    comments: SearchResult[];
  }> {
    console.log(`📁 Finding documents for project: ${projectKey}`);

    const filters: SearchFilters = {
      projects: [projectKey]
    };

    const allResults = await this.pineconeService.search(
      `project ${projectKey}`, 
      filters, 
      100
    );

    // Group by document type
    const grouped = {
      tickets: allResults.filter(r => r.document.type === DocumentType.JIRA_TICKET),
      comments: allResults.filter(r => r.document.type === DocumentType.JIRA_COMMENT),
      emails: allResults.filter(r => r.document.type === DocumentType.EMAIL && 
        r.document.content.includes(projectKey)),
      pages: allResults.filter(r => r.document.type === DocumentType.CONFLUENCE &&
        r.document.content.includes(projectKey))
    };

    console.log(`📁 Found project documents: ${grouped.tickets.length} tickets, ${grouped.comments.length} comments, ${grouped.emails.length} emails, ${grouped.pages.length} pages`);

    return grouped;
  }

  /**
   * Semantic search across all document types
   */
  async semanticSearch(concept: string, maxResults: number = 15): Promise<SearchResult[]> {
    console.log(`🧠 Semantic search for concept: "${concept}"`);

    const results = await this.pineconeService.search(concept, {}, maxResults);
    
    console.log(`🧠 Found ${results.length} semantically related documents`);
    return results;
  }

  /**
   * Private helper methods
   */

  private buildEnhancedFilters(baseFilters: SearchFilters, context?: CrossReferenceQuery['context']): SearchFilters {
    const enhanced = { ...baseFilters };

    if (context?.ticketKey) {
      enhanced.relatedTo = { ticketKey: context.ticketKey };
    }

    if (context?.emailId) {
      enhanced.relatedTo = { emailId: context.emailId };
    }

    if (context?.pageId) {
      enhanced.relatedTo = { pageId: context.pageId };
    }

    if (context?.userAccountId) {
      enhanced.mentions = enhanced.mentions || [];
      enhanced.mentions.push(context.userAccountId);
    }

    return enhanced;
  }

  private async findRelatedDocuments(context: CrossReferenceQuery['context'], originalQuery: string): Promise<SearchResult[]> {
    const relatedResults: SearchResult[] = [];

    if (context?.ticketKey) {
      // Find emails and pages related to the ticket
      const emailResults = await this.findEmailThreadsForTicket(context.ticketKey);
      const pageResults = await this.findPagesForTicket(context.ticketKey);
      relatedResults.push(...emailResults, ...pageResults);
    }

    if (context?.userAccountId) {
      // Find recent mentions of the user
      const mentionResults = await this.findUserMentions(context.userAccountId, 14);
      relatedResults.push(...mentionResults.emails, ...mentionResults.comments);
    }

    return relatedResults;
  }

  private generateSearchSummary(results: SearchResult[], query: string): SearchSummary {
    const summary: SearchSummary = {
      totalResults: results.length,
      resultsByType: {
        [DocumentType.EMAIL]: 0,
        [DocumentType.CONFLUENCE]: 0,
        [DocumentType.JIRA_TICKET]: 0,
        [DocumentType.JIRA_COMMENT]: 0
      },
      topKeywords: [],
      relatedTickets: [],
      relatedEmails: [],
      relatedPages: [],
      urgentItems: [],
      mentionsUser: []
    };

    // Count by type
    results.forEach(result => {
      summary.resultsByType[result.document.type]++;
    });

    // Extract cross-references
    const allTickets = new Set<string>();
    const allEmails = new Set<string>();
    const allPages = new Set<string>();

    results.forEach(result => {
      // Collect cross-references
      result.crossReferences.tickets.forEach(ticket => allTickets.add(ticket));
      result.crossReferences.emails.forEach(email => allEmails.add(email));
      result.crossReferences.pages.forEach(page => allPages.add(page));

      // Identify urgent items
      const metadata = result.document.metadata;
      if (metadata.urgencyLevel === 'high' || metadata.urgencyLevel === 'critical' ||
          metadata.priority === 'high' || metadata.priority === 'highest') {
        summary.urgentItems.push(result);
      }

      // Identify user mentions (you would pass user ID to check)
      if (metadata.mentions && metadata.mentions.length > 0) {
        summary.mentionsUser.push(result);
      }
    });

    summary.relatedTickets = Array.from(allTickets);
    summary.relatedEmails = Array.from(allEmails);
    summary.relatedPages = Array.from(allPages);

    // Extract top keywords from results
    const keywords = new Map<string, number>();
    results.forEach(result => {
      result.highlights.forEach(highlight => {
        const words = highlight.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        words.forEach(word => {
          keywords.set(word, (keywords.get(word) || 0) + 1);
        });
      });
    });

    summary.topKeywords = Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    return summary;
  }

  private generateSearchSuggestions(results: SearchResult[], query: string, context?: CrossReferenceQuery['context']): string[] {
    const suggestions: string[] = [];

    // Extract related entities for suggestions
    const allTickets = new Set<string>();
    const allProjects = new Set<string>();
    const allSpaces = new Set<string>();

    results.forEach(result => {
      const doc = result.document;
      
      if (doc.type === DocumentType.JIRA_TICKET || doc.type === DocumentType.JIRA_COMMENT) {
        allTickets.add(doc.ticketKey);
        allProjects.add(doc.projectKey);
      }
      
      if (doc.type === DocumentType.CONFLUENCE) {
        allSpaces.add(doc.spaceKey);
      }
    });

    // Generate contextual suggestions
    if (context?.ticketKey) {
      suggestions.push(`Find all email threads about ${context.ticketKey}`);
      suggestions.push(`Show Confluence pages related to ${context.ticketKey}`);
    }

    if (allTickets.size > 0) {
      const randomTicket = Array.from(allTickets)[0];
      if (randomTicket !== context?.ticketKey) {
        suggestions.push(`Find discussions about ${randomTicket}`);
      }
    }

    if (allProjects.size > 0) {
      const randomProject = Array.from(allProjects)[0];
      suggestions.push(`Show all documents for project ${randomProject}`);
    }

    if (allSpaces.size > 0) {
      const randomSpace = Array.from(allSpaces)[0];
      suggestions.push(`Search ${randomSpace} space documentation`);
    }

    // Add general suggestions based on result types
    if (results.some(r => r.document.type === DocumentType.EMAIL)) {
      suggestions.push('Show urgent emails requiring response');
    }

    if (results.some(r => r.document.metadata.urgencyLevel === 'high')) {
      suggestions.push('Find all high priority items');
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }
}

// Export singleton
let searchService: CrossReferenceSearchService | null = null;

export function getCrossReferenceSearchService(): CrossReferenceSearchService {
  if (!searchService) {
    searchService = new CrossReferenceSearchService();
  }
  return searchService;
}