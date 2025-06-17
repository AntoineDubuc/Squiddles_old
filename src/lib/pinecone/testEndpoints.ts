/**
 * Test script for Pinecone API endpoints
 * Run with: npx tsx src/lib/pinecone/testEndpoints.ts
 */

const PINECONE_BASE_URL = 'http://localhost:8888/api/pinecone';

// ANSI color codes
const pineconeColors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function testEndpoints() {
  console.log(`${pineconeColors.blue}🦑 Testing Pinecone API Endpoints${pineconeColors.reset}\n`);

  // Test 1: Health Check
  console.log(`${pineconeColors.yellow}1. Testing health check...${pineconeColors.reset}`);
  try {
    const response = await fetch(`${PINECONE_BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.status === 'healthy') {
      console.log(`${pineconeColors.green}✓ Health check passed${pineconeColors.reset}`);
      console.log(`  Status: ${data.status}`);
      console.log(`  Index: ${data.details?.indexName}`);
    } else {
      console.log(`${pineconeColors.red}✗ Health check failed${pineconeColors.reset}`);
    }
  } catch (error) {
    console.log(`${pineconeColors.red}✗ Health check error: ${error}${pineconeColors.reset}`);
  }

  // Test 2: Get Stats
  console.log(`\n${pineconeColors.yellow}2. Testing stats endpoint...${pineconeColors.reset}`);
  try {
    const response = await fetch(`${PINECONE_BASE_URL}/stats`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${pineconeColors.green}✓ Stats retrieved${pineconeColors.reset}`);
      console.log(`  Total vectors: ${data.stats.totalVectors}`);
      console.log(`  Index fullness: ${data.stats.indexFullness}`);
    } else {
      console.log(`${pineconeColors.red}✗ Stats failed: ${data.error}${pineconeColors.reset}`);
    }
  } catch (error) {
    console.log(`${pineconeColors.red}✗ Stats error: ${error}${pineconeColors.reset}`);
  }

  // Test 3: Upsert Single Document
  console.log(`\n${pineconeColors.yellow}3. Testing single document upsert...${pineconeColors.reset}`);
  const testDoc = {
    id: 'api-test-001',
    type: 'TICKET',
    metadata: {
      teamId: 'team-api-test',
      userId: 'user-api-test',
      status: 'OPEN',
      priority: 'HIGH',
    },
    content: {
      title: 'API Test Ticket',
      description: 'Testing Pinecone API endpoints',
      fullText: 'This is a test ticket created via the API endpoint to verify upsert functionality.',
    },
  };

  try {
    const response = await fetch(`${PINECONE_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDoc),
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${pineconeColors.green}✓ Document upserted${pineconeColors.reset}`);
      console.log(`  ID: ${data.id}`);
    } else {
      console.log(`${pineconeColors.red}✗ Upsert failed: ${data.error}${pineconeColors.reset}`);
    }
  } catch (error) {
    console.log(`${pineconeColors.red}✗ Upsert error: ${error}${pineconeColors.reset}`);
  }

  // Test 4: Batch Upsert
  console.log(`\n${pineconeColors.yellow}4. Testing batch upsert...${pineconeColors.reset}`);
  const batchDocs = {
    documents: [
      {
        id: 'api-test-002',
        type: 'COMMENT',
        metadata: {
          teamId: 'team-api-test',
          ticketId: 'api-test-001',
        },
        content: {
          title: 'Comment on API Test',
          description: 'This is a test comment',
          fullText: 'Testing batch upsert functionality',
        },
      },
      {
        id: 'api-test-003',
        type: 'TEMPLATE',
        metadata: {
          teamId: 'team-api-test',
        },
        content: {
          title: 'API Test Template',
          description: 'Template for API testing',
          fullText: 'Template content for testing',
        },
      },
    ],
  };

  try {
    const response = await fetch(`${PINECONE_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchDocs),
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${pineconeColors.green}✓ Batch upserted${pineconeColors.reset}`);
      console.log(`  Count: ${data.count} documents`);
    } else {
      console.log(`${pineconeColors.red}✗ Batch upsert failed: ${data.error}${pineconeColors.reset}`);
    }
  } catch (error) {
    console.log(`${pineconeColors.red}✗ Batch upsert error: ${error}${pineconeColors.reset}`);
  }

  // Wait for indexing
  console.log(`\n${pineconeColors.blue}Waiting for indexing...${pineconeColors.reset}`);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 5: Search
  console.log(`\n${pineconeColors.yellow}5. Testing search...${pineconeColors.reset}`);
  try {
    const params = new URLSearchParams({
      query: 'API test',
      type: 'TICKET,COMMENT',
      teamId: 'team-api-test',
      limit: '5',
    });
    
    const response = await fetch(`${PINECONE_BASE_URL}/documents?${params}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${pineconeColors.green}✓ Search completed${pineconeColors.reset}`);
      console.log(`  Results: ${data.count}`);
      data.results.forEach((result: any, i: number) => {
        console.log(`  ${i + 1}. ${result.document.metadata.title} (${result.score.toFixed(4)})`);
      });
    } else {
      console.log(`${pineconeColors.red}✗ Search failed: ${data.error}${pineconeColors.reset}`);
    }
  } catch (error) {
    console.log(`${pineconeColors.red}✗ Search error: ${error}${pineconeColors.reset}`);
  }

  // Test 6: Delete Documents
  console.log(`\n${pineconeColors.yellow}6. Testing delete...${pineconeColors.reset}`);
  const deleteIds = [
    { id: 'api-test-001', type: 'TICKET' },
    { id: 'api-test-002', type: 'COMMENT' },
    { id: 'api-test-003', type: 'TEMPLATE' },
  ];

  for (const { id, type } of deleteIds) {
    try {
      const response = await fetch(`${PINECONE_BASE_URL}/documents/${id}?type=${type}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log(`${pineconeColors.green}✓ Deleted ${id}${pineconeColors.reset}`);
      } else {
        console.log(`${pineconeColors.red}✗ Delete failed for ${id}: ${data.error}${pineconeColors.reset}`);
      }
    } catch (error) {
      console.log(`${pineconeColors.red}✗ Delete error for ${id}: ${error}${pineconeColors.reset}`);
    }
  }

  console.log(`\n${pineconeColors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${pineconeColors.reset}`);
  console.log(`${pineconeColors.green}✅ API endpoint tests completed!${pineconeColors.reset}`);
}

// Note: This requires the Next.js server to be running
console.log(`${pineconeColors.yellow}Note: Make sure the Next.js server is running (npm run dev)${pineconeColors.reset}\n`);

testEndpoints().catch(error => {
  console.error(`${pineconeColors.red}Test error: ${error}${pineconeColors.reset}`);
});