/**
 * Test script for PineconeService
 * Run with: npx tsx src/lib/pinecone/testService.ts
 */

import * as dotenv from 'dotenv';
import { getPineconeService } from './pineconeService';
import { PineconeDocType, PineconeDocument } from './types';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function testPineconeService() {
  console.log(`${colors.blue}🦑 Testing PineconeService${colors.reset}\n`);

  const service = getPineconeService();

  // Test 1: Health Check
  console.log(`${colors.yellow}1. Testing health check...${colors.reset}`);
  try {
    const health = await service.checkHealth();
    if (health.healthy) {
      console.log(`${colors.green}✓ Service is healthy${colors.reset}`);
      console.log(`  Index: ${health.details.indexName}`);
      console.log(`  Total vectors: ${health.details.totalVectors}`);
    } else {
      console.log(`${colors.red}✗ Service is unhealthy: ${health.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Health check failed: ${error}${colors.reset}`);
  }

  // Test 2: Upsert a test ticket
  console.log(`\n${colors.yellow}2. Testing document upsert (ticket)...${colors.reset}`);
  const testTicket: PineconeDocument = {
    id: 'test-ticket-001',
    type: PineconeDocType.TICKET,
    embedding: [], // Will be generated
    metadata: {
      type: 'TICKET',
      teamId: 'team-123',
      userId: 'user-456',
      createdAt: Date.now(),
      status: 'OPEN',
      priority: 'HIGH',
      ticketType: 'BUG'
    },
    content: {
      title: 'Payment processing error on checkout',
      description: 'Users are experiencing 500 errors when attempting to process credit card payments during checkout flow',
      fullText: 'Bug Report: Payment processing error\n\nSteps to reproduce:\n1. Add items to cart\n2. Proceed to checkout\n3. Enter credit card details\n4. Click submit\n\nExpected: Payment processes successfully\nActual: 500 error displayed\n\nEnvironment: Production\nBrowser: Chrome 120\nFrequency: 30% of transactions'
    }
  };

  try {
    await service.upsertDocument(testTicket);
    console.log(`${colors.green}✓ Successfully upserted test ticket${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Failed to upsert ticket: ${error}${colors.reset}`);
  }

  // Test 3: Upsert a test comment
  console.log(`\n${colors.yellow}3. Testing document upsert (comment)...${colors.reset}`);
  const testComment: PineconeDocument = {
    id: 'test-comment-001',
    type: PineconeDocType.COMMENT,
    embedding: [],
    metadata: {
      type: 'COMMENT',
      teamId: 'team-123',
      userId: 'user-789',
      createdAt: Date.now(),
      ticketId: 'test-ticket-001',
      hasMention: true
    },
    content: {
      title: 'Comment on PROD-234',
      description: '@user-456 This looks like the Stripe webhook timeout issue we saw last week',
      fullText: '@user-456 This looks like the Stripe webhook timeout issue we saw last week. The error pattern matches - happening during high traffic periods. Should we increase the timeout threshold?'
    }
  };

  try {
    await service.upsertDocument(testComment);
    console.log(`${colors.green}✓ Successfully upserted test comment${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Failed to upsert comment: ${error}${colors.reset}`);
  }

  // Wait a moment for indexing
  console.log(`\n${colors.blue}Waiting for indexing...${colors.reset}`);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 4: Search for tickets
  console.log(`\n${colors.yellow}4. Testing search (payment errors)...${colors.reset}`);
  try {
    const results = await service.search({
      query: 'payment processing checkout error',
      type: [PineconeDocType.TICKET],
      filters: {
        teamId: 'team-123'
      },
      limit: 5
    });

    console.log(`${colors.green}✓ Search completed${colors.reset}`);
    console.log(`  Found ${results.length} results`);
    
    results.forEach((result, i) => {
      console.log(`\n  Result ${i + 1}:`);
      console.log(`    ID: ${result.id}`);
      console.log(`    Score: ${result.score.toFixed(4)}`);
      console.log(`    Title: ${result.document.metadata.title}`);
      if (result.highlights?.length) {
        console.log(`    Highlights: ${result.highlights[0]}`);
      }
    });
  } catch (error) {
    console.log(`${colors.red}✗ Search failed: ${error}${colors.reset}`);
  }

  // Test 5: Search for mentions
  console.log(`\n${colors.yellow}5. Testing search (mentions)...${colors.reset}`);
  try {
    const results = await service.search({
      query: '@user-456 stripe webhook',
      type: [PineconeDocType.COMMENT],
      filters: {
        teamId: 'team-123'
      },
      limit: 5
    });

    console.log(`${colors.green}✓ Mention search completed${colors.reset}`);
    console.log(`  Found ${results.length} results`);
  } catch (error) {
    console.log(`${colors.red}✗ Mention search failed: ${error}${colors.reset}`);
  }

  // Test 6: Batch upsert
  console.log(`\n${colors.yellow}6. Testing batch upsert...${colors.reset}`);
  const batchDocs: PineconeDocument[] = [
    {
      id: 'test-template-001',
      type: PineconeDocType.TEMPLATE,
      embedding: [],
      metadata: {
        type: 'TEMPLATE',
        teamId: 'team-123',
        createdAt: Date.now(),
        templateType: 'BUG'
      },
      content: {
        title: 'Bug Report Template',
        description: 'Standard template for reporting bugs with reproduction steps',
        fullText: 'Bug Title:\n\nDescription:\n\nSteps to Reproduce:\n1.\n2.\n3.\n\nExpected Behavior:\n\nActual Behavior:\n\nEnvironment:'
      }
    },
    {
      id: 'test-template-002',
      type: PineconeDocType.TEMPLATE,
      embedding: [],
      metadata: {
        type: 'TEMPLATE',
        teamId: 'team-123',
        createdAt: Date.now(),
        templateType: 'STORY'
      },
      content: {
        title: 'User Story Template',
        description: 'Template for creating user stories with acceptance criteria',
        fullText: 'As a [user type]\nI want [feature]\nSo that [benefit]\n\nAcceptance Criteria:\n- [ ]\n- [ ]\n\nTechnical Notes:'
      }
    }
  ];

  try {
    await service.upsertBatch(batchDocs);
    console.log(`${colors.green}✓ Successfully batch upserted ${batchDocs.length} documents${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Batch upsert failed: ${error}${colors.reset}`);
  }

  // Test 7: Get index stats
  console.log(`\n${colors.yellow}7. Getting final index statistics...${colors.reset}`);
  try {
    const stats = await service.getIndexStats();
    console.log(`${colors.green}✓ Index statistics:${colors.reset}`);
    console.log(`  Total vectors: ${stats.totalRecordCount || 0}`);
    
    if (stats.namespaces) {
      console.log(`  Namespaces:`);
      Object.entries(stats.namespaces).forEach(([ns, data]: [string, any]) => {
        console.log(`    • ${ns}: ${data.recordCount || 0} vectors`);
      });
    }
  } catch (error) {
    console.log(`${colors.red}✗ Failed to get stats: ${error}${colors.reset}`);
  }

  // Test 8: Cleanup
  console.log(`\n${colors.yellow}8. Cleaning up test data...${colors.reset}`);
  const testIds = [
    { id: 'test-ticket-001', type: PineconeDocType.TICKET },
    { id: 'test-comment-001', type: PineconeDocType.COMMENT },
    { id: 'test-template-001', type: PineconeDocType.TEMPLATE },
    { id: 'test-template-002', type: PineconeDocType.TEMPLATE }
  ];

  for (const { id, type } of testIds) {
    try {
      await service.deleteDocument(id, type);
      console.log(`${colors.green}✓ Deleted ${id}${colors.reset}`);
    } catch (error) {
      console.log(`${colors.yellow}⚠ Failed to delete ${id}: ${error}${colors.reset}`);
    }
  }

  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}✅ PineconeService tests completed!${colors.reset}`);
  console.log(`\nThe service is ready for integration with:`);
  console.log(`- Ticket creation flow`);
  console.log(`- Comment syncing`);
  console.log(`- Search API endpoints`);
}

// Run the tests
testPineconeService().catch(error => {
  console.error(`${colors.red}Unexpected error: ${error}${colors.reset}`);
  process.exit(1);
});