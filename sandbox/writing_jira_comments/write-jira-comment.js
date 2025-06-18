#!/usr/bin/env node

/**
 * Write Jira Comment Script
 * 
 * This script demonstrates how to write comments to Jira tickets using the REST API v3.
 * It handles both plain text and ADF (Atlassian Document Format) comments.
 */

const https = require('https');
const { URL } = require('url');

// Configuration from environment variables
const JIRA_HOST = process.env.JIRA_HOST || process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Validate configuration
if (!JIRA_HOST || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   JIRA_HOST (or JIRA_BASE_URL)');
  console.error('   JIRA_EMAIL (or JIRA_USER_EMAIL)');
  console.error('   JIRA_API_TOKEN');
  process.exit(1);
}

/**
 * Make a Jira API request
 */
function makeJiraRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, JIRA_HOST);
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Create a plain text comment
 */
function createPlainTextComment(text) {
  return {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: text
            }
          ]
        }
      ]
    }
  };
}

/**
 * Create a comment with mentions
 */
function createCommentWithMention(text, userAccountId, userName) {
  return {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Hey "
            },
            {
              type: "mention",
              attrs: {
                id: userAccountId,
                text: `@${userName}`,
                userType: "DEFAULT"
              }
            },
            {
              type: "text",
              text: `, ${text}`
            }
          ]
        }
      ]
    }
  };
}

/**
 * Create a rich comment with formatting
 */
function createRichComment() {
  return {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "heading",
          attrs: {
            level: 2
          },
          content: [
            {
              type: "text",
              text: "Test Comment from API"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "This is a test comment created via the Jira REST API v3. It includes:"
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
                      text: "Rich formatting with ",
                      marks: [
                        {
                          type: "strong"
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: "bold"
                    },
                    {
                      type: "text",
                      text: " and ",
                      marks: [
                        {
                          type: "em"
                        }
                      ]
                    },
                    {
                      type: "text",
                      text: "italic"
                    },
                    {
                      type: "text",
                      text: " text"
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
                      text: "Code blocks and tables"
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
                      text: "User mentions (if needed)"
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
            language: "javascript"
          },
          content: [
            {
              type: "text",
              text: "// Example code block\nconst message = 'Hello from Jira API!';\nconsole.log(message);"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Created on: " + new Date().toISOString()
            }
          ]
        }
      ]
    }
  };
}

/**
 * Add a comment to a Jira issue
 */
async function addComment(issueKeyOrId, commentData) {
  const endpoint = `/rest/api/3/issue/${issueKeyOrId}/comment`;
  
  try {
    console.log(`📝 Adding comment to ${issueKeyOrId}...`);
    const result = await makeJiraRequest(endpoint, 'POST', commentData);
    console.log(`✅ Comment added successfully!`);
    console.log(`   Comment ID: ${result.id}`);
    console.log(`   Created: ${result.created}`);
    console.log(`   Author: ${result.author.displayName}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to add comment: ${error.message}`);
    throw error;
  }
}

/**
 * Get current user info
 */
async function getCurrentUser() {
  const endpoint = '/rest/api/3/myself';
  
  try {
    const user = await makeJiraRequest(endpoint);
    console.log(`👤 Current user: ${user.displayName} (${user.accountId})`);
    return user;
  } catch (error) {
    console.error(`❌ Failed to get current user: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  const ticketKey = process.argv[2] || 'DE-3417';
  const commentType = process.argv[3] || 'rich'; // plain, mention, or rich
  
  console.log(`\n🎫 Writing comment to ticket: ${ticketKey}`);
  console.log(`📝 Comment type: ${commentType}\n`);

  try {
    // Get current user info
    const currentUser = await getCurrentUser();
    
    // Create comment based on type
    let commentData;
    
    switch (commentType) {
      case 'plain':
        commentData = createPlainTextComment(
          'This is a test comment from the Jira API script. Testing plain text comments.'
        );
        break;
        
      case 'mention':
        // For demo purposes, we'll mention ourselves
        commentData = createCommentWithMention(
          'this is a test comment with a mention.',
          currentUser.accountId,
          currentUser.displayName
        );
        break;
        
      case 'rich':
      default:
        commentData = createRichComment();
        break;
    }
    
    // Add the comment
    const result = await addComment(ticketKey, commentData);
    
    console.log('\n✅ Comment created successfully!');
    console.log(`📍 View it at: ${JIRA_HOST}/browse/${ticketKey}?focusedCommentId=${result.id}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

// Export functions for use in other scripts
module.exports = {
  makeJiraRequest,
  createPlainTextComment,
  createCommentWithMention,
  createRichComment,
  addComment,
  getCurrentUser
};