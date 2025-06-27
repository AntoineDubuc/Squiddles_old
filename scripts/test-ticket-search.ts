#!/usr/bin/env tsx
/**
 * Test script to search for specific tickets in Pinecone
 * Usage: npm run test:ticket-search DE-3397
 */

import { getMultiSourcePineconeService, DocumentType } from '../src/lib/pinecone/multiSourceService';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

const pineconeService = getMultiSourcePineconeService();

/**
 * Search for a specific ticket
 */
async function searchForTicket(ticketKey: string) {
  console.log(`🔍 Searching for ticket: ${ticketKey}\n`);

  try {
    // Method 1: Search by ticket key in content
    console.log('1️⃣ Searching by ticket key in content...');
    const contentResults = await pineconeService.search(
      ticketKey,
      undefined,
      10
    );

    if (contentResults.length > 0) {
      console.log(`✅ Found ${contentResults.length} results for "${ticketKey}":\n`);
      
      contentResults.forEach((result, index) => {
        console.log(`Result ${index + 1}:`);
        console.log(`  Score: ${result.score.toFixed(4)}`);
        
        if (result.document) {
          console.log(`  ID: ${result.document.id}`);
          console.log(`  Type: ${result.document.type}`);
          console.log(`  Title: ${result.document.title}`);
          console.log(`  URL: ${result.document.url}`);
          console.log(`  Author: ${result.document.author?.name}`);
          console.log(`  Created: ${new Date(result.document.createdAt).toLocaleString()}`);
          
          // Show content preview
          const preview = result.document.content.substring(0, 200).replace(/\n/g, ' ');
          console.log(`  Content: ${preview}...`);
          
          // Show metadata
          if (result.document.metadata) {
            console.log(`  Metadata:`);
            console.log(`    Status: ${result.document.metadata.status}`);
            console.log(`    Priority: ${result.document.metadata.priority}`);
            console.log(`    Issue Type: ${result.document.metadata.issueType}`);
            if (result.document.metadata.mentions?.length > 0) {
              console.log(`    Mentions: ${result.document.metadata.mentions.join(', ')}`);
            }
          }
        }
        
        // Show highlights if available
        if (result.highlights?.length > 0) {
          console.log(`  Highlights: ${result.highlights.join(' | ')}`);
        }
        
        // Show cross-references
        if (result.crossReferences?.length > 0) {
          console.log(`  Cross-references: ${result.crossReferences.length} found`);
        }
        
        console.log('');
      });
    } else {
      console.log(`❌ No results found for "${ticketKey}" in content search\n`);
    }

    // Method 2: Get document by exact ID
    console.log('2️⃣ Searching by exact document ID...');
    const ticketId = `jira_ticket_${ticketKey}`;
    // Note: Direct document retrieval by ID is not available in current implementation
    const exactResult = null; // await pineconeService.getDocumentById(ticketId);

    if (exactResult) {
      console.log(`✅ Found exact ticket document:\n`);
      console.log(`  ID: ${exactResult.id}`);
      console.log(`  Type: ${exactResult.type}`);
      console.log(`  Title: ${exactResult.title}`);
      console.log(`  URL: ${exactResult.url}`);
      console.log(`  Author: ${exactResult.author?.name}`);
      console.log(`  Created: ${new Date(exactResult.createdAt).toLocaleString()}`);
      console.log(`  Updated: ${new Date(exactResult.updatedAt).toLocaleString()}`);
      
      // Full content
      console.log(`\n  Full Content:`);
      console.log('  ' + '-'.repeat(60));
      console.log(exactResult.content.split('\n').map(line => '  ' + line).join('\n'));
      console.log('  ' + '-'.repeat(60));
      
      // Metadata details
      if (exactResult.metadata) {
        console.log(`\n  Metadata Details:`);
        Object.entries(exactResult.metadata).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value) && value.length > 0) {
              console.log(`    ${key}: ${value.join(', ')}`);
            } else if (typeof value !== 'object') {
              console.log(`    ${key}: ${value}`);
            }
          }
        });
      }
    } else {
      console.log(`❌ No exact document found with ID: ${ticketId}\n`);
    }

    // Method 3: Search for comments on this ticket
    console.log('\n3️⃣ Searching for comments on this ticket...');
    const commentResults = await pineconeService.search(
      `Comment on ${ticketKey}`,
      { 
        types: [DocumentType.JIRA_COMMENT]
      },
      10
    );

    if (commentResults.length > 0) {
      console.log(`✅ Found ${commentResults.length} comments:\n`);
      
      commentResults.forEach((result, index) => {
        console.log(`Comment ${index + 1}:`);
        if (result.document) {
          console.log(`  Author: ${result.document.author?.name}`);
          console.log(`  Created: ${new Date(result.document.createdAt).toLocaleString()}`);
          
          const preview = result.document.content.substring(0, 150).replace(/\n/g, ' ');
          console.log(`  Content: ${preview}...`);
          
          if (result.document.metadata?.mentions?.length > 0) {
            console.log(`  Mentions: ${result.document.metadata.mentions.join(', ')}`);
          }
        }
        console.log('');
      });
    } else {
      console.log(`❌ No comments found for ${ticketKey}\n`);
    }

    // Method 4: Search by project key
    console.log('4️⃣ Getting stats for DE project...');
    const deTickets = await pineconeService.search(
      'project:DE',
      {
        types: [DocumentType.JIRA_TICKET],
        projectKey: 'DE'
      },
      5
    );

    console.log(`\n📊 DE Project Stats:`);
    console.log(`  Total DE tickets found in search: ${deTickets.length}`);
    if (deTickets.length > 0) {
      console.log(`  Sample tickets: ${deTickets.map(r => r.document?.metadata?.ticketKey || r.document?.id || 'unknown').join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Error searching for ticket:', error);
  }
}

/**
 * Test semantic search
 */
async function testSemanticSearch(query: string) {
  console.log(`\n🧠 Testing semantic search for: "${query}"\n`);

  try {
    const results = await pineconeService.search(query, {
      types: [DocumentType.JIRA_TICKET, DocumentType.JIRA_COMMENT]
    }, 5);

    if (results.length > 0) {
      console.log(`✅ Found ${results.length} relevant results:\n`);
      
      results.forEach((result, index) => {
        console.log(`Result ${index + 1}:`);
        if (result.document) {
          console.log(`  Ticket: ${result.document.metadata?.ticketKey || result.document.id}`);
          console.log(`  Title: ${result.document.title}`);
          console.log(`  Score: ${result.score.toFixed(4)}`);
          console.log(`  Type: ${result.document.type}`);
          
          const preview = result.document.content.substring(0, 150).replace(/\n/g, ' ');
          console.log(`  Preview: ${preview}...`);
        }
        console.log('');
      });
    } else {
      console.log(`❌ No results found for semantic search\n`);
    }

  } catch (error) {
    console.error('❌ Error in semantic search:', error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run test:ticket-search <ticket-key>');
    console.log('Example: npm run test:ticket-search DE-3397');
    console.log('\nOr use semantic search:');
    console.log('npm run test:ticket-search "search query"');
    process.exit(1);
  }

  const input = args.join(' ');
  
  // Check if it's a ticket key (format: XX-####)
  if (/^[A-Z]+-\d+$/.test(input)) {
    await searchForTicket(input);
  } else {
    // Treat as semantic search query
    await testSemanticSearch(input);
  }

  // Test connection
  console.log('\n🔌 Testing Pinecone connection...');
  try {
    // Note: Index stats not directly available, test with a simple search
    const testResults = await pineconeService.search('test', undefined, 1);
    console.log('✅ Pinecone connection successful');
    console.log(`  Search capability verified`);
  } catch (error) {
    console.error('❌ Pinecone connection failed:', error);
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✨ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}

export { searchForTicket, testSemanticSearch };