#!/usr/bin/env tsx
/**
 * Compare storage between old and optimized approaches
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';

async function compareStorage() {
  console.log('📊 Comparing Pinecone Storage Approaches\n');
  
  try {
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    // Fetch the optimized version
    console.log('Fetching DE-3397 from Pinecone...\n');
    const result = await index.namespace('jira-tickets').fetch(['jira_ticket_DE-3397']);
    
    if (result.records && result.records['jira_ticket_DE-3397']) {
      const record = result.records['jira_ticket_DE-3397'];
      
      console.log('✅ CURRENT (Optimized) Metadata:');
      console.log('================================');
      console.log(JSON.stringify(record.metadata, null, 2));
      console.log(`\nSize: ${JSON.stringify(record.metadata).length} bytes`);
      
      console.log('\n\n🚫 OLD APPROACH would have stored:');
      console.log('===================================');
      const oldMetadata = {
        id: 'jira_ticket_DE-3397',
        type: 'jira_ticket',
        source: 'jira',
        createdAt: record.metadata?.createdAt,
        updatedAt: record.metadata?.updatedAt,
        title: 'DE-3397: [IMP] LinkedIn Connector',
        content: 'Full ticket content here with description, links, etc...',
        searchableText: 'DE-3397 LinkedIn Connector enhancement request...',
        url: 'https://extendtv.atlassian.net/browse/DE-3397',
        author: {
          id: '712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e',
          name: 'Antoine Dubuc',
          email: 'antoine@extend.tv'
        },
        ticketKey: 'DE-3397',
        projectKey: 'DE',
        projectName: 'Data Engineering',
        metadata: {
          issueType: 'Task',
          status: 'In Progress',
          priority: 'P2',
          assignee: '712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e',
          reporter: '712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e',
          labels: ['enhancement', 'connector', 'linkedin'],
          components: ['ETL'],
          mentions: ['@antoine', '712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e'],
          hasRichContent: true,
          urgencyLevel: 'medium',
          relatedEmails: [],
          relatedPages: [],
          links: [
            'https://extendtv.atlassian.net/wiki/spaces/TEC/pages/1996128343',
            'https://extendtv.atlassian.net/wiki/spaces/TEC/pages/1996259503',
            'https://extendtv.atlassian.net/wiki/spaces/TEC/pages/1991901234'
          ]
        }
      };
      
      console.log('(Sample of what would be stored)');
      console.log(`Size: ~${JSON.stringify(oldMetadata).length} bytes`);
      
      console.log('\n\n💰 COST COMPARISON:');
      console.log('==================');
      const oldSize = JSON.stringify(oldMetadata).length;
      const newSize = JSON.stringify(record.metadata).length;
      const reduction = Math.round((1 - newSize / oldSize) * 100);
      
      console.log(`Old approach: ~${oldSize} bytes per document`);
      console.log(`New approach: ${newSize} bytes per document`);
      console.log(`Reduction: ${reduction}% less metadata storage`);
      
      console.log('\nFor 100,000 documents:');
      console.log(`Old: ~${Math.round(oldSize * 100000 / 1024 / 1024)} MB of metadata`);
      console.log(`New: ~${Math.round(newSize * 100000 / 1024 / 1024)} MB of metadata`);
      
      console.log('\n\n📍 KEY DIFFERENCES:');
      console.log('==================');
      console.log('✅ Optimized approach stores in Pinecone:');
      console.log('  - Only fields needed for filtering');
      console.log('  - No content, titles, or display data');
      console.log('  - Minimal fixed schema');
      
      console.log('\n✅ Full data stored separately:');
      console.log('  - PostgreSQL/Redis for fast retrieval');
      console.log('  - All display fields (title, content, author details)');
      console.log('  - Flexible schema for custom fields');
      console.log('  - Links, attachments, and rich content');
      
    } else {
      console.log('❌ DE-3397 not found in index');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run comparison
compareStorage()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });