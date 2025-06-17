# API Testing Instructions

## Quick Test

**Terminal 1 - Start Server:**
```bash
npm run dev
```
Wait for "✓ Ready" message.

**Terminal 2 - Run Tests:**
```bash
node test-all-endpoints.js
```

## What the Tests Check

### Pinecone Endpoints ✅
1. **Health Check** - Verifies Pinecone connection
2. **Statistics** - Shows index status and vector count
3. **Document Upsert** - Tests adding documents
4. **Search** - Tests semantic search functionality
5. **Document Delete** - Tests removing documents

### Jira Endpoints 🔧
6. **User Info** - Gets current user and projects
7. **Tickets** - Fetches active sprint tickets
8. **Comments** - Gets comments with mention detection

## Expected Output

```
🦑 Squiddles API Endpoint Tests

Testing: Pinecone Health Check
✓ Pinecone Health Check - Status: 200
  Success: true
  Message: Pinecone service is operational

Testing: Pinecone Statistics  
✓ Pinecone Statistics - Status: 200
  Success: true
  Total vectors: 0

Testing: Jira User Info
✓ Jira User Info - Status: 200
  User: Your Name (account-id)
  Projects: 3

... (more tests)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All 8 tests passed!

API endpoints are ready for integration!
```

## Troubleshooting

**If tests fail:**

1. **Server not running:** Make sure `npm run dev` is running on port 8888
2. **Pinecone errors:** Check your PINECONE_API_KEY in .env.local
3. **Jira errors:** Verify JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN in .env.local

## Alternative Testing

**Individual endpoint tests:**
```bash
# Pinecone only
npm run test:pinecone-api

# Jira only  
npm run test:jira-api
```

**Manual curl tests:**
```bash
curl http://localhost:8888/api/pinecone/health | jq
curl http://localhost:8888/api/jira/user | jq
```