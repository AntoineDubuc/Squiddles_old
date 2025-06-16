# Squiddles API Integration Guide

This guide explains how the Pinecone and Jira integrations work together to enable semantic search across your project management data.

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Jira     │────▶│  API Routes │────▶│  Pinecone   │
│   (Source)  │     │  (Process)  │     │  (Search)   │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                    │                    │
       │                    ▼                    ▼
       │            ┌─────────────┐     ┌─────────────┐
       └────────────│    Voice    │────▶│   Search    │
                    │  Interface  │     │   Results   │
                    └─────────────┘     └─────────────┘
```

## Quick Start

### 1. Configure Environment

```bash
# In .env.local

# Pinecone
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=jira

# Jira
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token
```

### 2. Test Connections

```bash
# Test Pinecone
npm run test:pinecone
npm run test:pinecone-service

# Test API endpoints (requires npm run dev)
npm run test:pinecone-api
npm run test:jira-api
```

### 3. Sync Jira Data

```bash
# Sync all active sprint data
curl -X POST http://localhost:3000/api/jira/sync

# Sync specific project
curl -X POST http://localhost:3000/api/jira/sync \
  -H "Content-Type: application/json" \
  -d '{"projectKey": "PROJ"}'
```

### 4. Search Synced Data

```bash
# Search tickets
curl "http://localhost:3000/api/pinecone/documents?query=authentication&type=TICKET"

# Search comments with mentions
curl "http://localhost:3000/api/pinecone/documents?query=@mention&type=COMMENT"
```

## API Endpoints Summary

### Pinecone Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/pinecone/health` | GET | Check service health |
| `/api/pinecone/stats` | GET | Get index statistics |
| `/api/pinecone/documents` | POST | Upsert documents |
| `/api/pinecone/documents` | GET | Search documents |
| `/api/pinecone/documents/[id]` | DELETE | Delete document |

### Jira Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jira/user` | GET | Get user info and projects |
| `/api/jira/tickets` | GET | Get Jira tickets |
| `/api/jira/comments` | GET | Get ticket comments |
| `/api/jira/sync` | POST | Sync to Pinecone |

## Data Flow

### 1. Initial Sync
```javascript
// Sync all active sprint data
const response = await fetch('/api/jira/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ syncComments: true })
});
```

### 2. Incremental Updates
```javascript
// Sync specific project
const response = await fetch('/api/jira/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    projectKey: 'PROJ',
    sprintId: 123 
  })
});
```

### 3. Search Synced Data
```javascript
// Semantic search across tickets
const searchResults = await fetch(
  '/api/pinecone/documents?query=payment+processing+error&type=TICKET'
).then(r => r.json());

// Find similar tickets
searchResults.results.forEach(result => {
  console.log(`${result.document.metadata.title} (${result.score})`);
});
```

## Voice Interface Integration

The synced data enables natural language queries:

```javascript
// Voice command: "Show me all comments where I'm mentioned"
const mentions = await fetch('/api/jira/comments?withMentions=true')
  .then(r => r.json());

// Voice command: "Find tickets about authentication"
const tickets = await fetch(
  '/api/pinecone/documents?query=authentication+OAuth+login&type=TICKET'
).then(r => r.json());
```

## Data Stored in Pinecone

### Ticket Documents
```json
{
  "id": "PROJ-123",
  "type": "TICKET",
  "metadata": {
    "teamId": "PROJ",
    "status": "In Progress",
    "priority": "High",
    "ticketType": "Story",
    "assigneeId": "user-123"
  },
  "content": {
    "title": "Implement OAuth authentication",
    "description": "Add OAuth2 login flow...",
    "fullText": "Complete ticket content..."
  }
}
```

### Comment Documents
```json
{
  "id": "PROJ-123-comment-456",
  "type": "COMMENT",
  "metadata": {
    "ticketKey": "PROJ-123",
    "authorId": "user-456",
    "hasMention": true,
    "isDirectMention": true,
    "mentions": ["user-123"]
  },
  "content": {
    "title": "Comment on PROJ-123",
    "description": "First 200 chars...",
    "fullText": "Full comment text..."
  }
}
```

## Namespaces in Pinecone

- `tickets` - All Jira tickets
- `comments` - All ticket comments
- `templates` - Ticket templates (future)
- `commands` - Voice command history (future)
- `docs` - Documentation (future)

## Best Practices

### 1. Regular Syncing
Set up a cron job or scheduled function:
```javascript
// Sync every 15 minutes
setInterval(async () => {
  await fetch('/api/jira/sync', { method: 'POST' });
}, 15 * 60 * 1000);
```

### 2. Filtering by Team
```javascript
// Search only team tickets
const teamTickets = await fetch(
  '/api/pinecone/documents?query=bug&type=TICKET&teamId=PROJ'
).then(r => r.json());
```

### 3. Handling Rate Limits
The Jira client implements:
- Batch processing (10 requests at a time)
- 100ms delay between batches
- Error handling for 429 responses

### 4. Monitoring
```javascript
// Check system health
const health = await fetch('/api/pinecone/health').then(r => r.json());
const stats = await fetch('/api/pinecone/stats').then(r => r.json());

console.log(`Total vectors: ${stats.stats.totalVectors}`);
console.log(`Namespaces:`, stats.stats.namespaces);
```

## Troubleshooting

### Jira Connection Issues
1. Verify API token is valid
2. Check project permissions
3. Ensure user has access to sprints

### Pinecone Search Issues
1. Verify data is synced (`/api/pinecone/stats`)
2. Check query syntax
3. Ensure proper document types are specified

### Performance
1. Use batch operations for large syncs
2. Implement caching for frequently accessed data
3. Monitor Pinecone index usage

## Next Steps

1. **Implement Voice Commands**: Connect search to voice interface
2. **Add Templates**: Store and search ticket templates
3. **Real-time Updates**: Jira webhooks for instant syncing
4. **Analytics**: Track search patterns and usage
5. **Optimization**: Implement caching and query optimization