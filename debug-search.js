/**
 * Debug Pinecone search issues
 */

const BASE_URL = 'http://localhost:8888';

async function debugSearch() {
  console.log('🔍 Debugging Pinecone Search\n');
  
  // Step 1: Add a test document
  console.log('1. Adding test document...');
  const testDoc = {
    id: 'debug-test-001',
    type: 'TICKET',
    metadata: {
      teamId: 'debug-team',
      status: 'OPEN'
    },
    content: {
      title: 'Debug Test Ticket',
      description: 'Testing search functionality',
      fullText: 'This is a debug test for search functionality'
    }
  };
  
  try {
    const upsertResponse = await fetch(`${BASE_URL}/api/pinecone/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDoc)
    });
    
    const upsertData = await upsertResponse.json();
    console.log('✓ Document added:', upsertData.message);
  } catch (error) {
    console.log('✗ Failed to add document:', error.message);
    return;
  }
  
  // Step 2: Wait for indexing
  console.log('\n2. Waiting for indexing (10 seconds)...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Step 3: Check index stats
  console.log('\n3. Checking index stats...');
  try {
    const statsResponse = await fetch(`${BASE_URL}/api/pinecone/stats`);
    const statsData = await statsResponse.json();
    console.log('✓ Total vectors:', statsData.stats.totalVectors);
    console.log('✓ Namespaces:', Object.keys(statsData.stats.namespaces || {}));
  } catch (error) {
    console.log('✗ Failed to get stats:', error.message);
  }
  
  // Step 4: Try different search queries
  const searches = [
    { query: 'debug test', desc: 'Simple search' },
    { query: 'testing search', desc: 'Keywords from content' },
    { query: 'ticket', desc: 'Single word' },
    { query: 'debug test&type=TICKET', desc: 'With type filter' }
  ];
  
  console.log('\n4. Testing different search queries...');
  
  for (const search of searches) {
    try {
      const searchResponse = await fetch(
        `${BASE_URL}/api/pinecone/documents?query=${encodeURIComponent(search.query)}`
      );
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        console.log(`✓ ${search.desc}: Found ${searchData.count} results`);
        
        if (searchData.results && searchData.results.length > 0) {
          console.log(`  Best match: ${searchData.results[0].document.metadata.title} (score: ${searchData.results[0].score.toFixed(4)})`);
        }
      } else {
        const errorData = await searchResponse.json();
        console.log(`✗ ${search.desc}: ${errorData.error}`);
      }
    } catch (error) {
      console.log(`✗ ${search.desc}: ${error.message}`);
    }
  }
  
  // Step 5: Clean up
  console.log('\n5. Cleaning up...');
  try {
    const deleteResponse = await fetch(
      `${BASE_URL}/api/pinecone/documents/debug-test-001?type=TICKET`,
      { method: 'DELETE' }
    );
    
    if (deleteResponse.ok) {
      console.log('✓ Test document deleted');
    }
  } catch (error) {
    console.log('✗ Failed to delete:', error.message);
  }
  
  console.log('\n🔍 Debug complete!');
}

debugSearch().catch(console.error);