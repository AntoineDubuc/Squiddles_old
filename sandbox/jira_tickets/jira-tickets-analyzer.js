#!/usr/bin/env node

/**
 * Comprehensive Jira Tickets Analyzer
 * Retrieves and analyzes ticket structure, fields, relationships, and content patterns
 * 
 * This script follows the successful pattern from jira_comments analysis:
 * 1. Retrieve tickets with comprehensive field expansion
 * 2. Analyze field usage patterns and data types
 * 3. Parse rich content (ADF in descriptions)
 * 4. Document relationships and attachments
 * 5. Generate structured analysis for Pinecone integration
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

// Comprehensive field expansion for maximum data collection
const EXPAND_FIELDS = [
  'renderedFields',        // HTML rendered versions
  'names',                 // Field name translations
  'schema',                // Field type information
  'transitions',           // Available workflow transitions
  'editmeta',             // Edit metadata
  'changelog',            // Change history
  'operations',           // Available operations
  'versionedRepresentations', // Version info
  'attachment',           // File attachments
  'comment',              // Comments (basic info)
  'worklog',              // Work log entries
  'issuelinks',           // Linked issues
  'subtasks',             // Subtask information
  'votes',                // Vote information
  'watches',              // Watcher information
  'watchers'              // Watcher list
].join(',');

// Standard fields to always include
const STANDARD_FIELDS = [
  'id', 'key', 'self',
  'summary', 'description', 'status', 'priority', 'issuetype',
  'project', 'reporter', 'assignee', 'creator',
  'created', 'updated', 'resolutiondate', 'resolution',
  'fixVersions', 'versions', 'components', 'labels',
  'timetracking', 'timeoriginalestimate', 'timeestimate', 'timespent',
  'parent', 'subtasks', 'issuelinks',
  'attachment', 'comment', 'worklog',
  'votes', 'watches', 'watchers',
  'duedate', 'environment',
  // Common custom fields (will be filtered if not available)
  'customfield_10000', 'customfield_10001', 'customfield_10002',
  'customfield_10003', 'customfield_10004', 'customfield_10005'
].join(',');

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
            // Rate limiting - wait and retry
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
 * Get tickets with JQL and comprehensive field expansion
 */
async function getTicketsWithFields(jql, maxResults = 100, startAt = 0) {
  const params = new URLSearchParams({
    jql: jql,
    maxResults: maxResults.toString(),
    startAt: startAt.toString(),
    expand: EXPAND_FIELDS,
    fields: STANDARD_FIELDS,
    validateQuery: 'true'
  });

  const endpoint = `/rest/api/3/search?${params}`;
  return await makeJiraRequest(endpoint);
}

/**
 * Analyze ADF content in ticket descriptions
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

  tickets.forEach(ticket => {
    // Safe field access
    const fields = ticket.fields || {};
    
    // Analyze standard fields
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
            field.sampleValues.push(String(value).substring(0, 100));
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
 * Analyze ticket relationships and links
 */
function analyzeRelationships(tickets) {
  const relationships = {
    issueLinks: {},
    subtasks: {},
    parents: {},
    linkTypes: new Set(),
    totalLinked: 0,
    totalSubtasks: 0
  };

  tickets.forEach(ticket => {
    const key = ticket.key;
    const fields = ticket.fields || {};
    
    // Analyze issue links
    if (fields.issuelinks && fields.issuelinks.length > 0) {
      relationships.totalLinked++;
      relationships.issueLinks[key] = fields.issuelinks.map(link => {
        const linkType = link.type.name;
        relationships.linkTypes.add(linkType);
        
        return {
          type: linkType,
          direction: link.outwardIssue ? 'outward' : 'inward',
          targetKey: link.outwardIssue ? link.outwardIssue.key : link.inwardIssue.key,
          targetSummary: link.outwardIssue ? link.outwardIssue.fields.summary : link.inwardIssue.fields.summary
        };
      });
    }

    // Analyze subtasks
    if (fields.subtasks && fields.subtasks.length > 0) {
      relationships.totalSubtasks += fields.subtasks.length;
      relationships.subtasks[key] = fields.subtasks.map(subtask => ({
        key: subtask.key,
        summary: subtask.fields && subtask.fields.summary ? subtask.fields.summary : 'N/A',
        status: subtask.fields && subtask.fields.status && subtask.fields.status.name ? subtask.fields.status.name : 'Unknown'
      }));
    }

    // Track parent relationships
    if (fields.parent) {
      relationships.parents[key] = {
        parentKey: fields.parent.key,
        parentSummary: fields.parent.fields && fields.parent.fields.summary ? fields.parent.fields.summary : 'N/A'
      };
    }
  });

  relationships.linkTypes = Array.from(relationships.linkTypes);
  
  return relationships;
}

/**
 * Main analysis function
 */
async function analyzeJiraTickets() {
  try {
    console.log('🎫 Jira Tickets Comprehensive Analysis');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}`);
    console.log('');

    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration. Check .env file.');
    }

    // Get recent tickets (last 2 weeks, similar to comments analysis)
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
    const batchSize = 50; // Smaller batches for detailed analysis
    let totalFound = 0;

    console.log('📥 Retrieving tickets...');

    do {
      console.log(`   📦 Batch ${Math.floor(startAt / batchSize) + 1}: Getting ${batchSize} tickets starting at ${startAt}`);
      
      const result = await getTicketsWithFields(jql, batchSize, startAt);
      totalFound = result.total;
      
      console.log(`   ✅ Retrieved ${result.issues.length} tickets (${allTickets.length + result.issues.length}/${totalFound})`);
      
      allTickets = allTickets.concat(result.issues);
      startAt += batchSize;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } while (startAt < totalFound && allTickets.length < 200); // Limit to 200 for analysis

    console.log(`\n📊 Total tickets retrieved: ${allTickets.length}`);
    console.log('');

    // Analyze ticket data
    console.log('🔍 Analyzing ticket structure and content...');
    
    const ticketAnalysis = {
      metadata: {
        generatedAt: new Date().toISOString(),
        jiraHost: JIRA_CONFIG.host,
        totalTickets: allTickets.length,
        analysisScope: `Last 2 weeks (since ${dateFilter})`,
        jqlQuery: jql
      },
      tickets: [],
      fieldUsage: null,
      relationships: null,
      contentAnalysis: {
        adfDescriptions: 0,
        plainTextDescriptions: 0,
        emptyDescriptions: 0,
        totalAttachments: 0,
        totalComments: 0,
        avgDescriptionLength: 0
      }
    };

    // Analyze each ticket
    let totalDescriptionLength = 0;
    let attachmentCount = 0;
    let commentCount = 0;

    allTickets.forEach((ticket, index) => {
      console.log(`   📋 Analyzing ${ticket.key} (${index + 1}/${allTickets.length})`);
      
      // Safe field access with proper error handling
      const fields = ticket.fields || {};
      const description = fields.description;
      let descriptionAnalysis = null;
      let descriptionType = 'empty';
      
      if (description) {
        if (typeof description === 'object') {
          // ADF format
          descriptionAnalysis = analyzeADFContent(description, ticket.key);
          descriptionType = 'adf';
          ticketAnalysis.contentAnalysis.adfDescriptions++;
          totalDescriptionLength += descriptionAnalysis.textLength;
        } else if (typeof description === 'string') {
          // Plain text
          descriptionType = 'plaintext';
          ticketAnalysis.contentAnalysis.plainTextDescriptions++;
          totalDescriptionLength += description.length;
        }
      } else {
        ticketAnalysis.contentAnalysis.emptyDescriptions++;
      }

      // Count attachments and comments
      const ticketAttachments = fields.attachment ? fields.attachment.length : 0;
      const ticketComments = fields.comment ? fields.comment.total : 0;
      
      attachmentCount += ticketAttachments;
      commentCount += ticketComments;

      const ticketData = {
        key: ticket.key,
        id: ticket.id,
        self: ticket.self,
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

      ticketAnalysis.tickets.push(ticketData);
    });

    // Calculate averages
    ticketAnalysis.contentAnalysis.avgDescriptionLength = Math.round(
      totalDescriptionLength / allTickets.length
    );
    ticketAnalysis.contentAnalysis.totalAttachments = attachmentCount;
    ticketAnalysis.contentAnalysis.totalComments = commentCount;

    // Analyze field usage patterns
    console.log('\n🔍 Analyzing field usage patterns...');
    ticketAnalysis.fieldUsage = analyzeFieldUsage(allTickets);

    // Analyze relationships
    console.log('🔗 Analyzing ticket relationships...');
    ticketAnalysis.relationships = analyzeRelationships(allTickets);

    // Save analysis results
    const timestamp = new Date().toISOString().split('T')[0];
    const outputFile = path.join(__dirname, `jira-tickets-analysis-${timestamp}.json`);
    
    fs.writeFileSync(outputFile, JSON.stringify(ticketAnalysis, null, 2));

    // Generate summary report
    console.log('\n📊 ANALYSIS COMPLETE!');
    console.log('='.repeat(50));
    console.log(`📁 Results saved: ${path.basename(outputFile)}`);
    console.log(`🎫 Tickets analyzed: ${allTickets.length}`);
    console.log(`📝 ADF descriptions: ${ticketAnalysis.contentAnalysis.adfDescriptions}`);
    console.log(`📄 Plain text descriptions: ${ticketAnalysis.contentAnalysis.plainTextDescriptions}`);
    console.log(`📋 Empty descriptions: ${ticketAnalysis.contentAnalysis.emptyDescriptions}`);
    console.log(`📎 Total attachments: ${attachmentCount}`);
    console.log(`💬 Total comments: ${commentCount}`);
    console.log(`🔗 Linked tickets: ${ticketAnalysis.relationships.totalLinked}`);
    console.log(`👥 Subtasks found: ${ticketAnalysis.relationships.totalSubtasks}`);
    console.log(`🏷️  Field types analyzed: ${ticketAnalysis.fieldUsage.summary.totalFields}`);
    console.log(`⚙️  Custom fields found: ${ticketAnalysis.fieldUsage.summary.customFieldCount}`);
    
    return ticketAnalysis;

  } catch (error) {
    console.error('\n❌ Analysis failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  analyzeJiraTickets();
}

module.exports = { analyzeJiraTickets };