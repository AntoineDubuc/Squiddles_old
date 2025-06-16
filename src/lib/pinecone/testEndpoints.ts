/**
 * Test script for Pinecone API endpoints
 * Run with: npx tsx src/lib/pinecone/testEndpoints.ts
 */

const BASE_URL = 'http://localhost:8888/api/pinecone';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function testEndpoints() {
  console.log(`${colors.blue}🦑 Testing Pinecone API Endpoints${colors.reset}\n`);

  // Test 1: Health Check
  console.log(`${colors.yellow}1. Testing health check...${colors.reset}`);
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.status === 'healthy') {
      console.log(`${colors.green}✓ Health check passed${colors.reset}`);
      console.log(`  Status: ${data.status}`);
      console.log(`  Index: ${data.details?.indexName}`);
    } else {
      console.log(`${colors.red}✗ Health check failed${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Health check error: ${error}${colors.reset}`);
  }

  // Test 2: Get Stats
  console.log(`\n${colors.yellow}2. Testing stats endpoint...${colors.reset}`);
  try {
    const response = await fetch(`${BASE_URL}/stats`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✓ Stats retrieved${colors.reset}`);
      console.log(`  Total vectors: ${data.stats.totalVectors}`);
      console.log(`  Index fullness: ${data.stats.indexFullness}`);
    } else {
      console.log(`${colors.red}✗ Stats failed: ${data.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Stats error: ${error}${colors.reset}`);
  }

  // Test 3: Upsert Single Document
  console.log(`\n${colors.yellow}3. Testing single document upsert...${colors.reset}`);
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
    const response = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDoc),
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✓ Document upserted${colors.reset}`);
      console.log(`  ID: ${data.id}`);
    } else {
      console.log(`${colors.red}✗ Upsert failed: ${data.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Upsert error: ${error}${colors.reset}`);
  }

  // Test 4: Batch Upsert
  console.log(`\n${colors.yellow}4. Testing batch upsert...${colors.reset}`);
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
    const response = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchDocs),
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✓ Batch upserted${colors.reset}`);
      console.log(`  Count: ${data.count} documents`);
    } else {
      console.log(`${colors.red}✗ Batch upsert failed: ${data.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Batch upsert error: ${error}${colors.reset}`);
  }

  // Wait for indexing
  console.log(`\n${colors.blue}Waiting for indexing...${colors.reset}`);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 5: Search
  console.log(`\n${colors.yellow}5. Testing search...${colors.reset}`);
  try {
    const params = new URLSearchParams({
      query: 'API test',
      type: 'TICKET,COMMENT',
      teamId: 'team-api-test',
      limit: '5',
    });
    
    const response = await fetch(`${BASE_URL}/documents?${params}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✓ Search completed${colors.reset}`);
      console.log(`  Results: ${data.count}`);
      data.results.forEach((result: any, i: number) => {
        console.log(`  ${i + 1}. ${result.document.metadata.title} (${result.score.toFixed(4)})`);
      });
    } else {
      console.log(`${colors.red}✗ Search failed: ${data.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Search error: ${error}${colors.reset}`);
  }

  // Test 6: Delete Documents
  console.log(`\n${colors.yellow}6. Testing delete...${colors.reset}`);
  const deleteIds = [
    { id: 'api-test-001', type: 'TICKET' },
    { id: 'api-test-002', type: 'COMMENT' },
    { id: 'api-test-003', type: 'TEMPLATE' },
  ];

  for (const { id, type } of deleteIds) {
    try {
      const response = await fetch(`${BASE_URL}/documents/${id}?type=${type}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log(`${colors.green}✓ Deleted ${id}${colors.reset}`);
      } else {
        console.log(`${colors.red}✗ Delete failed for ${id}: ${data.error}${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}✗ Delete error for ${id}: ${error}${colors.reset}`);
    }
  }

  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}✅ API endpoint tests completed!${colors.reset}`);
}

// Note: This requires the Next.js server to be running
console.log(`${colors.yellow}Note: Make sure the Next.js server is running (npm run dev)${colors.reset}\n`);

testEndpoints().catch(error => {
  console.error(`${colors.red}Test error: ${error}${colors.reset}`);
});