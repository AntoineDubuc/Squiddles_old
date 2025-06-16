/**
 * Pinecone Connection Test Script
 * Tests basic connectivity and operations with Pinecone
 * Run with: npx tsx src/lib/pinecone/testConnection.ts
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Configuration
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'squiddles-prod';
const TEST_NAMESPACE = 'test';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

async function testPineconeConnection() {
  console.log(`${colors.blue}🦑 Squiddles Pinecone Connection Test${colors.reset}\n`);

  // Step 1: Check environment variables
  console.log(`${colors.yellow}1. Checking environment variables...${colors.reset}`);
  const requiredEnvVars = {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  };

  let envVarsOk = true;
  for (const [name, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      console.log(`${colors.red}❌ Missing: ${name}${colors.reset}`);
      envVarsOk = false;
    } else {
      console.log(`${colors.green}✓ Found: ${name}${colors.reset} ${colors.dim}(${value.substring(0, 8)}...)${colors.reset}`);
    }
  }

  if (!envVarsOk) {
    console.log(`\n${colors.red}Please set all required environment variables in .env.local${colors.reset}`);
    process.exit(1);
  }

  // Step 2: Initialize Pinecone client
  console.log(`\n${colors.yellow}2. Initializing Pinecone client...${colors.reset}`);
  let pinecone: Pinecone;
  try {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    console.log(`${colors.green}✓ Pinecone client initialized${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}❌ Failed to initialize Pinecone: ${error}${colors.reset}`);
    process.exit(1);
  }

  // Step 3: List indexes
  console.log(`\n${colors.yellow}3. Listing available indexes...${colors.reset}`);
  try {
    const indexList = await pinecone.listIndexes();
    const indexes = indexList.indexes || [];
    console.log(`${colors.green}✓ Found ${indexes.length} indexes:${colors.reset}`);
    indexes.forEach((index: any) => {
      console.log(`  - ${index.name} ${index.name === PINECONE_INDEX_NAME ? '(target)' : ''}`);
    });
  } catch (error) {
    console.log(`${colors.red}❌ Failed to list indexes: ${error}${colors.reset}`);
    process.exit(1);
  }

  // Step 4: Check if target index exists
  console.log(`\n${colors.yellow}4. Checking target index: ${PINECONE_INDEX_NAME}...${colors.reset}`);
  let indexExists = false;
  try {
    const indexList = await pinecone.listIndexes();
    const indexes = indexList.indexes || [];
    indexExists = indexes.some((idx: any) => idx.name === PINECONE_INDEX_NAME);
    
    if (indexExists) {
      console.log(`${colors.green}✓ Index '${PINECONE_INDEX_NAME}' exists${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ Index '${PINECONE_INDEX_NAME}' not found${colors.reset}`);
      console.log(`${colors.yellow}  Creating index...${colors.reset}`);
      
      // Create index
      await pinecone.createIndex({
        name: PINECONE_INDEX_NAME,
        dimension: 1536, // OpenAI embeddings dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          }
        }
      });
      
      console.log(`${colors.green}✓ Index created successfully${colors.reset}`);
      
      // Wait for index to be ready
      console.log(`${colors.dim}  Waiting for index to be ready...${colors.reset}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error with index: ${error}${colors.reset}`);
    process.exit(1);
  }

  // Step 5: Connect to index
  console.log(`\n${colors.yellow}5. Connecting to index...${colors.reset}`);
  let index: any;
  try {
    index = pinecone.index(PINECONE_INDEX_NAME);
    console.log(`${colors.green}✓ Connected to index${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}❌ Failed to connect to index: ${error}${colors.reset}`);
    process.exit(1);
  }

  // Step 6: Get index stats
  console.log(`\n${colors.yellow}6. Getting index statistics...${colors.reset}`);
  try {
    const stats = await index.describeIndexStats();
    console.log(`${colors.green}✓ Index stats retrieved:${colors.reset}`);
    console.log(`  - Total vectors: ${stats.totalRecordCount || 0}`);
    console.log(`  - Dimensions: ${stats.dimension || 'N/A'}`);
    console.log(`  - Index fullness: ${((stats.indexFullness || 0) * 100).toFixed(2)}%`);
    
    if (stats.namespaces) {
      console.log(`  - Namespaces:`);
      Object.entries(stats.namespaces).forEach(([ns, data]: [string, any]) => {
        console.log(`    • ${ns}: ${data.recordCount || 0} vectors`);
      });
    }
  } catch (error) {
    console.log(`${colors.red}❌ Failed to get index stats: ${error}${colors.reset}`);
  }

  // Step 7: Test embedding generation
  console.log(`\n${colors.yellow}7. Testing OpenAI embedding generation...${colors.reset}`);
  let testEmbedding: number[] = [];
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: 'Test query for Squiddles Pinecone integration',
    });
    
    testEmbedding = response.data[0].embedding;
    console.log(`${colors.green}✓ Embedding generated (dimension: ${testEmbedding.length})${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}❌ Failed to generate embedding: ${error}${colors.reset}`);
    process.exit(1);
  }

  // Step 8: Test upsert operation
  console.log(`\n${colors.yellow}8. Testing upsert operation...${colors.reset}`);
  try {
    const testVector = {
      id: 'test-vector-1',
      values: testEmbedding,
      metadata: {
        type: 'TEST',
        content: 'Test vector for Squiddles',
        timestamp: Date.now(),
      }
    };

    await index.namespace(TEST_NAMESPACE).upsert([testVector]);
    console.log(`${colors.green}✓ Successfully upserted test vector${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}❌ Failed to upsert vector: ${error}${colors.reset}`);
    process.exit(1);
  }

  // Step 9: Test query operation
  console.log(`\n${colors.yellow}9. Testing query operation...${colors.reset}`);
  try {
    const queryResponse = await index.namespace(TEST_NAMESPACE).query({
      vector: testEmbedding,
      topK: 3,
      includeMetadata: true,
    });

    console.log(`${colors.green}✓ Query successful:${colors.reset}`);
    console.log(`  - Matches found: ${queryResponse.matches?.length || 0}`);
    
    if (queryResponse.matches && queryResponse.matches.length > 0) {
      queryResponse.matches.forEach((match, i) => {
        console.log(`  - Match ${i + 1}: ID=${match.id}, Score=${match.score?.toFixed(4)}`);
      });
    }
  } catch (error) {
    console.log(`${colors.red}❌ Failed to query: ${error}${colors.reset}`);
    process.exit(1);
  }

  // Step 10: Clean up test data
  console.log(`\n${colors.yellow}10. Cleaning up test data...${colors.reset}`);
  try {
    await index.namespace(TEST_NAMESPACE).deleteOne('test-vector-1');
    console.log(`${colors.green}✓ Test data cleaned up${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠ Warning: Failed to clean up test data: ${error}${colors.reset}`);
  }

  // Summary
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}✅ All tests passed! Pinecone is ready for use.${colors.reset}`);
  console.log(`\nNext steps:`);
  console.log(`1. Implement the PineconeService class`);
  console.log(`2. Integrate with ticket creation flow`);
  console.log(`3. Set up comment syncing from Jira`);
  console.log(`4. Add search endpoints to the API`);
}

// Run the test
testPineconeConnection().catch(error => {
  console.error(`${colors.red}Unexpected error: ${error}${colors.reset}`);
  process.exit(1);
});