# Minimal Metadata Filtering Guide

Quick reference for querying the multi-source Pinecone index with our minimal metadata schema.

## Metadata Fields

```typescript
interface MinimalMetadata {
  id: string;                    // Unique ID
  source: 'gmail' | 'jira' | 'confluence' | 'github' | 'slack';
  type: string;                  // email, ticket, pr, message, page, comment, etc.
  createdAt: number;             // Unix timestamp
  title: string;                 // Subject/title/summary
  author: string;                // Name or email
  projectKey?: string;           // PROJ, repo name, or space
  ticketKeys: string[];          // [PROJ-123, PROJ-456]
  status?: string;               // open, closed, done, merged
  priority?: string;             // high, medium, low
  mentions: string[];            // [@user, @channel, PROJ-123]
}
```

## Common Queries

### 1. Find by Source
```typescript
// All Jira tickets
const filter = { source: { $eq: 'jira' } };

// Emails and Slack messages
const filter = { source: { $in: ['gmail', 'slack'] } };
```

### 2. Find by Project
```typescript
// All content for project "WEBAPP"
const filter = { projectKey: { $eq: 'WEBAPP' } };

// Multiple projects
const filter = { projectKey: { $in: ['WEBAPP', 'MOBILE'] } };
```

### 3. Find Recent Items
```typescript
// Last 24 hours
const filter = { 
  createdAt: { $gte: Date.now() - 24 * 60 * 60 * 1000 } 
};

// Last week of Jira tickets
const filter = {
  source: { $eq: 'jira' },
  createdAt: { $gte: Date.now() - 7 * 24 * 60 * 60 * 1000 }
};
```

### 4. Find by Status
```typescript
// Open GitHub PRs
const filter = {
  source: { $eq: 'github' },
  type: { $eq: 'pr' },
  status: { $eq: 'open' }
};

// High priority items
const filter = { priority: { $eq: 'high' } };
```

### 5. Find Cross-References
```typescript
// All content mentioning ticket PROJ-123
const filter = { ticketKeys: { $in: ['PROJ-123'] } };

// Content mentioning multiple tickets
const filter = { 
  ticketKeys: { $in: ['PROJ-123', 'PROJ-456'] } 
};
```

### 6. Find Mentions
```typescript
// Find where user is mentioned
const filter = { mentions: { $in: ['@john.doe'] } };

// Find channel mentions
const filter = { mentions: { $in: ['#general', '#dev-team'] } };
```

### 7. Find by Author
```typescript
// All content from specific author
const filter = { author: { $eq: 'john.doe@company.com' } };

// Content from multiple authors
const filter = { 
  author: { $in: ['john@company.com', 'jane@company.com'] } 
};
```

### 8. Combined Filters
```typescript
// Recent high-priority Jira tickets for project
const filter = {
  source: { $eq: 'jira' },
  projectKey: { $eq: 'WEBAPP' },
  priority: { $eq: 'high' },
  createdAt: { $gte: Date.now() - 7 * 24 * 60 * 60 * 1000 }
};

// Open items mentioning a ticket
const filter = {
  ticketKeys: { $in: ['PROJ-123'] },
  status: { $in: ['open', 'in progress'] }
};
```

## Usage Examples

### Basic Search
```typescript
import { Pinecone } from '@pinecone-database/pinecone';
import { buildPineconeFilter } from './types/unifiedMetadata';

const pc = new Pinecone();
const index = pc.index('squiddles-index');

// Search with filters
const results = await index.query({
  vector: queryEmbedding,
  topK: 20,
  filter: buildPineconeFilter({
    sources: ['jira', 'github'],
    createdAfter: Date.now() - 7 * 24 * 60 * 60 * 1000,
    statuses: ['open']
  }),
  includeMetadata: true
});
```

### Cross-Reference Search
```typescript
// Find all discussions about a Jira ticket
async function findDiscussions(ticketKey: string) {
  const results = await index.query({
    vector: await getEmbedding(`discussions about ${ticketKey}`),
    topK: 50,
    filter: {
      ticketKeys: { $in: [ticketKey] },
      source: { $in: ['slack', 'gmail', 'confluence'] }
    },
    includeMetadata: true
  });
  
  return results.matches;
}
```

### Project Dashboard
```typescript
// Get project overview
async function getProjectOverview(projectKey: string) {
  const baseFilter = {
    projectKey: { $eq: projectKey },
    createdAt: { $gte: Date.now() - 30 * 24 * 60 * 60 * 1000 }
  };
  
  // Parallel queries for different aspects
  const [tickets, prs, discussions] = await Promise.all([
    // Jira tickets
    index.query({
      vector: await getEmbedding(projectKey),
      topK: 20,
      filter: { ...baseFilter, source: { $eq: 'jira' } }
    }),
    
    // GitHub PRs
    index.query({
      vector: await getEmbedding(projectKey),
      topK: 20,
      filter: { ...baseFilter, source: { $eq: 'github' }, type: { $eq: 'pr' } }
    }),
    
    // Slack discussions
    index.query({
      vector: await getEmbedding(projectKey),
      topK: 30,
      filter: { ...baseFilter, source: { $eq: 'slack' } }
    })
  ]);
  
  return { tickets, prs, discussions };
}
```

## Performance Tips

1. **Always filter by source first** when looking for source-specific content
2. **Use time filters** to limit the search space
3. **Combine vector search with metadata filters** for best results
4. **Keep filters simple** - complex OR conditions can be slow

## Type Mappings

Common `type` values by source:
- **Gmail**: `email`, `thread`
- **Jira**: `ticket`, `comment`, `epic`
- **Confluence**: `page`, `blogpost`, `comment`
- **GitHub**: `issue`, `pr`, `commit`, `review`, `comment`
- **Slack**: `message`, `thread`, `file`