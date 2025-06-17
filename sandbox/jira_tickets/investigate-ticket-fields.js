#!/usr/bin/env node

/**
 * Investigate Jira Ticket Field Structure
 * This script helps understand what fields are actually returned by the Jira API
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
 * Test different API calls to understand field structure
 */
async function investigateTicketFields() {
  try {
    console.log('🔍 Investigating Jira Ticket Field Structure');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}`);
    console.log('');

    // 1. Get a single ticket with minimal fields first
    console.log('1. 📋 Testing minimal ticket retrieval...');
    const minimalTicket = await makeJiraRequest('/rest/api/3/search?jql=updated >= -1d&maxResults=1');
    console.log(`   ✅ Found ${minimalTicket.total} tickets`);
    
    if (minimalTicket.issues.length > 0) {
      const ticket = minimalTicket.issues[0];
      console.log(`   📝 Sample ticket: ${ticket.key}`);
      console.log(`   🔑 Available top-level keys: ${Object.keys(ticket).join(', ')}`);
      console.log(`   📊 Available field keys: ${Object.keys(ticket.fields).join(', ').substring(0, 200)}...`);
      console.log('');

      // 2. Test with specific field selection
      console.log('2. 📋 Testing with specific fields...');
      const specificFields = await makeJiraRequest(`/rest/api/3/search?jql=key=${ticket.key}&fields=summary,description,status,priority,issuetype,assignee,reporter,created,updated`);
      
      if (specificFields.issues.length > 0) {
        const specificTicket = specificFields.issues[0];
        console.log(`   🔍 Fields in specific request:`);
        Object.keys(specificTicket.fields).forEach(field => {
          const value = specificTicket.fields[field];
          const type = value === null ? 'null' : typeof value;
          const preview = value === null ? 'null' : 
                         typeof value === 'object' ? '[Object]' : 
                         String(value).substring(0, 50);
          console.log(`      ${field}: ${type} - ${preview}`);
        });
      }
      console.log('');

      // 3. Test with expand parameters
      console.log('3. 📋 Testing with expand parameters...');
      const expandedTicket = await makeJiraRequest(`/rest/api/3/search?jql=key=${ticket.key}&expand=renderedFields,names,schema&fields=summary,description,status`);
      
      if (expandedTicket.issues.length > 0) {
        const expanded = expandedTicket.issues[0];
        console.log(`   🔍 Top-level keys with expand: ${Object.keys(expanded).join(', ')}`);
        if (expanded.renderedFields) {
          console.log(`   🎨 Rendered fields available: ${Object.keys(expanded.renderedFields).join(', ')}`);
        }
        if (expanded.names) {
          console.log(`   📛 Field names available: ${Object.keys(expanded.names).length} fields mapped`);
        }
      }
      console.log('');

      // 4. Test single issue endpoint
      console.log('4. 📋 Testing single issue endpoint...');
      const singleIssue = await makeJiraRequest(`/rest/api/3/issue/${ticket.key}`);
      console.log(`   🔍 Single issue fields: ${Object.keys(singleIssue.fields).length} fields`);
      console.log(`   📊 Sample field analysis:`);
      
      let fieldCount = 0;
      Object.keys(singleIssue.fields).forEach(field => {
        if (fieldCount < 10) {
          const value = singleIssue.fields[field];
          const type = value === null ? 'null' : typeof value;
          const preview = value === null ? 'null' : 
                         typeof value === 'object' ? `[${Array.isArray(value) ? 'Array' : 'Object'}]` : 
                         String(value).substring(0, 30);
          console.log(`      ${field}: ${type} - ${preview}`);
          fieldCount++;
        }
      });
      console.log('');

      // 5. Test getting attachments and comments specifically
      console.log('5. 📎 Testing attachments and comments...');
      const attachmentTicket = await makeJiraRequest(`/rest/api/3/issue/${ticket.key}?expand=attachment,comment`);
      console.log(`   📎 Attachments: ${attachmentTicket.fields.attachment ? attachmentTicket.fields.attachment.length : 'N/A'}`);
      console.log(`   💬 Comments: ${attachmentTicket.fields.comment ? attachmentTicket.fields.comment.total : 'N/A'}`);
      
      // Check description format
      if (attachmentTicket.fields.description) {
        const desc = attachmentTicket.fields.description;
        console.log(`   📝 Description type: ${typeof desc}`);
        if (typeof desc === 'object' && desc.type) {
          console.log(`   📝 Description format: ADF (${desc.type})`);
        } else if (typeof desc === 'string') {
          console.log(`   📝 Description format: Plain text (${desc.length} chars)`);
        }
      } else {
        console.log(`   📝 Description: No description field`);
      }
      console.log('');

      // 6. Save full structure for analysis
      const outputData = {
        investigation: {
          timestamp: new Date().toISOString(),
          jiraHost: JIRA_CONFIG.host,
          testTicket: ticket.key
        },
        minimalTicket: minimalTicket.issues[0],
        specificFieldsTicket: specificFields.issues[0],
        expandedTicket: expandedTicket.issues[0],
        singleIssueTicket: singleIssue,
        attachmentTicket: attachmentTicket
      };

      const outputFile = path.join(__dirname, 'ticket-field-investigation.json');
      fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
      console.log(`💾 Full investigation saved: ${path.basename(outputFile)}`);
      
      return outputData;
    }

  } catch (error) {
    console.error('\n❌ Investigation failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  investigateTicketFields();
}

module.exports = { investigateTicketFields };