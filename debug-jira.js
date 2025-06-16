/**
 * Debug Jira connection issues
 */

const BASE_URL = 'http://localhost:8888';

async function debugJira() {
  console.log('🔧 Debugging Jira Connection\n');
  
  // Step 1: Check environment variables
  console.log('1. Checking environment variables...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/jira/user`);
    const text = await response.text();
    
    if (!response.ok) {
      console.log(`✗ Status: ${response.status} ${response.statusText}`);
      console.log('Raw response:', text);
      
      // Try to parse as JSON for error details
      try {
        const errorData = JSON.parse(text);
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Could not parse error as JSON');
      }
    } else {
      const data = JSON.parse(text);
      console.log('✓ Success:', data);
    }
  } catch (error) {
    console.log('✗ Network error:', error.message);
  }
  
  // Step 2: Test basic connectivity
  console.log('\n2. Testing basic endpoint availability...');
  
  const endpoints = [
    '/api/jira/user',
    '/api/jira/tickets', 
    '/api/jira/comments'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      console.log(`${endpoint}: Status ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`  Error: ${errorText.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`${endpoint}: Network error - ${error.message}`);
    }
  }
  
  console.log('\n🔧 Debug complete!');
  console.log('\nNext steps:');
  console.log('1. Check your .env.local file has:');
  console.log('   JIRA_HOST=https://your-domain.atlassian.net');
  console.log('   JIRA_EMAIL=your-email@company.com');
  console.log('   JIRA_API_TOKEN=your-api-token');
  console.log('2. Verify the API token is valid and has proper permissions');
  console.log('3. Test with a simple curl command:');
  console.log('   curl -u "email:token" "https://your-domain.atlassian.net/rest/api/3/myself"');
}

debugJira().catch(console.error);