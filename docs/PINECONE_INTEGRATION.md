# Pinecone Integration Guide for Squiddles

## Overview
This guide covers the implementation of Pinecone vector database for semantic search across tickets, comments, templates, and voice commands in Squiddles.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Voice    │────▶│  OpenAI API      │────▶│   Pinecone      │
│   Command       │     │  Embeddings      │     │   Vector DB     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │                         │
                                ▼                         ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │ Embedding Model  │     │  Search Results │
                        │ text-embedding-  │     │  (Ranked by     │
                        │ ada-002          │     │   similarity)   │
                        └──────────────────┘     └─────────────────┘
```

## Setup & Configuration

### 1. Environment Variables
```bash
# Add to .env.local
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-environment  # e.g., "us-east-1-aws"
PINECONE_INDEX_NAME=squiddles-prod
OPENAI_API_KEY=your-openai-api-key  # For embeddings
```

### 2. Pinecone Index Configuration
```typescript
// Pinecone index settings
const indexConfig = {
  name: 'squiddles-prod',
  dimension: 1536,  // OpenAI embeddings dimension
  metric: 'cosine', // Best for semantic similarity
  pods: 1,
  replicas: 1,
  pod_type: 'p1.x1'
};
```

### 3. Install Dependencies
```bash
npm install @pinecone-database/pinecone openai
```

## Implementation

### Core Pinecone Service
```typescript
// src/lib/pinecone/pineconeService.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

export class PineconeService {
  private pinecone: Pinecone;
  private openai: OpenAI;
  private index: any;

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!
    });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    this.index = this.pinecone.index(process.env.PINECONE_INDEX_NAME!);
  }

  // Generate embedding for text
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    
    return response.data[0].embedding;
  }

  // Upsert document to Pinecone
  async upsertDocument(doc: PineconeDocument): Promise<void> {
    const { id, type, content, metadata } = doc;
    
    // Generate embedding from content
    const textToEmbed = `${content.title} ${content.description} ${content.fullText}`;
    const embedding = await this.generateEmbedding(textToEmbed);
    
    // Upsert to appropriate namespace
    const namespace = this.getNamespace(type);
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
  }

  // Search for similar documents
  async search(query: SearchQuery): Promise<SearchResult[]> {
    const { query: searchText, type, filters, limit = 10 } = query;
    
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(searchText);
    
    // Build filter
    const filter: any = {};
    if (filters?.teamId) filter.teamId = filters.teamId;
    if (filters?.userId) filter.userId = filters.userId;
    if (filters?.status) filter.status = { $in: filters.status };
    
    // Search across namespaces
    const namespaces = type?.map(t => this.getNamespace(t)) || ['tickets', 'comments'];
    const results = await Promise.all(
      namespaces.map(ns => 
        this.index.namespace(ns).query({
          vector: queryEmbedding,
          topK: limit,
          filter,
          includeMetadata: true
        })
      )
    );
    
    // Combine and sort results
    const allMatches = results.flatMap(r => r.matches || []);
    allMatches.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    // Transform to SearchResult
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
          fullText: '' // Fetch from database if needed
        }
      },
      highlights: this.generateHighlights(searchText, match.metadata)
    }));
  }

  // Delete document
  async deleteDocument(id: string, type: PineconeDocType): Promise<void> {
    const namespace = this.getNamespace(type);
    await this.index.namespace(namespace).deleteOne(id);
  }

  // Batch operations
  async upsertBatch(documents: PineconeDocument[]): Promise<void> {
    // Group by type for namespace
    const grouped = documents.reduce((acc, doc) => {
      const ns = this.getNamespace(doc.type);
      if (!acc[ns]) acc[ns] = [];
      acc[ns].push(doc);
      return acc;
    }, {} as Record<string, PineconeDocument[]>);
    
    // Process each namespace
    for (const [namespace, docs] of Object.entries(grouped)) {
      const vectors = await Promise.all(
        docs.map(async (doc) => {
          const textToEmbed = `${doc.content.title} ${doc.content.description} ${doc.content.fullText}`;
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
      
      // Upsert in batches of 100
      const batchSize = 100;
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        await this.index.namespace(namespace).upsert(batch);
      }
    }
  }

  private getNamespace(type: PineconeDocType): string {
    const namespaceMap: Record<PineconeDocType, string> = {
      TICKET: 'tickets',
      COMMENT: 'comments',
      TEMPLATE: 'templates',
      VOICE_COMMAND: 'commands',
      DOCUMENTATION: 'docs'
    };
    return namespaceMap[type] || 'default';
  }

  private generateHighlights(query: string, metadata: any): string[] {
    // Simple highlight generation - in production use more sophisticated approach
    const highlights: string[] = [];
    const queryWords = query.toLowerCase().split(' ');
    
    if (metadata.title) {
      const titleLower = metadata.title.toLowerCase();
      if (queryWords.some(word => titleLower.includes(word))) {
        highlights.push(metadata.title);
      }
    }
    
    if (metadata.description) {
      const descLower = metadata.description.toLowerCase();
      if (queryWords.some(word => descLower.includes(word))) {
        highlights.push(metadata.description.substring(0, 150) + '...');
      }
    }
    
    return highlights;
  }
}
```

### Integration with Ticket Creation
```typescript
// src/lib/tickets/ticketService.ts
import { PineconeService } from '../pinecone/pineconeService';

export class TicketService {
  private pinecone: PineconeService;

  constructor() {
    this.pinecone = new PineconeService();
  }

  async createTicket(ticketData: CreateTicketInput): Promise<Ticket> {
    // Create ticket in database
    const ticket = await this.db.ticket.create({
      data: ticketData
    });

    // Index in Pinecone
    await this.indexTicket(ticket);

    return ticket;
  }

  async indexTicket(ticket: Ticket): Promise<void> {
    const pineconeDoc: PineconeDocument = {
      id: ticket.id,
      type: PineconeDocType.TICKET,
      embedding: [], // Will be generated by service
      metadata: {
        type: 'TICKET',
        teamId: ticket.teamId,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt.getTime(),
        assigneeId: ticket.assigneeId,
        ticketType: ticket.type
      },
      content: {
        title: ticket.title,
        description: ticket.description,
        fullText: this.buildFullText(ticket)
      }
    };

    await this.pinecone.upsertDocument(pineconeDoc);
  }

  async searchSimilarTickets(
    query: string, 
    teamId: string, 
    limit: number = 5
  ): Promise<SearchResult[]> {
    return this.pinecone.search({
      query,
      type: [PineconeDocType.TICKET],
      filters: { teamId },
      limit
    });
  }

  private buildFullText(ticket: Ticket): string {
    const sections = ticket.sections
      .map(s => `${s.name}: ${s.content}`)
      .join('\n');
    
    return `${ticket.title}\n${ticket.description}\n${sections}`;
  }
}
```

### Voice Command Integration
```typescript
// src/lib/voice/voiceCommandHandler.ts
export class VoiceCommandHandler {
  private pinecone: PineconeService;
  private ticketService: TicketService;

  async handleCommand(command: VoiceCommand): Promise<void> {
    // Store command for future reference
    await this.indexVoiceCommand(command);

    // Handle based on intent
    switch (command.intent) {
      case CommandIntent.SEARCH_TICKETS:
        await this.handleSearch(command);
        break;
      case CommandIntent.CREATE_TICKET:
        await this.handleCreate(command);
        break;
      // ... other intents
    }
  }

  private async handleSearch(command: VoiceCommand): Promise<void> {
    const { transcript, entities } = command;
    
    // Search for similar tickets
    const results = await this.ticketService.searchSimilarTickets(
      transcript,
      entities.teamId,
      5
    );

    // Also search comments for context
    const commentResults = await this.pinecone.search({
      query: transcript,
      type: [PineconeDocType.COMMENT],
      filters: { teamId: entities.teamId },
      limit: 3
    });

    // Present results to user
    await this.presentSearchResults(results, commentResults);
  }

  private async indexVoiceCommand(command: VoiceCommand): Promise<void> {
    const doc: PineconeDocument = {
      id: command.id,
      type: PineconeDocType.VOICE_COMMAND,
      embedding: [],
      metadata: {
        type: 'VOICE_COMMAND',
        userId: command.sessionId, // From session
        intent: command.intent,
        timestamp: command.timestamp.getTime()
      },
      content: {
        title: command.transcript,
        description: `Intent: ${command.intent}`,
        fullText: command.transcript
      }
    };

    await this.pinecone.upsertDocument(doc);
  }
}
```

### Comment Sync from Jira
```typescript
// src/lib/integrations/jiraCommentSync.ts
export class JiraCommentSync {
  private pinecone: PineconeService;

  async syncComments(projectKey: string, sprintId: string): Promise<void> {
    // Fetch comments from Jira
    const comments = await this.fetchJiraComments(projectKey, sprintId);

    // Prepare documents for Pinecone
    const documents: PineconeDocument[] = comments.map(comment => ({
      id: comment.id,
      type: PineconeDocType.COMMENT,
      embedding: [],
      metadata: {
        type: 'COMMENT',
        ticketId: comment.ticketId,
        authorId: comment.authorId,
        teamId: this.getTeamIdFromProject(projectKey),
        createdAt: new Date(comment.created).getTime(),
        hasMe
ntion: comment.mentions.length > 0
      },
      content: {
        title: `Comment on ${comment.ticketKey}`,
        description: comment.body.substring(0, 200),
        fullText: comment.body
      }
    }));

    // Batch upsert to Pinecone
    await this.pinecone.upsertBatch(documents);
  }
}
```

## Query Examples

### 1. Find Similar Tickets
```typescript
// "Find tickets about payment processing errors"
const results = await pineconeService.search({
  query: "payment processing errors",
  type: [PineconeDocType.TICKET],
  filters: {
    teamId: currentUser.teamId,
    status: ['OPEN', 'IN_PROGRESS']
  },
  limit: 10
});
```

### 2. Search Mentions in Comments
```typescript
// "Show me comments where I'm mentioned about API changes"
const results = await pineconeService.search({
  query: "API changes",
  type: [PineconeDocType.COMMENT],
  filters: {
    teamId: currentUser.teamId,
    userId: currentUser.id // In mention metadata
  },
  limit: 20
});
```

### 3. Find Templates
```typescript
// "Show me bug report templates"
const results = await pineconeService.search({
  query: "bug report template",
  type: [PineconeDocType.TEMPLATE],
  filters: {
    teamId: currentUser.teamId
  },
  limit: 5
});
```

### 4. Voice Command History
```typescript
// Find similar past commands
const results = await pineconeService.search({
  query: currentTranscript,
  type: [PineconeDocType.VOICE_COMMAND],
  filters: {
    userId: currentUser.id
  },
  limit: 3
});
```

## Performance Optimization

### 1. Embedding Cache
```typescript
// Cache frequently used embeddings
const embeddingCache = new Map<string, number[]>();

async function getCachedEmbedding(text: string): Promise<number[]> {
  const cacheKey = createHash('md5').update(text).digest('hex');
  
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }
  
  const embedding = await generateEmbedding(text);
  embeddingCache.set(cacheKey, embedding);
  
  // LRU eviction after 1000 entries
  if (embeddingCache.size > 1000) {
    const firstKey = embeddingCache.keys().next().value;
    embeddingCache.delete(firstKey);
  }
  
  return embedding;
}
```

### 2. Batch Processing
```typescript
// Process webhooks in batches
const commentQueue: Comment[] = [];

setInterval(async () => {
  if (commentQueue.length > 0) {
    const batch = commentQueue.splice(0, 100);
    await processBatch(batch);
  }
}, 30000); // Every 30 seconds
```

### 3. Hybrid Search
```typescript
// Combine vector search with keyword filters
async function hybridSearch(query: string, teamId: string) {
  // Vector search
  const vectorResults = await pineconeService.search({
    query,
    type: [PineconeDocType.TICKET],
    filters: { teamId },
    limit: 20
  });
  
  // Keyword search in database
  const keywordResults = await db.ticket.findMany({
    where: {
      teamId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 20
  });
  
  // Merge and deduplicate
  return mergeResults(vectorResults, keywordResults);
}
```

## Monitoring & Maintenance

### Health Check
```typescript
async function checkPineconeHealth(): Promise<HealthStatus> {
  try {
    // Check index stats
    const stats = await pinecone.describeIndexStats();
    
    // Test query
    const testResults = await pineconeService.search({
      query: "test",
      limit: 1
    });
    
    return {
      healthy: true,
      vectorCount: stats.totalVectorCount,
      indexFullness: stats.indexFullness,
      namespaces: stats.namespaces
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}
```

### Reindexing Strategy
```typescript
// Reindex all tickets
async function reindexAllTickets(teamId: string) {
  const tickets = await db.ticket.findMany({
    where: { teamId },
    include: { sections: true }
  });
  
  const documents = tickets.map(ticket => 
    convertTicketToPineconeDoc(ticket)
  );
  
  // Delete existing
  await pinecone.index('squiddles-prod')
    .namespace('tickets')
    .deleteMany({ teamId });
  
  // Reindex in batches
  await pineconeService.upsertBatch(documents);
}
```

## Security Considerations

1. **API Key Management**: Store keys in environment variables
2. **Data Isolation**: Use teamId filters for multi-tenant isolation
3. **PII Handling**: Don't include sensitive data in embeddings
4. **Access Control**: Validate user permissions before search
5. **Rate Limiting**: Implement rate limits for API calls

## Cost Optimization

1. **Namespace Strategy**: Separate namespaces for different data types
2. **Metadata Filtering**: Use metadata filters before vector search
3. **Embedding Cache**: Cache frequently used embeddings
4. **Batch Operations**: Group operations to reduce API calls
5. **TTL Policies**: Remove old voice commands after 90 days

## Next Steps

1. Set up Pinecone account and create index
2. Implement PineconeService class
3. Add indexing to ticket creation flow
4. Implement search endpoints
5. Add comment sync from Jira
6. Create reindexing scripts
7. Set up monitoring and alerts