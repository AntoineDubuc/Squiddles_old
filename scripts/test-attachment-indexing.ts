#!/usr/bin/env tsx
/**
 * Test indexing DE-3270 to see how attachments are handled
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

async function testAttachmentIndexing() {
  console.log('🧪 Testing attachment handling with DE-3270...\n');
  
  try {
    // Initialize clients
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    // Fetch the ticket
    console.log('🎫 Fetching DE-3270...');
    const response = await fetch(
      `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/issue/DE-3270?expand=renderedFields`,
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
    
    // Check for attachments
    console.log('\n📎 Attachment Analysis:');
    if (fields.attachment && fields.attachment.length > 0) {
      console.log(`Found ${fields.attachment.length} attachments:`);
      fields.attachment.forEach((att: any, idx: number) => {
        console.log(`\n${idx + 1}. ${att.filename}`);
        console.log(`   - ID: ${att.id}`);
        console.log(`   - Size: ${(att.size / 1024).toFixed(2)} KB`);
        console.log(`   - MIME Type: ${att.mimeType}`);
        console.log(`   - Created: ${new Date(att.created).toLocaleDateString()}`);
        console.log(`   - Author: ${att.author.displayName}`);
        console.log(`   - URL: ${att.content}`);
      });
    } else {
      console.log('No attachments found on this ticket.');
    }
    
    // Log raw ADF to see if attachments are referenced
    console.log('\n📄 Checking description for attachment references...');
    const descriptionStr = JSON.stringify(fields.description);
    const hasMediaGroup = descriptionStr.includes('mediaGroup');
    const hasMedia = descriptionStr.includes('"type":"media"');
    console.log(`Has mediaGroup nodes: ${hasMediaGroup}`);
    console.log(`Has media nodes: ${hasMedia}`);
    
    // Extract content with attachments preserved
    const descriptionText = extractTextFromADFWithAttachments(fields.description) || '';
    const links = extractLinksFromADF(fields.description);
    const attachmentRefs = extractAttachmentReferences(fields.description);
    
    // Build content for embedding
    let content = `${issue.key}: ${fields.summary}\n\n${descriptionText}`;
    
    if (links.length > 0) {
      content += '\n\nLinks:\n' + links.map(link => `- ${link}`).join('\n');
    }
    
    if (attachmentRefs.length > 0) {
      content += '\n\nAttachments referenced in description:\n' + attachmentRefs.map(ref => `- ${ref}`).join('\n');
    }
    
    if (fields.attachment && fields.attachment.length > 0) {
      content += '\n\nAttachments:\n' + fields.attachment.map((att: any) => `- ${att.filename} (${att.mimeType})`).join('\n');
    }
    
    console.log('\n📝 Extracted content with attachments:');
    console.log(content);
    
    // Generate embedding
    console.log('\n🧮 Generating embedding...');
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: content
    });
    const embedding = embeddingResponse.data[0].embedding;
    
    // Create minimal metadata
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
      hasLinks: links.length > 0,
      hasAttachments: !!(fields.attachment && fields.attachment.length > 0)
    };
    
    // Index with minimal metadata
    console.log('\n📝 Indexing with minimal metadata...');
    await index.namespace('jira-tickets').upsert([{
      id: `jira_ticket_${issue.key}`,
      values: embedding,
      metadata: minimalMetadata
    }]);
    
    console.log('\n✅ Indexed DE-3270!');
    
    // Show storage breakdown
    console.log('\n📊 Storage Breakdown:');
    console.log('\nPinecone metadata (minimal):');
    console.log(JSON.stringify(minimalMetadata, null, 2));
    console.log(`Metadata size: ${JSON.stringify(minimalMetadata).length} bytes`);
    
    console.log('\n🗄️ Document store would contain:');
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
      attachments: fields.attachment?.map((att: any) => ({
        id: att.id,
        filename: att.filename,
        mimeType: att.mimeType,
        size: att.size,
        url: att.content,
        created: att.created,
        author: att.author.displayName
      }))
    };
    
    console.log(`- Title: ${documentData.title}`);
    console.log(`- Links: ${documentData.links.length}`);
    console.log(`- Attachments: ${documentData.attachments?.length || 0}`);
    console.log(`- Full data size: ${JSON.stringify(documentData).length} bytes`);
    
    console.log('\n💡 Attachment Storage Strategy:');
    console.log('1. Attachment metadata stored in document store');
    console.log('2. Attachment filenames included in searchable content');
    console.log('3. hasAttachments flag in Pinecone for filtering');
    console.log('4. Actual files would be:');
    console.log('   - Downloaded from Jira using attachment URLs');
    console.log('   - Uploaded to S3 bucket');
    console.log('   - S3 URLs stored in document store');
    
    if (fields.attachment && fields.attachment.length > 0) {
      console.log('\n📥 S3 Upload Plan:');
      fields.attachment.forEach((att: any) => {
        const s3Key = `jira/${issue.key}/${att.id}_${att.filename}`;
        console.log(`- ${att.filename} → s3://squiddles-attachments/${s3Key}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Extract text preserving attachment references
function extractTextFromADFWithAttachments(adf: any): string {
  if (!adf) return '';
  if (typeof adf === 'string') return adf;
  
  if (adf.type === 'doc' && adf.content) {
    return extractTextFromADFContentWithAttachments(adf.content);
  }
  
  return '';
}

function extractTextFromADFContentWithAttachments(content: any[]): string {
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
    } else if (node.type === 'mediaGroup' && node.content) {
      // Handle media group (attachments)
      const mediaItems = node.content
        .filter((n: any) => n.type === 'media')
        .map((media: any) => {
          const filename = media.attrs?.filename || media.attrs?.id || 'attachment';
          return `[Attachment: ${filename}]`;
        });
      return mediaItems.join(' ');
    } else if (node.type === 'media' && node.attrs) {
      // Handle individual media items
      const filename = node.attrs.filename || node.attrs.id || 'media';
      return `[Attachment: ${filename}]`;
    } else if (node.type === 'paragraph' && node.content) {
      return extractTextFromADFContentWithAttachments(node.content);
    } else if (node.type === 'mention' && node.attrs) {
      return `@${node.attrs.text || node.attrs.displayName || ''}`;
    } else if (node.type === 'inlineCard' && node.attrs) {
      return `[${node.attrs.url || 'link'}]`;
    } else if (node.type === 'blockCard' && node.attrs) {
      return `[${node.attrs.url || 'link'}]`;
    } else if (node.content) {
      return extractTextFromADFContentWithAttachments(node.content);
    }
    
    return '';
  }).join(' ').replace(/\s+/g, ' ').trim();
}

// Extract links from ADF
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

// Extract attachment references from ADF
function extractAttachmentReferences(adf: any): string[] {
  const attachments: string[] = [];
  
  const extractFromNodes = (nodes: any[]) => {
    if (!Array.isArray(nodes)) return;
    
    nodes.forEach(node => {
      if (node.type === 'media' && node.attrs) {
        const filename = node.attrs.filename || node.attrs.id || 'unknown';
        attachments.push(filename);
      } else if (node.type === 'mediaGroup' && node.content) {
        extractFromNodes(node.content);
      } else if (node.content) {
        extractFromNodes(node.content);
      }
    });
  };
  
  if (adf?.type === 'doc' && adf.content) {
    extractFromNodes(adf.content);
  }
  
  return [...new Set(attachments)];
}

// Run the test
testAttachmentIndexing()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });