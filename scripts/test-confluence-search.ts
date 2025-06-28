#!/usr/bin/env tsx
/**
 * Test searching the indexed Confluence page
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

async function testConfluenceSearch() {
  console.log('🔍 Testing search on indexed Confluence page...\n');
  
  try {
    const pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY! 
    });
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    const index = pc.index(process.env.PINECONE_INDEX_NAME!);
    
    // Test searches related to the LinkedIn page
    const searchQueries = [
      "LinkedIn authentication",
      "Cooking with LinkedIn", 
      "Microsoft LinkedIn API",
      "ads reporting analytics",
      "authorization code flow"
    ];
    
    for (const query of searchQueries) {
      console.log(`\n🔍 Searching for: "${query}"`);
      
      // Generate query embedding
      const queryEmbedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: query
      });
      
      // Search in confluence-pages namespace
      const searchResults = await index.namespace('confluence-pages').query({
        vector: queryEmbedding.data[0].embedding,
        topK: 5,
        includeMetadata: true
      });
      
      if (searchResults.matches.length > 0) {
        console.log(`✅ Found ${searchResults.matches.length} results:`);
        searchResults.matches.forEach((match, idx) => {
          console.log(`${idx + 1}. Score: ${match.score?.toFixed(3)} | ${match.metadata?.type} | ${match.metadata?.pageId}`);
          if (match.metadata?.type === 'confluence_page') {
            console.log(`   Space: ${match.metadata.spaceKey} | Has Tables: ${match.metadata.hasTables}`);
          }
        });
      } else {
        console.log('❌ No results found');
      }
    }
    
    // Check what's in the confluence namespace
    console.log('\n\n📊 Confluence namespace stats:');
    const stats = await index.describeIndexStats();
    console.log(JSON.stringify(stats.namespaces?.['confluence-pages'] || 'No confluence-pages namespace', null, 2));
    
    // Test cross-namespace search (both Jira and Confluence)
    console.log('\n\n🔄 Cross-namespace search for "LinkedIn":');
    
    const linkedinQuery = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: "LinkedIn connector development"
    });
    
    // Search both namespaces
    const jiraResults = await index.namespace('jira-tickets').query({
      vector: linkedinQuery.data[0].embedding,
      topK: 3,
      includeMetadata: true
    });
    
    const confluenceResults = await index.namespace('confluence-pages').query({
      vector: linkedinQuery.data[0].embedding,
      topK: 3,
      includeMetadata: true
    });
    
    console.log('\nJira results:');
    jiraResults.matches.forEach((match, idx) => {
      console.log(`${idx + 1}. ${match.metadata?.ticketKey} | Score: ${match.score?.toFixed(3)}`);
    });
    
    console.log('\nConfluence results:');
    confluenceResults.matches.forEach((match, idx) => {
      console.log(`${idx + 1}. Page ${match.metadata?.pageId} | Score: ${match.score?.toFixed(3)}`);
    });
    
    console.log('\n💡 This shows how the same query finds both:');
    console.log('- Related Jira tickets (DE-3397)');
    console.log('- Related documentation (Cooking with LinkedIn)');
    console.log('- Provides complete context for developers!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run test
testConfluenceSearch()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });