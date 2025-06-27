#!/usr/bin/env tsx
/**
 * Script to show detailed data stored in Pinecone for a specific ticket
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';

async function showTicketData(ticketKey: string) {
  console.log(`🔍 Fetching stored data for ticket: ${ticketKey}\n`);
  
  const pc = new Pinecone({ 
    apiKey: process.env.PINECONE_API_KEY!
  });
  
  const index = pc.index(process.env.PINECONE_INDEX_NAME!);
  
  try {
    // Fetch ticket document
    const ticketId = `jira_ticket_${ticketKey}`;
    console.log(`📄 Looking for ticket document with ID: ${ticketId}`);
    console.log('='*60);
    
    // Try to fetch from jira-tickets namespace
    const ticketNs = index.namespace('jira-tickets');
    const ticketFetch = await ticketNs.fetch([ticketId]);
    
    if (ticketFetch.records && ticketFetch.records[ticketId]) {
      const record = ticketFetch.records[ticketId];
      console.log('\n✅ TICKET DOCUMENT FOUND:\n');
      console.log('Basic Info:');
      console.log(`  ID: ${record.id}`);
      console.log(`  Values: ${record.values ? `[${record.values.length} dimensions]` : 'None'}`);
      
      if (record.metadata) {
        console.log('\nMetadata:');
        Object.entries(record.metadata).forEach(([key, value]) => {
          if (key === 'content' || key === 'searchableText') {
            console.log(`  ${key}: "${String(value).substring(0, 100)}..."`);
          } else if (typeof value === 'object') {
            console.log(`  ${key}: ${JSON.stringify(value, null, 2).split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n')}`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        });
      }
    } else {
      console.log('❌ Ticket document not found in jira-tickets namespace');
    }
    
    // Now look for comments
    console.log('\n' + '='*60);
    console.log(`\n💬 Looking for comments on ${ticketKey}...`);
    
    // Search in comments namespace for this ticket
    const commentsNs = index.namespace('jira-comments');
    
    // We need to do a query since we can't list all IDs
    // First, let's try fetching by pattern (this is a workaround)
    const possibleCommentIds = [];
    for (let i = 1; i < 10; i++) {
      possibleCommentIds.push(`jira_comment_${ticketKey}_${186850 + i}`);
    }
    
    const commentsFetch = await commentsNs.fetch(possibleCommentIds);
    
    let foundComments = 0;
    if (commentsFetch.records) {
      for (const [id, record] of Object.entries(commentsFetch.records)) {
        if (record) {
          foundComments++;
          console.log(`\n📝 COMMENT ${foundComments}:`);
          console.log(`  ID: ${id}`);
          
          if (record.metadata) {
            console.log('  Metadata:');
            Object.entries(record.metadata).forEach(([key, value]) => {
              if (key === 'content' || key === 'searchableText') {
                console.log(`    ${key}: "${String(value).substring(0, 100)}..."`);
              } else if (typeof value === 'object' && value !== null) {
                console.log(`    ${key}: ${JSON.stringify(value)}`);
              } else {
                console.log(`    ${key}: ${value}`);
              }
            });
          }
        }
      }
    }
    
    if (foundComments === 0) {
      console.log('  No comments found with the attempted IDs');
    }
    
    // Let's also do a similarity search to find any related documents
    console.log('\n' + '='*60);
    console.log(`\n🔎 Searching for all documents related to ${ticketKey}...`);
    
    // We need to create a dummy embedding for the query
    const dummyVector = new Array(1536).fill(0.1); // Dummy vector
    
    const searchResults = await Promise.all([
      ticketNs.query({
        vector: dummyVector,
        topK: 100,
        includeMetadata: true,
        filter: { title: { '$contains': ticketKey } }
      }),
      commentsNs.query({
        vector: dummyVector,
        topK: 100,
        includeMetadata: true,
        filter: { title: { '$contains': ticketKey } }
      })
    ]);
    
    const allMatches = [...(searchResults[0].matches || []), ...(searchResults[1].matches || [])];
    
    console.log(`\nFound ${allMatches.length} total documents mentioning ${ticketKey}`);
    
    if (allMatches.length > 0) {
      console.log('\nDocument IDs found:');
      allMatches.forEach(match => {
        console.log(`  - ${match.id} (${match.metadata?.type || 'unknown type'})`);
      });
    }
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Get ticket key from command line or use default
const ticketKey = process.argv[2] || 'DE-3417';
showTicketData(ticketKey);