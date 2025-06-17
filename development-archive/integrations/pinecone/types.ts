/**
 * Type definitions for Pinecone integration
 */

export enum PineconeDocType {
  TICKET = 'TICKET',
  COMMENT = 'COMMENT',
  TEMPLATE = 'TEMPLATE',
  VOICE_COMMAND = 'VOICE_COMMAND',
  DOCUMENTATION = 'DOCUMENTATION'
}

export interface PineconeDocument {
  id: string;
  type: PineconeDocType;
  embedding: number[];
  metadata: {
    type: string;
    teamId?: string;
    userId?: string;
    createdAt: number;
    status?: string;
    priority?: string;
    [key: string]: any;
  };
  content: {
    title: string;
    description: string;
    fullText: string;
  };
}

export interface SearchQuery {
  query: string;
  type?: PineconeDocType[];
  filters?: {
    teamId?: string;
    userId?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    status?: string[];
  };
  limit?: number;
  includeContent?: boolean;
}

export interface SearchResult {
  id: string;
  score: number;
  document: PineconeDocument;
  highlights?: string[];
}

export interface CreateTicketInput {
  title: string;
  description: string;
  type: string;
  teamId: string;
  userId: string;
  priority?: string;
  status?: string;
  sections?: Array<{
    name: string;
    content: string;
  }>;
}

export interface Ticket {
  id: string;
  key: string;
  title: string;
  description: string;
  type: string;
  teamId: string;
  userId: string;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  sections: Array<{
    name: string;
    content: string;
  }>;
  assigneeId?: string;
}