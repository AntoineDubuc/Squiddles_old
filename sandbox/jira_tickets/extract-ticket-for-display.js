#!/usr/bin/env node

/**
 * Extract Single Ticket for Display
 * Creates a detailed ticket display with ADF content rendering
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from root .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '..', '.env');
  
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

// Target tickets with interesting content for display
const INTERESTING_TICKETS = [
  'DE-3081',   // User requested ticket
  'PROD-9733', // Recent ticket with ADF content
  'PROD-9731', // Has media content
  'PROD-9727', // Complex ADF structure
  'DE-3360',   // Has attachments
  'PROD-9622'  // Rich content example
];

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
 * Get ticket with comprehensive field expansion
 */
async function getDetailedTicket(ticketKey) {
  const endpoint = `/rest/api/3/issue/${ticketKey}?expand=attachment,comment,renderedFields,names,changelog,transitions,editmeta,issuelinks,subtasks`;
  return await makeJiraRequest(endpoint);
}

/**
 * Analyze ADF content structure for display
 */
function analyzeADFForDisplay(adfContent, ticketKey) {
  if (!adfContent || typeof adfContent !== 'object' || adfContent.type !== 'doc') {
    return {
      hasADF: false,
      structure: null,
      contentSummary: 'No ADF content'
    };
  }

  const structure = {
    nodeTypes: new Set(),
    textLength: 0,
    nodeCount: 0,
    elements: []
  };

  function analyzeNode(node, depth = 0, path = []) {
    if (!node || typeof node !== 'object') return;
    
    structure.nodeCount++;
    const nodeType = node.type;
    
    if (nodeType) {
      structure.nodeTypes.add(nodeType);
      
      // Extract specific elements for display
      if (nodeType === 'mention') {
        structure.elements.push({
          type: 'mention',
          data: {
            userId: node.attrs?.id,
            displayName: node.attrs?.text || node.attrs?.displayName,
            userType: node.attrs?.userType
          },
          depth,
          path: [...path, nodeType]
        });
      } else if (nodeType === 'table') {
        structure.elements.push({
          type: 'table',
          data: extractTableStructure(node),
          depth,
          path: [...path, nodeType]
        });
      } else if (['media', 'mediaSingle', 'mediaGroup'].includes(nodeType)) {
        structure.elements.push({
          type: 'media',
          data: {
            id: node.attrs?.id,
            fileName: node.attrs?.fileName,
            mimeType: node.attrs?.mimeType,
            collection: node.attrs?.collection
          },
          depth,
          path: [...path, nodeType]
        });
      } else if (nodeType === 'status') {
        structure.elements.push({
          type: 'status',
          data: {
            text: node.attrs?.text,
            color: node.attrs?.color,
            style: node.attrs?.style
          },
          depth,
          path: [...path, nodeType]
        });
      } else if (nodeType === 'inlineCard') {
        structure.elements.push({
          type: 'link',
          data: {
            url: node.attrs?.url,
            title: node.attrs?.title
          },
          depth,
          path: [...path, nodeType]
        });
      } else if (nodeType === 'codeBlock') {
        structure.elements.push({
          type: 'code',
          data: {
            language: node.attrs?.language,
            content: extractTextFromNode(node)
          },
          depth,
          path: [...path, nodeType]
        });
      }
    }

    // Extract text content
    if (node.text && typeof node.text === 'string') {
      structure.textLength += node.text.length;
    }

    // Recursively analyze content
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child, index) => 
        analyzeNode(child, depth + 1, [...path, nodeType, index])
      );
    }
  }

  try {
    analyzeNode(adfContent);
  } catch (error) {
    console.warn(`⚠️  Error analyzing ADF for ${ticketKey}: ${error.message}`);
  }

  return {
    hasADF: true,
    structure: {
      nodeTypes: Array.from(structure.nodeTypes),
      textLength: structure.textLength,
      nodeCount: structure.nodeCount,
      elements: structure.elements
    },
    contentSummary: `${structure.nodeCount} nodes, ${structure.nodeTypes.size} types, ${structure.textLength} chars`
  };
}

/**
 * Extract table structure from ADF table node
 */
function extractTableStructure(tableNode) {
  const table = {
    rows: [],
    columnCount: 0,
    hasHeaders: false
  };

  if (tableNode.content && Array.isArray(tableNode.content)) {
    tableNode.content.forEach((row, rowIndex) => {
      if (row.type === 'tableRow') {
        const rowData = {
          cells: [],
          isHeader: false
        };

        if (row.content && Array.isArray(row.content)) {
          row.content.forEach(cell => {
            if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
              rowData.cells.push({
                content: extractTextFromNode(cell),
                isHeader: cell.type === 'tableHeader'
              });
              
              if (cell.type === 'tableHeader') {
                rowData.isHeader = true;
                table.hasHeaders = true;
              }
            }
          });
        }

        table.rows.push(rowData);
        table.columnCount = Math.max(table.columnCount, rowData.cells.length);
      }
    });
  }

  return table;
}

/**
 * Extract text content from any ADF node
 */
function extractTextFromNode(node) {
  let text = '';
  
  function traverse(n) {
    if (n.text) {
      text += n.text;
    }
    if (n.content && Array.isArray(n.content)) {
      n.content.forEach(traverse);
    }
  }
  
  traverse(node);
  return text.trim();
}

/**
 * Extract comprehensive ticket data for display
 */
function extractTicketDisplayData(ticket) {
  const fields = ticket.fields || {};
  
  // Analyze description
  const descriptionAnalysis = analyzeADFForDisplay(fields.description, ticket.key);
  
  // Extract key fields with safe access
  const displayData = {
    // Core identification
    key: ticket.key,
    id: ticket.id,
    url: `${JIRA_CONFIG.host}/browse/${ticket.key}`,
    self: ticket.self,
    
    // Basic information
    summary: fields.summary || '[No Summary]',
    description: fields.description,
    descriptionAnalysis,
    
    // Status and classification
    status: fields.status ? {
      name: fields.status.name,
      id: fields.status.id,
      category: fields.status.statusCategory ? fields.status.statusCategory.name : null,
      color: fields.status.statusCategory ? fields.status.statusCategory.colorName : null
    } : null,
    
    priority: fields.priority ? {
      name: fields.priority.name,
      id: fields.priority.id,
      iconUrl: fields.priority.iconUrl
    } : null,
    
    issueType: fields.issuetype ? {
      name: fields.issuetype.name,
      id: fields.issuetype.id,
      description: fields.issuetype.description,
      iconUrl: fields.issuetype.iconUrl,
      subtask: fields.issuetype.subtask
    } : null,
    
    // Project information
    project: fields.project ? {
      key: fields.project.key,
      name: fields.project.name,
      id: fields.project.id,
      avatarUrls: fields.project.avatarUrls
    } : null,
    
    // People
    reporter: fields.reporter ? {
      displayName: fields.reporter.displayName,
      emailAddress: fields.reporter.emailAddress,
      accountId: fields.reporter.accountId,
      avatarUrls: fields.reporter.avatarUrls
    } : null,
    
    assignee: fields.assignee ? {
      displayName: fields.assignee.displayName,
      emailAddress: fields.assignee.emailAddress,
      accountId: fields.assignee.accountId,
      avatarUrls: fields.assignee.avatarUrls
    } : null,
    
    // Dates
    created: fields.created,
    updated: fields.updated,
    resolutiondate: fields.resolutiondate,
    
    // Content metadata
    labels: fields.labels || [],
    components: fields.components ? fields.components.map(c => ({
      name: c.name,
      id: c.id,
      description: c.description
    })) : [],
    
    fixVersions: fields.fixVersions ? fields.fixVersions.map(v => ({
      name: v.name,
      id: v.id,
      description: v.description,
      released: v.released,
      releaseDate: v.releaseDate
    })) : [],
    
    // Relationships
    issuelinks: fields.issuelinks ? fields.issuelinks.map(link => ({
      type: link.type.name,
      direction: link.outwardIssue ? 'outward' : 'inward',
      linkedIssue: link.outwardIssue || link.inwardIssue
    })) : [],
    
    subtasks: fields.subtasks ? fields.subtasks.map(sub => ({
      key: sub.key,
      summary: sub.fields.summary,
      status: sub.fields.status.name,
      issueType: sub.fields.issuetype.name
    })) : [],
    
    // Attachments and comments
    attachments: fields.attachment ? fields.attachment.map(att => ({
      id: att.id,
      filename: att.filename,
      size: att.size,
      mimeType: att.mimeType,
      created: att.created,
      author: att.author.displayName
    })) : [],
    
    commentsTotal: fields.comment ? fields.comment.total : 0,
    comments: fields.comment && fields.comment.comments ? fields.comment.comments.map(comment => ({
      id: comment.id,
      author: comment.author ? {
        displayName: comment.author.displayName,
        emailAddress: comment.author.emailAddress,
        accountId: comment.author.accountId,
        avatarUrls: comment.author.avatarUrls
      } : null,
      body: comment.body,
      created: comment.created,
      updated: comment.updated,
      self: comment.self
    })) : [],
    
    // Rendered fields (if available)
    renderedFields: ticket.renderedFields || null,
    
    // Processing metadata
    extractedAt: new Date().toISOString(),
    extractedBy: 'jira-tickets-display-extractor'
  };
  
  return displayData;
}

/**
 * Main extraction function
 */
async function extractTicketForDisplay() {
  try {
    console.log('🎫 Extracting Ticket for Display Interface');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}`);
    console.log('');

    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration. Check .env file.');
    }

    // Try to get an interesting ticket, fallback to first available
    let selectedTicket = null;
    
    for (const ticketKey of INTERESTING_TICKETS) {
      try {
        console.log(`🔍 Trying ticket: ${ticketKey}`);
        selectedTicket = await getDetailedTicket(ticketKey);
        console.log(`✅ Successfully retrieved: ${ticketKey}`);
        break;
      } catch (error) {
        console.log(`⚠️  Failed to get ${ticketKey}: ${error.message}`);
      }
    }
    
    if (!selectedTicket) {
      // Fallback: get a recent ticket
      console.log('🔍 Falling back to recent ticket search...');
      const searchResult = await makeJiraRequest('/rest/api/3/search?jql=updated >= -7d&maxResults=1&expand=attachment,comment,renderedFields');
      
      if (searchResult.issues && searchResult.issues.length > 0) {
        const ticketKey = searchResult.issues[0].key;
        selectedTicket = await getDetailedTicket(ticketKey);
        console.log(`✅ Using fallback ticket: ${ticketKey}`);
      } else {
        throw new Error('No tickets found for display');
      }
    }

    // Extract comprehensive display data
    console.log('📊 Extracting display data...');
    const displayData = extractTicketDisplayData(selectedTicket);
    
    // Save extracted data
    const outputFile = path.join(__dirname, 'ticket-display-data.json');
    fs.writeFileSync(outputFile, JSON.stringify(displayData, null, 2));
    
    // Generate summary
    console.log('\n📋 TICKET EXTRACTION COMPLETE!');
    console.log('='.repeat(50));
    console.log(`🎫 Ticket: ${displayData.key}`);
    console.log(`📝 Summary: ${displayData.summary}`);
    console.log(`📊 Status: ${displayData.status ? displayData.status.name : 'Unknown'}`);
    console.log(`⚡ Priority: ${displayData.priority ? displayData.priority.name : 'Unknown'}`);
    console.log(`🏷️  Type: ${displayData.issueType ? displayData.issueType.name : 'Unknown'}`);
    console.log(`👤 Assignee: ${displayData.assignee ? displayData.assignee.displayName : 'Unassigned'}`);
    console.log(`📅 Created: ${displayData.created}`);
    console.log(`📎 Attachments: ${displayData.attachments.length}`);
    console.log(`💬 Comments: ${displayData.commentsTotal}`);
    console.log(`🎨 ADF Content: ${displayData.descriptionAnalysis.contentSummary}`);
    
    if (displayData.descriptionAnalysis.hasADF) {
      console.log(`📋 ADF Elements Found: ${displayData.descriptionAnalysis.structure.elements.length}`);
      const elementTypes = [...new Set(displayData.descriptionAnalysis.structure.elements.map(e => e.type))];
      console.log(`🎯 Element Types: ${elementTypes.join(', ')}`);
    }
    
    console.log(`📁 Data saved: ${path.basename(outputFile)}`);
    
    return displayData;

  } catch (error) {
    console.error('\n❌ Extraction failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  extractTicketForDisplay();
}

module.exports = { extractTicketForDisplay };