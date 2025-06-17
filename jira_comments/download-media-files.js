#!/usr/bin/env node

/**
 * Jira Media File Downloader
 * Downloads actual media files from Jira comments for testing
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

/**
 * Make authenticated request to Jira API
 */
function makeJiraRequest(endpoint, isBuffer = false) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
    const url = new URL(endpoint, JIRA_CONFIG.host);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': isBuffer ? 'application/octet-stream' : 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      if (isBuffer) {
        const chunks = [];
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              buffer: Buffer.concat(chunks),
              contentType: res.headers['content-type'],
              contentLength: res.headers['content-length']
            });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: Failed to download media`));
          }
        });
      } else {
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
      }
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Get attachment metadata from Jira
 */
async function getAttachmentInfo(attachmentId) {
  try {
    const endpoint = `/rest/api/3/attachment/${attachmentId}`;
    return await makeJiraRequest(endpoint);
  } catch (error) {
    console.warn(`⚠️  Failed to get attachment info for ${attachmentId}: ${error.message}`);
    return null;
  }
}

/**
 * Download attachment content
 */
async function downloadAttachment(attachmentId, outputDir) {
  try {
    // First get attachment metadata
    const attachmentInfo = await getAttachmentInfo(attachmentId);
    if (!attachmentInfo) {
      return null;
    }

    console.log(`📥 Downloading: ${attachmentInfo.filename} (${attachmentInfo.mimeType})`);

    // Download the actual file content
    const endpoint = `/rest/api/3/attachment/content/${attachmentId}`;
    const result = await makeJiraRequest(endpoint, true);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save file with original name
    const outputPath = path.join(outputDir, attachmentInfo.filename);
    fs.writeFileSync(outputPath, result.buffer);

    return {
      id: attachmentId,
      filename: attachmentInfo.filename,
      mimeType: attachmentInfo.mimeType,
      size: attachmentInfo.size,
      outputPath: outputPath,
      relativePath: path.relative(__dirname, outputPath),
      downloadedSize: result.buffer.length,
      success: true
    };

  } catch (error) {
    console.warn(`⚠️  Failed to download attachment ${attachmentId}: ${error.message}`);
    return {
      id: attachmentId,
      error: error.message,
      success: false
    };
  }
}

/**
 * Process test data and download all media files
 */
async function downloadMediaFromTestData() {
  try {
    console.log('🔍 Loading test data...');
    
    const testDataPath = path.join(__dirname, 'test-data-examples-2025-06-17.json');
    if (!fs.existsSync(testDataPath)) {
      throw new Error('Test data file not found. Run find-data-type-examples.js first.');
    }

    const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
    const mediaDir = path.join(__dirname, 'downloaded-media');

    console.log('📊 Found test data with media examples:');

    const allMediaIds = new Set();
    const mediaResults = [];

    // Extract all media IDs from different media types
    ['media', 'mediaGroup', 'mediaSingle'].forEach(mediaType => {
      if (testData.dataTypes[mediaType] && testData.dataTypes[mediaType].found) {
        testData.dataTypes[mediaType].examples.forEach(example => {
          // Try to extract media ID from the nodeContent
          if (typeof example.nodeContent === 'object' && example.nodeContent.id) {
            allMediaIds.add(example.nodeContent.id);
          } else if (typeof example.nodeContent === 'string') {
            // Parse ID from string like "Media: 1a38bf73-9321-4366-bc8c-1b7266eb6440 (unknown type)"
            const idMatch = example.nodeContent.match(/Media: ([a-f0-9-]{36})/);
            if (idMatch) {
              allMediaIds.add(idMatch[1]);
            }
          }
        });
      }
    });

    console.log(`📋 Found ${allMediaIds.size} unique media IDs to download`);

    if (allMediaIds.size === 0) {
      console.log('ℹ️  No media IDs found in test data');
      return { success: true, downloads: [], message: 'No media found' };
    }

    // Download each media file
    let downloadCount = 0;
    for (const mediaId of allMediaIds) {
      downloadCount++;
      console.log(`⏳ Processing ${downloadCount}/${allMediaIds.size}: ${mediaId}`);
      
      const result = await downloadAttachment(mediaId, mediaDir);
      mediaResults.push(result);

      if (result.success) {
        console.log(`   ✅ Downloaded: ${result.filename} (${result.downloadedSize} bytes)`);
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Summary
    const successful = mediaResults.filter(r => r.success);
    const failed = mediaResults.filter(r => !r.success);

    console.log('\n📊 Download Summary:');
    console.log(`   ✅ Successful: ${successful.length}`);
    console.log(`   ❌ Failed: ${failed.length}`);
    console.log(`   📁 Output directory: ${mediaDir}`);

    if (successful.length > 0) {
      console.log('\n📁 Downloaded files:');
      successful.forEach(file => {
        console.log(`   📄 ${file.filename} (${file.mimeType})`);
      });
    }

    // Update test data with download results
    const updatedTestData = {
      ...testData,
      downloadedMedia: {
        timestamp: new Date().toISOString(),
        outputDirectory: mediaDir,
        results: mediaResults,
        summary: {
          total: mediaResults.length,
          successful: successful.length,
          failed: failed.length
        }
      }
    };

    // Save updated test data
    const updatedTestDataPath = path.join(__dirname, 'test-data-with-media-2025-06-17.json');
    fs.writeFileSync(updatedTestDataPath, JSON.stringify(updatedTestData, null, 2));
    console.log(`\n💾 Updated test data saved: ${path.basename(updatedTestDataPath)}`);

    return {
      success: true,
      downloads: mediaResults,
      outputDir: mediaDir,
      updatedTestDataPath
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
    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration. Check your .env file.');
    }

    console.log('🎬 Jira Media File Downloader');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}`);
    console.log('');

    const result = await downloadMediaFromTestData();
    
    console.log('\n🎉 SUCCESS!');
    console.log('✅ Media files downloaded and ready for testing');
    
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

module.exports = { downloadMediaFromTestData, downloadAttachment };