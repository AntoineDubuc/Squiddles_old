#!/usr/bin/env tsx
/**
 * Auto-confirmed version: DELETE ALL data from Pinecone index
 * and then index only DE-3397
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { getJiraIndexer } from '../src/lib/pinecone/indexers/jiraIndexer';

async function clearAndIndexSingleTicket() {
  console.log('⚠️  EXECUTING: DELETE ALL data from Pinecone index');
  console.log('Then indexing only ticket DE-3397\n');
  
  console.log('🗑️  Starting deletion process...');
  
  try {
    // Initialize Pinecone
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    
    const indexName = process.env.PINECONE_INDEX_NAME!;
    const index = pc.index(indexName);
    
    // Get all namespaces that might have data
    const namespaces = [
      'jira-tickets',
      'jira-comments', 
      'emails',
      'confluence-pages',
      'slack-messages',
      'github-items',
      'default'
    ];
    
    // Delete all data from each namespace
    for (const namespace of namespaces) {
      console.log(`\n🗑️  Deleting all vectors from namespace: ${namespace}`);
      try {
        await index.namespace(namespace).deleteAll();
        console.log(`✅ Cleared namespace: ${namespace}`);
      } catch (error: any) {
        if (error.message?.includes('Namespace not found')) {
          console.log(`⏭️  Namespace ${namespace} doesn't exist, skipping`);
        } else {
          console.error(`❌ Error clearing ${namespace}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ All data deleted from Pinecone index');
    
    // Wait a bit for deletion to propagate
    console.log('\n⏳ Waiting 5 seconds for deletion to propagate...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Now index only DE-3397
    console.log('\n📝 Indexing ticket DE-3397...');
    
    const jiraIndexer = getJiraIndexer();
    await jiraIndexer.indexTicketByKey('DE-3397');
    
    console.log('\n✅ Successfully indexed DE-3397');
    
    // Verify the index now contains only this ticket
    console.log('\n🔍 Verifying index contents...');
    
    const stats = await index.describeIndexStats();
    console.log('\nIndex statistics:');
    console.log(JSON.stringify(stats, null, 2));
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
clearAndIndexSingleTicket()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });