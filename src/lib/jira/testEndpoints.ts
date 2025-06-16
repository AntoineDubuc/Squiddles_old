/**
 * Test script for Jira API endpoints
 * Run with: npx tsx src/lib/jira/testEndpoints.ts
 */

const BASE_URL = 'http://localhost:8888/api/jira';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

async function testJiraEndpoints() {
  console.log(`${colors.blue}🦑 Testing Jira API Endpoints${colors.reset}\n`);

  // Test 1: Get User Info
  console.log(`${colors.yellow}1. Testing user info endpoint...${colors.reset}`);
  let userInfo: any = null;
  
  try {
    const response = await fetch(`${BASE_URL}/user`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      userInfo = data;
      console.log(`${colors.green}✓ User info retrieved${colors.reset}`);
      console.log(`  User: ${data.user.name} (${data.user.id})`);
      console.log(`  Projects: ${data.projects.length}`);
      data.projects.forEach((p: any) => {
        console.log(`    - ${p.name} (${p.key})`);
      });
    } else {
      console.log(`${colors.red}✗ User info failed: ${data.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ User info error: ${error}${colors.reset}`);
  }

  // Test 2: Get Tickets
  console.log(`\n${colors.yellow}2. Testing tickets endpoint...${colors.reset}`);
  let tickets: any[] = [];
  
  try {
    const response = await fetch(`${BASE_URL}/tickets`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      tickets = data.tickets;
      console.log(`${colors.green}✓ Tickets retrieved${colors.reset}`);
      console.log(`  Total tickets: ${data.count}`);
      
      // Show first 3 tickets
      tickets.slice(0, 3).forEach((ticket: any) => {
        console.log(`  - ${ticket.key}: ${ticket.title}`);
        console.log(`    Type: ${ticket.type}, Status: ${ticket.status}, Priority: ${ticket.priority}`);
      });
    } else {
      console.log(`${colors.red}✗ Tickets failed: ${data.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Tickets error: ${error}${colors.reset}`);
  }

  // Test 3: Get Comments
  console.log(`\n${colors.yellow}3. Testing comments endpoint...${colors.reset}`);
  
  try {
    const response = await fetch(`${BASE_URL}/comments`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${colors.green}✓ Comments retrieved${colors.reset}`);
      console.log(`  Total comments: ${data.count}`);
      
      // Count mentions
      const mentionCount = data.comments.filter((c: any) => c.isDirectMention).length;
      console.log(`  Direct mentions: ${mentionCount}`);
      
      // Show first 3 comments
      data.comments.slice(0, 3).forEach((comment: any) => {
        console.log(`  - ${comment.ticketKey}: ${comment.author.name}`);
        console.log(`    ${comment.body.substring(0, 80)}...`);
        if (comment.isDirectMention) {
          console.log(`    ${colors.yellow}@mention${colors.reset}`);
        }
      });
    } else {
      console.log(`${colors.red}✗ Comments failed: ${data.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Comments error: ${error}${colors.reset}`);
  }

  // Test 4: Get Comments with Mentions Only
  console.log(`\n${colors.yellow}4. Testing comments with mentions filter...${colors.reset}`);
  
  try {
    const response = await fetch(`${BASE_URL}/comments?withMentions=true`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${colors.green}✓ Mentions retrieved${colors.reset}`);
      console.log(`  Comments with mentions: ${data.count}`);
      
      data.comments.slice(0, 3).forEach((comment: any) => {
        console.log(`  - ${comment.ticketKey}: ${comment.ticketTitle}`);
        console.log(`    From: ${comment.author.name}`);
      });
    } else {
      console.log(`${colors.red}✗ Mentions failed: ${data.error}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Mentions error: ${error}${colors.reset}`);
  }

  // Test 5: Get Tickets for Specific Project
  if (userInfo && userInfo.projects.length > 0) {
    const testProject = userInfo.projects[0];
    console.log(`\n${colors.yellow}5. Testing tickets for project ${testProject.key}...${colors.reset}`);
    
    try {
      const response = await fetch(`${BASE_URL}/tickets?projectKey=${testProject.key}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`${colors.green}✓ Project tickets retrieved${colors.reset}`);
        console.log(`  Tickets in ${testProject.name}: ${data.count}`);
      } else {
        console.log(`${colors.red}✗ Project tickets failed: ${data.error}${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}✗ Project tickets error: ${error}${colors.reset}`);
    }
  }

  // Test 6: Sync to Pinecone (dry run - don't actually sync in test)
  console.log(`\n${colors.yellow}6. Testing sync endpoint structure...${colors.reset}`);
  console.log(`  ${colors.blue}Sync endpoint available at POST /api/jira/sync${colors.reset}`);
  console.log(`  Parameters:`);
  console.log(`    - projectKey (optional): Specific project to sync`);
  console.log(`    - sprintId (optional): Specific sprint to sync`);
  console.log(`    - syncComments (default: true): Whether to sync comments`);

  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}✅ Jira API endpoint tests completed!${colors.reset}`);
  
  if (!userInfo) {
    console.log(`\n${colors.yellow}⚠ Note: Could not retrieve user info. Check your Jira credentials in .env.local:${colors.reset}`);
    console.log(`  JIRA_HOST=https://your-domain.atlassian.net`);
    console.log(`  JIRA_EMAIL=your-email@company.com`);
    console.log(`  JIRA_API_TOKEN=your-api-token`);
  }
}

// Note: This requires the Next.js server to be running
console.log(`${colors.yellow}Note: Make sure the Next.js server is running (npm run dev)${colors.reset}\n`);

testJiraEndpoints().catch(error => {
  console.error(`${colors.red}Test error: ${error}${colors.reset}`);
});