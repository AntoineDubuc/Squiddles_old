#!/usr/bin/env node

/**
 * Jira Media Structure Investigator
 * Analyzes how media is actually stored in ADF and finds the correct access patterns
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
 * Get full ticket with attachments
 */
async function getTicketWithAttachments(ticketKey) {
  const endpoint = `/rest/api/3/issue/${ticketKey}?expand=attachment`;
  return await makeJiraRequest(endpoint);
}

/**
 * Get specific comment with full ADF structure
 */
async function getCommentWithFullStructure(ticketKey, commentId) {
  const endpoint = `/rest/api/3/issue/${ticketKey}/comment/${commentId}`;
  return await makeJiraRequest(endpoint);
}

/**
 * Deep analyze ADF structure for media nodes
 */
function deepAnalyzeADF(node, path = '', depth = 0) {
  const results = [];
  
  if (!node || typeof node !== 'object') {
    return results;
  }
  
  const currentPath = path ? `${path}.${node.type || 'unknown'}` : (node.type || 'root');
  
  // If this is a media-related node, capture full details
  if (['media', 'mediaGroup', 'mediaSingle'].includes(node.type)) {
    results.push({
      path: currentPath,
      depth: depth,
      nodeType: node.type,
      fullNode: JSON.parse(JSON.stringify(node)), // Deep clone
      attrs: node.attrs || {},
      hasContent: !!(node.content && node.content.length > 0),
      contentCount: node.content ? node.content.length : 0
    });
  }
  
  // Recursively analyze children
  if (node.content && Array.isArray(node.content)) {
    node.content.forEach((child, index) => {
      const childResults = deepAnalyzeADF(child, currentPath, depth + 1);
      results.push(...childResults);
    });
  }
  
  return results;
}

/**
 * Investigate media structure in specific comments
 */
async function investigateMediaStructure() {
  try {
    console.log('🔍 Investigating Media Structure in Jira Comments...');
    
    const testDataPath = path.join(__dirname, 'test-data-examples-2025-06-17.json');
    if (!fs.existsSync(testDataPath)) {
      throw new Error('Test data file not found');
    }

    const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
    
    // Get examples of comments with media
    const mediaExamples = [];
    ['media', 'mediaGroup', 'mediaSingle'].forEach(mediaType => {
      if (testData.dataTypes[mediaType] && testData.dataTypes[mediaType].found) {
        mediaExamples.push(...testData.dataTypes[mediaType].examples);
      }
    });

    console.log(`📋 Found ${mediaExamples.length} media examples to investigate`);
    
    const investigations = [];
    
    for (let i = 0; i < Math.min(mediaExamples.length, 3); i++) {
      const example = mediaExamples[i];
      console.log(`\n⏳ Investigating ${i + 1}: ${example.ticketKey} comment ${example.commentId}`);
      
      try {
        // Get full ticket info including attachments
        console.log('   📋 Getting ticket attachments...');
        const ticketInfo = await getTicketWithAttachments(example.ticketKey);
        
        // Get full comment structure
        console.log('   💬 Getting comment structure...');
        const commentInfo = await getCommentWithFullStructure(example.ticketKey, example.commentId);
        
        // Deep analyze the ADF structure
        console.log('   🔍 Analyzing ADF structure...');
        const adfAnalysis = deepAnalyzeADF(commentInfo.body);
        
        const investigation = {
          ticketKey: example.ticketKey,
          commentId: example.commentId,
          ticketAttachments: ticketInfo.fields.attachment || [],
          commentCreated: commentInfo.created,
          commentAuthor: commentInfo.author.displayName,
          adfMediaNodes: adfAnalysis,
          fullCommentBody: commentInfo.body
        };
        
        investigations.push(investigation);
        
        console.log(`   ✅ Found ${ticketInfo.fields.attachment.length} ticket attachments`);
        console.log(`   ✅ Found ${adfAnalysis.length} ADF media nodes`);
        
        // Show attachment details
        if (ticketInfo.fields.attachment.length > 0) {
          console.log('   📎 Attachments:');
          ticketInfo.fields.attachment.forEach(att => {
            console.log(`      - ${att.filename} (${att.mimeType}) ID: ${att.id}`);
          });
        }
        
        // Show ADF media node details
        if (adfAnalysis.length > 0) {
          console.log('   🎬 ADF Media Nodes:');
          adfAnalysis.forEach(node => {
            console.log(`      - ${node.nodeType} at ${node.path}`);
            console.log(`        Attrs: ${JSON.stringify(node.attrs)}`);
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.warn(`   ⚠️  Failed to investigate ${example.ticketKey}: ${error.message}`);
      }
    }
    
    // Save detailed investigation results
    const outputPath = path.join(__dirname, 'media-structure-investigation.json');
    fs.writeFileSync(outputPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      jiraHost: JIRA_CONFIG.host,
      investigations: investigations,
      summary: {
        totalInvestigated: investigations.length,
        attachmentIds: investigations.flatMap(inv => inv.ticketAttachments.map(att => att.id)),
        mediaNodeTypes: investigations.flatMap(inv => inv.adfMediaNodes.map(node => node.nodeType))
      }
    }, null, 2));
    
    console.log(`\n💾 Investigation results saved: ${path.basename(outputPath)}`);
    
    return investigations;
    
  } catch (error) {
    console.error('❌ Error investigating media structure:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration');
    }

    console.log('🔬 Jira Media Structure Investigator');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}\n`);

    const result = await investigateMediaStructure();
    
    console.log('\n🎉 Investigation Complete!');
    console.log('📊 Check media-structure-investigation.json for detailed results');
    
    return result;
    
  } catch (error) {
    console.error('\n❌ Investigation Failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { investigateMediaStructure };