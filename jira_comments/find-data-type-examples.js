#!/usr/bin/env node

/**
 * Jira Comment Data Type Example Finder
 * Finds comment IDs that contain each supported ADF data type for testing
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
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value.trim();
          }
        }
      });
      
      console.log(`📁 Loaded environment variables from: ${envPath}`);
    }
  } catch (error) {
    console.warn(`⚠️  Failed to load .env file: ${error.message}`);
  }
}

loadEnvFile();

const JIRA_CONFIG = {
  host: process.env.JIRA_HOST || process.env.JIRA_BASE_URL,
  email: process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL,
  token: process.env.JIRA_API_TOKEN
};

// Data types we want to find examples for
const TARGET_DATA_TYPES = {
  'table': { found: false, examples: [] },
  'media': { found: false, examples: [] },
  'mediaGroup': { found: false, examples: [] },
  'mediaSingle': { found: false, examples: [] },
  'codeBlock': { found: false, examples: [] },
  'mention': { found: false, examples: [] },
  'panel': { found: false, examples: [] },
  'bulletList': { found: false, examples: [] },
  'orderedList': { found: false, examples: [] },
  'heading': { found: false, examples: [] },
  'blockquote': { found: false, examples: [] },
  'rule': { found: false, examples: [] },
  'inlineCard': { found: false, examples: [] },
  'blockCard': { found: false, examples: [] }
};

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
 * Analyze ADF content to find data types
 */
function findDataTypes(adfBody, commentInfo) {
  const foundTypes = new Set();
  
  function scanNode(node, depth = 0) {
    if (!node || typeof node !== 'object') return;
    
    const nodeType = node.type;
    if (nodeType && TARGET_DATA_TYPES[nodeType] !== undefined) {
      foundTypes.add(nodeType);
      
      // Add example if we don't have enough yet
      if (TARGET_DATA_TYPES[nodeType].examples.length < 3) {
        TARGET_DATA_TYPES[nodeType].examples.push({
          ...commentInfo,
          nodeType: nodeType,
          nodeContent: extractNodeSample(node),
          depth: depth,
          context: extractContext(node, 2)
        });
        TARGET_DATA_TYPES[nodeType].found = true;
      }
    }
    
    // Recursively scan content
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(child => scanNode(child, depth + 1));
    }
  }
  
  try {
    scanNode(adfBody);
  } catch (error) {
    console.warn(`Error scanning ADF:`, error.message);
  }
  
  return Array.from(foundTypes);
}

/**
 * Extract a sample of the node content for display
 */
function extractNodeSample(node) {
  if (!node) return '';
  
  switch (node.type) {
    case 'text':
      return node.text || '';
      
    case 'table':
      const rowCount = node.content ? node.content.length : 0;
      const attrs = node.attrs || {};
      return `Table: ${rowCount} rows, layout: ${attrs.layout || 'default'}`;
      
    case 'media':
    case 'mediaGroup':
    case 'mediaSingle':
      const mediaAttrs = node.attrs || {};
      return {
        type: 'media',
        id: mediaAttrs.id,
        fileName: mediaAttrs.fileName,
        mimeType: mediaAttrs.mimeType,
        width: mediaAttrs.width,
        height: mediaAttrs.height,
        display: `Media: ${mediaAttrs.fileName || mediaAttrs.id || 'unknown'} (${mediaAttrs.mimeType || 'unknown type'})`
      };
      
    case 'codeBlock':
      const codeAttrs = node.attrs || {};
      const codeText = extractTextFromNode(node).substring(0, 50);
      return `Code (${codeAttrs.language || 'plain'}): ${codeText}...`;
      
    case 'mention':
      const mentionAttrs = node.attrs || {};
      return `@${mentionAttrs.displayName || mentionAttrs.text || mentionAttrs.id}`;
      
    case 'panel':
      const panelAttrs = node.attrs || {};
      const panelText = extractTextFromNode(node).substring(0, 50);
      return `Panel (${panelAttrs.panelType || 'info'}): ${panelText}...`;
      
    case 'heading':
      const headingAttrs = node.attrs || {};
      const headingText = extractTextFromNode(node);
      return `H${headingAttrs.level || '?'}: ${headingText}`;
      
    case 'bulletList':
    case 'orderedList':
      const listItems = node.content ? node.content.length : 0;
      return `${node.type}: ${listItems} items`;
      
    case 'blockquote':
      const quoteText = extractTextFromNode(node).substring(0, 50);
      return `Quote: ${quoteText}...`;
      
    case 'rule':
      return 'Horizontal rule';
      
    case 'inlineCard':
    case 'blockCard':
      const cardAttrs = node.attrs || {};
      return `Card: ${cardAttrs.url || 'unknown URL'}`;
      
    default:
      const nodeText = extractTextFromNode(node).substring(0, 50);
      return nodeText ? `${node.type}: ${nodeText}...` : node.type;
  }
}

/**
 * Extract text content from any node
 */
function extractTextFromNode(node) {
  if (!node) return '';
  
  if (node.type === 'text') {
    return node.text || '';
  }
  
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextFromNode).join('');
  }
  
  return '';
}

/**
 * Extract surrounding context
 */
function extractContext(node, siblingCount = 2) {
  // This is a simplified context extraction
  // In a real implementation, you'd walk up the tree
  return {
    nodeType: node.type,
    hasContent: !!(node.content && node.content.length > 0),
    hasAttrs: !!(node.attrs && Object.keys(node.attrs).length > 0),
    contentTypes: node.content ? 
      node.content.map(child => child.type).filter(Boolean) : []
  };
}

/**
 * Main function to find examples
 */
async function findDataTypeExamples() {
  try {
    console.log('🔍 Finding ADF Data Type Examples...');
    console.log(`📅 Searching in last 2 weeks (since ${TWO_WEEKS_AGO.toDateString()})`);
    console.log('');

    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration');
    }

    const searchResults = await getRecentTickets();
    console.log(`📋 Found ${searchResults.issues.length} recently updated tickets`);
    
    let processedCount = 0;
    let totalCommentsProcessed = 0;

    for (const issue of searchResults.issues) {
      processedCount++;
      console.log(`⏳ Processing ${processedCount}/${searchResults.issues.length}: ${issue.key}`);
      
      try {
        const commentsData = await getTicketComments(issue.key);
        totalCommentsProcessed += commentsData.comments.length;
        
        for (const comment of commentsData.comments) {
          const commentDate = new Date(comment.created);
          
          if (commentDate >= TWO_WEEKS_AGO) {
            const commentInfo = {
              ticketKey: issue.key,
              ticketTitle: issue.fields.summary,
              commentId: comment.id,
              commentAuthor: comment.author?.displayName || 'Unknown',
              commentDate: comment.created,
              commentUrl: `${JIRA_CONFIG.host}/browse/${issue.key}?focusedCommentId=${comment.id}`
            };
            
            if (comment.body && typeof comment.body === 'object') {
              const foundTypes = findDataTypes(comment.body, commentInfo);
              
              if (foundTypes.length > 0) {
                console.log(`   📝 Found: ${foundTypes.join(', ')} in comment by ${comment.author?.displayName}`);
              }
            }
          }
        }
        
        // Check if we have examples for all types
        const foundAll = Object.values(TARGET_DATA_TYPES).every(type => type.found);
        if (foundAll) {
          console.log('🎉 Found examples for all data types! Stopping search.');
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.warn(`⚠️  Failed to process ${issue.key}: ${error.message}`);
      }
    }

    console.log(`\n📊 Processing Complete:`);
    console.log(`   🎫 Tickets processed: ${processedCount}`);
    console.log(`   💬 Comments processed: ${totalCommentsProcessed}`);
    console.log(`   📋 Data types found:`);
    
    const summary = {};
    Object.entries(TARGET_DATA_TYPES).forEach(([type, data]) => {
      const status = data.found ? '✅' : '❌';
      const count = data.examples.length;
      console.log(`      ${status} ${type}: ${count} example(s)`);
      summary[type] = {
        found: data.found,
        count: count,
        examples: data.examples
      };
    });

    return summary;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Generate test data file for webpage
 */
function generateTestDataFile(summary) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `test-data-examples-${timestamp}.json`;
  
  const testData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      jiraHost: JIRA_CONFIG.host,
      searchPeriod: {
        from: TWO_WEEKS_AGO.toISOString(),
        to: new Date().toISOString()
      },
      totalDataTypes: Object.keys(TARGET_DATA_TYPES).length,
      foundDataTypes: Object.values(summary).filter(type => type.found).length
    },
    dataTypes: summary,
    renderingExamples: generateRenderingExamples(summary)
  };
  
  const outputPath = path.join(__dirname, filename);
  fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2));
  
  return { filename, outputPath, testData };
}

/**
 * Generate specific examples for webpage rendering
 */
function generateRenderingExamples(summary) {
  const examples = {};
  
  Object.entries(summary).forEach(([type, data]) => {
    if (data.found && data.examples.length > 0) {
      // Take the best example (first one found)
      const example = data.examples[0];
      examples[type] = {
        commentId: example.commentId,
        commentUrl: example.commentUrl,
        ticketKey: example.ticketKey,
        author: example.commentAuthor,
        preview: example.nodeContent,
        context: example.context
      };
    }
  });
  
  return examples;
}

/**
 * Main execution
 */
async function main() {
  try {
    const summary = await findDataTypeExamples();
    const result = generateTestDataFile(summary);
    
    console.log('\n🎉 SUCCESS!');
    console.log(`📊 Found examples for ${Object.values(summary).filter(s => s.found).length}/${Object.keys(TARGET_DATA_TYPES).length} data types`);
    console.log(`📄 Test data saved: ${result.filename}`);
    console.log(`📁 Full path: ${result.outputPath}`);
    console.log('');
    console.log('✅ Ready to create test webpage!');
    
    return result.testData;
    
  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findDataTypeExamples, generateTestDataFile };