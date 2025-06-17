# Pinecone Integration Module

This module handles vector database operations for Squiddles' semantic search capabilities.

## Setup

1. **Get Pinecone Credentials**
   - Sign up at [pinecone.io](https://www.pinecone.io)
   - Create a new project
   - Get your API key and environment from the dashboard

2. **Configure Environment Variables**
   ```bash
   # In .env.local
   PINECONE_API_KEY=your-api-key
   PINECONE_ENVIRONMENT=your-environment  # e.g., "us-east-1"
   PINECONE_INDEX_NAME=squiddles-prod
   ```

3. **Test Connection**
   ```bash
   npm run test:pinecone
   ```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   User Voice    │────▶│  OpenAI API      │────▶│   Pinecone      │
│   Command       │     │  Embeddings      │     │   Vector DB     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Components

### testConnection.ts
- Verifies Pinecone setup and connectivity
- Tests basic operations (upsert, query, delete)
- Validates OpenAI embedding generation

### PineconeService (Coming Soon)
- Main service class for vector operations
- Handles document indexing and search
- Manages namespaces for different data types

## Data Types Stored

1. **Tickets** - User stories, tasks, bugs, spikes
2. **Comments** - Jira comments with mentions
3. **Templates** - Reusable ticket templates
4. **Voice Commands** - Historical commands for context
5. **Documentation** - Knowledge base articles

## Namespaces

- `tickets` - All ticket embeddings
- `comments` - Comment embeddings
- `templates` - Template embeddings
- `commands` - Voice command history
- `docs` - Documentation embeddings
- `test` - Test vectors (cleaned up automatically)

## Usage Examples

### Test Connection
```bash
npm run test:pinecone
```

### Expected Output
```
🦑 Squiddles Pinecone Connection Test

1. Checking environment variables...
✓ Found: PINECONE_API_KEY (pc-12345...)
✓ Found: PINECONE_ENVIRONMENT (us-east-1...)
✓ Found: OPENAI_API_KEY (sk-proj-...)

2. Initializing Pinecone client...
✓ Pinecone client initialized

3. Listing available indexes...
✓ Found 1 indexes:
  - squiddles-prod (target)

... (additional test steps)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All tests passed! Pinecone is ready for use.
```

## Troubleshooting

### Missing Environment Variables
- Ensure all required variables are in `.env.local`
- No quotes needed around values
- Check for typos in variable names

### Index Not Found
- The test script will create the index if it doesn't exist
- Default: 1536 dimensions (OpenAI embeddings)
- Cosine similarity metric

### API Key Issues
- Verify key is active in Pinecone dashboard
- Check you're using the correct environment
- Free tier allows 1 index with 100K vectors

## Next Steps

1. Implement PineconeService class
2. Add indexing to ticket creation flow
3. Create search endpoints
4. Set up Jira comment sync
5. Add reindexing utilities