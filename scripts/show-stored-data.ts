#!/usr/bin/env tsx
/**
 * Script to show complete stored data for a ticket in a formatted way
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { getMultiSourcePineconeService, DocumentType } from '../src/lib/pinecone/multiSourceService';

async function showStoredData(ticketKey: string) {
  console.log(`📊 Stored Data Analysis for ${ticketKey}`);
  console.log('='['repeat'](60) + '\n');
  
  const pineconeService = getMultiSourcePineconeService();
  
  try {
    // Search for the ticket
    console.log('1️⃣ SEARCHING FOR TICKET DOCUMENTS...\n');
    const ticketResults = await pineconeService.search(ticketKey, {
      types: [DocumentType.JIRA_TICKET]
    }, 10);
    
    const exactTicket = ticketResults.find(r => r.document?.id === `jira_ticket_${ticketKey}`);
    
    if (exactTicket && exactTicket.document) {
      console.log('✅ TICKET FOUND:\n');
      console.log('📋 BASIC INFORMATION:');
      console.log(`  • ID: ${exactTicket.document.id}`);
      console.log(`  • Title: ${exactTicket.document.title}`);
      console.log(`  • Type: ${exactTicket.document.type}`);
      console.log(`  • URL: ${exactTicket.document.url}`);
      console.log(`  • Created: ${new Date(exactTicket.document.createdAt).toLocaleString()}`);
      console.log(`  • Updated: ${new Date(exactTicket.document.updatedAt).toLocaleString()}`);
      console.log(`  • Search Score: ${exactTicket.score.toFixed(4)}`);
      
      console.log('\n👤 AUTHOR:');
      console.log(`  • Name: ${exactTicket.document.author.name}`);
      console.log(`  • ID: ${exactTicket.document.author.id}`);
      console.log(`  • Email: ${exactTicket.document.author.email || 'N/A'}`);
      
      console.log('\n📝 CONTENT:');
      console.log(`  ${exactTicket.document.content.split('\n').join('\n  ')}`);
      
      if (exactTicket.document.metadata) {
        console.log('\n🏷️ METADATA:');
        const meta = exactTicket.document.metadata;
        console.log(`  • Status: ${meta.status}`);
        console.log(`  • Priority: ${meta.priority}`);
        console.log(`  • Issue Type: ${meta.issueType}`);
        console.log(`  • Project Key: ${exactTicket.document.projectKey || 'N/A'}`);
        console.log(`  • Urgency Level: ${meta.urgencyLevel}`);
        console.log(`  • Reporter: ${meta.reporter}`);
        console.log(`  • Assignee: ${meta.assignee || 'Unassigned'}`);
        console.log(`  • Labels: ${meta.labels?.length ? meta.labels.join(', ') : 'None'}`);
        console.log(`  • Components: ${meta.components?.length ? meta.components.join(', ') : 'None'}`);
        console.log(`  • Has Rich Content: ${meta.hasRichContent ? 'Yes' : 'No'}`);
        console.log(`  • Mentions: ${meta.mentions?.length ? meta.mentions.join(', ') : 'None'}`);
        console.log(`  • Related Emails: ${meta.relatedEmails?.length ? meta.relatedEmails.join(', ') : 'None'}`);
        console.log(`  • Related Pages: ${meta.relatedPages?.length ? meta.relatedPages.join(', ') : 'None'}`);
      }
    } else {
      console.log(`❌ No ticket document found for ${ticketKey}`);
    }
    
    // Search for comments
    console.log('\n\n2️⃣ SEARCHING FOR COMMENT DOCUMENTS...\n');
    const commentResults = await pineconeService.search(`Comment on ${ticketKey}`, {
      types: [DocumentType.JIRA_COMMENT]
    }, 20);
    
    const ticketComments = commentResults.filter(r => 
      r.document?.id.startsWith(`jira_comment_${ticketKey}_`)
    );
    
    if (ticketComments.length > 0) {
      console.log(`✅ Found ${ticketComments.length} comments:\n`);
      
      ticketComments.forEach((result, index) => {
        if (result.document) {
          console.log(`💬 COMMENT ${index + 1}:`);
          console.log(`  • ID: ${result.document.id}`);
          console.log(`  • Author: ${result.document.author.name}`);
          console.log(`  • Created: ${new Date(result.document.createdAt).toLocaleString()}`);
          console.log(`  • Content: ${result.document.content.substring(0, 200)}${result.document.content.length > 200 ? '...' : ''}`);
          if (result.document.metadata?.mentions?.length) {
            console.log(`  • Mentions: ${result.document.metadata.mentions.join(', ')}`);
          }
          console.log(`  • Search Score: ${result.score.toFixed(4)}`);
          console.log('');
        }
      });
    } else {
      console.log(`❌ No comments found for ${ticketKey}`);
    }
    
    // Show what's indexed
    console.log('\n3️⃣ INDEXING SUMMARY:');
    console.log(`  • Ticket Document: ${exactTicket ? '✅ Indexed' : '❌ Not found'}`);
    console.log(`  • Comments: ${ticketComments.length} indexed`);
    console.log(`  • Total Documents: ${1 + ticketComments.length}`);
    
    // Show searchable text sample
    if (exactTicket?.document?.metadata) {
      console.log('\n4️⃣ SEARCHABLE TEXT PREVIEW:');
      const searchableText = (exactTicket.document.metadata as any).searchableText;
      if (searchableText) {
        console.log(`  "${searchableText.substring(0, 200)}..."`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get ticket key from command line or use default
const ticketKey = process.argv[2] || 'DE-3417';
showStoredData(ticketKey);