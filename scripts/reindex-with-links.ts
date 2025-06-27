#!/usr/bin/env tsx
/**
 * Re-index DE-3397 with improved link extraction
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { getImprovedJiraIndexer } from '../src/lib/pinecone/indexers/improvedJiraIndexer';
import { Pinecone } from '@pinecone-database/pinecone';

async function reindexWithLinks() {
  console.log('🔄 Re-indexing DE-3397 with link preservation...\n');
  
  try {
    // First, delete the old version
    console.log('🗑️  Deleting old version of DE-3397...');
    
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    await index.namespace('jira-tickets').deleteOne('jira_ticket_DE-3397');
    console.log('✅ Old version deleted\n');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Now re-index with improved extraction
    console.log('📝 Indexing with improved link extraction...\n');
    
    const improvedIndexer = getImprovedJiraIndexer();
    await improvedIndexer.indexTicketByKey('DE-3397');
    
    console.log('\n✅ Re-indexing complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
reindexWithLinks()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });