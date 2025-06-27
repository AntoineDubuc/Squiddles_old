#!/usr/bin/env tsx
import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';

async function fetchById(documentId: string) {
  console.log(`Fetching document: ${documentId}\n`);
  
  const pc = new Pinecone({ 
    apiKey: process.env.PINECONE_API_KEY!
  });
  
  const index = pc.index(process.env.PINECONE_INDEX_NAME!);
  
  // Try both namespaces
  const namespaces = ['jira-tickets', 'jira-comments'];
  
  for (const ns of namespaces) {
    console.log(`Checking namespace: ${ns}`);
    const namespace = index.namespace(ns);
    const result = await namespace.fetch([documentId]);
    
    if (result.records && result.records[documentId]) {
      console.log(`✅ Found in ${ns}!`);
      const record = result.records[documentId];
      console.log('\nFull record:', JSON.stringify(record.metadata, null, 2));
      return;
    }
  }
  
  console.log('❌ Document not found in any namespace');
}

const id = process.argv[2] || 'jira_ticket_DE-3397';
fetchById(id);