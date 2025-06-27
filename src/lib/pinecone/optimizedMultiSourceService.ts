/**
 * Optimized Multi-Source Pinecone Service following best practices
 * - Minimal metadata for filtering only
 * - Full content stored in separate document store
 * - Efficient vector search with post-processing enrichment
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

// Minimal metadata for Pinecone filtering
export interface PineconeMetadata {
  // Core identifiers
  type: string;         // 'jira_ticket' | 'jira_comment' | 'email' | 'confluence' | 'slack'
  source: string;       // 'jira' | 'gmail' | 'confluence' | 'slack' | 'github'
  
  // Filtering fields (keep minimal)
  projectKey?: string;  // Jira project
  ticketKey?: string;   // Jira ticket
  authorId?: string;    // Author identifier
  status?: string;      // Current status
  priority?: string;    // Priority level
  
  // Date filtering (as epoch timestamps)
  createdAt: number;
  updatedAt?: number;
  
  // Boolean flags for filtering
  hasAttachments?: boolean;
  isUrgent?: boolean;
  
  // Array fields (keep small)
  mentionIds?: string[];  // Just user IDs, not names
  labels?: string[];      // Max 5-10 labels
}

// Full document stored separately (Redis/PostgreSQL)
export interface DocumentData {
  id: string;
  title: string;
  content: string;
  url?: string;
  author: {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  assignee?: {
    id: string;
    name: string;
    email?: string;
  };
  attachments?: Array<{
    id: string;
    filename: string;
    mimeType: string;
    size: number;
    s3Url?: string;
  }>;
  relatedEmails?: string[];
  relatedPages?: string[];
  components?: string[];
  customFields?: Record<string, any>;
}

// Search filters matching minimal metadata
export interface SearchFilters {
  types?: string[];
  sources?: string[];
  projectKeys?: string[];
  ticketKeys?: string[];
  authorIds?: string[];
  statuses?: string[];
  priorities?: string[];
  dateRange?: {
    field: 'createdAt' | 'updatedAt';
    from?: Date;
    to?: Date;
  };
  hasAttachments?: boolean;
  isUrgent?: boolean;
  mentionedUserIds?: string[];
  labels?: string[];
}

export interface SearchOptions {
  filters?: SearchFilters;
  limit?: number;
  includeDocuments?: boolean;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: PineconeMetadata;
  document?: DocumentData;  // Only included if requested
}

/**
 * Document store interface - implement with Redis, PostgreSQL, etc.
 */
export interface IDocumentStore {
  set(id: string, data: DocumentData): Promise<void>;
  get(id: string): Promise<DocumentData | null>;
  mget(ids: string[]): Promise<Map<string, DocumentData>>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export class OptimizedPineconeService {
  private pinecone: Pinecone;
  private index: any;
  private openai: OpenAI;
  private documentStore: IDocumentStore;

  constructor(
    apiKey: string,
    indexName: string,
    openaiApiKey: string,
    documentStore: IDocumentStore
  ) {
    this.pinecone = new Pinecone({ apiKey });
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.documentStore = documentStore;
  }

  async initialize() {
    this.index = await this.pinecone.index(process.env.PINECONE_INDEX_NAME!);
  }

  /**
   * Index a document with minimal metadata
   */
  async indexDocument(
    id: string,
    content: string,
    metadata: PineconeMetadata,
    documentData: DocumentData,
    namespace?: string
  ): Promise<void> {
    try {
      // Generate embedding from content
      const embedding = await this.generateEmbedding(content);
      
      // Store minimal metadata in Pinecone
      const vector = {
        id,
        values: embedding,
        metadata: this.sanitizeMetadata(metadata)
      };
      
      // Upsert to Pinecone
      const ns = namespace || this.getNamespace(metadata.source);
      await this.index.namespace(ns).upsert([vector]);
      
      // Store full document data separately
      await this.documentStore.set(id, documentData);
      
      console.log(`✅ Indexed ${id} with minimal metadata`);
    } catch (error) {
      console.error(`❌ Error indexing ${id}:`, error);
      throw error;
    }
  }

  /**
   * Batch index documents
   */
  async indexDocuments(
    documents: Array<{
      id: string;
      content: string;
      metadata: PineconeMetadata;
      documentData: DocumentData;
    }>,
    namespace?: string
  ): Promise<void> {
    const batchSize = 100;
    
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      
      // Generate embeddings
      const vectors = await Promise.all(
        batch.map(async (doc) => {
          const embedding = await this.generateEmbedding(doc.content);
          return {
            id: doc.id,
            values: embedding,
            metadata: this.sanitizeMetadata(doc.metadata)
          };
        })
      );
      
      // Batch upsert to Pinecone
      const ns = namespace || this.getNamespace(batch[0].metadata.source);
      await this.index.namespace(ns).upsert(vectors);
      
      // Batch store documents
      await Promise.all(
        batch.map(doc => this.documentStore.set(doc.id, doc.documentData))
      );
      
      console.log(`✅ Indexed batch of ${batch.length} documents`);
    }
  }

  /**
   * Search with minimal metadata and optional document enrichment
   */
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const { filters, limit = 20, includeDocuments = true } = options;
    
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Build metadata filter
    const metadataFilter = this.buildMetadataFilter(filters);
    
    // Determine namespaces to search
    const namespaces = filters?.sources?.map(s => this.getNamespace(s)) || ['jira-tickets', 'jira-comments'];
    
    // Search across namespaces
    const searchPromises = namespaces.map(ns =>
      this.index.namespace(ns).query({
        vector: queryEmbedding,
        topK: Math.ceil(limit / namespaces.length),
        filter: metadataFilter,
        includeMetadata: true,
        includeValues: false
      })
    );
    
    const results = await Promise.all(searchPromises);
    const allMatches = results.flatMap(r => r.matches || []);
    
    // Sort by score
    allMatches.sort((a, b) => (b.score || 0) - (a.score || 0));
    const topMatches = allMatches.slice(0, limit);
    
    // Build search results
    const searchResults: SearchResult[] = topMatches.map(match => ({
      id: match.id,
      score: match.score || 0,
      metadata: match.metadata as PineconeMetadata
    }));
    
    // Optionally fetch full documents
    if (includeDocuments && searchResults.length > 0) {
      const documentIds = searchResults.map(r => r.id);
      const documents = await this.documentStore.mget(documentIds);
      
      searchResults.forEach(result => {
        result.document = documents.get(result.id) || undefined;
      });
    }
    
    return searchResults;
  }

  /**
   * Delete document from Pinecone and document store
   */
  async deleteDocument(id: string, namespace?: string): Promise<void> {
    // Delete from Pinecone
    const ns = namespace || 'default';
    await this.index.namespace(ns).deleteOne(id);
    
    // Delete from document store
    await this.documentStore.delete(id);
    
    console.log(`✅ Deleted document ${id}`);
  }

  /**
   * Update document metadata (minimal fields only)
   */
  async updateMetadata(
    id: string,
    metadata: Partial<PineconeMetadata>,
    namespace?: string
  ): Promise<void> {
    const ns = namespace || 'default';
    await this.index.namespace(ns).update({
      id,
      metadata: this.sanitizeMetadata(metadata as PineconeMetadata)
    });
  }

  /**
   * Update document data (in document store)
   */
  async updateDocumentData(
    id: string,
    data: Partial<DocumentData>
  ): Promise<void> {
    const existing = await this.documentStore.get(id);
    if (!existing) {
      throw new Error(`Document ${id} not found`);
    }
    
    const updated = { ...existing, ...data };
    await this.documentStore.set(id, updated);
  }

  // Private helper methods

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return response.data[0].embedding;
  }

  private sanitizeMetadata(metadata: PineconeMetadata): PineconeMetadata {
    // Ensure metadata is minimal and valid
    const sanitized: PineconeMetadata = {
      type: metadata.type,
      source: metadata.source,
      createdAt: metadata.createdAt
    };
    
    // Only include optional fields if they exist and are valid
    if (metadata.projectKey) sanitized.projectKey = metadata.projectKey;
    if (metadata.ticketKey) sanitized.ticketKey = metadata.ticketKey;
    if (metadata.authorId) sanitized.authorId = metadata.authorId;
    if (metadata.status) sanitized.status = metadata.status;
    if (metadata.priority) sanitized.priority = metadata.priority;
    if (metadata.updatedAt) sanitized.updatedAt = metadata.updatedAt;
    if (metadata.hasAttachments !== undefined) sanitized.hasAttachments = metadata.hasAttachments;
    if (metadata.isUrgent !== undefined) sanitized.isUrgent = metadata.isUrgent;
    
    // Limit array sizes
    if (metadata.mentionIds?.length) {
      sanitized.mentionIds = metadata.mentionIds.slice(0, 10);
    }
    if (metadata.labels?.length) {
      sanitized.labels = metadata.labels.slice(0, 10);
    }
    
    return sanitized;
  }

  private buildMetadataFilter(filters?: SearchFilters): any {
    if (!filters) return {};
    
    const conditions: any[] = [];
    
    if (filters.types?.length) {
      conditions.push({ type: { $in: filters.types } });
    }
    if (filters.sources?.length) {
      conditions.push({ source: { $in: filters.sources } });
    }
    if (filters.projectKeys?.length) {
      conditions.push({ projectKey: { $in: filters.projectKeys } });
    }
    if (filters.authorIds?.length) {
      conditions.push({ authorId: { $in: filters.authorIds } });
    }
    if (filters.statuses?.length) {
      conditions.push({ status: { $in: filters.statuses } });
    }
    if (filters.priorities?.length) {
      conditions.push({ priority: { $in: filters.priorities } });
    }
    
    if (filters.dateRange) {
      const dateFilter: any = {};
      if (filters.dateRange.from) {
        dateFilter.$gte = filters.dateRange.from.getTime();
      }
      if (filters.dateRange.to) {
        dateFilter.$lte = filters.dateRange.to.getTime();
      }
      conditions.push({ [filters.dateRange.field]: dateFilter });
    }
    
    if (filters.hasAttachments !== undefined) {
      conditions.push({ hasAttachments: filters.hasAttachments });
    }
    if (filters.isUrgent !== undefined) {
      conditions.push({ isUrgent: filters.isUrgent });
    }
    
    if (filters.mentionedUserIds?.length) {
      conditions.push({ mentionIds: { $in: filters.mentionedUserIds } });
    }
    
    return conditions.length > 1 ? { $and: conditions } : conditions[0] || {};
  }

  private getNamespace(source: string): string {
    const namespaceMap: Record<string, string> = {
      'jira': 'jira-tickets',
      'jira_ticket': 'jira-tickets',
      'jira_comment': 'jira-comments',
      'gmail': 'emails',
      'email': 'emails',
      'confluence': 'confluence-pages',
      'slack': 'slack-messages',
      'github': 'github-items'
    };
    return namespaceMap[source] || 'default';
  }
}

/**
 * Example Redis document store implementation
 */
export class RedisDocumentStore implements IDocumentStore {
  private redis: any; // Use your Redis client
  private prefix = 'squiddles:docs:';
  
  constructor(redisClient: any) {
    this.redis = redisClient;
  }
  
  async set(id: string, data: DocumentData): Promise<void> {
    await this.redis.set(
      this.prefix + id,
      JSON.stringify(data),
      'EX',
      86400 * 30 // 30 days TTL
    );
  }
  
  async get(id: string): Promise<DocumentData | null> {
    const data = await this.redis.get(this.prefix + id);
    return data ? JSON.parse(data) : null;
  }
  
  async mget(ids: string[]): Promise<Map<string, DocumentData>> {
    const keys = ids.map(id => this.prefix + id);
    const values = await this.redis.mget(keys);
    
    const result = new Map<string, DocumentData>();
    ids.forEach((id, index) => {
      if (values[index]) {
        result.set(id, JSON.parse(values[index]));
      }
    });
    
    return result;
  }
  
  async delete(id: string): Promise<void> {
    await this.redis.del(this.prefix + id);
  }
  
  async exists(id: string): Promise<boolean> {
    return await this.redis.exists(this.prefix + id) === 1;
  }
}