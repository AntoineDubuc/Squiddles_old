#!/usr/bin/env tsx
/**
 * Re-index DE-3397 with optimized metadata AND preserved links
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

async function reindexOptimizedWithLinks() {
  console.log('🔄 Re-indexing DE-3397 with optimized metadata + link preservation...\n');
  
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
    
    // Log raw ADF to see structure
    console.log('📄 Raw description ADF:', JSON.stringify(fields.description, null, 2));
    
    // Extract content WITH LINKS PRESERVED
    const descriptionText = extractTextFromADFWithLinks(fields.description) || '';
    const links = extractLinksFromADF(fields.description);
    
    // Build content for embedding (includes links)
    let content = `${issue.key}: ${fields.summary}\n\n${descriptionText}`;
    
    // Add links section if any exist
    if (links.length > 0) {
      content += '\n\nLinks:\n' + links.map(link => `- ${link}`).join('\n');
    }
    
    console.log('\n📝 Extracted content with links:');
    console.log(content);
    
    if (links.length > 0) {
      console.log('\n🔗 Extracted links:');
      links.forEach(link => console.log(`  - ${link}`));
    }
    
    // Generate embedding
    console.log('\n🧮 Generating embedding...');
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
      isUrgent: fields.priority.name === 'Highest' || fields.priority.name === 'Critical',
      hasLinks: links.length > 0 // Add boolean flag for filtering
    };
    
    // Index with minimal metadata
    console.log('\n📝 Indexing with minimal metadata...');
    await index.namespace('jira-tickets').upsert([{
      id: `jira_ticket_${issue.key}`,
      values: embedding,
      metadata: minimalMetadata
    }]);
    
    console.log('\n✅ Re-indexed with optimized metadata + links in content!');
    
    // Show storage breakdown
    console.log('\n📊 Storage Breakdown:');
    console.log('\nPinecone metadata (minimal):');
    console.log(JSON.stringify(minimalMetadata, null, 2));
    console.log(`Metadata size: ${JSON.stringify(minimalMetadata).length} bytes`);
    
    console.log('\nVector content (for search):');
    console.log(`- Includes title, description, and ${links.length} links`);
    console.log(`- Content length: ${content.length} characters`);
    
    console.log('\nDocument store would contain:');
    const documentData = {
      id: `jira_ticket_${issue.key}`,
      title: `${issue.key}: ${fields.summary}`,
      content: descriptionText,
      url: `${process.env.JIRA_HOST}/browse/${issue.key}`,
      author: {
        id: fields.reporter.accountId,
        name: fields.reporter.displayName,
        email: fields.reporter.emailAddress
      },
      links: links,
      rawDescription: fields.description // Store raw ADF for future processing
    };
    console.log(`- Full data size: ${JSON.stringify(documentData).length} bytes`);
    console.log(`- Links stored separately: ${links.length} links`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Extract text from ADF preserving links
function extractTextFromADFWithLinks(adf: any): string {
  if (!adf) return '';
  if (typeof adf === 'string') return adf;
  
  if (adf.type === 'doc' && adf.content) {
    return extractTextFromADFContentWithLinks(adf.content);
  }
  
  return '';
}

function extractTextFromADFContentWithLinks(content: any[]): string {
  if (!Array.isArray(content)) return '';
  
  return content.map(node => {
    if (node.type === 'text') {
      let text = node.text || '';
      
      // Check for link marks
      if (node.marks && Array.isArray(node.marks)) {
        const linkMark = node.marks.find((mark: any) => mark.type === 'link');
        if (linkMark && linkMark.attrs && linkMark.attrs.href) {
          // Include both the text and the URL
          text = `${text} (${linkMark.attrs.href})`;
        }
      }
      
      return text;
    } else if (node.type === 'paragraph' && node.content) {
      return extractTextFromADFContentWithLinks(node.content);
    } else if (node.type === 'mention' && node.attrs) {
      return `@${node.attrs.text || node.attrs.displayName || ''}`;
    } else if (node.type === 'inlineCard' && node.attrs) {
      // Handle inline cards (like Confluence links)
      return `[${node.attrs.url || 'link'}]`;
    } else if (node.type === 'blockCard' && node.attrs) {
      // Handle block cards (like embedded links)
      return `[${node.attrs.url || 'link'}]`;
    } else if (node.type === 'mediaGroup' && node.content) {
      // Handle media/attachments
      return '[attachment]';
    } else if (node.type === 'media' && node.attrs) {
      // Handle individual media items
      const filename = node.attrs.filename || node.attrs.id || 'media';
      return `[${filename}]`;
    } else if (node.type === 'codeBlock' && node.content) {
      // Preserve code blocks
      const codeText = extractTextFromADFContentWithLinks(node.content);
      return `\`\`\`\n${codeText}\n\`\`\``;
    } else if (node.type === 'bulletList' || node.type === 'orderedList') {
      if (node.content) {
        return extractTextFromADFContentWithLinks(node.content);
      }
    } else if (node.type === 'listItem' && node.content) {
      return '• ' + extractTextFromADFContentWithLinks(node.content);
    } else if (node.type === 'heading' && node.content) {
      const level = node.attrs?.level || 1;
      const prefix = '#'.repeat(level) + ' ';
      return prefix + extractTextFromADFContentWithLinks(node.content);
    } else if (node.type === 'table' && node.content) {
      return '[table content]\n' + extractTextFromADFContentWithLinks(node.content);
    } else if (node.type === 'tableRow' && node.content) {
      return extractTextFromADFContentWithLinks(node.content) + '\n';
    } else if (node.type === 'tableCell' && node.content) {
      return extractTextFromADFContentWithLinks(node.content) + ' | ';
    } else if (node.type === 'panel' && node.content) {
      const panelType = node.attrs?.panelType || 'info';
      return `[${panelType} panel] ` + extractTextFromADFContentWithLinks(node.content);
    } else if (node.content) {
      // Fallback for any other node with content
      return extractTextFromADFContentWithLinks(node.content);
    }
    
    return '';
  }).join(' ').replace(/\s+/g, ' ').trim();
}

// Extract all links from ADF
function extractLinksFromADF(adf: any): string[] {
  const links: string[] = [];
  
  const extractFromNodes = (nodes: any[]) => {
    if (!Array.isArray(nodes)) return;
    
    nodes.forEach(node => {
      // Check text nodes for link marks
      if (node.type === 'text' && node.marks) {
        const linkMark = node.marks.find((mark: any) => mark.type === 'link');
        if (linkMark?.attrs?.href) {
          links.push(linkMark.attrs.href);
        }
      }
      
      // Check inline/block cards
      if ((node.type === 'inlineCard' || node.type === 'blockCard') && node.attrs?.url) {
        links.push(node.attrs.url);
      }
      
      // Recursively check child nodes
      if (node.content) {
        extractFromNodes(node.content);
      }
    });
  };
  
  if (adf?.type === 'doc' && adf.content) {
    extractFromNodes(adf.content);
  }
  
  return [...new Set(links)]; // Return unique links
}

// Run the script
reindexOptimizedWithLinks()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });