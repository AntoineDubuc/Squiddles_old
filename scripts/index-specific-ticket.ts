#!/usr/bin/env tsx
import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { getJiraIndexer } from '../src/lib/pinecone/indexers/jiraIndexer';

async function indexSpecificTicket(ticketKey: string) {
  console.log(`🎫 Indexing specific ticket: ${ticketKey}`);
  
  const jiraIndexer = getJiraIndexer();
  
  try {
    await jiraIndexer.indexTicketByKey(ticketKey);
    console.log(`✅ Successfully indexed ${ticketKey}`);
  } catch (error) {
    console.error(`❌ Error indexing ${ticketKey}:`, error);
  }
}

indexSpecificTicket('DE-3397');