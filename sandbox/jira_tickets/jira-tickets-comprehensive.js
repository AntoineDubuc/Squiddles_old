#!/usr/bin/env node

/**
 * Comprehensive Jira Tickets Analyzer - Fixed Version
 * Properly handles Jira API field structure and ADF content
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

/**
 * Make authenticated request to Jira API with retry logic
 */
function makeJiraRequest(endpoint, retries = 3) {
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

    function attempt(attemptsLeft) {
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
              if (attemptsLeft > 0) {
                console.warn(`⚠️  JSON parse error, retrying... (${attemptsLeft} attempts left)`);
                setTimeout(() => attempt(attemptsLeft - 1), 1000);
              } else {
                reject(new Error(`Failed to parse JSON: ${error.message}`));
              }
            }
          } else if (res.statusCode === 429 && attemptsLeft > 0) {
            const retryAfter = parseInt(res.headers['retry-after']) || 5;
            console.warn(`⏳ Rate limited, waiting ${retryAfter}s... (${attemptsLeft} attempts left)`);
            setTimeout(() => attempt(attemptsLeft - 1), retryAfter * 1000);
          } else if (attemptsLeft > 0) {
            console.warn(`⚠️  HTTP ${res.statusCode}, retrying... (${attemptsLeft} attempts left)`);
            setTimeout(() => attempt(attemptsLeft - 1), 2000);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        if (attemptsLeft > 0) {
          console.warn(`⚠️  Request error, retrying... (${attemptsLeft} attempts left)`);
          setTimeout(() => attempt(attemptsLeft - 1), 2000);
        } else {
          reject(error);
        }
      });
      
      req.end();
    }

    attempt(retries);
  });
}

/**
 * Get tickets with proper field handling
 */
async function getTicketsWithFullFields(jql, maxResults = 50, startAt = 0) {
  const params = new URLSearchParams({
    jql: jql,
    maxResults: maxResults.toString(),
    startAt: startAt.toString(),
    expand: 'attachment,comment,renderedFields,names',
    validateQuery: 'true'
    // Note: Not specifying fields parameter to get all fields
  });

  const endpoint = `/rest/api/3/search?${params}`;
  return await makeJiraRequest(endpoint);
}

/**
 * Analyze ADF content in descriptions - Enhanced from comments analyzer
 */
function analyzeADFContent(adfContent, ticketKey) {
  if (!adfContent || typeof adfContent !== 'object') {
    return {
      hasADF: false,
      contentTypes: [],
      textLength: 0,
      complexity: 'none'
    };
  }

  const foundTypes = new Set();
  let textLength = 0;
  let nodeCount = 0;
  let mediaCount = 0;
  let linkCount = 0;
  let mentionCount = 0;
  let tableCount = 0;

  function scanNode(node, depth = 0) {
    if (!node || typeof node !== 'object') return;
    
    nodeCount++;
    const nodeType = node.type;
    
    if (nodeType) {
      foundTypes.add(nodeType);
      
      // Count specific content types
      if (['media', 'mediaGroup', 'mediaSingle'].includes(nodeType)) {
        mediaCount++;
      } else if (['inlineCard', 'blockCard'].includes(nodeType)) {
        linkCount++;
      } else if (nodeType === 'mention') {
        mentionCount++;
      } else if (nodeType === 'table') {
        tableCount++;
      }
    }

    // Extract text content
    if (node.text && typeof node.text === 'string') {
      textLength += node.text.length;
    }

    // Recursively scan content
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(child => scanNode(child, depth + 1));
    }
  }

  try {
    scanNode(adfContent);
  } catch (error) {
    console.warn(`⚠️  Error analyzing ADF for ${ticketKey}: ${error.message}`);
  }

  // Determine complexity
  let complexity = 'simple';
  if (nodeCount > 20 || foundTypes.size > 5) {
    complexity = 'complex';
  } else if (nodeCount > 5 || foundTypes.size > 2) {
    complexity = 'medium';
  }

  return {
    hasADF: true,
    contentTypes: Array.from(foundTypes),
    textLength,
    nodeCount,
    mediaCount,
    linkCount,
    mentionCount,
    tableCount,
    complexity,
    uniqueTypes: foundTypes.size
  };
}

/**
 * Analyze field usage patterns across tickets
 */
function analyzeFieldUsage(tickets) {
  const fieldAnalysis = {};
  const customFields = {};
  let totalTickets = tickets.length;

  tickets.forEach((ticket, index) => {
    const fields = ticket.fields || {};
    
    Object.keys(fields).forEach(fieldKey => {
      if (!fieldAnalysis[fieldKey]) {
        fieldAnalysis[fieldKey] = {
          name: fieldKey,
          usageCount: 0,
          usagePercent: 0,
          dataTypes: new Set(),
          sampleValues: [],
          isCustomField: fieldKey.startsWith('customfield_')
        };
      }

      const field = fieldAnalysis[fieldKey];
      const value = fields[fieldKey];
      
      if (value !== null && value !== undefined && value !== '') {
        field.usageCount++;
        
        // Analyze data type
        const dataType = Array.isArray(value) ? 'array' : typeof value;
        field.dataTypes.add(dataType);
        
        // Store sample values (max 3)
        if (field.sampleValues.length < 3) {
          if (typeof value === 'object' && value !== null) {
            if (value.name) field.sampleValues.push(value.name);
            else if (value.displayName) field.sampleValues.push(value.displayName);
            else if (value.value) field.sampleValues.push(value.value);
            else field.sampleValues.push('[Object]');
          } else {
            field.sampleValues.push(String(value).substring(0, 50));
          }
        }
      }

      // Track custom fields separately
      if (fieldKey.startsWith('customfield_')) {
        customFields[fieldKey] = field;
      }
    });
  });

  // Calculate usage percentages
  Object.values(fieldAnalysis).forEach(field => {
    field.usagePercent = Math.round((field.usageCount / totalTickets) * 100);
    field.dataTypes = Array.from(field.dataTypes);
  });

  return {
    fieldAnalysis,
    customFields,
    totalTickets,
    summary: {
      totalFields: Object.keys(fieldAnalysis).length,
      customFieldCount: Object.keys(customFields).length,
      highUsageFields: Object.values(fieldAnalysis).filter(f => f.usagePercent > 80).length,
      mediumUsageFields: Object.values(fieldAnalysis).filter(f => f.usagePercent > 50 && f.usagePercent <= 80).length,
      lowUsageFields: Object.values(fieldAnalysis).filter(f => f.usagePercent <= 50).length
    }
  };
}

/**
 * Extract the most important ticket information for Pinecone
 */
function extractTicketForPinecone(ticket) {
  const fields = ticket.fields || {};
  
  return {
    // Core identifiers
    key: ticket.key,
    id: ticket.id,
    url: `${JIRA_CONFIG.host}/browse/${ticket.key}`,
    
    // Basic info
    summary: fields.summary || '',
    description: fields.description || null,
    status: fields.status ? fields.status.name : 'Unknown',
    priority: fields.priority ? fields.priority.name : 'Unknown',
    issueType: fields.issuetype ? fields.issuetype.name : 'Unknown',
    
    // Project and people
    project: fields.project ? fields.project.key : 'Unknown',
    projectName: fields.project ? fields.project.name : 'Unknown',
    reporter: fields.reporter ? fields.reporter.displayName : 'Unknown',
    assignee: fields.assignee ? fields.assignee.displayName : 'Unassigned',
    
    // Dates
    created: fields.created,
    updated: fields.updated,
    resolved: fields.resolutiondate,
    
    // Additional metadata
    labels: fields.labels || [],
    components: fields.components ? fields.components.map(c => c.name) : [],
    fixVersions: fields.fixVersions ? fields.fixVersions.map(v => v.name) : [],
    
    // Counts
    attachmentCount: fields.attachment ? fields.attachment.length : 0,
    commentCount: fields.comment ? fields.comment.total : 0,
    subtaskCount: fields.subtasks ? fields.subtasks.length : 0,
    
    // Relationships
    hasSubtasks: fields.subtasks ? fields.subtasks.length > 0 : false,
    hasLinks: fields.issuelinks ? fields.issuelinks.length > 0 : false,
    
    // Processing metadata
    processedAt: new Date().toISOString(),
    dataSource: 'jira-tickets-comprehensive'
  };
}

/**
 * Main analysis function
 */
async function analyzeJiraTicketsComprehensive() {
  try {
    console.log('🎫 Jira Tickets - Comprehensive Analysis (Fixed)');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}`);
    console.log('');

    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration. Check .env file.');
    }

    // Get recent tickets (last 2 weeks)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const dateFilter = twoWeeksAgo.toISOString().split('T')[0];
    
    const jql = `updated >= "${dateFilter}" ORDER BY updated DESC`;
    
    console.log(`📅 Analyzing tickets updated since: ${dateFilter}`);
    console.log(`🔍 JQL Query: ${jql}`);
    console.log('');

    // Retrieve tickets with pagination
    let allTickets = [];
    let startAt = 0;
    const batchSize = 50;
    let totalFound = 0;

    console.log('📥 Retrieving tickets with full field access...');

    do {
      console.log(`   📦 Batch ${Math.floor(startAt / batchSize) + 1}: Getting ${batchSize} tickets starting at ${startAt}`);
      
      const result = await getTicketsWithFullFields(jql, batchSize, startAt);
      totalFound = result.total;
      
      console.log(`   ✅ Retrieved ${result.issues.length} tickets (${allTickets.length + result.issues.length}/${totalFound})`);
      
      allTickets = allTickets.concat(result.issues);
      startAt += batchSize;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } while (startAt < totalFound && allTickets.length < 200); // Limit to 200 for analysis

    console.log(`\n📊 Total tickets retrieved: ${allTickets.length}`);
    console.log('');

    // Analyze tickets
    console.log('🔍 Analyzing ticket structure and content...');
    
    const analysis = {
      metadata: {
        generatedAt: new Date().toISOString(),
        jiraHost: JIRA_CONFIG.host,
        totalTickets: allTickets.length,
        analysisScope: `Last 2 weeks (since ${dateFilter})`,
        jqlQuery: jql
      },
      tickets: [],
      contentAnalysis: {
        adfDescriptions: 0,
        plainTextDescriptions: 0,
        emptyDescriptions: 0,
        totalAttachments: 0,
        totalComments: 0,
        totalADFContentTypes: new Set(),
        avgDescriptionLength: 0,
        complexDescriptions: 0
      },
      fieldUsage: null,
      pineconeReadyTickets: []
    };

    // Process each ticket
    let totalDescriptionLength = 0;
    let attachmentCount = 0;
    let commentCount = 0;

    allTickets.forEach((ticket, index) => {
      console.log(`   📋 Processing ${ticket.key} (${index + 1}/${allTickets.length})`);
      
      const fields = ticket.fields || {};
      const description = fields.description;
      let descriptionAnalysis = null;
      let descriptionType = 'empty';
      
      if (description) {
        if (typeof description === 'object' && description.type === 'doc') {
          // ADF format
          descriptionAnalysis = analyzeADFContent(description, ticket.key);
          descriptionType = 'adf';
          analysis.contentAnalysis.adfDescriptions++;
          totalDescriptionLength += descriptionAnalysis.textLength;
          
          // Track ADF content types
          descriptionAnalysis.contentTypes.forEach(type => {
            analysis.contentAnalysis.totalADFContentTypes.add(type);
          });
          
          if (descriptionAnalysis.complexity === 'complex') {
            analysis.contentAnalysis.complexDescriptions++;
          }
        } else if (typeof description === 'string') {
          // Plain text
          descriptionType = 'plaintext';
          analysis.contentAnalysis.plainTextDescriptions++;
          totalDescriptionLength += description.length;
        }
      } else {
        analysis.contentAnalysis.emptyDescriptions++;
      }

      // Count attachments and comments
      const ticketAttachments = fields.attachment ? fields.attachment.length : 0;
      const ticketComments = fields.comment ? fields.comment.total : 0;
      
      attachmentCount += ticketAttachments;
      commentCount += ticketComments;

      // Store processed ticket data
      const ticketData = {
        key: ticket.key,
        id: ticket.id,
        summary: fields.summary,
        status: fields.status ? fields.status.name : null,
        priority: fields.priority ? fields.priority.name : null,
        issueType: fields.issuetype ? fields.issuetype.name : null,
        project: fields.project ? fields.project.key : null,
        reporter: fields.reporter ? fields.reporter.displayName : null,
        assignee: fields.assignee ? fields.assignee.displayName : null,
        created: fields.created,
        updated: fields.updated,
        resolved: fields.resolutiondate,
        descriptionType: descriptionType,
        descriptionAnalysis: descriptionAnalysis,
        attachmentCount: ticketAttachments,
        commentCount: ticketComments,
        hasSubtasks: fields.subtasks ? fields.subtasks.length > 0 : false,
        hasLinks: fields.issuelinks ? fields.issuelinks.length > 0 : false,
        labels: fields.labels || [],
        components: fields.components ? fields.components.map(c => c.name) : [],
        fixVersions: fields.fixVersions ? fields.fixVersions.map(v => v.name) : []
      };

      analysis.tickets.push(ticketData);
      
      // Create Pinecone-ready version
      const pineconeTicket = extractTicketForPinecone(ticket);
      analysis.pineconeReadyTickets.push(pineconeTicket);
    });

    // Complete content analysis
    analysis.contentAnalysis.avgDescriptionLength = Math.round(totalDescriptionLength / allTickets.length);
    analysis.contentAnalysis.totalAttachments = attachmentCount;
    analysis.contentAnalysis.totalComments = commentCount;
    analysis.contentAnalysis.totalADFContentTypes = Array.from(analysis.contentAnalysis.totalADFContentTypes);

    // Analyze field usage
    console.log('\n🔍 Analyzing field usage patterns...');
    analysis.fieldUsage = analyzeFieldUsage(allTickets);

    // Save results
    const timestamp = new Date().toISOString().split('T')[0];
    const outputFile = path.join(__dirname, `jira-tickets-comprehensive-${timestamp}.json`);
    
    fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));

    // Also save Pinecone-ready data separately
    const pineconeFile = path.join(__dirname, `jira-tickets-pinecone-ready-${timestamp}.json`);
    fs.writeFileSync(pineconeFile, JSON.stringify({
      metadata: analysis.metadata,
      tickets: analysis.pineconeReadyTickets
    }, null, 2));

    // Generate comprehensive summary
    console.log('\n📊 COMPREHENSIVE ANALYSIS COMPLETE!');
    console.log('='.repeat(60));
    console.log(`📁 Full analysis: ${path.basename(outputFile)}`);
    console.log(`🎯 Pinecone ready: ${path.basename(pineconeFile)}`);
    console.log(`🎫 Tickets analyzed: ${allTickets.length}`);
    console.log(`📝 ADF descriptions: ${analysis.contentAnalysis.adfDescriptions}`);
    console.log(`📄 Plain text descriptions: ${analysis.contentAnalysis.plainTextDescriptions}`);
    console.log(`📋 Empty descriptions: ${analysis.contentAnalysis.emptyDescriptions}`);
    console.log(`🎨 ADF content types found: ${analysis.contentAnalysis.totalADFContentTypes.length}`);
    console.log(`   Types: ${analysis.contentAnalysis.totalADFContentTypes.join(', ')}`);
    console.log(`📎 Total attachments: ${attachmentCount}`);
    console.log(`💬 Total comments: ${commentCount}`);
    console.log(`🏷️  Total fields analyzed: ${analysis.fieldUsage.summary.totalFields}`);
    console.log(`⚙️  Custom fields: ${analysis.fieldUsage.summary.customFieldCount}`);
    console.log(`📈 High-usage fields: ${analysis.fieldUsage.summary.highUsageFields}`);
    console.log(`🎯 Pinecone-ready records: ${analysis.pineconeReadyTickets.length}`);
    
    return analysis;

  } catch (error) {
    console.error('\n❌ Analysis failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  analyzeJiraTicketsComprehensive();
}

module.exports = { analyzeJiraTicketsComprehensive };