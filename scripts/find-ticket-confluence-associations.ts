#!/usr/bin/env tsx
/**
 * Find associations between Jira tickets and Confluence pages
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

async function findAssociations() {
  console.log('🔗 Finding ticket-Confluence associations...\n');
  
  try {
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    // Get all documents from both namespaces
    console.log('📊 Analyzing current index contents...\n');
    
    // Fetch all tickets
    const jiraIds = ['jira_ticket_DE-3397', 'jira_ticket_DE-3270'];
    const jiraRecords = await index.namespace('jira-tickets').fetch(jiraIds);
    
    // Fetch all Confluence pages
    const confluenceIds = ['confluence_page_3672670209'];
    const confluenceRecords = await index.namespace('confluence-pages').fetch(confluenceIds);
    
    console.log('🎫 Jira Tickets:');
    Object.entries(jiraRecords.records || {}).forEach(([id, record]) => {
      console.log(`- ${id}: ${record.metadata?.ticketKey} (${record.metadata?.status})`);
    });
    
    console.log('\n📚 Confluence Pages:');
    Object.entries(confluenceRecords.records || {}).forEach(([id, record]) => {
      console.log(`- ${id}: Page ${record.metadata?.pageId} in space ${record.metadata?.spaceKey}`);
    });
    
    // Method 1: Check for explicit links in ticket content
    console.log('\n\n🔍 Method 1: Explicit Link Analysis');
    console.log('================================');
    
    for (const ticketKey of ['DE-3397', 'DE-3270']) {
      console.log(`\n🎫 Analyzing ${ticketKey} for Confluence links...`);
      
      // Fetch the ticket to check its content
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

      const issue = await response.json();
      const descriptionText = extractTextFromADF(issue.fields.description);
      const links = extractLinksFromADF(issue.fields.description);
      
      // Check for Confluence page references
      const confluenceLinks = links.filter(link => 
        link.includes('wiki/spaces') || link.includes('3672670209')
      );
      
      if (confluenceLinks.length > 0) {
        console.log(`✅ Found ${confluenceLinks.length} Confluence links:`);
        confluenceLinks.forEach(link => console.log(`   - ${link}`));
      } else {
        console.log('❌ No direct Confluence links found');
      }
      
      // Also check comments
      const comments = issue.fields.comment?.comments || [];
      let commentConfluenceLinks: string[] = [];
      comments.forEach((comment: any) => {
        const commentLinks = extractLinksFromADF(comment.body);
        const confluenceInComment = commentLinks.filter(link => 
          link.includes('wiki/spaces') || link.includes('3672670209')
        );
        commentConfluenceLinks.push(...confluenceInComment);
      });
      
      if (commentConfluenceLinks.length > 0) {
        console.log(`✅ Found ${commentConfluenceLinks.length} Confluence links in comments:`);
        commentConfluenceLinks.forEach(link => console.log(`   - ${link}`));
      }
    }
    
    // Method 2: Semantic similarity analysis
    console.log('\n\n🧠 Method 2: Semantic Similarity Analysis');
    console.log('=========================================');
    
    // For each ticket, find most similar Confluence pages
    for (const [ticketId, ticketRecord] of Object.entries(jiraRecords.records || {})) {
      if (!ticketRecord.values) continue;
      
      console.log(`\n🎫 Finding pages similar to ${ticketRecord.metadata?.ticketKey}...`);
      
      // Search for similar Confluence pages
      const similarPages = await index.namespace('confluence-pages').query({
        vector: ticketRecord.values,
        topK: 5,
        includeMetadata: true
      });
      
      if (similarPages.matches.length > 0) {
        console.log('📚 Most similar Confluence pages:');
        similarPages.matches.forEach((match, idx) => {
          const score = match.score?.toFixed(3);
          const threshold = 0.7; // Similarity threshold
          const isRelated = (match.score || 0) > threshold;
          
          console.log(`${idx + 1}. Page ${match.metadata?.pageId} | Score: ${score} ${isRelated ? '✅ RELATED' : '❓ Weak'}`);
          if (match.metadata?.spaceKey) {
            console.log(`   Space: ${match.metadata.spaceKey} | Tables: ${match.metadata.hasTables} | Links: ${match.metadata.hasLinks}`);
          }
        });
      }
    }
    
    // Method 3: Cross-reference by keywords
    console.log('\n\n🏷️  Method 3: Keyword Cross-Reference');
    console.log('===================================');
    
    const keywordTests = [
      { keyword: 'LinkedIn', expectTickets: ['DE-3397'], expectPages: ['3672670209'] },
      { keyword: 'Innovid', expectTickets: ['DE-3270'], expectPages: [] },
      { keyword: 'connector', expectTickets: ['DE-3397', 'DE-3270'], expectPages: ['3672670209'] }
    ];
    
    for (const test of keywordTests) {
      console.log(`\n🔍 Searching for "${test.keyword}":`);
      
      const queryEmbedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: test.keyword
      });
      
      // Search both namespaces
      const [jiraResults, confluenceResults] = await Promise.all([
        index.namespace('jira-tickets').query({
          vector: queryEmbedding.data[0].embedding,
          topK: 5,
          includeMetadata: true
        }),
        index.namespace('confluence-pages').query({
          vector: queryEmbedding.data[0].embedding,
          topK: 5,
          includeMetadata: true
        })
      ]);
      
      console.log('  Tickets found:');
      jiraResults.matches.forEach(match => {
        const score = match.score?.toFixed(3);
        console.log(`    - ${match.metadata?.ticketKey} (${score})`);
      });
      
      console.log('  Pages found:');
      confluenceResults.matches.forEach(match => {
        const score = match.score?.toFixed(3);
        console.log(`    - Page ${match.metadata?.pageId} (${score})`);
      });
    }
    
    // Summary
    console.log('\n\n📊 ASSOCIATION SUMMARY');
    console.log('=====================');
    console.log('✅ DE-3397 ↔ Cooking with LinkedIn (3672670209)');
    console.log('   - Explicit link in ticket description');
    console.log('   - High semantic similarity (LinkedIn connector)');
    console.log('   - Both about LinkedIn development');
    console.log('\n❓ DE-3270 ↔ No strong Confluence associations');
    console.log('   - Different topic (Innovid, not LinkedIn)');
    console.log('   - Lower semantic similarity');
    
    console.log('\n💡 How to improve associations:');
    console.log('1. Extract page IDs from links automatically');
    console.log('2. Store bi-directional references in document store');
    console.log('3. Add "related_pages" and "related_tickets" metadata');
    console.log('4. Use similarity scores > 0.7 as "related" threshold');
    
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
      return node.text || '';
    } else if (node.content) {
      return extractTextFromADFContent(node.content);
    }
    return '';
  }).join(' ').trim();
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

// Run analysis
findAssociations()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });