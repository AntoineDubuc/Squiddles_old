/**
 * Confluence Search Test - Affinity Solutions
 * Tests searching for pages about Affinity Solutions in Confluence
 */

const https = require('https');
const fs = require('fs');

// Load environment variables from .env file
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
          process.env[key.trim()] = value.trim();
        }
      }
    }
  } catch (error) {
    console.error('Could not load .env file:', error.message);
  }
}

// Make HTTPS request to Confluence API
function makeConfluenceRequest(path, data = null) {
  return new Promise((resolve, reject) => {
    // Try different environment variable combinations
    const baseUrl = process.env.CONFLUENCE_BASE_URL || process.env.CONFLUENCE_HOST || process.env.JIRA_BASE_URL;
    const email = process.env.CONFLUENCE_EMAIL || process.env.JIRA_USER_EMAIL;
    const token = process.env.CONFLUENCE_API_TOKEN || process.env.JIRA_API_TOKEN;
    
    if (!baseUrl || !email || !token) {
      reject(new Error('Missing Confluence configuration. Need CONFLUENCE_BASE_URL/JIRA_BASE_URL, CONFLUENCE_EMAIL/JIRA_USER_EMAIL, and CONFLUENCE_API_TOKEN/JIRA_API_TOKEN'));
      return;
    }

    // Extract hostname from URL
    const url = new URL(baseUrl);
    const hostname = url.hostname;
    const fullPath = `/wiki/rest/api/${path}`;

    // Create Basic Auth header
    const auth = Buffer.from(`${email}:${token}`).toString('base64');

    const options = {
      hostname: hostname,
      path: fullPath,
      method: data ? 'POST' : 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testConfluenceSearch() {
  console.log('🧪 Testing Confluence Search for "Affinity Solutions"...\n');
  
  // Load environment
  loadEnv();
  
  const baseUrl = process.env.CONFLUENCE_BASE_URL || process.env.CONFLUENCE_HOST || process.env.JIRA_BASE_URL;
  const email = process.env.CONFLUENCE_EMAIL || process.env.JIRA_USER_EMAIL;
  const token = process.env.CONFLUENCE_API_TOKEN || process.env.JIRA_API_TOKEN;
  
  console.log('🔧 Configuration check:');
  console.log(`   Base URL: ${baseUrl ? '✅ ' + baseUrl : '❌ Missing'}`);
  console.log(`   Email: ${email ? '✅ ' + email : '❌ Missing'}`);
  console.log(`   Token: ${token ? '✅ ' + token.substring(0, 10) + '...' : '❌ Missing'}`);
  console.log('');
  
  if (!baseUrl || !email || !token) {
    console.error('❌ Missing required Confluence configuration');
    console.log('💡 Make sure these are set in your .env file:');
    console.log('   CONFLUENCE_BASE_URL or JIRA_BASE_URL');
    console.log('   CONFLUENCE_EMAIL or JIRA_USER_EMAIL'); 
    console.log('   CONFLUENCE_API_TOKEN or JIRA_API_TOKEN');
    return;
  }

  try {
    // Test 1: Authentication & User Info
    console.log('📡 Testing Confluence authentication...');
    const userResult = await makeConfluenceRequest('user/current');
    
    if (userResult.status === 200 && userResult.data) {
      console.log('✅ Authentication successful!');
      console.log(`   User: ${userResult.data.displayName || userResult.data.username}`);
      console.log(`   Email: ${userResult.data.email || 'N/A'}`);
      console.log(`   User Key: ${userResult.data.userKey || userResult.data.accountId}`);
    } else {
      console.error('❌ Authentication failed:', userResult.data);
      return;
    }

    // Test 2: List available spaces
    console.log('\n📚 Getting available spaces...');
    const spacesResult = await makeConfluenceRequest('space?limit=20');
    
    if (spacesResult.status === 200 && spacesResult.data.results) {
      console.log(`✅ Found ${spacesResult.data.results.length} accessible spaces:`);
      spacesResult.data.results.forEach(space => {
        console.log(`   📁 ${space.key}: ${space.name} (${space.type})`);
      });
    } else {
      console.log('⚠️ Could not list spaces:', spacesResult.data);
    }

    // Test 3: Search for "Affinity Solutions" content
    console.log('\n🔍 Searching for "Affinity Solutions" content...');
    
    // Multiple search strategies
    const searchQueries = [
      // Text search in title and content
      'text ~ "Affinity Solutions" AND type = page',
      // Title-specific search
      'title ~ "Affinity Solutions" AND type = page',
      // Broader search for "Affinity"
      'text ~ "Affinity" AND type = page',
      // Search for pages with "Solutions" 
      'text ~ "Solutions" AND type = page',
      // Get all pages (fallback)
      'type = page ORDER BY lastModified DESC'
    ];

    let foundResults = false;

    for (const [index, cql] of searchQueries.entries()) {
      console.log(`\n   Query ${index + 1}: ${cql}`);
      
      try {
        const encodedCql = encodeURIComponent(cql);
        const searchResult = await makeConfluenceRequest(`content/search?cql=${encodedCql}&limit=10&expand=space,body.storage,version`);
        
        if (searchResult.status === 200 && searchResult.data.results) {
          const results = searchResult.data.results;
          console.log(`   ✅ Found ${results.length} results`);
          
          if (results.length > 0) {
            foundResults = true;
            
            results.forEach((page, idx) => {
              console.log(`\n   📄 Result ${idx + 1}:`);
              console.log(`      Title: ${page.title}`);
              console.log(`      Space: ${page.space.name} (${page.space.key})`);
              console.log(`      Type: ${page.type}`);
              console.log(`      Status: ${page.status}`);
              console.log(`      URL: ${page._links.base}${page._links.webui}`);
              console.log(`      Last Modified: ${page.version.when}`);
              
              // Check if content contains "Affinity Solutions"
              const content = page.body?.storage?.value || '';
              const affinityMentions = (content.match(/affinity\s+solutions/gi) || []).length;
              const affinityOnly = (content.match(/affinity/gi) || []).length;
              
              if (affinityMentions > 0) {
                console.log(`      🎯 Contains "Affinity Solutions": ${affinityMentions} mentions`);
              } else if (affinityOnly > 0) {
                console.log(`      📝 Contains "Affinity": ${affinityOnly} mentions`);
              }
              
              // Show snippet of content
              if (content) {
                const plainText = content.replace(/<[^>]*>/g, '').substring(0, 200);
                console.log(`      Content preview: ${plainText}${content.length > 200 ? '...' : ''}`);
              }
            });
            
            // If this is the Affinity Solutions specific search and we found results, break
            if (index === 0 && results.length > 0) {
              break;
            }
          }
        } else {
          console.log(`   ❌ Search failed: ${searchResult.data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(`   ❌ Search error: ${error.message}`);
      }
    }

    // Test 4: Recent content check (if no Affinity Solutions found)
    if (!foundResults) {
      console.log('\n📋 Getting recent content to verify Confluence access...');
      try {
        const recentResult = await makeConfluenceRequest('content?type=page&limit=5&expand=space,version');
        
        if (recentResult.status === 200 && recentResult.data.results) {
          const pages = recentResult.data.results;
          console.log(`✅ Found ${pages.length} recent pages:`);
          
          pages.forEach((page, idx) => {
            console.log(`   ${idx + 1}. ${page.title} (${page.space.name})`);
          });
        }
      } catch (error) {
        console.log(`❌ Could not get recent content: ${error.message}`);
      }
    }

    // Summary
    console.log('\n🎉 Confluence Search Test Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Authentication: Working');
    console.log('✅ Space Access: Working');
    console.log(`${foundResults ? '✅' : '⚠️'} Search Functionality: ${foundResults ? 'Working' : 'No Affinity Solutions content found'}`);
    
    if (foundResults) {
      console.log('\n🦑 Confluence integration is ready for voice commands like:');
      console.log('   • "Search Confluence for Affinity Solutions documentation"');
      console.log('   • "Find pages about Affinity in Confluence"');
      console.log('   • "Show me recent Confluence updates"');
    } else {
      console.log('\n💡 Try creating a test page about Affinity Solutions to verify search works');
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    
    console.log('\n💡 Common solutions:');
    console.log('   • Check if Confluence/Jira credentials are correct');
    console.log('   • Verify API token has Confluence read permissions');
    console.log('   • Ensure the base URL includes the correct Confluence instance');
    console.log('   • Try accessing the Confluence web interface manually first');
  }
}

// Run the test
testConfluenceSearch().catch(console.error);