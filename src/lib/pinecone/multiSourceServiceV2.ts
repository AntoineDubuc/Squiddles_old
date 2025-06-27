/**
 * Multi-Source Pinecone Service V2 with Minimal Metadata Schema
 * Supports Gmail, Confluence, Jira, GitHub, and Slack with unified minimal metadata
 */

import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';
import { 
  MinimalMetadata, 
  MinimalPineconeRecord,
  DataSource,
  SimpleSearchFilters,
  buildPineconeFilter 
} from './types/unifiedMetadata';

export interface DocumentInput {
  id: string;
  source: DataSource;
  type: string;
  title: string;
  content: string;
  author: string;
  createdAt?: Date;
  projectKey?: string;
  ticketKeys?: string[];
  status?: string;
  priority?: string;
  mentions?: string[];
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: MinimalMetadata;
  highlights?: string[];
}

export class MultiSourcePineconeServiceV2 {
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
    
    this.indexName = process.env.PINECONE_INDEX_NAME || 'squiddles-unified';
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
   * Extract ticket keys from content
   */
  private extractTicketKeys(content: string): string[] {
    const ticketPattern = /\b[A-Z]{2,}-\d+\b/g;
    const matches = content.match(ticketPattern) || [];
    return [...new Set(matches)];
  }

  /**
   * Extract mentions from content
   */
  private extractMentions(content: string): string[] {
    const mentions: string[] = [];
    
    // Extract @mentions
    const atMentions = content.match(/@[\w.-]+/g) || [];
    mentions.push(...atMentions);
    
    // Extract #channels
    const channels = content.match(/#[\w-]+/g) || [];
    mentions.push(...channels);
    
    // Extract ticket mentions
    const tickets = this.extractTicketKeys(content);
    mentions.push(...tickets);
    
    return [...new Set(mentions)];
  }

  /**
   * Upsert a single document with minimal metadata
   */
  async upsertDocument(doc: DocumentInput): Promise<void> {
    try {
      // Generate embedding from content and title
      const searchableText = `${doc.title} ${doc.content}`;
      const embedding = await this.generateEmbedding(searchableText);
      
      // Build minimal metadata
      const metadata: MinimalMetadata = {
        id: doc.id,
        source: doc.source,
        type: doc.type,
        createdAt: doc.createdAt ? doc.createdAt.getTime() : Date.now(),
        title: doc.title.substring(0, 500), // Limit title length
        author: doc.author,
        projectKey: doc.projectKey,
        ticketKeys: doc.ticketKeys || this.extractTicketKeys(doc.content),
        status: doc.status,
        priority: doc.priority,
        mentions: doc.mentions || this.extractMentions(doc.content)
      };
      
      const record: MinimalPineconeRecord = {
        id: doc.id,
        values: embedding,
        metadata
      };
      
      await this.index.upsert([record]);
      
      console.log(`✅ Upserted document: ${doc.id} (${doc.source}:${doc.type})`);
    } catch (error) {
      console.error('Error upserting document:', error);
      throw new Error(`Failed to upsert document ${doc.id}`);
    }
  }

  /**
   * Batch upsert multiple documents
   */
  async upsertDocuments(documents: DocumentInput[]): Promise<void> {
    console.log(`📦 Processing ${documents.length} documents for upsert`);
    
    // Process in batches to avoid rate limits
    const batchSize = 50;
    const records: MinimalPineconeRecord[] = [];
    
    // Generate embeddings and metadata for all documents
    for (const doc of documents) {
      try {
        const searchableText = `${doc.title} ${doc.content}`;
        const embedding = await this.generateEmbedding(searchableText);
        
        const metadata: MinimalMetadata = {
          id: doc.id,
          source: doc.source,
          type: doc.type,
          createdAt: doc.createdAt ? doc.createdAt.getTime() : Date.now(),
          title: doc.title.substring(0, 500),
          author: doc.author,
          projectKey: doc.projectKey,
          ticketKeys: doc.ticketKeys || this.extractTicketKeys(doc.content),
          status: doc.status,
          priority: doc.priority,
          mentions: doc.mentions || this.extractMentions(doc.content)
        };
        
        records.push({
          id: doc.id,
          values: embedding,
          metadata
        });
      } catch (error) {
        console.error(`Error processing document ${doc.id}:`, error);
      }
    }
    
    // Upsert in batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      try {
        await this.index.upsert(batch);
        console.log(`✅ Upserted batch of ${batch.length} documents`);
      } catch (error) {
        console.error('Error upserting batch:', error);
        throw new Error('Failed to batch upsert documents');
      }
    }
  }

  /**
   * Search with minimal metadata filters
   */
  async search(
    query: string, 
    filters?: SimpleSearchFilters, 
    limit: number = 20
  ): Promise<SearchResult[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      const pineconeFilter = filters ? buildPineconeFilter(filters) : undefined;
      
      const results = await this.index.query({
        vector: queryEmbedding,
        topK: limit,
        filter: pineconeFilter,
        includeMetadata: true,
        includeValues: false
      });
      
      return results.matches.map((match: any) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata as MinimalMetadata,
        highlights: this.generateHighlights(query, match.metadata)
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(id: string): Promise<SearchResult | null> {
    try {
      const result = await this.index.fetch([id]);
      const record = result.records[id];
      
      if (!record) {
        return null;
      }
      
      return {
        id: record.id,
        score: 1.0,
        metadata: record.metadata as MinimalMetadata
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      throw new Error(`Failed to fetch document ${id}`);
    }
  }

  /**
   * Update document metadata
   */
  async updateMetadata(id: string, metadata: Partial<MinimalMetadata>): Promise<void> {
    try {
      // Fetch existing document
      const existing = await this.getDocument(id);
      if (!existing) {
        throw new Error(`Document ${id} not found`);
      }
      
      // Merge metadata
      const updatedMetadata = {
        ...existing.metadata,
        ...metadata
      };
      
      // Update in Pinecone
      await this.index.update({
        id,
        metadata: updatedMetadata
      });
      
      console.log(`✅ Updated metadata for document: ${id}`);
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error(`Failed to update metadata for document ${id}`);
    }
  }

  /**
   * Delete document by ID
   */
  async deleteDocument(id: string): Promise<void> {
    try {
      await this.index.deleteOne(id);
      console.log(`✅ Deleted document: ${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error(`Failed to delete document ${id}`);
    }
  }

  /**
   * Bulk delete documents
   */
  async bulkDelete(options: {
    ids?: string[];
    filter?: SimpleSearchFilters;
  }): Promise<number> {
    try {
      if (options.ids && options.ids.length > 0) {
        // Delete by IDs
        await this.index.deleteMany(options.ids);
        console.log(`✅ Deleted ${options.ids.length} documents by ID`);
        return options.ids.length;
      } else if (options.filter) {
        // Delete by filter
        const pineconeFilter = buildPineconeFilter(options.filter);
        await this.index.deleteMany(pineconeFilter);
        console.log(`✅ Deleted documents matching filter`);
        return -1; // Can't determine exact count with filter deletion
      } else {
        throw new Error('Either ids or filter must be provided');
      }
    } catch (error) {
      console.error('Error bulk deleting documents:', error);
      throw new Error('Failed to bulk delete documents');
    }
  }

  /**
   * Get index statistics
   */
  async getStats(): Promise<any> {
    try {
      const stats = await this.index.describeIndexStats();
      return {
        totalVectors: stats.totalRecordCount,
        dimensions: stats.dimension,
        indexFullness: stats.indexFullness,
        namespaces: stats.namespaces
      };
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw new Error('Failed to get index statistics');
    }
  }

  /**
   * Initialize index (if it doesn't exist)
   */
  async initializeIndex(): Promise<void> {
    try {
      const indexes = await this.pinecone.listIndexes();
      const indexExists = indexes.indexes?.some(idx => idx.name === this.indexName);
      
      if (!indexExists) {
        console.log(`Creating index: ${this.indexName}`);
        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: 1536, // OpenAI embedding dimension
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          }
        });
        
        // Wait for index to be ready
        await new Promise(resolve => setTimeout(resolve, 60000));
        console.log(`✅ Index ${this.indexName} created`);
      } else {
        console.log(`✅ Index ${this.indexName} already exists`);
      }
    } catch (error) {
      console.error('Error initializing index:', error);
      throw new Error('Failed to initialize Pinecone index');
    }
  }

  /**
   * Get health status
   */
  async getHealth(): Promise<{
    healthy: boolean;
    indexName: string;
    stats?: any;
    error?: string;
  }> {
    try {
      const stats = await this.getStats();
      return {
        healthy: true,
        indexName: this.indexName,
        stats
      };
    } catch (error: any) {
      return {
        healthy: false,
        indexName: this.indexName,
        error: error.message
      };
    }
  }

  /**
   * Generate highlights for search results
   */
  private generateHighlights(query: string, metadata: any): string[] {
    const highlights: string[] = [];
    const queryTerms = query.toLowerCase().split(/\s+/);
    
    // Check title
    if (metadata.title) {
      const titleLower = metadata.title.toLowerCase();
      if (queryTerms.some(term => titleLower.includes(term))) {
        highlights.push(metadata.title);
      }
    }
    
    // Check mentions
    if (metadata.mentions) {
      const relevantMentions = metadata.mentions.filter((mention: string) =>
        queryTerms.some(term => mention.toLowerCase().includes(term))
      );
      highlights.push(...relevantMentions);
    }
    
    return highlights.slice(0, 3); // Limit to 3 highlights
  }
}

// Export singleton instance
let serviceInstance: MultiSourcePineconeServiceV2 | null = null;

export function getMultiSourcePineconeServiceV2(): MultiSourcePineconeServiceV2 {
  if (!serviceInstance) {
    serviceInstance = new MultiSourcePineconeServiceV2();
  }
  return serviceInstance;
}