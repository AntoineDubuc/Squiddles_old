# Pinecone API Endpoints

This directory contains REST API endpoints for interacting with the Pinecone vector database.

## Endpoints

### 1. Health Check
```bash
GET /api/pinecone/health
```

Check if the Pinecone service is operational.

**Response:**
```json
{
  "status": "healthy",
  "message": "Pinecone service is operational",
  "details": {
    "indexName": "jira",
    "totalVectors": 0,
    "indexFullness": 0,
    "namespaces": {}
  }
}
```

### 2. Index Statistics
```bash
GET /api/pinecone/stats
```

Get detailed statistics about the Pinecone index.

**Response:**
```json
{
  "success": true,
  "health": true,
  "stats": {
    "indexName": "jira",
    "totalVectors": 0,
    "dimension": 1536,
    "indexFullness": "0.00%",
    "namespaces": {
      "tickets": { "recordCount": 10 },
      "comments": { "recordCount": 25 }
    }
  }
}
```

### 3. Upsert Documents
```bash
POST /api/pinecone/documents
```

Insert or update documents in Pinecone.

**Single Document:**
```json
{
  "id": "PROD-123",
  "type": "TICKET",
  "metadata": {
    "teamId": "team-123",
    "userId": "user-456",
    "status": "OPEN",
    "priority": "HIGH"
  },
  "content": {
    "title": "Fix payment processing error",
    "description": "Users experiencing 500 errors during checkout",
    "fullText": "Detailed description..."
  }
}
```

**Batch Upsert:**
```json
{
  "documents": [
    {
      "id": "PROD-123",
      "type": "TICKET",
      "metadata": {...},
      "content": {...}
    },
    {
      "id": "comment-456",
      "type": "COMMENT",
      "metadata": {...},
      "content": {...}
    }
  ]
}
```

### 4. Search Documents
```bash
GET /api/pinecone/documents?query=payment+error&type=TICKET,COMMENT&teamId=team-123&limit=10
```

Search for similar documents using semantic search.

**Query Parameters:**
- `query` (required): Search text
- `type`: Comma-separated document types (TICKET, COMMENT, TEMPLATE, etc.)
- `teamId`: Filter by team
- `userId`: Filter by user
- `status`: Comma-separated statuses
- `startDate`: ISO date string for date range start
- `endDate`: ISO date string for date range end
- `limit`: Number of results (1-100, default: 10)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "PROD-123",
      "score": 0.95,
      "document": {
        "id": "PROD-123",
        "type": "TICKET",
        "metadata": {
          "title": "Fix payment processing error",
          "teamId": "team-123",
          "status": "OPEN"
        },
        "content": {
          "title": "Fix payment processing error",
          "description": "Users experiencing 500 errors"
        }
      },
      "highlights": [
        "Fix payment processing error",
        "Users experiencing 500 errors during checkout"
      ]
    }
  ],
  "count": 1,
  "query": "payment error"
}
```

### 5. Delete Document
```bash
DELETE /api/pinecone/documents/{id}?type=TICKET
```

Delete a specific document from Pinecone.

**Parameters:**
- `id`: Document ID (in URL path)
- `type`: Document type (required query parameter)

**Response:**
```json
{
  "success": true,
  "message": "Document PROD-123 deleted successfully",
  "id": "PROD-123",
  "type": "TICKET"
}
```

## Document Types

- `TICKET`: Jira tickets (stories, tasks, bugs, etc.)
- `COMMENT`: Comments on tickets
- `TEMPLATE`: Reusable ticket templates
- `VOICE_COMMAND`: Historical voice commands
- `DOCUMENTATION`: Knowledge base articles

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "details": [...] // For validation errors
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request (validation error)
- `500`: Internal Server Error
- `503`: Service Unavailable (Pinecone connection issue)

## Testing

Run the endpoint tests:
```bash
# Start the Next.js server first
npm run dev

# In another terminal
npx tsx src/lib/pinecone/testEndpoints.ts
```

## Usage Examples

### Create a Ticket
```javascript
const response = await fetch('/api/pinecone/documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'PROD-234',
    type: 'TICKET',
    metadata: {
      teamId: 'engineering',
      status: 'TODO',
      priority: 'MEDIUM'
    },
    content: {
      title: 'Add user authentication',
      description: 'Implement OAuth2 login flow',
      fullText: 'As a user, I want to log in using OAuth2...'
    }
  })
});
```

### Search for Similar Tickets
```javascript
const params = new URLSearchParams({
  query: 'authentication OAuth',
  type: 'TICKET',
  teamId: 'engineering',
  limit: '5'
});

const response = await fetch(`/api/pinecone/documents?${params}`);
const { results } = await response.json();
```

### Delete a Document
```javascript
const response = await fetch('/api/pinecone/documents/PROD-234?type=TICKET', {
  method: 'DELETE'
});
```