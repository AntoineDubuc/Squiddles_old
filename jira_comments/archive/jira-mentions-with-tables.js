#!/usr/bin/env node

/**
 * Jira Mentions Test Script with ADF Table Detection
 * Enhanced version that detects and renders ADF tables in markdown
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
 * Extract text from Atlassian Document Format (ADF) and detect tables
 */
function extractTextAndTablesFromADF(adfBody) {
  if (!adfBody) return { text: '', tables: [], hasRichContent: false };
  
  let text = '';
  let tables = [];
  let hasRichContent = false;
  
  function processNode(node) {
    if (!node) return '';
    
    // Handle text nodes
    if (node.type === 'text') {
      return node.text || '';
    }
    
    // Handle tables
    if (node.type === 'table') {
      hasRichContent = true;
      const table = processTable(node);
      tables.push(table);
      return `\n[TABLE: ${table.rows.length} rows x ${table.maxCols} columns]\n`;
    }
    
    // Handle mention nodes
    if (node.type === 'mention') {
      const displayName = node.attrs?.text || node.attrs?.displayName || '';
      return `@${displayName}`;
    }
    
    // Handle code blocks
    if (node.type === 'codeBlock') {
      hasRichContent = true;
      const code = processNodeContent(node);
      return `\n\`\`\`${node.attrs?.language || ''}\n${code}\n\`\`\`\n`;
    }
    
    // Handle other rich content types
    if (['media', 'mediaGroup', 'mediaSingle', 'panel', 'inlineCard', 'blockCard'].includes(node.type)) {
      hasRichContent = true;
    }
    
    // Handle content arrays (recursive)
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(processNode).join('');
    }
    
    return '';
  }
  
  function processNodeContent(node) {
    if (!node) return '';
    if (node.type === 'text') return node.text || '';
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(processNodeContent).join('');
    }
    return '';
  }
  
  function processTable(tableNode) {
    const table = {
      layout: tableNode.attrs?.layout || 'default',
      isNumberColumnEnabled: tableNode.attrs?.isNumberColumnEnabled || false,
      rows: [],
      maxCols: 0
    };
    
    if (tableNode.content && Array.isArray(tableNode.content)) {
      tableNode.content.forEach(rowNode => {
        if (rowNode.type === 'tableRow') {
          const row = {
            cells: [],
            isHeader: false
          };
          
          if (rowNode.content && Array.isArray(rowNode.content)) {
            rowNode.content.forEach(cellNode => {
              const cellText = processNodeContent(cellNode).trim();
              const isHeader = cellNode.type === 'tableHeader';
              
              row.cells.push({
                text: cellText,
                isHeader: isHeader,
                colspan: cellNode.attrs?.colspan || 1,
                background: cellNode.attrs?.background
              });
              
              if (isHeader) row.isHeader = true;
            });
          }
          
          table.maxCols = Math.max(table.maxCols, row.cells.length);
          table.rows.push(row);
        }
      });
    }
    
    return table;
  }
  
  try {
    if (adfBody.content && Array.isArray(adfBody.content)) {
      text = adfBody.content.map(processNode).join(' ');
    } else {
      text = processNode(adfBody);
    }
  } catch (error) {
    console.warn('⚠️  Failed to extract text from ADF:', error.message);
    return { text: JSON.stringify(adfBody), tables: [], hasRichContent: false };
  }
  
  return { text: text.trim(), tables, hasRichContent };
}

/**
 * Convert ADF table to markdown table
 */
function tableToMarkdown(table) {
  if (!table.rows || table.rows.length === 0) {
    return '| (Empty Table) |\n|---|\n';
  }
  
  let markdown = '';
  let hasHeaders = false;
  
  // Process each row
  table.rows.forEach((row, rowIndex) => {
    if (row.cells.length === 0) return;
    
    // Build the row
    const cellTexts = row.cells.map(cell => {
      let cellText = cell.text || ' ';
      // Escape pipes in cell content
      cellText = cellText.replace(/\|/g, '\\|');
      // Limit cell width for readability
      if (cellText.length > 50) {
        cellText = cellText.substring(0, 47) + '...';
      }
      return cellText;
    });
    
    // Ensure all rows have the same number of columns
    while (cellTexts.length < table.maxCols) {
      cellTexts.push(' ');
    }
    
    markdown += `| ${cellTexts.join(' | ')} |\n`;
    
    // Add header separator after first row if it contains headers, or after first row anyway
    if (rowIndex === 0) {
      const separator = Array(table.maxCols).fill('---').join(' | ');
      markdown += `| ${separator} |\n`;
      hasHeaders = true;
    }
  });
  
  return markdown;
}

/**
 * Check if comment contains mention (comprehensive patterns)
 */
function containsMention(commentText, userEmail) {
  if (!commentText || typeof commentText !== 'string') {
    return false;
  }
  
  const username = userEmail.split('@')[0]; // e.g., "adubuc" from "adubuc@cloudgeometry.com"
  const firstName = username.charAt(0).toUpperCase() + username.slice(1); // e.g., "Adubuc"
  
  const patterns = [
    userEmail,
    `@${userEmail}`,
    `@${username}`,
    `@${firstName}`,
    username,
    firstName,
    `[~${username}]`,
    `[~${userEmail}]`,
    username.toLowerCase(),
    'antoine',
    'dubuc',
    'antoine dubuc',
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
    console.log('🦑 Jira Mentions Test with Tables - Starting...');
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
    let totalTablesFound = 0;

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
            // Extract text and tables from comment body (Jira uses Atlassian Document Format)
            let analysis = { text: '', tables: [], hasRichContent: false };
            
            if (typeof comment.body === 'string') {
              analysis.text = comment.body;
            } else if (comment.body && comment.body.content) {
              // Atlassian Document Format - extract text and detect tables
              analysis = extractTextAndTablesFromADF(comment.body);
            }
            
            // Count tables found
            if (analysis.tables.length > 0) {
              totalTablesFound += analysis.tables.length;
              console.log(`   📊 Found ${analysis.tables.length} table(s) in comment by ${comment.author?.displayName}`);
            }
            
            if (analysis.hasRichContent) {
              console.log(`   🎨 Rich content detected in comment by ${comment.author?.displayName}`);
            }
            
            if (containsMention(analysis.text, JIRA_CONFIG.email)) {
              mentions.push({
                ticketKey: issue.key,
                ticketTitle: issue.fields.summary,
                ticketUrl: `${JIRA_CONFIG.host}/browse/${issue.key}`,
                commentId: comment.id,
                commentAuthor: comment.author?.displayName || 'Unknown',
                commentDate: comment.created,
                commentBody: analysis.text,
                commentUrl: `${JIRA_CONFIG.host}/browse/${issue.key}?focusedCommentId=${comment.id}`,
                tables: analysis.tables,
                hasRichContent: analysis.hasRichContent
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

    console.log(`\n📊 Summary: Found ${totalTablesFound} total tables across all comments`);
    return mentions;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Generate markdown report with table rendering
 */
function generateMarkdownReport(mentions) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `jira-mentions-with-tables-${timestamp}.md`;
  
  let markdown = `# 🎯 Jira Mentions Report (with Tables)\n\n`;
  markdown += `**Generated:** ${new Date().toLocaleString()}\n`;
  markdown += `**Period:** Last 2 weeks (since ${TWO_WEEKS_AGO.toDateString()})\n`;
  markdown += `**User:** ${JIRA_CONFIG.email}\n`;
  markdown += `**Total Mentions Found:** ${mentions.length}\n`;
  
  // Count rich content
  const richContentCount = mentions.filter(m => m.hasRichContent).length;
  const tableCount = mentions.reduce((sum, m) => sum + m.tables.length, 0);
  
  markdown += `**Rich Content:** ${richContentCount} mentions with rich formatting\n`;
  markdown += `**Tables Found:** ${tableCount} tables total\n\n`;
  
  if (mentions.length === 0) {
    markdown += `## ✅ No Mentions Found\n\n`;
    markdown += `No mentions of "${JIRA_CONFIG.email}" were found in Jira comments from the last 2 weeks.\n\n`;
  } else {
    markdown += `## 📋 Mentions Found\n\n`;
    
    // Sort by date (newest first)
    mentions.sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate));
    
    mentions.forEach((mention, index) => {
      markdown += `### ${index + 1}. ${mention.ticketKey}: ${mention.ticketTitle}\n\n`;
      markdown += `- **Author:** ${mention.commentAuthor}\n`;
      markdown += `- **Date:** ${new Date(mention.commentDate).toLocaleString()}\n`;
      markdown += `- **Ticket:** [${mention.ticketKey}](${mention.ticketUrl})\n`;
      markdown += `- **Comment:** [View Comment](${mention.commentUrl})\n`;
      
      if (mention.hasRichContent) {
        markdown += `- **Rich Content:** ✅ Contains formatting/tables/media\n`;
      }
      
      if (mention.tables.length > 0) {
        markdown += `- **Tables:** ${mention.tables.length} table(s) found\n`;
      }
      
      markdown += `\n`;
      
      // Show tables first if they exist
      if (mention.tables.length > 0) {
        mention.tables.forEach((table, tableIndex) => {
          markdown += `**Table ${tableIndex + 1}** (${table.rows.length} rows, layout: ${table.layout}):\n\n`;
          markdown += tableToMarkdown(table);
          markdown += `\n`;
        });
      }
      
      // Then show the comment content
      markdown += `**Comment Content:**\n`;
      markdown += `\`\`\`\n${mention.commentBody}\n\`\`\`\n\n`;
      markdown += `---\n\n`;
    });
  }
  
  markdown += `## 🔧 Technical Details\n\n`;
  markdown += `- **Script:** jira-mentions-with-tables.js\n`;
  markdown += `- **Jira Host:** ${JIRA_CONFIG.host}\n`;
  markdown += `- **Search Period:** ${TWO_WEEKS_AGO.toISOString()} to ${new Date().toISOString()}\n`;
  markdown += `- **ADF Processing:** ✅ Tables and rich content detected\n`;
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
    console.log('✅ Jira comment retrieval with table detection completed successfully!');
    
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