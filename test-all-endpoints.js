/**
 * Comprehensive API endpoint test
 * Run with: node test-all-endpoints.js
 * (Requires server running on port 8888)
 */

const BASE_URL = 'http://localhost:8888';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`${colors.yellow}Testing: ${name}${colors.reset}`);
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✓ ${name} - Status: ${response.status}${colors.reset}`);
      
      // Show relevant data
      if (data.success !== undefined) {
        console.log(`  Success: ${data.success}`);
      }
      if (data.message) {
        console.log(`  Message: ${data.message}`);
      }
      if (data.count !== undefined) {
        console.log(`  Count: ${data.count}`);
      }
      if (data.stats) {
        console.log(`  Total vectors: ${data.stats.totalVectors}`);
      }
      if (data.user) {
        console.log(`  User: ${data.user.name} (${data.user.id})`);
      }
      if (data.projects) {
        console.log(`  Projects: ${data.projects.length}`);
      }
      return { success: true, data };
    } else {
      console.log(`${colors.red}✗ ${name} - Status: ${response.status}${colors.reset}`);
      console.log(`  Error: ${data.error || data.message || 'Unknown error'}`);
      return { success: false, data };
    }
  } catch (error) {
    console.log(`${colors.red}✗ ${name} - Error: ${error.message}${colors.reset}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(`${colors.blue}🦑 Squiddles API Endpoint Tests${colors.reset}\n`);
  
  const results = [];
  
  // Test 1: Pinecone Health
  results.push(await testEndpoint(
    'Pinecone Health Check',
    `${BASE_URL}/api/pinecone/health`
  ));
  
  console.log('');
  
  // Test 2: Pinecone Stats
  results.push(await testEndpoint(
    'Pinecone Statistics',
    `${BASE_URL}/api/pinecone/stats`
  ));
  
  console.log('');
  
  // Test 3: Jira User Info
  results.push(await testEndpoint(
    'Jira User Info',
    `${BASE_URL}/api/jira/user`
  ));
  
  console.log('');
  
  // Test 4: Jira Tickets
  results.push(await testEndpoint(
    'Jira Tickets',
    `${BASE_URL}/api/jira/tickets`
  ));
  
  console.log('');
  
  // Test 5: Jira Comments
  results.push(await testEndpoint(
    'Jira Comments',
    `${BASE_URL}/api/jira/comments`
  ));
  
  console.log('');
  
  // Test 6: Pinecone Document Upsert
  const testDocument = {
    id: 'test-doc-001',
    type: 'TICKET',
    metadata: {
      teamId: 'test-team',
      status: 'OPEN',
      priority: 'HIGH'
    },
    content: {
      title: 'Test Document',
      description: 'This is a test document for API testing',
      fullText: 'Full content of the test document for API endpoint testing'
    }
  };
  
  results.push(await testEndpoint(
    'Pinecone Document Upsert',
    `${BASE_URL}/api/pinecone/documents`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDocument)
    }
  ));
  
  console.log('');
  
  // Wait for indexing
  console.log(`${colors.cyan}Waiting for Pinecone indexing...${colors.reset}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 7: Pinecone Search
  results.push(await testEndpoint(
    'Pinecone Search',
    `${BASE_URL}/api/pinecone/documents?query=test+document&type=TICKET&limit=5`
  ));
  
  console.log('');
  
  // Test 8: Pinecone Document Delete
  results.push(await testEndpoint(
    'Pinecone Document Delete',
    `${BASE_URL}/api/pinecone/documents/test-doc-001?type=TICKET`,
    { method: 'DELETE' }
  ));
  
  console.log('');
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  if (successful === total) {
    console.log(`${colors.green}✅ All ${total} tests passed!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ ${successful}/${total} tests passed${colors.reset}`);
  }
  
  console.log(`\n${colors.cyan}API endpoints are ready for integration!${colors.reset}`);
  
  // If Jira failed, show setup reminder
  const jiraResults = results.slice(2, 5); // Tests 3-5 are Jira
  if (jiraResults.some(r => !r.success)) {
    console.log(`\n${colors.yellow}Note: Jira tests failed. Ensure these are set in .env.local:${colors.reset}`);
    console.log('  JIRA_HOST=https://your-domain.atlassian.net');
    console.log('  JIRA_EMAIL=your-email@company.com');
    console.log('  JIRA_API_TOKEN=your-api-token');
  }
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Test runner error: ${error}${colors.reset}`);
  process.exit(1);
});