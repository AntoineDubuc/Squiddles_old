/**
 * Test Jira API directly without our endpoints
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

// Also try to read .env.local directly
try {
  const envContent = readFileSync('.env.local', 'utf8');
  console.log('Found .env.local file with', envContent.split('\n').length, 'lines');
} catch (e) {
  console.log('Could not read .env.local file');
}

async function testJiraDirect() {
  console.log('🔧 Testing Jira API Direct Connection\n');
  
  // Check environment variables
  const jiraHost = process.env.JIRA_HOST;
  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraToken = process.env.JIRA_API_TOKEN;
  
  console.log('Environment variables:');
  console.log(`JIRA_HOST: ${jiraHost ? jiraHost : '❌ Missing'}`);
  console.log(`JIRA_EMAIL: ${jiraEmail ? jiraEmail : '❌ Missing'}`);
  console.log(`JIRA_API_TOKEN: ${jiraToken ? jiraToken.substring(0, 8) + '...' : '❌ Missing'}`);
  
  if (!jiraHost || !jiraEmail || !jiraToken) {
    console.log('\n❌ Missing required Jira configuration!');
    console.log('\nAdd these to your .env.local file:');
    console.log('JIRA_HOST=https://your-domain.atlassian.net');
    console.log('JIRA_EMAIL=your-email@company.com');
    console.log('JIRA_API_TOKEN=your-api-token');
    console.log('\nTo get an API token:');
    console.log('1. Go to https://id.atlassian.com/manage-profile/security/api-tokens');
    console.log('2. Click "Create API token"');
    console.log('3. Give it a name and copy the token');
    return;
  }
  
  // Test authentication
  console.log('\n1. Testing authentication...');
  
  const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  try {
    const response = await fetch(`${jiraHost}/rest/api/3/myself`, { headers });
    
    if (response.ok) {
      const user = await response.json();
      console.log('✅ Authentication successful!');
      console.log(`User: ${user.displayName} (${user.accountId})`);
      console.log(`Email: ${user.emailAddress || 'Not available'}`);
      
      // Test 2: Get projects
      console.log('\n2. Testing project access...');
      const projectsResponse = await fetch(`${jiraHost}/rest/api/3/project/search`, { headers });
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        const projects = projectsData.values || [];
        console.log(`✅ Found ${projects.length} projects:`);
        projects.slice(0, 5).forEach(p => {
          console.log(`  - ${p.name} (${p.key})`);
        });
        
        // Test 3: Get issues from first project
        if (projects.length > 0) {
          console.log('\n3. Testing issue access...');
          const firstProject = projects[0];
          
          const jql = `project = ${firstProject.key} ORDER BY created DESC`;
          const issuesResponse = await fetch(`${jiraHost}/rest/api/3/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              jql,
              maxResults: 5,
              fields: ['summary', 'status', 'issuetype']
            })
          });
          
          if (issuesResponse.ok) {
            const issuesData = await issuesResponse.json();
            const issues = issuesData.issues || [];
            console.log(`✅ Found ${issuesData.total} issues in ${firstProject.name}:`);
            issues.forEach(issue => {
              console.log(`  - ${issue.key}: ${issue.fields.summary}`);
              console.log(`    Type: ${issue.fields.issuetype.name}, Status: ${issue.fields.status.name}`);
            });
          } else {
            const errorText = await issuesResponse.text();
            console.log(`❌ Failed to get issues: ${issuesResponse.status} - ${errorText}`);
          }
        }
      } else {
        const errorText = await projectsResponse.text();
        console.log(`❌ Failed to get projects: ${projectsResponse.status} - ${errorText}`);
      }
      
    } else {
      const errorText = await response.text();
      console.log(`❌ Authentication failed: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        console.log('\nTroubleshooting:');
        console.log('1. Check that your email and API token are correct');
        console.log('2. Make sure the API token has not expired');
        console.log('3. Verify you have access to the Jira instance');
      } else if (response.status === 403) {
        console.log('\nTroubleshooting:');
        console.log('1. Your credentials are correct but you lack permissions');
        console.log('2. Contact your Jira admin to grant API access');
      }
    }
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
    console.log('\nTroubleshooting:');
    console.log('1. Check that JIRA_HOST URL is correct');
    console.log('2. Ensure you have internet connectivity');
    console.log('3. Verify the Jira instance is accessible');
  }
}

testJiraDirect().catch(console.error);