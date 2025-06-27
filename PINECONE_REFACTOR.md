# Pinecone Metadata Refactoring Plan

## Current Issues

We're storing too much data in metadata:
```typescript
metadata: {
  content: doc.content.substring(0, 1000),      // ❌ Large text
  searchableText: searchableText.substring(0, 2000), // ❌ Duplicate content
  title: doc.title,                              // ✅ OK for filtering
  type: doc.type,                                // ✅ OK for filtering
  url: doc.url,                                  // ❌ Not used for filtering
  createdAt: doc.createdAt.getTime(),           // ❌ Rarely filtered
  updatedAt: doc.updatedAt.getTime(),           // ❌ Rarely filtered
  authorId: doc.author.id,                       // ✅ OK for filtering
  authorName: doc.author.name,                   // ❌ Not used for filtering
  authorEmail: doc.author.email,                 // ❌ Not used for filtering
  // Plus all custom metadata...
}
```

## Recommended Minimal Metadata Structure

### For Filtering Only:
```typescript
interface MinimalPineconeMetadata {
  // Core filtering fields
  type: string;           // 'jira_ticket' | 'jira_comment' | 'email' | etc.
  source: string;         // 'jira' | 'gmail' | 'confluence' | 'slack'
  
  // Key identifiers for filtering
  ticketKey?: string;     // 'DE-3397'
  projectKey?: string;    // 'DE'
  authorId?: string;      // For "my items" filters
  
  // Status filters
  status?: string;        // 'In Progress', 'Done', etc.
  priority?: string;      // 'P1', 'P2', etc.
  
  // Date filtering (as numbers for range queries)
  createdAt: number;      // Timestamp
  updatedAt: number;      // Timestamp
  
  // Search helpers
  hasAttachments?: boolean;
  urgencyLevel?: string;  // 'critical' | 'high' | 'medium' | 'low'
  
  // User mentions for filtering (just IDs)
  mentionIds?: string[];  // ['712020:...'] not '@antoine'
}
```

## What Should NOT Be in Metadata

1. **Content/Text** - This should only be in the embedding
2. **URLs** - Store in a separate key-value store or database
3. **Names/Emails** - Store user info in a lookup table
4. **Large arrays** - Like `relatedEmails`, `relatedPages`
5. **Display data** - Title, descriptions, etc.

## Proposed Architecture

### 1. Pinecone (Vectors + Minimal Metadata)
```typescript
{
  id: 'jira_ticket_DE-3397',
  values: [...],  // OpenAI embedding of full content
  metadata: {
    type: 'jira_ticket',
    source: 'jira',
    projectKey: 'DE',
    ticketKey: 'DE-3397',
    status: 'In Progress',
    priority: 'P2',
    authorId: '712020:...',
    createdAt: 1749586383352,
    updatedAt: 1750865595143,
    urgencyLevel: 'medium'
  }
}
```

### 2. Document Store (Redis/PostgreSQL)
Store full document data keyed by ID:
```typescript
{
  'jira_ticket_DE-3397': {
    title: 'DE-3397: [IMP] LinkedIn Connector',
    content: 'Full ticket content...',
    url: 'https://extendtv.atlassian.net/browse/DE-3397',
    author: {
      id: '712020:...',
      name: 'Antoine Dubuc',
      email: 'adubuc@cloudgeometry.com'
    },
    assignee: {...},
    labels: [...],
    components: [...],
    attachments: [...],
    // All other display data
  }
}
```

### 3. Search Flow
```typescript
// 1. Search Pinecone with minimal metadata
const results = await pinecone.query({
  vector: embedding,
  filter: {
    projectKey: 'DE',
    status: 'In Progress',
    updatedAt: { $gte: lastWeek }
  },
  topK: 20
});

// 2. Fetch full documents from store
const ids = results.matches.map(m => m.id);
const fullDocuments = await documentStore.mget(ids);

// 3. Return enriched results
return results.matches.map(match => ({
  score: match.score,
  document: fullDocuments[match.id],
  metadata: match.metadata
}));
```

## Benefits

1. **Performance**: Smaller metadata = faster queries
2. **Cost**: Less storage in Pinecone
3. **Scalability**: Can handle more documents
4. **Flexibility**: Easy to update display data without reindexing

## Implementation Steps

1. Create document store (Redis or PostgreSQL)
2. Modify indexing to store minimal metadata
3. Update search service to fetch from document store
4. Migrate existing data

## Pod Index Metadata Config

For pod-based indexes, explicitly index only needed fields:
```typescript
await pc.createIndex({
  name: 'squiddles',
  dimension: 1536,
  spec: {
    pod: {
      metadataConfig: {
        indexed: ['type', 'source', 'projectKey', 'status', 'priority', 'authorId']
      }
    }
  }
});
```

This ensures only filterable fields consume memory.