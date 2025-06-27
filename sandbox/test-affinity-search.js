/**
 * Simple Affinity Solutions Search Test
 * Uses existing Confluence API to search for content
 */

const https = require('https');

// Make request to local dev server
function makeLocalRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8888,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

async function testAffinitySearch() {
  console.log('🧪 Testing Confluence Search for "Affinity Solutions"...\n');
  
  try {
    // Test 1: Test Confluence API endpoint
    console.log('📡 Testing Confluence test endpoint...');
    const testResult = await makeLocalRequest('/api/confluence/test');
    
    if (testResult.status === 200 && testResult.data) {
      console.log('✅ Confluence API endpoint accessible');
      
      const data = testResult.data;
      
      // Check configuration
      console.log('\n🔧 Configuration Status:');
      console.log(`   Host: ${data.configuration?.host_configured ? '✅' : '❌'}`);
      console.log(`   Email: ${data.configuration?.email_configured ? '✅' : '❌'}`);
      console.log(`   Token: ${data.configuration?.token_configured ? '✅' : '❌'}`);
      
      // Check authentication
      console.log('\n👤 Authentication:');
      if (data.authentication?.success) {
        console.log('✅ Authentication successful');
        console.log(`   User: ${data.authentication.user?.displayName || 'Unknown'}`);
        console.log(`   Email: ${data.authentication.user?.email || 'N/A'}`);
      } else {
        console.log('❌ Authentication failed:', data.authentication?.error);
      }
      
      // Check spaces
      console.log('\n📚 Spaces Access:');
      if (data.spaces?.success) {
        console.log(`✅ Found ${data.spaces.count} accessible spaces:`);
        data.spaces.spaces?.forEach(space => {
          console.log(`   📁 ${space.key}: ${space.name}`);
        });
      } else {
        console.log('❌ Spaces access failed:', data.spaces?.error);
      }
      
      // Check Affinity Solutions search results
      console.log('\n🔍 Affinity Solutions Search Results:');
      if (data.search_results?.affinity_solutions?.success) {
        const count = data.search_results.affinity_solutions.count;
        console.log(`✅ Found ${count} pages mentioning "Affinity Solutions"`);
        
        if (count > 0) {
          data.search_results.affinity_solutions.pages?.forEach((page, idx) => {
            console.log(`\n   📄 Result ${idx + 1}:`);
            console.log(`      Title: ${page.title}`);
            console.log(`      Space: ${page.space.name} (${page.space.key})`);
            console.log(`      URL: ${page.url}`);
            console.log(`      Last Modified: ${page.lastModified}`);
            console.log(`      Content Preview: ${page.contentPreview?.substring(0, 150)}...`);
          });
        } else {
          console.log('   No pages found with exact "Affinity Solutions" match');
        }
      } else {
        console.log('❌ Affinity Solutions search failed:', data.search_results?.affinity_solutions?.error);
      }
      
      // Check broader Affinity search
      if (data.search_results?.affinity_only?.count > 0) {
        console.log(`\n📝 Broader "Affinity" Search Results:`);
        console.log(`✅ Found ${data.search_results.affinity_only.count} pages mentioning "Affinity"`);
        
        data.search_results.affinity_only.pages?.forEach((page, idx) => {
          console.log(`\n   📄 Result ${idx + 1}:`);
          console.log(`      Title: ${page.title}`);
          console.log(`      Space: ${page.space.name} (${page.space.key})`);
          console.log(`      Affinity Mentions: ${page.affinityMentions}`);
          console.log(`      URL: ${page.url}`);
        });
      }
      
      // Check recent pages
      if (data.search_results?.recent_pages?.success) {
        console.log(`\n📋 Recent Pages (for verification):`);
        console.log(`✅ Found ${data.search_results.recent_pages.count} recent pages:`);
        
        data.search_results.recent_pages.pages?.slice(0, 3).forEach((page, idx) => {
          console.log(`   ${idx + 1}. ${page.title} (${page.space.name})`);
        });
      }
      
      // Overall status
      console.log('\n🎉 Search Test Summary:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Overall Status: ${data.overall_status?.toUpperCase()}`);
      
      if (data.overall_status === 'passed') {
        console.log('✅ Confluence integration fully working!');
        console.log('\n🦑 You can now use voice commands like:');
        console.log('   • "Search Confluence for Affinity Solutions"');
        console.log('   • "Find documentation about Affinity"');
        console.log('   • "Show me recent Confluence updates"');
      } else if (data.overall_status === 'partial') {
        console.log('⚠️ Confluence working but no Affinity content found');
        console.log('💡 Try creating a test page about Affinity Solutions');
      } else {
        console.log('❌ Confluence integration needs configuration');
      }
      
    } else {
      console.log('❌ Failed to access Confluence test endpoint');
      console.log(`Status: ${testResult.status}`);
      console.log(`Response: ${JSON.stringify(testResult.data)}`);
    }
    
    // Test 2: Direct search using pages endpoint
    console.log('\n🔍 Testing direct search API...');
    const searchResult = await makeLocalRequest('/api/confluence/pages?query=Affinity Solutions&limit=10');
    
    if (searchResult.status === 200 && searchResult.data?.success) {
      console.log('✅ Direct search API working');
      const pages = searchResult.data.pages || [];
      console.log(`Found ${pages.length} pages in direct search`);
      
      if (pages.length > 0) {
        pages.forEach((page, idx) => {
          console.log(`   ${idx + 1}. ${page.title} (${page.spaceName})`);
        });
      }
    } else {
      console.log('⚠️ Direct search API response:', searchResult.data);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   • Dev server is running: npm run dev');
    console.log('   • Server is accessible at localhost:8888');
    console.log('   • Confluence credentials are configured in .env');
  }
}

// Run the test
console.log('Starting Affinity Solutions search test...');
console.log('Make sure your dev server is running on localhost:8888\n');

testAffinitySearch().catch(console.error);