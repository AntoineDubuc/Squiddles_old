#!/usr/bin/env node

/**
 * Jira Mentions Test Script
 * Simple proof-of-concept to retrieve Jira comments and find mentions
 * Completely isolated test - does not depend on main codebase
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from root .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
            process.env[key.trim()] = value.trim();
          }
        }
      });
      
      console.log(`📁 Loaded environment variables from: ${envPath}`);
    } else {
      console.log(`⚠️  No .env file found at: ${envPath}`);
    }
  } catch (error) {
    console.warn(`⚠️  Failed to load .env file: ${error.message}`);
  }
}

// Load environment variables first
loadEnvFile();

// Configuration
const JIRA_CONFIG = {
  host: process.env.JIRA_HOST || process.env.JIRA_BASE_URL,
  email: process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL,
  token: process.env.JIRA_API_TOKEN
};

// Date range: last 2 weeks
const TWO_WEEKS_AGO = new Date();
TWO_WEEKS_AGO.setDate(TWO_WEEKS_AGO.getDate() - 14);

/**
 * Make authenticated request to Jira API
 */
function makeJiraRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
    const url = new URL(endpoint, JIRA_CONFIG.host);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
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
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Search for recently updated tickets
 */
async function getRecentTickets() {
  const jql = `updated >= -2w ORDER BY updated DESC`;
  const endpoint = `/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=100&expand=changelog`;
  
  console.log('🔍 Searching for tickets updated in last 2 weeks...');
  return await makeJiraRequest(endpoint);
}

/**
 * Get comments for a specific ticket
 */
async function getTicketComments(ticketKey) {
  const endpoint = `/rest/api/3/issue/${ticketKey}/comment?maxResults=1000`;
  return await makeJiraRequest(endpoint);
}

/**
 * Extract text from Atlassian Document Format (ADF)
 */
function extractTextFromADF(adfBody) {
  if (!adfBody) return '';
  
  let text = '';
  
  function extractFromNode(node) {
    if (!node) return '';
    
    // Handle text nodes
    if (node.type === 'text') {
      return node.text || '';
    }
    
    // Handle mention nodes
    if (node.type === 'mention') {
      const displayName = node.attrs?.text || node.attrs?.displayName || '';
      const accountId = node.attrs?.id || '';
      return `@${displayName}`;
    }
    
    // Handle content arrays (recursive)
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join('');
    }
    
    // Handle marks (like strong, em, etc.)
    if (node.marks && Array.isArray(node.marks)) {
      // Process the text with marks
      return extractFromNode({...node, marks: undefined});
    }
    
    return '';
  }
  
  try {
    if (adfBody.content && Array.isArray(adfBody.content)) {
      text = adfBody.content.map(extractFromNode).join(' ');
    } else {
      text = extractFromNode(adfBody);
    }
  } catch (error) {
    console.warn('⚠️  Failed to extract text from ADF:', error.message);
    return JSON.stringify(adfBody); // Fallback to stringified version
  }
  
  return text.trim();
}

/**
 * Check if comment contains mention (comprehensive patterns)
 */
function containsMention(commentText, userEmail) {
  // Handle various comment text formats from Jira API
  if (!commentText || typeof commentText !== 'string') {
    return false;
  }
  
  const username = userEmail.split('@')[0]; // e.g., "adubuc" from "adubuc@cloudgeometry.com"
  const firstName = username.charAt(0).toUpperCase() + username.slice(1); // e.g., "Adubuc"
  
  const patterns = [
    // Direct email mentions
    userEmail,
    // @mentions
    `@${userEmail}`,
    `@${username}`,
    `@${firstName}`,
    // Name variations (common in Jira)
    username,
    firstName,
    // Jira user links (common format)
    `[~${username}]`,
    `[~${userEmail}]`,
    // Account ID mentions (Jira Cloud format)
    username.toLowerCase(),
    // Full name patterns (you might need to adjust these)
    'antoine',
    'dubuc',
    'antoine dubuc',
    // Add other name variations you use
  ];
  
  const lowerComment = commentText.toLowerCase();
  
  return patterns.some(pattern => 
    lowerComment.includes(pattern.toLowerCase())
  );
}

/**
 * Process tickets and find mentions
 */
async function findMentions() {
  try {
    console.log('🦑 Jira Mentions Test - Starting...');
    console.log(`📅 Looking for mentions in last 2 weeks (since ${TWO_WEEKS_AGO.toDateString()})`);
    console.log(`🎯 Target user: ${JIRA_CONFIG.email}`);
    console.log('');

    // Validate configuration
    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration. Please set JIRA_HOST, JIRA_EMAIL, and JIRA_API_TOKEN environment variables.');
    }

    // Get recent tickets
    const searchResults = await getRecentTickets();
    console.log(`📋 Found ${searchResults.issues.length} recently updated tickets`);
    
    const mentions = [];
    let processedCount = 0;

    // Process each ticket
    for (const issue of searchResults.issues) {
      processedCount++;
      console.log(`⏳ Processing ${processedCount}/${searchResults.issues.length}: ${issue.key} - ${issue.fields.summary}`);
      
      try {
        // Get comments for this ticket
        const commentsData = await getTicketComments(issue.key);
        
        // Debug: show total comments found
        console.log(`   📝 Found ${commentsData.comments.length} total comments`);
        
        // Check each comment for mentions
        for (const comment of commentsData.comments) {
          const commentDate = new Date(comment.created);
          
          // Only check comments from last 2 weeks
          if (commentDate >= TWO_WEEKS_AGO) {
            // Debug: show comment structure for first few comments
            if (mentions.length < 3) {
              console.log(`   🔍 Debug comment structure:`, JSON.stringify(comment, null, 2).substring(0, 300) + '...');
            }
            
            // Extract text from comment body (Jira uses Atlassian Document Format)
            let commentText = '';
            if (typeof comment.body === 'string') {
              commentText = comment.body;
            } else if (comment.body && comment.body.content) {
              // Atlassian Document Format - extract text
              commentText = extractTextFromADF(comment.body);
            }
            
            if (commentText && mentions.length < 5) {
              console.log(`   💬 Sample comment from ${comment.author?.displayName}: "${commentText.substring(0, 100)}..."`);
            }
            
            if (containsMention(commentText, JIRA_CONFIG.email)) {
              mentions.push({
                ticketKey: issue.key,
                ticketTitle: issue.fields.summary,
                ticketUrl: `${JIRA_CONFIG.host}/browse/${issue.key}`,
                commentId: comment.id,
                commentAuthor: comment.author?.displayName || 'Unknown',
                commentDate: comment.created,
                commentBody: commentText,
                commentUrl: `${JIRA_CONFIG.host}/browse/${issue.key}?focusedCommentId=${comment.id}`
              });
            }
          }
        }
        
        // Small delay to be nice to Jira API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.warn(`⚠️  Failed to get comments for ${issue.key}: ${error.message}`);
      }
    }

    return mentions;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(mentions) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `jira-mentions-${timestamp}.md`;
  
  let markdown = `# 🎯 Jira Mentions Report\n\n`;
  markdown += `**Generated:** ${new Date().toLocaleString()}\n`;
  markdown += `**Period:** Last 2 weeks (since ${TWO_WEEKS_AGO.toDateString()})\n`;
  markdown += `**User:** ${JIRA_CONFIG.email}\n`;
  markdown += `**Total Mentions Found:** ${mentions.length}\n\n`;
  
  if (mentions.length === 0) {
    markdown += `## ✅ No Mentions Found\n\n`;
    markdown += `No mentions of "${JIRA_CONFIG.email}" were found in Jira comments from the last 2 weeks.\n\n`;
    markdown += `This could mean:\n`;
    markdown += `- No one mentioned you recently\n`;
    markdown += `- The mention patterns need adjustment\n`;
    markdown += `- There were API access issues\n\n`;
  } else {
    markdown += `## 📋 Mentions Found\n\n`;
    
    // Sort by date (newest first)
    mentions.sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate));
    
    mentions.forEach((mention, index) => {
      markdown += `### ${index + 1}. ${mention.ticketKey}: ${mention.ticketTitle}\n\n`;
      markdown += `- **Author:** ${mention.commentAuthor}\n`;
      markdown += `- **Date:** ${new Date(mention.commentDate).toLocaleString()}\n`;
      markdown += `- **Ticket:** [${mention.ticketKey}](${mention.ticketUrl})\n`;
      markdown += `- **Comment:** [View Comment](${mention.commentUrl})\n\n`;
      markdown += `**Comment Content:**\n`;
      markdown += `\`\`\`\n${mention.commentBody}\n\`\`\`\n\n`;
      markdown += `---\n\n`;
    });
  }
  
  markdown += `## 🔧 Technical Details\n\n`;
  markdown += `- **Script:** jira-mentions-test.js\n`;
  markdown += `- **Jira Host:** ${JIRA_CONFIG.host}\n`;
  markdown += `- **Search Period:** ${TWO_WEEKS_AGO.toISOString()} to ${new Date().toISOString()}\n`;
  markdown += `- **Status:** Script completed successfully ✅\n`;
  
  // Write to file
  const outputPath = path.join(__dirname, filename);
  fs.writeFileSync(outputPath, markdown);
  
  return { filename, outputPath };
}

/**
 * Main execution
 */
async function main() {
  try {
    const mentions = await findMentions();
    const report = generateMarkdownReport(mentions);
    
    console.log('');
    console.log('🎉 SUCCESS!');
    console.log(`📊 Found ${mentions.length} mentions`);
    console.log(`📄 Report saved: ${report.filename}`);
    console.log(`📁 Full path: ${report.outputPath}`);
    console.log('');
    console.log('✅ Jira comment retrieval test completed successfully!');
    
  } catch (error) {
    console.error('');
    console.error('❌ FAILED!');
    console.error(`Error: ${error.message}`);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('1. Check your environment variables (JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN)');
    console.error('2. Verify Jira API access and permissions');
    console.error('3. Check network connectivity to Jira instance');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { findMentions, generateMarkdownReport };