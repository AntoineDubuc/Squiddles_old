#!/usr/bin/env tsx
/**
 * Re-index DE-3397 using optimized metadata approach
 * Shows the difference between old and new storage patterns
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

async function reindexOptimizedSimple() {
  console.log('🔄 Re-indexing DE-3397 with optimized metadata...\n');
  
  try {
    // Initialize clients
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    // First, delete the old version
    console.log('🗑️  Deleting old version...');
    await index.namespace('jira-tickets').deleteOne('jira_ticket_DE-3397');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Fetch the ticket
    console.log('🎫 Fetching DE-3397...');
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
    const fields = issue.fields;
    
    // Extract content for embedding
    const content = `${issue.key}: ${fields.summary}\n\n${extractTextFromADF(fields.description)}`;
    
    // Generate embedding
    console.log('🧮 Generating embedding...');
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: content
    });
    const embedding = embeddingResponse.data[0].embedding;
    
    // Create MINIMAL metadata (only for filtering)
    const minimalMetadata = {
      type: 'jira_ticket',
      source: 'jira',
      ticketKey: issue.key,
      projectKey: fields.project.key,
      status: fields.status.name,
      priority: fields.priority.name,
      authorId: fields.reporter.accountId,
      createdAt: new Date(fields.created).getTime(),
      updatedAt: new Date(fields.updated).getTime(),
      isUrgent: fields.priority.name === 'Highest' || fields.priority.name === 'Critical'
    };
    
    // Index with minimal metadata
    console.log('📝 Indexing with minimal metadata...');
    await index.namespace('jira-tickets').upsert([{
      id: `jira_ticket_${issue.key}`,
      values: embedding,
      metadata: minimalMetadata
    }]);
    
    console.log('\n✅ Re-indexed with optimized metadata!');
    
    // Compare old vs new
    console.log('\n📊 Storage Comparison:');
    console.log('\n🚫 OLD APPROACH (everything in metadata):');
    console.log('- Full content, author objects, searchableText');
    console.log('- Metadata size: ~2-5KB per document');
    console.log('- Expensive Pinecone storage costs');
    
    console.log('\n✅ NEW APPROACH (minimal metadata):');
    console.log('Pinecone metadata:');
    console.log(JSON.stringify(minimalMetadata, null, 2));
    console.log(`Metadata size: ${JSON.stringify(minimalMetadata).length} bytes`);
    
    console.log('\n💡 Full document data would be stored in:');
    console.log('- PostgreSQL/Redis for fast retrieval');
    console.log('- Contains: title, content, author details, links, etc.');
    console.log('- Only fetched when displaying search results');
    
    // Show what would be in document store
    const documentData = {
      id: `jira_ticket_${issue.key}`,
      title: `${issue.key}: ${fields.summary}`,
      content: extractTextFromADF(fields.description),
      url: `${process.env.JIRA_HOST}/browse/${issue.key}`,
      author: {
        id: fields.reporter.accountId,
        name: fields.reporter.displayName,
        email: fields.reporter.emailAddress
      },
      links: extractLinksFromADF(fields.description)
    };
    
    console.log('\nDocument store data preview:');
    console.log(`- Title: ${documentData.title}`);
    console.log(`- Author: ${documentData.author.name}`);
    console.log(`- Links: ${documentData.links.length} found`);
    console.log(`- Full data size: ${JSON.stringify(documentData).length} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Helper functions
function extractTextFromADF(adf: any): string {
  if (!adf) return '';
  if (typeof adf === 'string') return adf;
  
  if (adf.type === 'doc' && adf.content) {
    return extractTextFromADFContent(adf.content);
  }
  
  return '';
}

function extractTextFromADFContent(content: any[]): string {
  if (!Array.isArray(content)) return '';
  
  return content.map(node => {
    if (node.type === 'text') {
      let text = node.text || '';
      
      // Check for link marks
      if (node.marks && Array.isArray(node.marks)) {
        const linkMark = node.marks.find((mark: any) => mark.type === 'link');
        if (linkMark && linkMark.attrs && linkMark.attrs.href) {
          text = `${text} (${linkMark.attrs.href})`;
        }
      }
      
      return text;
    } else if (node.type === 'paragraph' && node.content) {
      return extractTextFromADFContent(node.content);
    } else if (node.type === 'mention' && node.attrs) {
      return `@${node.attrs.text || node.attrs.displayName || ''}`;
    } else if (node.type === 'inlineCard' && node.attrs) {
      return `[${node.attrs.url || 'link'}]`;
    } else if (node.type === 'blockCard' && node.attrs) {
      return `[${node.attrs.url || 'link'}]`;
    } else if (node.content) {
      return extractTextFromADFContent(node.content);
    }
    return '';
  }).join(' ').replace(/\s+/g, ' ').trim();
}

function extractLinksFromADF(adf: any): string[] {
  const links: string[] = [];
  
  const extractFromNodes = (nodes: any[]) => {
    if (!Array.isArray(nodes)) return;
    
    nodes.forEach(node => {
      if (node.type === 'text' && node.marks) {
        const linkMark = node.marks.find((mark: any) => mark.type === 'link');
        if (linkMark?.attrs?.href) {
          links.push(linkMark.attrs.href);
        }
      }
      
      if ((node.type === 'inlineCard' || node.type === 'blockCard') && node.attrs?.url) {
        links.push(node.attrs.url);
      }
      
      if (node.content) {
        extractFromNodes(node.content);
      }
    });
  };
  
  if (adf?.type === 'doc' && adf.content) {
    extractFromNodes(adf.content);
  }
  
  return [...new Set(links)];
}

// Run the script
reindexOptimizedSimple()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });