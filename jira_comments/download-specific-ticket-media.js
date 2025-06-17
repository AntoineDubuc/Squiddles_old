#!/usr/bin/env node

/**
 * Download media from specific tickets that have ADF media nodes
 * Test script to verify we can download and render files locally
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

// Target tickets with ADF media nodes but no downloaded files
const TARGET_TICKETS = ['DE-3360'];

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
 * Download binary content with redirect handling
 */
function downloadBinaryContent(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
    
    function makeRequest(currentUrl, redirectCount = 0) {
      if (redirectCount > maxRedirects) {
        reject(new Error('Too many redirects'));
        return;
      }

      const urlObj = new URL(currentUrl);
      
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': '*/*',
          'User-Agent': 'Node.js Media Downloader'
        }
      };

      const req = https.request(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`   📍 Redirect ${redirectCount + 1}: ${res.statusCode} -> ${res.headers.location}`);
          makeRequest(res.headers.location, redirectCount + 1);
          return;
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          const chunks = [];
          
          res.on('data', (chunk) => {
            chunks.push(chunk);
          });
          
          res.on('end', () => {
            resolve({
              buffer: Buffer.concat(chunks),
              contentType: res.headers['content-type'],
              contentLength: res.headers['content-length'],
              finalUrl: currentUrl,
              redirectCount: redirectCount
            });
          });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: Failed to download from ${currentUrl}`));
        }
      });

      req.on('error', reject);
      req.end();
    }

    makeRequest(url);
  });
}

/**
 * Get ticket with attachments
 */
async function getTicketWithAttachments(ticketKey) {
  const endpoint = `/rest/api/3/issue/${ticketKey}?expand=attachment`;
  return await makeJiraRequest(endpoint);
}

/**
 * Download attachment and save to file
 */
async function downloadAttachment(attachment, outputDir, ticketKey) {
  try {
    console.log(`📥 Downloading: ${attachment.filename} (${attachment.mimeType})`);

    const result = await downloadBinaryContent(attachment.content);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save file with ticket prefix to avoid conflicts
    const sanitizedName = `${ticketKey}_${attachment.filename.replace(/[<>:"/\\|?*]/g, '_')}`;
    const outputPath = path.join(outputDir, sanitizedName);
    fs.writeFileSync(outputPath, result.buffer);

    return {
      id: attachment.id,
      filename: attachment.filename,
      sanitizedFilename: sanitizedName,
      mimeType: attachment.mimeType,
      originalSize: attachment.size,
      downloadedSize: result.buffer.length,
      outputPath: outputPath,
      relativePath: path.relative(__dirname, outputPath),
      downloadUrl: attachment.content,
      webPath: `/test-media/${sanitizedName}`,
      ticketKey: ticketKey,
      success: true,
      isImage: attachment.mimeType.startsWith('image/'),
      isVideo: attachment.mimeType.startsWith('video/'),
      isAudio: attachment.mimeType.startsWith('audio/')
    };

  } catch (error) {
    console.warn(`⚠️  Failed to download ${attachment.filename}: ${error.message}`);
    return {
      id: attachment.id,
      filename: attachment.filename,
      error: error.message,
      success: false
    };
  }
}

/**
 * Download media from specific tickets
 */
async function downloadSpecificTicketMedia() {
  try {
    console.log('🎯 Downloading Media from Specific Tickets...');
    console.log(`🎫 Target tickets: ${TARGET_TICKETS.join(', ')}`);
    console.log('');

    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration');
    }

    const testMediaDir = path.join(__dirname, 'test-media');
    const allDownloads = [];

    for (const ticketKey of TARGET_TICKETS) {
      console.log(`🔍 Processing ticket: ${ticketKey}`);
      
      try {
        const ticketInfo = await getTicketWithAttachments(ticketKey);
        console.log(`📎 Found ${ticketInfo.fields.attachment.length} attachments`);

        if (ticketInfo.fields.attachment.length > 0) {
          console.log('📋 Attachments:');
          ticketInfo.fields.attachment.forEach(att => {
            console.log(`   - ${att.filename} (${att.mimeType}) - ${att.size} bytes`);
          });

          for (const attachment of ticketInfo.fields.attachment) {
            const result = await downloadAttachment(attachment, testMediaDir, ticketKey);
            allDownloads.push(result);

            if (result.success) {
              console.log(`   ✅ ${result.filename} -> ${result.sanitizedFilename}`);
            } else {
              console.log(`   ❌ ${result.filename}: ${result.error}`);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        } else {
          console.log('   ℹ️  No attachments found in this ticket');
        }

        console.log('');
        
      } catch (error) {
        console.warn(`⚠️  Failed to process ${ticketKey}: ${error.message}`);
      }
    }

    // Summary
    const successful = allDownloads.filter(d => d.success);
    const failed = allDownloads.filter(d => !d.success);
    const images = successful.filter(d => d.isImage);

    console.log('📊 Download Summary:');
    console.log(`   ✅ Successful: ${successful.length}`);
    console.log(`   ❌ Failed: ${failed.length}`);
    console.log(`   🖼️  Images: ${images.length}`);
    console.log(`   📁 Output: ${testMediaDir}`);

    if (successful.length > 0) {
      console.log('\n📁 Downloaded Files:');
      successful.forEach(file => {
        const type = file.isImage ? '🖼️' : file.isVideo ? '🎥' : file.isAudio ? '🔊' : '📄';
        console.log(`   ${type} ${file.sanitizedFilename} (${file.downloadedSize} bytes)`);
      });

      // Save test data
      const testData = {
        timestamp: new Date().toISOString(),
        targetTickets: TARGET_TICKETS,
        downloads: successful,
        outputDirectory: testMediaDir,
        summary: {
          total: successful.length,
          images: images.length,
          videos: successful.filter(d => d.isVideo).length,
          audio: successful.filter(d => d.isAudio).length,
          other: successful.filter(d => !d.isImage && !d.isVideo && !d.isAudio).length
        }
      };

      const testDataPath = path.join(__dirname, 'test-specific-media-data.json');
      fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
      console.log(`\n💾 Test data saved: ${path.basename(testDataPath)}`);
    }

    return {
      success: true,
      downloads: allDownloads,
      outputDir: testMediaDir
    };

  } catch (error) {
    console.error('❌ Error downloading media:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🧪 Test: Download Specific Ticket Media');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}\n`);

    const result = await downloadSpecificTicketMedia();
    
    console.log('\n🎉 SUCCESS!');
    console.log('📊 Files ready for local rendering test');
    
    return result;
    
  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { downloadSpecificTicketMedia };