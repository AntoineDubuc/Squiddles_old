#!/usr/bin/env tsx
/**
 * Re-index tickets WITH comments included in the embedding
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

async function reindexWithComments() {
  console.log('🔄 Re-indexing tickets with comments included...\n');
  
  try {
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    // Delete old versions
    console.log('🗑️  Deleting old versions...');
    await index.namespace('jira-tickets').deleteMany(['jira_ticket_DE-3397', 'jira_ticket_DE-3270']);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Process both tickets
    const tickets = ['DE-3397', 'DE-3270'];
    
    for (const ticketKey of tickets) {
      console.log(`\n🎫 Processing ${ticketKey}...`);
      
      const response = await fetch(
        `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/issue/${ticketKey}?expand=renderedFields,comments`,
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
      const comments = fields.comment?.comments || [];
      
      // Extract ticket content
      const descriptionText = extractTextFromADFWithLinks(fields.description) || '';
      const links = extractLinksFromADF(fields.description);
      
      // Build content including ticket AND comments
      let content = `${issue.key}: ${fields.summary}\n\n${descriptionText}`;
      
      // Add links
      if (links.length > 0) {
        content += '\n\nLinks:\n' + links.map(link => `- ${link}`).join('\n');
      }
      
      // Add comments
      if (comments.length > 0) {
        content += '\n\n--- Comments ---\n';
        comments.forEach((comment: any, idx: number) => {
          const commentText = extractTextFromADFWithLinks(comment.body);
          const commentLinks = extractLinksFromADF(comment.body);
          
          content += `\nComment ${idx + 1} by ${comment.author.displayName} (${new Date(comment.created).toLocaleDateString()}):\n`;
          content += commentText;
          
          if (commentLinks.length > 0) {
            content += '\nLinks in comment: ' + commentLinks.join(', ');
          }
          content += '\n';
        });
      }
      
      console.log(`📝 Content length: ${content.length} characters`);
      console.log(`💬 Comments included: ${comments.length}`);
      
      // Generate embedding
      console.log('🧮 Generating embedding...');
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: content
      });
      const embedding = embeddingResponse.data[0].embedding;
      
      // Extract all unique author IDs
      const authorIds = new Set([fields.reporter.accountId]);
      if (fields.assignee) authorIds.add(fields.assignee.accountId);
      comments.forEach((c: any) => authorIds.add(c.author.accountId));
      
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
        hasAttachments: !!(fields.attachment && fields.attachment.length > 0),
        hasComments: comments.length > 0,
        commentCount: comments.length,
        participantIds: Array.from(authorIds).slice(0, 5) // Limit to 5 participants
      };
      
      // Index with comments included
      console.log('📝 Indexing with comments...');
      await index.namespace('jira-tickets').upsert([{
        id: `jira_ticket_${issue.key}`,
        values: embedding,
        metadata: minimalMetadata
      }]);
      
      console.log(`✅ Indexed ${ticketKey} with ${comments.length} comments`);
    }
    
    console.log('\n\n📊 Summary:');
    console.log('✅ Both tickets now include comments in their embeddings');
    console.log('✅ Comments are searchable as part of the ticket content');
    console.log('✅ Metadata includes comment count and participant IDs');
    console.log('\n💡 Benefits:');
    console.log('- Full conversation context in search');
    console.log('- Can find tickets by comment content');
    console.log('- Preserves solutions/decisions in comments');
    
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
      
      if (node.marks && Array.isArray(node.marks)) {
        const linkMark = node.marks.find((mark: any) => mark.type === 'link');
        if (linkMark && linkMark.attrs && linkMark.attrs.href) {
          text = `${text} (${linkMark.attrs.href})`;
        }
      }
      
      return text;
    } else if (node.type === 'paragraph' && node.content) {
      return extractTextFromADFContentWithLinks(node.content);
    } else if (node.type === 'mention' && node.attrs) {
      return `@${node.attrs.text || node.attrs.displayName || ''}`;
    } else if (node.type === 'inlineCard' && node.attrs) {
      return `[${node.attrs.url || 'link'}]`;
    } else if (node.type === 'blockCard' && node.attrs) {
      return `[${node.attrs.url || 'link'}]`;
    } else if (node.content) {
      return extractTextFromADFContentWithLinks(node.content);
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

// Run
reindexWithComments()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });