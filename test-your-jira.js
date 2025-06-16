/**
 * Test with your actual Jira configuration
 */

require('dotenv').config({ path: '.env.local' });

async function testYourJira() {
  console.log('🔧 Testing Your Jira Configuration\n');
  
  const jiraHost = process.env.JIRA_BASE_URL;
  const jiraEmail = process.env.JIRA_USER_EMAIL;
  const jiraToken = process.env.JIRA_API_TOKEN;
  
  console.log('Using your variables:');
  console.log(`JIRA_BASE_URL: ${jiraHost}`);
  console.log(`JIRA_USER_EMAIL: ${jiraEmail}`);
  console.log(`JIRA_API_TOKEN: ${jiraToken ? jiraToken.substring(0, 8) + '...' : '❌ Missing'}`);
  
  if (!jiraHost || !jiraEmail || !jiraToken) {
    console.log('\n❌ Missing configuration!');
    return;
  }
  
  // Test authentication
  console.log('\n🔄 Testing ExtendTV Jira...');
  
  const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
  };
  
  try {
    // Test /myself endpoint
    const response = await fetch(`${jiraHost}/rest/api/3/myself`, { headers });
    
    if (response.ok) {
      const user = await response.json();
      console.log('✅ Authentication successful!');
      console.log(`   User: ${user.displayName}`);
      console.log(`   Account ID: ${user.accountId}`);
      
      // Test projects
      console.log('\n🔄 Getting projects...');
      const projectsResponse = await fetch(`${jiraHost}/rest/api/3/project/search`, { headers });
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        const projects = projectsData.values || [];
        console.log(`✅ Found ${projects.length} projects:`);
        projects.forEach(p => {
          console.log(`   - ${p.name} (${p.key})`);
        });
        
        // Test specific project if you have JIRA_PROJECT_KEY
        const projectKey = process.env.JIRA_PROJECT_KEY;
        if (projectKey && projectKey !== 'JIRA_PROJECT_KEY') {
          console.log(`\n🔄 Testing project ${projectKey}...`);
          
          const jql = `project = ${projectKey} ORDER BY created DESC`;
          const issuesResponse = await fetch(`${jiraHost}/rest/api/3/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              jql,
              maxResults: 5,
              fields: ['summary', 'status', 'issuetype', 'assignee']
            })
          });
          
          if (issuesResponse.ok) {
            const issuesData = await issuesResponse.json();
            const issues = issuesData.issues || [];
            console.log(`✅ Found ${issuesData.total} issues in ${projectKey}:`);
            issues.forEach(issue => {
              console.log(`   - ${issue.key}: ${issue.fields.summary}`);
            });
          } else {
            const errorText = await issuesResponse.text();
            console.log(`❌ Failed to get issues: ${errorText.substring(0, 200)}`);
          }
        }
        
        console.log('\n🎉 Jira integration is working!');
        console.log('Now let\'s test the API endpoints...');
        
      } else {
        const errorText = await projectsResponse.text();
        console.log(`❌ Failed to get projects: ${errorText.substring(0, 200)}`);
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Authentication failed: ${response.status}`);
      console.log(`   Details: ${errorText.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
  }
}

testYourJira().catch(console.error);