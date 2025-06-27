/**
 * Multi-Source Pinecone Service for Cross-Reference Indexing
 * Supports Gmail, Confluence, and Jira with metadata for provenance tracking
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

// Document Types
export enum DocumentType {
  EMAIL = 'email',
  CONFLUENCE = 'confluence',
  JIRA_TICKET = 'jira_ticket',
  JIRA_COMMENT = 'jira_comment'
}

// Base document interface
export interface BaseDocument {
  id: string;
  type: DocumentType;
  title: string;
  content: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email?: string;
  };
  metadata: Record<string, any>;
}

// Email document
export interface EmailDocument extends BaseDocument {
  type: DocumentType.EMAIL;
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  threadId?: string;
  hasAttachments: boolean;
  isRead: boolean;
  labels: string[];
  metadata: {
    messageId: string;
    gmailId: string;
    priority: 'low' | 'medium' | 'high';
    hasLinks: boolean;
    mentionedTickets: string[];
    mentionedPages: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    urgencyKeywords: string[];
  };
}

// Confluence document
export interface ConfluenceDocument extends BaseDocument {
  type: DocumentType.CONFLUENCE;
  spaceKey: string;
  spaceName: string;
  parentId?: string;
  version: number;
  status: string;
  metadata: {
    pageId: string;
    hasImages: boolean;
    hasCode: boolean;
    hasTables: boolean;
    wordCount: number;
    relatedTickets: string[];
    tags: string[];
    watchers: string[];
    lastViewedBy: string[];
  };
}

// Jira document (ticket or comment)
export interface JiraDocument extends BaseDocument {
  type: DocumentType.JIRA_TICKET | DocumentType.JIRA_COMMENT;
  ticketKey: string;
  projectKey: string;
  projectName: string;
  metadata: {
    issueType: string;
    status: string;
    priority: string;
    assignee?: string;
    reporter: string;
    labels: string[];
    components: string[];
    mentions: string[];
    hasRichContent: boolean;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    relatedEmails: string[];
    relatedPages: string[];
  };
}

export type Document = EmailDocument | ConfluenceDocument | JiraDocument;

// Search filters
export interface SearchFilters {
  types?: DocumentType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  authors?: string[];
  projects?: string[];
  spaces?: string[];
  priority?: string[];
  mentions?: string[];
  relatedTo?: {
    ticketKey?: string;
    emailId?: string;
    pageId?: string;
  };
}

// Search result
export interface SearchResult {
  document: Document;
  score: number;
  highlights: string[];
  crossReferences: {
    emails: string[];
    tickets: string[];
    pages: string[];
  };
}

export class MultiSourcePineconeService {
  private pinecone: Pinecone;
  private openai: OpenAI;
  private index: any;
  private indexName: string;

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    this.indexName = process.env.PINECONE_INDEX_NAME || 'squiddles-multi-source';
    this.index = this.pinecone.index(this.indexName);
  }

  /**
   * Generate embedding for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Index a single document
   */
  async indexDocument(doc: Document): Promise<void> {
    const { id, type, title, content, metadata } = doc;
    
    // Build searchable text for embedding
    const searchableText = this.buildSearchableText(doc);
    const embedding = await this.generateEmbedding(searchableText);
    
    // Get namespace for document type
    const namespace = this.getNamespace(type);
    
    try {
      await this.index.namespace(namespace).upsert([{
        id,
        values: embedding,
        metadata: {
          ...metadata,
          type,
          title,
          content: content.substring(0, 1000), // Truncate for metadata
          url: doc.url,
          createdAt: doc.createdAt.getTime(),
          updatedAt: doc.updatedAt.getTime(),
          authorId: doc.author.id,
          authorName: doc.author.name,
          authorEmail: doc.author.email,
          searchableText: searchableText.substring(0, 2000)
        }
      }]);
      
      console.log(`✅ Indexed ${type} document: ${id} in namespace ${namespace}`);
    } catch (error) {
      console.error('Error indexing document:', error);
      throw new Error('Failed to index document in Pinecone');
    }
  }

  /**
   * Batch index multiple documents
   */
  async indexDocuments(documents: Document[]): Promise<void> {
    // Group documents by namespace
    const grouped = documents.reduce((acc, doc) => {
      const ns = this.getNamespace(doc.type);
      if (!acc[ns]) acc[ns] = [];
      acc[ns].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);

    // Process each namespace
    for (const [namespace, docs] of Object.entries(grouped)) {
      console.log(`📦 Processing ${docs.length} documents for namespace: ${namespace}`);
      
      // Generate embeddings for all documents
      const vectors = await Promise.all(
        docs.map(async (doc) => {
          const searchableText = this.buildSearchableText(doc);
          const embedding = await this.generateEmbedding(searchableText);
          
          return {
            id: doc.id,
            values: embedding,
            metadata: {
              ...doc.metadata,
              type: doc.type,
              title: doc.title,
              content: doc.content.substring(0, 1000),
              url: doc.url,
              createdAt: doc.createdAt.getTime(),
              updatedAt: doc.updatedAt.getTime(),
              authorId: doc.author.id,
              authorName: doc.author.name,
              authorEmail: doc.author.email,
              searchableText: searchableText.substring(0, 2000)
            }
          };
        })
      );
      
      // Upsert in batches of 100
      const batchSize = 100;
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        try {
          await this.index.namespace(namespace).upsert(batch);
          console.log(`✅ Upserted batch of ${batch.length} documents to ${namespace}`);
        } catch (error) {
          console.error('Error upserting batch:', error);
          throw new Error('Failed to batch upsert documents');
        }
      }
    }
  }

  /**
   * Search across all document types with cross-reference detection
   */
  async search(query: string, filters?: SearchFilters, limit: number = 10): Promise<SearchResult[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Build metadata filter
    const filter = this.buildSearchFilter(filters);
    
    // Determine namespaces to search
    const namespaces = filters?.types?.map(t => this.getNamespace(t)) || this.getAllNamespaces();
    
    try {
      // Search across namespaces
      const results = await Promise.all(
        namespaces.map(ns => 
          this.index.namespace(ns).query({
            vector: queryEmbedding,
            topK: Math.ceil(limit / namespaces.length),
            filter: Object.keys(filter).length > 0 ? filter : undefined,
            includeMetadata: true,
            includeValues: false
          })
        )
      );
      
      // Combine and sort results
      const allMatches = results.flatMap(r => r.matches || []);
      allMatches.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      // Transform to SearchResult with cross-references
      const searchResults = await Promise.all(
        allMatches.slice(0, limit).map(async (match) => {
          const crossReferences = await this.findCrossReferences(match);
          
          return {
            document: this.reconstructDocument(match),
            score: match.score || 0,
            highlights: this.generateHighlights(query, match.metadata),
            crossReferences
          };
        })
      );
      
      return searchResults;
    } catch (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents in Pinecone');
    }
  }

  /**
   * Find documents related to a specific ticket
   */
  async findRelatedToTicket(ticketKey: string, limit: number = 20): Promise<SearchResult[]> {
    return this.search(`ticket ${ticketKey}`, {
      relatedTo: { ticketKey }
    }, limit);
  }

  /**
   * Find email threads related to a ticket
   */
  async findEmailThreadsForTicket(ticketKey: string): Promise<SearchResult[]> {
    const results = await this.search(`${ticketKey}`, {
      types: [DocumentType.EMAIL]
    }, 50);
    
    // Filter for emails that actually mention the ticket
    return results.filter(result => 
      result.document.type === DocumentType.EMAIL &&
      (result.document.metadata.mentionedTickets?.includes(ticketKey) ||
       result.document.content.includes(ticketKey) ||
       result.document.title.includes(ticketKey))
    );
  }

  /**
   * Get health status of the service
   */
  async getHealth(): Promise<{ healthy: boolean; details?: any; error?: string }> {
    try {
      const stats = await this.index.describeIndexStats();
      
      return {
        healthy: true,
        details: {
          indexName: this.indexName,
          totalVectors: stats.totalRecordCount || 0,
          namespaces: stats.namespaces || {},
          indexFullness: stats.indexFullness || 0
        }
      };
    } catch (error: any) {
      return {
        healthy: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Private helper methods
   */
  
  private getNamespace(type: DocumentType): string {
    const namespaceMap: Record<DocumentType, string> = {
      [DocumentType.EMAIL]: 'emails',
      [DocumentType.CONFLUENCE]: 'confluence',
      [DocumentType.JIRA_TICKET]: 'jira-tickets',
      [DocumentType.JIRA_COMMENT]: 'jira-comments'
    };
    return namespaceMap[type];
  }

  private getAllNamespaces(): string[] {
    return ['emails', 'confluence', 'jira-tickets', 'jira-comments'];
  }

  private buildSearchableText(doc: Document): string {
    const parts = [doc.title, doc.content];
    
    // Add type-specific searchable content
    switch (doc.type) {
      case DocumentType.EMAIL:
        const emailDoc = doc as EmailDocument;
        parts.push(emailDoc.subject, emailDoc.from, ...emailDoc.to);
        if (emailDoc.metadata.mentionedTickets) {
          parts.push(...emailDoc.metadata.mentionedTickets);
        }
        break;
        
      case DocumentType.CONFLUENCE:
        const confluenceDoc = doc as ConfluenceDocument;
        parts.push(confluenceDoc.spaceKey, confluenceDoc.spaceName);
        if (confluenceDoc.metadata.tags) {
          parts.push(...confluenceDoc.metadata.tags);
        }
        break;
        
      case DocumentType.JIRA_TICKET:
      case DocumentType.JIRA_COMMENT:
        const jiraDoc = doc as JiraDocument;
        parts.push(jiraDoc.ticketKey, jiraDoc.projectKey, jiraDoc.projectName);
        if (jiraDoc.metadata.labels) {
          parts.push(...jiraDoc.metadata.labels);
        }
        break;
    }
    
    return parts.filter(Boolean).join(' ');
  }

  private buildSearchFilter(filters?: SearchFilters): any {
    const filter: any = {};
    
    if (filters?.dateRange) {
      filter.createdAt = {
        $gte: filters.dateRange.start.getTime(),
        $lte: filters.dateRange.end.getTime()
      };
    }
    
    if (filters?.authors?.length) {
      filter.authorId = { $in: filters.authors };
    }
    
    if (filters?.mentions?.length) {
      filter.mentions = { $in: filters.mentions };
    }
    
    if (filters?.relatedTo?.ticketKey) {
      filter.$or = [
        { mentionedTickets: { $in: [filters.relatedTo.ticketKey] } },
        { relatedTickets: { $in: [filters.relatedTo.ticketKey] } },
        { ticketKey: filters.relatedTo.ticketKey }
      ];
    }
    
    return filter;
  }

  private async findCrossReferences(match: any): Promise<{ emails: string[]; tickets: string[]; pages: string[] }> {
    const crossRefs = {
      emails: [] as string[],
      tickets: [] as string[],
      pages: [] as string[]
    };
    
    const metadata = match.metadata;
    
    // Extract cross-references from metadata
    if (metadata.mentionedTickets) crossRefs.tickets.push(...metadata.mentionedTickets);
    if (metadata.relatedTickets) crossRefs.tickets.push(...metadata.relatedTickets);
    if (metadata.mentionedPages) crossRefs.pages.push(...metadata.mentionedPages);
    if (metadata.relatedPages) crossRefs.pages.push(...metadata.relatedPages);
    if (metadata.relatedEmails) crossRefs.emails.push(...metadata.relatedEmails);
    
    // If this is a ticket, find related emails and pages
    if (metadata.type === DocumentType.JIRA_TICKET && metadata.ticketKey) {
      // This would require additional searches, keeping simple for now
      // Could implement more sophisticated cross-reference detection here
    }
    
    return {
      emails: [...new Set(crossRefs.emails)],
      tickets: [...new Set(crossRefs.tickets)],
      pages: [...new Set(crossRefs.pages)]
    };
  }

  private reconstructDocument(match: any): Document {
    const metadata = match.metadata;
    
    const baseDoc = {
      id: match.id,
      title: metadata.title,
      content: metadata.content,
      url: metadata.url,
      createdAt: new Date(metadata.createdAt),
      updatedAt: new Date(metadata.updatedAt),
      author: {
        id: metadata.authorId,
        name: metadata.authorName,
        email: metadata.authorEmail
      }
    };
    
    // Reconstruct type-specific document
    switch (metadata.type) {
      case DocumentType.EMAIL:
        return {
          ...baseDoc,
          type: DocumentType.EMAIL,
          from: metadata.from || '',
          to: metadata.to || [],
          cc: metadata.cc || [],
          subject: metadata.subject || metadata.title,
          threadId: metadata.threadId,
          hasAttachments: metadata.hasAttachments || false,
          isRead: metadata.isRead || false,
          labels: metadata.labels || [],
          metadata: {
            messageId: metadata.messageId,
            gmailId: metadata.gmailId,
            priority: metadata.priority || 'medium',
            hasLinks: metadata.hasLinks || false,
            mentionedTickets: metadata.mentionedTickets || [],
            mentionedPages: metadata.mentionedPages || [],
            sentiment: metadata.sentiment || 'neutral',
            urgencyKeywords: metadata.urgencyKeywords || []
          }
        } as EmailDocument;
        
      case DocumentType.CONFLUENCE:
        return {
          ...baseDoc,
          type: DocumentType.CONFLUENCE,
          spaceKey: metadata.spaceKey,
          spaceName: metadata.spaceName,
          parentId: metadata.parentId,
          version: metadata.version || 1,
          status: metadata.status || 'current',
          metadata: {
            pageId: metadata.pageId,
            hasImages: metadata.hasImages || false,
            hasCode: metadata.hasCode || false,
            hasTables: metadata.hasTables || false,
            wordCount: metadata.wordCount || 0,
            relatedTickets: metadata.relatedTickets || [],
            tags: metadata.tags || [],
            watchers: metadata.watchers || [],
            lastViewedBy: metadata.lastViewedBy || []
          }
        } as ConfluenceDocument;
        
      default: // JIRA_TICKET or JIRA_COMMENT
        return {
          ...baseDoc,
          type: metadata.type,
          ticketKey: metadata.ticketKey,
          projectKey: metadata.projectKey,
          projectName: metadata.projectName,
          metadata: {
            issueType: metadata.issueType,
            status: metadata.status,
            priority: metadata.priority,
            assignee: metadata.assignee,
            reporter: metadata.reporter,
            labels: metadata.labels || [],
            components: metadata.components || [],
            mentions: metadata.mentions || [],
            hasRichContent: metadata.hasRichContent || false,
            urgencyLevel: metadata.urgencyLevel || 'medium',
            relatedEmails: metadata.relatedEmails || [],
            relatedPages: metadata.relatedPages || []
          }
        } as JiraDocument;
    }
  }

  private generateHighlights(query: string, metadata: any): string[] {
    const highlights: string[] = [];
    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 2);
    
    // Check title
    if (metadata?.title) {
      const titleLower = metadata.title.toLowerCase();
      if (queryWords.some(word => titleLower.includes(word))) {
        highlights.push(metadata.title);
      }
    }
    
    // Check content
    if (metadata?.content) {
      const contentLower = metadata.content.toLowerCase();
      if (queryWords.some(word => contentLower.includes(word))) {
        const snippet = metadata.content.length > 150 
          ? metadata.content.substring(0, 150) + '...'
          : metadata.content;
        highlights.push(snippet);
      }
    }
    
    return highlights;
  }
}

// Export singleton instance
let multiSourceService: MultiSourcePineconeService | null = null;

export function getMultiSourcePineconeService(): MultiSourcePineconeService {
  if (!multiSourceService) {
    multiSourceService = new MultiSourcePineconeService();
  }
  return multiSourceService;
}