/**
 * Minimal Unified Metadata Schema for Multi-Source Pinecone Index
 * Fast, simple, and effective for Gmail, Jira, Confluence, GitHub, and Slack
 */

export type DataSource = 'gmail' | 'jira' | 'confluence' | 'github' | 'slack';

/**
 * Minimal metadata for fast, efficient filtering
 */
export interface MinimalMetadata {
  // Core (required)
  id: string;                    // Unique ID
  source: DataSource;
  type: string;                  // email, ticket, pr, message, page, comment, etc.
  
  // Timestamps (for recency)
  createdAt: number;             // Unix timestamp
  
  // Text fields (for display)
  title: string;                 // Subject/title/summary
  author: string;                // Name or email
  
  // Key relationships (for linking)
  projectKey?: string;           // PROJ, repo name, or space
  ticketKeys: string[];          // [PROJ-123, PROJ-456]
  
  // Status (for filtering)
  status?: string;               // open, closed, done, merged
  priority?: string;             // high, medium, low
  
  // Search optimization
  mentions: string[];            // [@user, @channel, PROJ-123]
}

/**
 * Pinecone vector record with minimal metadata
 */
export interface MinimalPineconeRecord {
  id: string;
  values: number[];
  metadata: MinimalMetadata;
}

/**
 * Simple search filters
 */
export interface SimpleSearchFilters {
  // Source filters
  sources?: DataSource[];
  types?: string[];
  
  // Time filter
  createdAfter?: number;         // Unix timestamp
  
  // Relationship filters
  projectKeys?: string[];
  hasTickets?: string[];         // Find docs mentioning these tickets
  hasMentions?: string[];        // Find docs mentioning these users/items
  
  // Status filters
  statuses?: string[];
  priorities?: string[];
  
  // Author filter
  authors?: string[];
}

/**
 * Build Pinecone filter from simple search filters
 */
export function buildPineconeFilter(filters: SimpleSearchFilters): Record<string, any> {
  const pineconeFilter: Record<string, any> = {};
  
  if (filters.sources?.length) {
    pineconeFilter.source = { $in: filters.sources };
  }
  
  if (filters.types?.length) {
    pineconeFilter.type = { $in: filters.types };
  }
  
  if (filters.createdAfter) {
    pineconeFilter.createdAt = { $gte: filters.createdAfter };
  }
  
  if (filters.projectKeys?.length) {
    pineconeFilter.projectKey = { $in: filters.projectKeys };
  }
  
  if (filters.hasTickets?.length) {
    pineconeFilter.ticketKeys = { $in: filters.hasTickets };
  }
  
  if (filters.hasMentions?.length) {
    pineconeFilter.mentions = { $in: filters.hasMentions };
  }
  
  if (filters.statuses?.length) {
    pineconeFilter.status = { $in: filters.statuses };
  }
  
  if (filters.priorities?.length) {
    pineconeFilter.priority = { $in: filters.priorities };
  }
  
  if (filters.authors?.length) {
    pineconeFilter.author = { $in: filters.authors };
  }
  
  return pineconeFilter;
}