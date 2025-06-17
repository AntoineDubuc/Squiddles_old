/**
 * Test script for Jira API endpoints
 * Run with: npx tsx src/lib/jira/testEndpoints.ts
 */

const JIRA_BASE_URL = 'http://localhost:8888/api/jira';

// ANSI color codes
const jiraColors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function testJiraEndpoints() {
  console.log(`${jiraColors.blue}🦑 Testing Jira API Endpoints${jiraColors.reset}\n`);

  // Test 1: Get User Info
  console.log(`${jiraColors.yellow}1. Testing user info endpoint...${jiraColors.reset}`);
  let userInfo: any = null;
  
  try {
    const response = await fetch(`${JIRA_BASE_URL}/user`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      userInfo = data;
      console.log(`${jiraColors.green}✓ User info retrieved${jiraColors.reset}`);
      console.log(`  User: ${data.user.name} (${data.user.id})`);
      console.log(`  Projects: ${data.projects.length}`);
      data.projects.forEach((p: any) => {
        console.log(`    - ${p.name} (${p.key})`);
      });
    } else {
      console.log(`${jiraColors.red}✗ User info failed: ${data.error}${jiraColors.reset}`);
    }
  } catch (error) {
    console.log(`${jiraColors.red}✗ User info error: ${error}${jiraColors.reset}`);
  }

  // Test 2: Get Tickets
  console.log(`\n${jiraColors.yellow}2. Testing tickets endpoint...${jiraColors.reset}`);
  let tickets: any[] = [];
  
  try {
    const response = await fetch(`${JIRA_BASE_URL}/tickets`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      tickets = data.tickets;
      console.log(`${jiraColors.green}✓ Tickets retrieved${jiraColors.reset}`);
      console.log(`  Total tickets: ${data.count}`);
      
      // Show first 3 tickets
      tickets.slice(0, 3).forEach((ticket: any) => {
        console.log(`  - ${ticket.key}: ${ticket.title}`);
        console.log(`    Type: ${ticket.type}, Status: ${ticket.status}, Priority: ${ticket.priority}`);
      });
    } else {
      console.log(`${jiraColors.red}✗ Tickets failed: ${data.error}${jiraColors.reset}`);
    }
  } catch (error) {
    console.log(`${jiraColors.red}✗ Tickets error: ${error}${jiraColors.reset}`);
  }

  // Test 3: Get Comments
  console.log(`\n${jiraColors.yellow}3. Testing comments endpoint...${jiraColors.reset}`);
  
  try {
    const response = await fetch(`${JIRA_BASE_URL}/comments`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${jiraColors.green}✓ Comments retrieved${jiraColors.reset}`);
      console.log(`  Total comments: ${data.count}`);
      
      // Count mentions
      const mentionCount = data.comments.filter((c: any) => c.isDirectMention).length;
      console.log(`  Direct mentions: ${mentionCount}`);
      
      // Show first 3 comments
      data.comments.slice(0, 3).forEach((comment: any) => {
        console.log(`  - ${comment.ticketKey}: ${comment.author.name}`);
        console.log(`    ${comment.body.substring(0, 80)}...`);
        if (comment.isDirectMention) {
          console.log(`    ${jiraColors.yellow}@mention${jiraColors.reset}`);
        }
      });
    } else {
      console.log(`${jiraColors.red}✗ Comments failed: ${data.error}${jiraColors.reset}`);
    }
  } catch (error) {
    console.log(`${jiraColors.red}✗ Comments error: ${error}${jiraColors.reset}`);
  }

  // Test 4: Get Comments with Mentions Only
  console.log(`\n${jiraColors.yellow}4. Testing comments with mentions filter...${jiraColors.reset}`);
  
  try {
    const response = await fetch(`${JIRA_BASE_URL}/comments?withMentions=true`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${jiraColors.green}✓ Mentions retrieved${jiraColors.reset}`);
      console.log(`  Comments with mentions: ${data.count}`);
      
      data.comments.slice(0, 3).forEach((comment: any) => {
        console.log(`  - ${comment.ticketKey}: ${comment.ticketTitle}`);
        console.log(`    From: ${comment.author.name}`);
      });
    } else {
      console.log(`${jiraColors.red}✗ Mentions failed: ${data.error}${jiraColors.reset}`);
    }
  } catch (error) {
    console.log(`${jiraColors.red}✗ Mentions error: ${error}${jiraColors.reset}`);
  }

  // Test 5: Get Tickets for Specific Project
  if (userInfo && userInfo.projects.length > 0) {
    const testProject = userInfo.projects[0];
    console.log(`\n${jiraColors.yellow}5. Testing tickets for project ${testProject.key}...${jiraColors.reset}`);
    
    try {
      const response = await fetch(`${JIRA_BASE_URL}/tickets?projectKey=${testProject.key}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`${jiraColors.green}✓ Project tickets retrieved${jiraColors.reset}`);
        console.log(`  Tickets in ${testProject.name}: ${data.count}`);
      } else {
        console.log(`${jiraColors.red}✗ Project tickets failed: ${data.error}${jiraColors.reset}`);
      }
    } catch (error) {
      console.log(`${jiraColors.red}✗ Project tickets error: ${error}${jiraColors.reset}`);
    }
  }

  // Test 6: Sync to Pinecone (dry run - don't actually sync in test)
  console.log(`\n${jiraColors.yellow}6. Testing sync endpoint structure...${jiraColors.reset}`);
  console.log(`  ${jiraColors.blue}Sync endpoint available at POST /api/jira/sync${jiraColors.reset}`);
  console.log(`  Parameters:`);
  console.log(`    - projectKey (optional): Specific project to sync`);
  console.log(`    - sprintId (optional): Specific sprint to sync`);
  console.log(`    - syncComments (default: true): Whether to sync comments`);

  console.log(`\n${jiraColors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${jiraColors.reset}`);
  console.log(`${jiraColors.green}✅ Jira API endpoint tests completed!${jiraColors.reset}`);
  
  if (!userInfo) {
    console.log(`\n${jiraColors.yellow}⚠ Note: Could not retrieve user info. Check your Jira credentials in .env.local:${jiraColors.reset}`);
    console.log(`  JIRA_HOST=https://your-domain.atlassian.net`);
    console.log(`  JIRA_EMAIL=your-email@company.com`);
    console.log(`  JIRA_API_TOKEN=your-api-token`);
  }
}

// Note: This requires the Next.js server to be running
console.log(`${jiraColors.yellow}Note: Make sure the Next.js server is running (npm run dev)${jiraColors.reset}\n`);

testJiraEndpoints().catch(error => {
  console.error(`${jiraColors.red}Test error: ${error}${jiraColors.reset}`);
});