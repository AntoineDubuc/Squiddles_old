#!/usr/bin/env tsx
import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';

async function testPinecone() {
  console.log('Testing Pinecone connection...');
  
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME;
  
  console.log('API Key:', apiKey ? 'Found' : 'Missing');
  console.log('Index Name:', indexName);
  
  if (!apiKey) {
    console.error('Missing PINECONE_API_KEY');
    return;
  }
  
  try {
    const pc = new Pinecone({ apiKey });
    
    // List all indexes
    console.log('\nListing all indexes...');
    const indexes = await pc.listIndexes();
    console.log('Available indexes:', indexes);
    
    // Try to describe the configured index
    if (indexName) {
      console.log(`\nTrying to describe index: ${indexName}`);
      try {
        const indexDesc = await pc.describeIndex(indexName);
        console.log('Index description:', indexDesc);
      } catch (error: any) {
        console.error(`Error describing index "${indexName}":`, error.message);
        
        // Try lowercase
        const lowerIndexName = indexName.toLowerCase();
        console.log(`\nTrying lowercase: ${lowerIndexName}`);
        try {
          const indexDesc = await pc.describeIndex(lowerIndexName);
          console.log('Index description:', indexDesc);
        } catch (error2: any) {
          console.error(`Error with lowercase:`, error2.message);
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testPinecone();