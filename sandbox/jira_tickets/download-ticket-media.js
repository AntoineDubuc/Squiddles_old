#!/usr/bin/env node

/**
 * Download Media from Ticket Attachments
 * Downloads and serves actual media files from Jira tickets for display
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
 * Download ticket attachments and save for web serving
 */
async function downloadTicketMedia() {
  try {
    console.log('📎 Downloading Ticket Media Files...');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}`);
    console.log('');

    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration');
    }

    // Read the current ticket display data
    const ticketDataPath = path.join(__dirname, 'ticket-display-data.json');
    if (!fs.existsSync(ticketDataPath)) {
      throw new Error('No ticket display data found. Run extract-ticket-for-display.js first.');
    }

    const ticketData = JSON.parse(fs.readFileSync(ticketDataPath, 'utf8'));
    console.log(`🎫 Processing ticket: ${ticketData.key}`);
    console.log(`📎 Found ${ticketData.attachments.length} attachments`);
    
    if (ticketData.attachments.length === 0) {
      console.log('ℹ️  No attachments to download');
      return { success: true, downloads: [] };
    }

    // Create media directory
    const mediaDir = path.join(__dirname, 'ticket-media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    const downloadedFiles = [];

    // Download each attachment
    for (const attachment of ticketData.attachments) {
      try {
        console.log(`📥 Downloading: ${attachment.filename}`);
        
        // Construct the attachment URL
        const attachmentUrl = `${JIRA_CONFIG.host}/rest/api/3/attachment/content/${attachment.id}`;
        
        const result = await downloadBinaryContent(attachmentUrl);
        
        // Create safe filename
        const safeFilename = attachment.filename.replace(/[<>:"/\\|?*]/g, '_');
        const outputPath = path.join(mediaDir, safeFilename);
        
        // Save file
        fs.writeFileSync(outputPath, result.buffer);
        
        const downloadInfo = {
          id: attachment.id,
          filename: attachment.filename,
          safeFilename: safeFilename,
          mimeType: attachment.mimeType,
          originalSize: attachment.size,
          downloadedSize: result.buffer.length,
          outputPath: outputPath,
          webPath: `/ticket-media/${safeFilename}`,
          ticketKey: ticketData.key,
          isImage: attachment.mimeType.startsWith('image/'),
          isVideo: attachment.mimeType.startsWith('video/'),
          isAudio: attachment.mimeType.startsWith('audio/'),
          downloadedAt: new Date().toISOString()
        };
        
        downloadedFiles.push(downloadInfo);
        
        console.log(`   ✅ ${attachment.filename} -> ${safeFilename} (${result.buffer.length} bytes)`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.warn(`⚠️  Failed to download ${attachment.filename}: ${error.message}`);
      }
    }

    // Save download metadata
    const downloadMetadata = {
      ticketKey: ticketData.key,
      downloadedAt: new Date().toISOString(),
      totalFiles: downloadedFiles.length,
      files: downloadedFiles
    };
    
    const metadataPath = path.join(__dirname, 'ticket-media-downloads.json');
    fs.writeFileSync(metadataPath, JSON.stringify(downloadMetadata, null, 2));

    console.log('\n📊 Download Summary:');
    console.log(`   ✅ Downloaded: ${downloadedFiles.length}/${ticketData.attachments.length} files`);
    console.log(`   🖼️  Images: ${downloadedFiles.filter(f => f.isImage).length}`);
    console.log(`   📁 Location: ${mediaDir}`);
    console.log(`   💾 Metadata: ${path.basename(metadataPath)}`);
    
    if (downloadedFiles.length > 0) {
      console.log('\n📁 Downloaded Files:');
      downloadedFiles.forEach(file => {
        const icon = file.isImage ? '🖼️' : file.isVideo ? '🎥' : file.isAudio ? '🔊' : '📄';
        console.log(`   ${icon} ${file.safeFilename} (${file.downloadedSize} bytes)`);
      });
    }

    return {
      success: true,
      downloads: downloadedFiles,
      metadata: downloadMetadata
    };

  } catch (error) {
    console.error('\n❌ Download failed!');
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// Execute if run directly
if (require.main === module) {
  downloadTicketMedia();
}

module.exports = { downloadTicketMedia };