/**
 * PineconeService - Core service for vector database operations
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';
import { 
  PineconeDocument, 
  PineconeDocType, 
  SearchQuery, 
  SearchResult 
} from './types';

export class PineconeService {
  private pinecone: Pinecone;
  private openai: OpenAI;
  private index: any;
  private indexName: string;

  constructor() {
    // Initialize Pinecone client
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    
    // Initialize OpenAI client for embeddings
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    // Use configured index name or default
    this.indexName = process.env.PINECONE_INDEX_NAME || 'theodore-companies';
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
   * Upsert a single document to Pinecone
   */
  async upsertDocument(doc: PineconeDocument): Promise<void> {
    const { id, type, content, metadata } = doc;
    
    // Generate embedding from content
    const textToEmbed = this.buildEmbeddingText(content);
    const embedding = await this.generateEmbedding(textToEmbed);
    
    // Get namespace for document type
    const namespace = this.getNamespace(type);
    
    try {
      await this.index.namespace(namespace).upsert([{
        id,
        values: embedding,
        metadata: {
          ...metadata,
          type,
          title: content.title,
          description: content.description
        }
      }]);
      
      console.log(`Document ${id} upserted to namespace ${namespace}`);
    } catch (error) {
      console.error('Error upserting document:', error);
      throw new Error('Failed to upsert document to Pinecone');
    }
  }

  /**
   * Search for similar documents
   */
  async search(query: SearchQuery): Promise<SearchResult[]> {
    const { query: searchText, type, filters, limit = 10 } = query;
    
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(searchText);
    
    // Build metadata filter
    const filter: any = {};
    if (filters?.teamId) filter.teamId = filters.teamId;
    if (filters?.userId) filter.userId = filters.userId;
    if (filters?.status) filter.status = { $in: filters.status };
    if (filters?.dateRange) {
      filter.createdAt = {
        $gte: filters.dateRange.start.getTime(),
        $lte: filters.dateRange.end.getTime()
      };
    }
    
    // Determine which namespaces to search
    const namespaces = type?.map(t => this.getNamespace(t)) || this.getAllNamespaces();
    
    try {
      // Search across namespaces
      const results = await Promise.all(
        namespaces.map(ns => 
          this.index.namespace(ns).query({
            vector: queryEmbedding,
            topK: limit,
            filter: Object.keys(filter).length > 0 ? filter : undefined,
            includeMetadata: true
          })
        )
      );
      
      // Combine and sort results by score
      const allMatches = results.flatMap(r => r.matches || []);
      allMatches.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      // Transform to SearchResult format
      return allMatches.slice(0, limit).map(match => ({
        id: match.id,
        score: match.score || 0,
        document: {
          id: match.id,
          type: match.metadata?.type as PineconeDocType,
          embedding: [], // Don't return full embedding
          metadata: match.metadata as any,
          content: {
            title: match.metadata?.title || '',
            description: match.metadata?.description || '',
            fullText: '' // Would need to fetch from database
          }
        },
        highlights: this.generateHighlights(searchText, match.metadata)
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents in Pinecone');
    }
  }

  /**
   * Delete a document from Pinecone
   */
  async deleteDocument(id: string, type: PineconeDocType): Promise<void> {
    const namespace = this.getNamespace(type);
    
    try {
      await this.index.namespace(namespace).deleteOne(id);
      console.log(`Document ${id} deleted from namespace ${namespace}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document from Pinecone');
    }
  }

  /**
   * Batch upsert multiple documents
   */
  async upsertBatch(documents: PineconeDocument[]): Promise<void> {
    // Group documents by type/namespace
    const grouped = documents.reduce((acc, doc) => {
      const ns = this.getNamespace(doc.type);
      if (!acc[ns]) acc[ns] = [];
      acc[ns].push(doc);
      return acc;
    }, {} as Record<string, PineconeDocument[]>);
    
    // Process each namespace
    for (const [namespace, docs] of Object.entries(grouped)) {
      // Generate embeddings for all documents
      const vectors = await Promise.all(
        docs.map(async (doc) => {
          const textToEmbed = this.buildEmbeddingText(doc.content);
          const embedding = await this.generateEmbedding(textToEmbed);
          
          return {
            id: doc.id,
            values: embedding,
            metadata: {
              ...doc.metadata,
              type: doc.type,
              title: doc.content.title,
              description: doc.content.description
            }
          };
        })
      );
      
      // Upsert in batches of 100 (Pinecone limit)
      const batchSize = 100;
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        try {
          await this.index.namespace(namespace).upsert(batch);
          console.log(`Upserted batch of ${batch.length} documents to namespace ${namespace}`);
        } catch (error) {
          console.error('Error upserting batch:', error);
          throw new Error('Failed to upsert batch to Pinecone');
        }
      }
    }
  }

  /**
   * Get index statistics
   */
  async getIndexStats(): Promise<any> {
    try {
      const stats = await this.index.describeIndexStats();
      return stats;
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw new Error('Failed to get index statistics');
    }
  }

  /**
   * Check health of Pinecone connection
   */
  async checkHealth(): Promise<{ healthy: boolean; details?: any; error?: string }> {
    try {
      // Try to get index stats as a health check
      const stats = await this.getIndexStats();
      
      // Try a simple query to ensure search works
      const testResults = await this.search({
        query: 'test',
        limit: 1
      });
      
      return {
        healthy: true,
        details: {
          indexName: this.indexName,
          totalVectors: stats.totalRecordCount || 0,
          indexFullness: stats.indexFullness || 0,
          namespaces: stats.namespaces || {}
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
  
  private getNamespace(type: PineconeDocType): string {
    const namespaceMap: Record<PineconeDocType, string> = {
      [PineconeDocType.TICKET]: 'tickets',
      [PineconeDocType.COMMENT]: 'comments',
      [PineconeDocType.TEMPLATE]: 'templates',
      [PineconeDocType.VOICE_COMMAND]: 'commands',
      [PineconeDocType.DOCUMENTATION]: 'docs'
    };
    return namespaceMap[type] || 'default';
  }

  private getAllNamespaces(): string[] {
    return ['tickets', 'comments', 'templates', 'commands', 'docs'];
  }

  private buildEmbeddingText(content: { title: string; description: string; fullText: string }): string {
    // Combine all text fields for embedding
    const parts = [content.title, content.description];
    
    // Add fullText if it's not too long
    if (content.fullText && content.fullText.length < 8000) {
      parts.push(content.fullText);
    }
    
    return parts.filter(Boolean).join(' ');
  }

  private generateHighlights(query: string, metadata: any): string[] {
    const highlights: string[] = [];
    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 2);
    
    // Check title for matches
    if (metadata?.title) {
      const titleLower = metadata.title.toLowerCase();
      if (queryWords.some(word => titleLower.includes(word))) {
        highlights.push(metadata.title);
      }
    }
    
    // Check description for matches
    if (metadata?.description) {
      const descLower = metadata.description.toLowerCase();
      if (queryWords.some(word => descLower.includes(word))) {
        // Truncate long descriptions
        const desc = metadata.description.length > 150 
          ? metadata.description.substring(0, 150) + '...'
          : metadata.description;
        highlights.push(desc);
      }
    }
    
    return highlights;
  }
}

// Export singleton instance
let pineconeService: PineconeService | null = null;

export function getPineconeService(): PineconeService {
  if (!pineconeService) {
    pineconeService = new PineconeService();
  }
  return pineconeService;
}