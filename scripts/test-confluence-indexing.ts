#!/usr/bin/env tsx
/**
 * Test indexing a Confluence page with optimized metadata
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

async function testConfluenceIndexing() {
  console.log('📚 Testing Confluence page indexing...\n');
  
  try {
    // Initialize clients
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    // Extract page ID from URL
    const pageUrl = 'https://extendtv.atlassian.net/wiki/spaces/DE/pages/3672670209/Cooking+with+LinkedIn';
    const pageId = '3672670209';
    const spaceKey = 'DE';
    
    console.log(`📄 Fetching Confluence page ${pageId}...`);
    
    // Fetch the page content
    const response = await fetch(
      `${process.env.CONFLUENCE_HOST || process.env.CONFLUENCE_BASE_URL}/wiki/rest/api/content/${pageId}?expand=body.storage,version,space,ancestors`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.CONFLUENCE_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.CONFLUENCE_API_TOKEN || process.env.JIRA_API_TOKEN}`
          ).toString('base64')}`,
          'Accept': 'application/json',
        },
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get page: ${response.status} - ${errorText}`);
    }

    const page = await response.json();
    
    console.log('\n📊 Page Details:');
    console.log(`- Title: ${page.title}`);
    console.log(`- Space: ${page.space.name} (${page.space.key})`);
    console.log(`- Version: ${page.version.number}`);
    console.log(`- Created: ${new Date(page.version.when).toLocaleDateString()}`);
    console.log(`- Author: ${page.version.by.displayName}`);
    console.log(`- Type: ${page.type}`);
    
    // Extract content from storage format (HTML)
    const htmlContent = page.body.storage.value;
    console.log(`\n📝 Raw HTML length: ${htmlContent.length} characters`);
    
    // Convert HTML to text (simple approach - in production use a proper HTML parser)
    const textContent = extractTextFromHTML(htmlContent);
    console.log(`📝 Extracted text length: ${textContent.length} characters`);
    
    // Extract links from HTML
    const links = extractLinksFromHTML(htmlContent);
    console.log(`\n🔗 Found ${links.length} links:`);
    links.slice(0, 5).forEach(link => console.log(`  - ${link}`));
    if (links.length > 5) console.log(`  ... and ${links.length - 5} more`);
    
    // Check for attachments
    const hasAttachments = htmlContent.includes('ri:attachment') || htmlContent.includes('ac:image');
    const hasCode = htmlContent.includes('ac:structured-macro-id') && htmlContent.includes('code');
    const hasTables = htmlContent.includes('<table') || htmlContent.includes('ac:structured-macro-id') && htmlContent.includes('table');
    
    console.log('\n🎯 Content Features:');
    console.log(`- Has attachments/images: ${hasAttachments}`);
    console.log(`- Has code blocks: ${hasCode}`);
    console.log(`- Has tables: ${hasTables}`);
    
    // Build searchable content
    let content = `${page.title}\n\n${textContent}`;
    
    // Add links section
    if (links.length > 0) {
      content += '\n\nLinks:\n' + links.slice(0, 20).map(link => `- ${link}`).join('\n');
    }
    
    // Add breadcrumb for context
    if (page.ancestors && page.ancestors.length > 0) {
      const breadcrumb = page.ancestors.map((a: any) => a.title).join(' > ');
      content = `${breadcrumb} > ${content}`;
    }
    
    console.log('\n🧮 Generating embedding...');
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: content.substring(0, 8000) // Limit content length
    });
    const embedding = embeddingResponse.data[0].embedding;
    
    // Create minimal metadata for Confluence
    const minimalMetadata = {
      type: 'confluence_page',
      source: 'confluence',
      spaceKey: page.space.key,
      pageId: pageId,
      authorId: page.version.by.accountId || page.version.by.userKey,
      createdAt: new Date(page.version.when).getTime(),
      updatedAt: new Date(page.version.when).getTime(),
      version: page.version.number,
      hasAttachments: hasAttachments,
      hasCode: hasCode,
      hasTables: hasTables,
      hasLinks: links.length > 0
    };
    
    console.log('\n📝 Indexing with minimal metadata...');
    await index.namespace('confluence-pages').upsert([{
      id: `confluence_page_${pageId}`,
      values: embedding,
      metadata: minimalMetadata
    }]);
    
    console.log('\n✅ Indexed Confluence page!');
    
    // Show storage breakdown
    console.log('\n📊 Storage Breakdown:');
    console.log('\nPinecone metadata (minimal):');
    console.log(JSON.stringify(minimalMetadata, null, 2));
    console.log(`Metadata size: ${JSON.stringify(minimalMetadata).length} bytes`);
    
    console.log('\n🗄️ Document store would contain:');
    const documentData = {
      id: `confluence_page_${pageId}`,
      title: page.title,
      content: textContent,
      htmlContent: htmlContent, // Store original for re-processing
      url: pageUrl,
      space: {
        key: page.space.key,
        name: page.space.name
      },
      author: {
        id: page.version.by.accountId || page.version.by.userKey,
        name: page.version.by.displayName,
        email: page.version.by.email
      },
      ancestors: page.ancestors,
      version: {
        number: page.version.number,
        when: page.version.when,
        message: page.version.message
      },
      links: links
    };
    
    console.log(`- Title: ${documentData.title}`);
    console.log(`- Space: ${documentData.space.name}`);
    console.log(`- Links: ${documentData.links.length}`);
    console.log(`- Full data size: ${JSON.stringify(documentData).length} bytes`);
    
    console.log('\n💡 Confluence Integration Benefits:');
    console.log('- Documentation is searchable alongside tickets');
    console.log('- Can find pages by content, code examples, links');
    console.log('- Cross-reference between tickets and docs');
    console.log('- Filter by space, author, content features');
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('401')) {
      console.error('\n🔑 Authentication failed. Check your Confluence credentials:');
      console.error('CONFLUENCE_HOST=' + (process.env.CONFLUENCE_HOST ? '✓ Set' : '✗ Missing'));
      console.error('CONFLUENCE_EMAIL=' + (process.env.CONFLUENCE_EMAIL ? '✓ Set' : '✗ Missing')); 
      console.error('CONFLUENCE_API_TOKEN=' + (process.env.CONFLUENCE_API_TOKEN ? '✓ Set' : '✗ Missing'));
    }
    
    process.exit(1);
  }
}

// Simple HTML to text extraction
function extractTextFromHTML(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Replace common tags with appropriate text
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n\n');
  text = text.replace(/<li>/gi, '\n• ');
  
  // Handle code blocks
  text = text.replace(/<ac:plain-text-body><!\[CDATA\[(.*?)\]\]><\/ac:plain-text-body>/gs, (match, code) => {
    return '\n```\n' + code + '\n```\n';
  });
  
  // Remove remaining tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\n\s+/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
}

// Extract links from HTML
function extractLinksFromHTML(html: string): string[] {
  const links: string[] = [];
  
  // Extract href attributes
  const hrefMatches = html.match(/href="([^"]+)"/g) || [];
  hrefMatches.forEach(match => {
    const url = match.replace(/href="/, '').replace(/"/, '');
    if (url && !url.startsWith('#') && !url.startsWith('javascript:')) {
      links.push(url);
    }
  });
  
  // Extract Confluence page links
  const pageLinks = html.match(/\/wiki\/spaces\/[A-Z]+\/pages\/\d+/g) || [];
  links.push(...pageLinks);
  
  // Extract ri:page links (internal Confluence references)
  const riPageMatches = html.match(/ri:content-title="([^"]+)"/g) || [];
  riPageMatches.forEach(match => {
    const title = match.replace(/ri:content-title="/, '').replace(/"/, '');
    links.push(`[Internal: ${title}]`);
  });
  
  return [...new Set(links)];
}

// Run test
testConfluenceIndexing()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });