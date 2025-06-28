#!/usr/bin/env tsx
/**
 * Re-index DE-3397 using the optimized metadata approach
 * This stores minimal metadata in Pinecone and full data in a document store
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { OptimizedPineconeService } from '../src/lib/pinecone/optimizedMultiSourceService';
import { InMemoryDocumentStore } from '../src/lib/pinecone/stores/inMemoryDocumentStore';
import { OptimizedJiraIndexer } from '../src/lib/pinecone/indexers/optimizedJiraIndexer';

async function reindexOptimized() {
  console.log('🔄 Re-indexing DE-3397 with optimized metadata approach...\n');
  
  try {
    // First, delete the old version
    console.log('🗑️  Deleting old version of DE-3397...');
    
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    // Delete from jira-tickets namespace
    await index.namespace('jira-tickets').deleteOne('jira_ticket_DE-3397');
    console.log('✅ Old version deleted\n');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Initialize optimized services
    console.log('📝 Initializing optimized indexing...\n');
    
    // For now, use in-memory store (replace with PostgreSQL later)
    const documentStore = new InMemoryDocumentStore();
    const pineconeService = new OptimizedPineconeService(documentStore);
    const indexer = new OptimizedJiraIndexer(pineconeService);
    
    // Index single ticket
    console.log('🎫 Fetching and indexing DE-3397...');
    
    const response = await fetch(
      `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/issue/DE-3397?expand=renderedFields`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString('base64')}`,
          'Accept': 'application/json',
        },
        method: 'GET'
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get issue: ${response.statusText}`);
    }

    const issue = await response.json();
    
    // Use the indexer's internal method by creating a minimal JQL
    await indexer.indexTicketsByJQL(`key = DE-3397`);
    
    console.log('\n✅ Re-indexing complete with optimized metadata!');
    
    // Show what's stored
    console.log('\n📊 Optimized storage breakdown:');
    console.log('Pinecone metadata (minimal for filtering):');
    
    // Fetch and show metadata
    const stats = await index.namespace('jira-tickets').fetch(['jira_ticket_DE-3397']);
    if (stats.records && stats.records['jira_ticket_DE-3397']) {
      const record = stats.records['jira_ticket_DE-3397'];
      console.log(JSON.stringify(record.metadata, null, 2));
      console.log(`\nMetadata size: ~${JSON.stringify(record.metadata).length} bytes`);
    }
    
    // Show document store data
    const fullDoc = await documentStore.get('jira_ticket_DE-3397');
    if (fullDoc) {
      console.log('\nDocument store (full data for display):');
      console.log(`- Title: ${fullDoc.title}`);
      console.log(`- Author: ${fullDoc.author?.name}`);
      console.log(`- URL: ${fullDoc.url}`);
      console.log(`- Content length: ${fullDoc.content?.length || 0} chars`);
      console.log(`\nFull document size: ~${JSON.stringify(fullDoc).length} bytes`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
reindexOptimized()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });