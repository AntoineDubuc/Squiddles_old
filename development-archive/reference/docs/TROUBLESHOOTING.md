# Troubleshooting Guide

## Jira Integration Issues

### Problem: Jira endpoints returning 500 errors

**Symptoms:**
- API tests show "Failed to fetch Jira user info"
- Jira tickets/comments endpoints return 500 status

**Root Cause:**
Environment variable naming mismatch between configuration and code expectations.

**Solution:**
The Jira client now supports both naming conventions. Use either:

**Option 1 - Standard Convention:**
```bash
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

**Option 2 - Alternative Convention:**
```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
```

### Problem: Cannot read properties of undefined (reading 'key')

**Symptoms:**
- Jira tickets endpoint fails with property access errors
- Works for some requests but not others

**Root Cause:**
Jira API returns tickets with varying field structures. Some fields may be null or missing.

**Solution:**
Updated ticket transformation to use optional chaining (`?.`) for all field access:

```typescript
// Before (would fail)
reporter: {
  id: ticket.fields.reporter.accountId,
  name: ticket.fields.reporter.displayName,
}

// After (safe)
reporter: ticket.fields?.reporter ? {
  id: ticket.fields.reporter.accountId,
  name: ticket.fields.reporter.displayName,
} : null
```

## Pinecone Integration Issues

### Problem: Search endpoint returns 500 errors

**Symptoms:**
- Document upsert and delete work fine
- Search operations fail consistently

**Root Cause:**
Likely timing issue with vector indexing. Pinecone needs time to index newly upserted documents.

**Current Status:**
- Basic Pinecone operations work (health, stats, upsert, delete)
- Search functionality needs investigation
- Does not block core Jira integration

**Temporary Workaround:**
Use Jira endpoints directly for now. Search will be addressed in next iteration.

## Environment Variable Loading

### Problem: Environment variables not loading

**Symptoms:**
- Direct tests show missing variables
- API endpoints work but tests fail

**Root Cause:**
Different environments load variables differently (Next.js vs Node.js scripts).

**Solution:**
Test scripts now load both `.env.local` and `.env`:

```javascript
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
```

## API Testing

### Problem: Server not accessible during tests

**Symptoms:**
- `fetch failed` errors in test scripts
- Connection refused errors

**Solutions:**

1. **Ensure server is running:**
   ```bash
   npm run dev
   ```
   Wait for "✓ Ready" message before testing.

2. **Check correct port:**
   Server runs on port 8888 (configured to avoid conflicts).
   Verify with: `lsof -i :8888`

3. **Run tests in separate terminal:**
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2
   node test-all-endpoints.js
   ```

## Debugging Commands

### Test Jira Connection Directly
```bash
node test-your-jira.js
```
Shows detailed Jira authentication and project access.

### Test All API Endpoints
```bash
node test-all-endpoints.js
```
Comprehensive test of all Pinecone and Jira endpoints.

### Debug Specific Issues
```bash
node debug-jira.js      # Jira-specific debugging
node debug-search.js    # Pinecone search debugging
```

## Success Metrics

**Current Working State (7/8 tests passing):**
- ✅ Pinecone Health Check
- ✅ Pinecone Statistics  
- ✅ Jira User Info (14 projects)
- ✅ Jira Tickets (50 active tickets)
- ✅ Jira Comments (312 comments)
- ✅ Pinecone Document Upsert
- ✅ Pinecone Document Delete
- ⚠️ Pinecone Search (under investigation)

**Key Achievements:**
- Full access to ExtendTV Jira instance
- 312 comments retrieved with mention detection
- 50 active sprint tickets accessible
- Vector database operations working
- Ready for voice interface integration

## Next Steps

1. **Investigate Pinecone search timing issue**
2. **Implement voice command integration**
3. **Add periodic Jira sync scheduling**
4. **Optimize search performance**

## Contact

For issues not covered here, check the API documentation in:
- `/src/app/api/pinecone/README.md`
- `/src/app/api/jira/README.md`
- `/docs/API_INTEGRATION.md`