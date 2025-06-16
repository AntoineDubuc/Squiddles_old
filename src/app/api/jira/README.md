# Jira API Endpoints

This directory contains REST API endpoints for interacting with Jira to fetch tickets, comments, and sync data to Pinecone.

## Prerequisites

Set up your Jira credentials in `.env.local`:
```bash
# Standard naming convention
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token

# Alternative naming convention (also supported)
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-jira-api-token
```

To get a Jira API token:
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a label and copy the token

## Endpoints

### 1. Get User Info
```bash
GET /api/jira/user
```

Get current user information and their projects.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "123456789",
    "name": "John Doe",
    "email": "john@company.com"
  },
  "projects": [
    {
      "key": "PROJ",
      "name": "Project Name"
    }
  ]
}
```

### 2. Get Tickets
```bash
GET /api/jira/tickets?projectKey=PROJ&sprintId=123
```

Fetch tickets from Jira. By default, gets tickets from active sprints across all user's projects.

**Query Parameters:**
- `projectKey` (optional): Filter by specific project
- `sprintId` (optional): Filter by specific sprint ID
- `jql` (optional): Custom JQL query

**Response:**
```json
{
  "success": true,
  "tickets": [
    {
      "id": "10001",
      "key": "PROJ-123",
      "title": "Implement user authentication",
      "description": "Add OAuth2 login...",
      "type": "Story",
      "status": "In Progress",
      "priority": "High",
      "assignee": {
        "id": "123456",
        "name": "Jane Smith"
      },
      "reporter": {
        "id": "789012",
        "name": "John Doe"
      },
      "project": {
        "key": "PROJ",
        "name": "Project Name"
      },
      "created": "2024-01-15T10:00:00.000Z",
      "updated": "2024-01-16T14:30:00.000Z"
    }
  ],
  "count": 15
}
```

### 3. Get Comments
```bash
GET /api/jira/comments?ticketKey=PROJ-123&withMentions=true
```

Fetch comments from Jira tickets. Can filter to show only comments with mentions.

**Query Parameters:**
- `ticketKey` (optional): Get comments for specific ticket
- `projectKey` (optional): Filter by project
- `sprintId` (optional): Filter by sprint
- `withMentions` (optional): If true, only return comments mentioning current user

**Response:**
```json
{
  "success": true,
  "comments": [
    {
      "id": "10005",
      "ticketKey": "PROJ-123",
      "ticketTitle": "Implement user authentication",
      "author": {
        "id": "123456",
        "name": "Jane Smith",
        "avatar": "https://..."
      },
      "body": "[~accountid:789012] Can you review this implementation?",
      "created": "2024-01-16T09:00:00.000Z",
      "updated": "2024-01-16T09:00:00.000Z",
      "mentions": ["789012"],
      "isDirectMention": true
    }
  ],
  "count": 5,
  "currentUser": {
    "id": "789012",
    "name": "John Doe"
  }
}
```

### 4. Sync to Pinecone
```bash
POST /api/jira/sync
```

Sync Jira tickets and comments to Pinecone for semantic search.

**Request Body:**
```json
{
  "projectKey": "PROJ",     // Optional: specific project
  "sprintId": 123,          // Optional: specific sprint
  "syncComments": true      // Optional: whether to sync comments (default: true)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Jira data synced to Pinecone",
  "stats": {
    "ticketsSynced": 25,
    "commentsSynced": 150,
    "projects": ["PROJ", "TEAM"]
  }
}
```

## Usage Examples

### Get All Active Sprint Tickets
```javascript
const response = await fetch('/api/jira/tickets');
const { tickets } = await response.json();
```

### Get Comments with Mentions
```javascript
const response = await fetch('/api/jira/comments?withMentions=true');
const { comments } = await response.json();

// Filter to high-priority tickets
const urgentMentions = comments.filter(c => 
  c.isDirectMention && c.priority === 'High'
);
```

### Sync Project to Pinecone
```javascript
const response = await fetch('/api/jira/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectKey: 'PROJ',
    syncComments: true
  })
});
```

### Search Synced Data
After syncing to Pinecone, you can search using the Pinecone API:

```javascript
// Search for tickets about authentication
const response = await fetch('/api/pinecone/documents?query=OAuth+authentication&type=TICKET');
const { results } = await response.json();

// Search for comments mentioning bugs
const response = await fetch('/api/pinecone/documents?query=bug+issue+error&type=COMMENT');
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Failed to fetch Jira tickets",
  "message": "Detailed error message"
}
```

**Common Errors:**
- `401 Unauthorized`: Invalid Jira credentials
- `404 Not Found`: Project or ticket not found
- `403 Forbidden`: No permission to access resource
- `429 Too Many Requests`: Rate limit exceeded

## Rate Limiting

Jira has rate limits. The endpoints implement:
- Batch processing with delays
- Maximum 10 concurrent requests
- 100ms delay between batches

## Testing

Run the endpoint tests:
```bash
# Start the Next.js server first
npm run dev

# In another terminal
npx tsx src/lib/jira/testEndpoints.ts
```

## Integration with Voice Commands

These endpoints support the voice interface for queries like:
- "Show me my mentions in the current sprint"
- "Find all high-priority bugs assigned to me"
- "Search for tickets about payment processing"

The synced data in Pinecone enables semantic search across all Jira content.