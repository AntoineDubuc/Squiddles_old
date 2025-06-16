/**
 * Debug Jira tickets endpoint
 */

require('dotenv').config({ path: '.env.local' });

async function debugTickets() {
  console.log('🔧 Debugging Jira Tickets\n');
  
  const jiraHost = process.env.JIRA_BASE_URL;
  const jiraEmail = process.env.JIRA_USER_EMAIL;
  const jiraToken = process.env.JIRA_API_TOKEN;
  
  const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  try {
    // Test 1: Get projects
    console.log('1. Getting projects...');
    const projectsResponse = await fetch(`${jiraHost}/rest/api/3/project/search`, { headers });
    const projectsData = await projectsResponse.json();
    const projects = projectsData.values || [];
    const projectKeys = projects.map(p => p.key);
    
    console.log(`Found ${projects.length} projects:`, projectKeys.slice(0, 5));
    
    // Test 2: Try JQL with active sprints
    console.log('\n2. Testing active sprints JQL...');
    const jql = `project in (${projectKeys.slice(0, 3).join(',')}) AND sprint in openSprints()`;
    console.log(`JQL: ${jql}`);
    
    const sprintResponse = await fetch(`${jiraHost}/rest/api/3/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jql,
        fields: ['summary', 'status', 'issuetype', 'assignee', 'reporter'],
        maxResults: 5,
      }),
    });
    
    if (sprintResponse.ok) {
      const sprintData = await sprintResponse.json();
      console.log(`✅ Found ${sprintData.total} tickets in active sprints`);
      
      if (sprintData.issues && sprintData.issues.length > 0) {
        console.log('Sample ticket structure:');
        const sample = sprintData.issues[0];
        console.log('ID:', sample.id);
        console.log('Key:', sample.key);
        console.log('Fields keys:', Object.keys(sample.fields || {}));
        console.log('Summary:', sample.fields?.summary);
        console.log('Status:', sample.fields?.status?.name);
      }
    } else {
      const errorText = await sprintResponse.text();
      console.log(`❌ Sprint query failed: ${errorText.substring(0, 200)}`);
    }
    
    // Test 3: Try simpler JQL
    console.log('\n3. Testing simpler JQL...');
    const simpleJql = `project = ${projectKeys[0]} ORDER BY created DESC`;
    console.log(`Simple JQL: ${simpleJql}`);
    
    const simpleResponse = await fetch(`${jiraHost}/rest/api/3/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jql: simpleJql,
        fields: ['summary', 'status', 'issuetype'],
        maxResults: 5,
      }),
    });
    
    if (simpleResponse.ok) {
      const simpleData = await simpleResponse.json();
      console.log(`✅ Found ${simpleData.total} tickets in ${projectKeys[0]}`);
      
      if (simpleData.issues && simpleData.issues.length > 0) {
        console.log('Recent tickets:');
        simpleData.issues.forEach(issue => {
          console.log(`  - ${issue.key}: ${issue.fields.summary}`);
        });
      }
    } else {
      const errorText = await simpleResponse.text();
      console.log(`❌ Simple query failed: ${errorText.substring(0, 200)}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

debugTickets().catch(console.error);