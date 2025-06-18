#!/usr/bin/env node

/**
 * Test Script for DE-3417
 * 
 * This script tests writing different types of comments to ticket DE-3417
 */

const { 
  makeJiraRequest, 
  addComment, 
  getCurrentUser 
} = require('./write-jira-comment.js');

const TICKET_KEY = 'DE-3417';

/**
 * Create a test comment with current timestamp
 */
function createTestComment() {
  const timestamp = new Date().toISOString();
  
  return {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            {
              type: "text",
              text: "API Test Comment"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "This is a test comment created via the Jira REST API v3."
            }
          ]
        },
        {
          type: "panel",
          attrs: {
            panelType: "info"
          },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `Created at: ${timestamp}`
                }
              ]
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Test details:"
            }
          ]
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "API Endpoint: ",
                      marks: [{ type: "strong" }]
                    },
                    {
                      type: "text",
                      text: "/rest/api/3/issue/{issueIdOrKey}/comment",
                      marks: [{ type: "code" }]
                    }
                  ]
                }
              ]
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Authentication: Basic Auth with API token"
                    }
                  ]
                }
              ]
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Content Format: ADF (Atlassian Document Format)"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "codeBlock",
          attrs: {
            language: "json"
          },
          content: [
            {
              type: "text",
              text: JSON.stringify({
                ticket: TICKET_KEY,
                timestamp: timestamp,
                source: "test-de-3417.js"
              }, null, 2)
            }
          ]
        }
      ]
    }
  };
}

/**
 * Get ticket details
 */
async function getTicketDetails(ticketKey) {
  const endpoint = `/rest/api/3/issue/${ticketKey}`;
  
  try {
    const ticket = await makeJiraRequest(endpoint);
    console.log(`\n📋 Ticket Details:`);
    console.log(`   Key: ${ticket.key}`);
    console.log(`   Summary: ${ticket.fields.summary}`);
    console.log(`   Status: ${ticket.fields.status.name}`);
    console.log(`   Assignee: ${ticket.fields.assignee?.displayName || 'Unassigned'}`);
    console.log(`   Reporter: ${ticket.fields.reporter.displayName}`);
    return ticket;
  } catch (error) {
    console.error(`❌ Failed to get ticket details: ${error.message}`);
    throw error;
  }
}

/**
 * Get existing comments
 */
async function getComments(ticketKey) {
  const endpoint = `/rest/api/3/issue/${ticketKey}/comment`;
  
  try {
    const response = await makeJiraRequest(endpoint);
    console.log(`\n💬 Existing Comments: ${response.total}`);
    
    if (response.comments && response.comments.length > 0) {
      // Show last 3 comments
      const recentComments = response.comments.slice(-3);
      recentComments.forEach((comment, index) => {
        console.log(`\n   Comment ${response.total - (2 - index)}:`);
        console.log(`   Author: ${comment.author.displayName}`);
        console.log(`   Created: ${comment.created}`);
        
        // Extract plain text from ADF
        const text = extractTextFromADF(comment.body);
        console.log(`   Text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
      });
    }
    
    return response;
  } catch (error) {
    console.error(`❌ Failed to get comments: ${error.message}`);
    throw error;
  }
}

/**
 * Extract plain text from ADF body
 */
function extractTextFromADF(adfBody) {
  if (!adfBody || typeof adfBody !== 'object') {
    return '';
  }
  
  let text = '';
  
  function processNode(node) {
    if (!node) return;
    
    if (node.type === 'text') {
      text += node.text || '';
    } else if (node.type === 'mention') {
      text += node.attrs?.text || '@mention';
    } else if (node.content && Array.isArray(node.content)) {
      node.content.forEach(processNode);
    }
  }
  
  if (adfBody.content && Array.isArray(adfBody.content)) {
    adfBody.content.forEach(processNode);
  }
  
  return text.trim();
}

/**
 * Main test function
 */
async function main() {
  console.log(`\n🧪 Testing Jira Comment API with ticket ${TICKET_KEY}\n`);
  
  try {
    // Step 1: Get current user
    console.log('Step 1: Getting current user...');
    const currentUser = await getCurrentUser();
    
    // Step 2: Get ticket details
    console.log('\nStep 2: Getting ticket details...');
    const ticket = await getTicketDetails(TICKET_KEY);
    
    // Step 3: Get existing comments
    console.log('\nStep 3: Checking existing comments...');
    const existingComments = await getComments(TICKET_KEY);
    
    // Step 4: Create test comment
    console.log('\nStep 4: Creating test comment...');
    const commentData = createTestComment();
    const result = await addComment(TICKET_KEY, commentData);
    
    // Step 5: Verify
    console.log('\nStep 5: Verifying comment creation...');
    const updatedComments = await getComments(TICKET_KEY);
    
    if (updatedComments.total > existingComments.total) {
      console.log(`\n✅ Success! Comment count increased from ${existingComments.total} to ${updatedComments.total}`);
    }
    
    console.log(`\n🎉 Test completed successfully!`);
    console.log(`📍 View the comment at: ${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/browse/${TICKET_KEY}?focusedCommentId=${result.id}`);
    
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  main();
}