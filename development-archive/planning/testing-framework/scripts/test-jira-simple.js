/**
 * Simple Jira test using require (CommonJS)
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function testJira() {
  console.log('🔧 Testing Jira Configuration\n');
  
  // Check all environment variables
  console.log('All Jira environment variables:');
  Object.keys(process.env)
    .filter(key => key.startsWith('JIRA_'))
    .forEach(key => {
      const value = process.env[key];
      console.log(`${key}: ${value ? (key.includes('TOKEN') ? value.substring(0, 8) + '...' : value) : '❌ Missing'}`);
    });
  
  const jiraHost = process.env.JIRA_HOST;
  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraToken = process.env.JIRA_API_TOKEN;
  
  console.log('\nRequired variables:');
  console.log(`JIRA_HOST: ${jiraHost || '❌ Missing'}`);
  console.log(`JIRA_EMAIL: ${jiraEmail || '❌ Missing'}`);
  console.log(`JIRA_API_TOKEN: ${jiraToken ? jiraToken.substring(0, 8) + '...' : '❌ Missing'}`);
  
  if (!jiraHost || !jiraEmail || !jiraToken) {
    console.log('\n❌ Missing required Jira configuration!');
    console.log('\nPlease add these to your .env.local file:');
    console.log('JIRA_HOST="https://your-domain.atlassian.net"');
    console.log('JIRA_EMAIL="your-email@company.com"');
    console.log('JIRA_API_TOKEN="your-api-token"');
    return;
  }
  
  // Test authentication
  console.log('\n🔄 Testing Jira authentication...');
  
  const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
  };
  
  try {
    const response = await fetch(`${jiraHost}/rest/api/3/myself`, { headers });
    
    if (response.ok) {
      const user = await response.json();
      console.log('✅ Jira authentication successful!');
      console.log(`   User: ${user.displayName}`);
      console.log(`   Account ID: ${user.accountId}`);
      console.log(`   Email: ${user.emailAddress || 'Not available'}`);
      
      // Test projects
      console.log('\n🔄 Testing project access...');
      const projectsResponse = await fetch(`${jiraHost}/rest/api/3/project/search?maxResults=5`, { headers });
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        const projects = projectsData.values || [];
        console.log(`✅ Found ${projects.length} accessible projects:`);
        projects.forEach(p => {
          console.log(`   - ${p.name} (${p.key})`);
        });
        
        if (projects.length > 0) {
          console.log('\n🎉 Jira integration is ready!');
          console.log('You can now test the API endpoints.');
        }
      } else {
        console.log('❌ Failed to access projects');
        const errorText = await projectsResponse.text();
        console.log(`   Error: ${errorText.substring(0, 200)}`);
      }
    } else {
      console.log(`❌ Authentication failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.log(`   Details: ${errorText.substring(0, 200)}`);
      
      if (response.status === 401) {
        console.log('\n🔧 Troubleshooting 401 Unauthorized:');
        console.log('   1. Check your email is correct');
        console.log('   2. Verify the API token is valid');
        console.log('   3. Make sure the token hasn\'t expired');
      }
    }
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
    console.log('\n🔧 Troubleshooting connection issues:');
    console.log('   1. Check JIRA_HOST URL is correct');
    console.log('   2. Ensure internet connectivity');
    console.log('   3. Verify the Jira instance is accessible');
  }
}

testJira().catch(console.error);