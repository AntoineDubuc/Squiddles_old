#!/usr/bin/env node

/**
 * Jira Real Media Downloader
 * Downloads actual attachment files from tickets that have media in comments
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
 * Download binary content from URL with redirect handling
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
        // Handle redirects
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
 * Download attachment and save to file
 */
async function downloadAttachment(attachment, outputDir) {
  try {
    console.log(`📥 Downloading: ${attachment.filename} (${attachment.mimeType})`);

    const result = await downloadBinaryContent(attachment.content);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save file with original name (sanitized)
    const sanitizedName = attachment.filename.replace(/[<>:"/\\|?*]/g, '_');
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
 * Download all media from tickets that have media comments
 */
async function downloadAllMediaFiles() {
  try {
    console.log('🎬 Downloading Real Media Files from Jira...');
    
    // Load investigation results
    const investigationPath = path.join(__dirname, 'media-structure-investigation.json');
    if (!fs.existsSync(investigationPath)) {
      throw new Error('Investigation file not found. Run investigate-media-structure.js first.');
    }

    const investigation = JSON.parse(fs.readFileSync(investigationPath, 'utf8'));
    const mediaDir = path.join(__dirname, 'downloaded-media');

    console.log(`📋 Found ${investigation.investigations.length} tickets with media to process`);
    
    const allDownloads = [];
    let totalAttachments = 0;

    for (const inv of investigation.investigations) {
      console.log(`\n🎫 Processing ${inv.ticketKey} (${inv.ticketAttachments.length} attachments)`);
      totalAttachments += inv.ticketAttachments.length;

      for (const attachment of inv.ticketAttachments) {
        const result = await downloadAttachment(attachment, mediaDir);
        allDownloads.push({
          ...result,
          ticketKey: inv.ticketKey,
          commentId: inv.commentId,
          commentAuthor: inv.commentAuthor
        });

        if (result.success) {
          console.log(`   ✅ ${result.filename} (${result.downloadedSize} bytes)`);
        } else {
          console.log(`   ❌ ${result.filename}: ${result.error}`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // Summary
    const successful = allDownloads.filter(d => d.success);
    const failed = allDownloads.filter(d => !d.success);
    const images = successful.filter(d => d.isImage);
    const videos = successful.filter(d => d.isVideo);
    const audio = successful.filter(d => d.isAudio);
    const other = successful.filter(d => !d.isImage && !d.isVideo && !d.isAudio);

    console.log('\n📊 Download Summary:');
    console.log(`   ✅ Successful: ${successful.length}/${totalAttachments}`);
    console.log(`   ❌ Failed: ${failed.length}`);
    console.log(`   🖼️  Images: ${images.length}`);
    console.log(`   🎥 Videos: ${videos.length}`);
    console.log(`   🔊 Audio: ${audio.length}`);
    console.log(`   📄 Other: ${other.length}`);
    console.log(`   📁 Output: ${mediaDir}`);

    if (successful.length > 0) {
      console.log('\n📁 Downloaded Files:');
      successful.forEach(file => {
        const type = file.isImage ? '🖼️' : file.isVideo ? '🎥' : file.isAudio ? '🔊' : '📄';
        console.log(`   ${type} ${file.filename} (${file.mimeType}) - ${file.ticketKey}`);
      });
    }

    // Create updated test data with real media files
    const mediaTestData = {
      timestamp: new Date().toISOString(),
      jiraHost: JIRA_CONFIG.host,
      downloadDirectory: mediaDir,
      downloads: allDownloads,
      summary: {
        total: allDownloads.length,
        successful: successful.length,
        failed: failed.length,
        byType: {
          images: images.length,
          videos: videos.length,
          audio: audio.length,
          other: other.length
        }
      },
      mediaFiles: successful.map(file => ({
        filename: file.sanitizedFilename,
        originalName: file.filename,
        mimeType: file.mimeType,
        size: file.downloadedSize,
        relativePath: file.relativePath,
        ticketKey: file.ticketKey,
        commentId: file.commentId,
        isImage: file.isImage,
        isVideo: file.isVideo,
        isAudio: file.isAudio,
        webPath: `/downloaded-media/${encodeURIComponent(file.sanitizedFilename)}`
      }))
    };

    // Save media test data
    const mediaDataPath = path.join(__dirname, 'downloaded-media-data.json');
    fs.writeFileSync(mediaDataPath, JSON.stringify(mediaTestData, null, 2));
    console.log(`\n💾 Media data saved: ${path.basename(mediaDataPath)}`);

    return {
      success: true,
      downloads: allDownloads,
      outputDir: mediaDir,
      mediaDataPath: mediaDataPath,
      summary: mediaTestData.summary
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

    console.log('🎬 Jira Real Media Downloader');
    console.log(`🔗 Connected to: ${JIRA_CONFIG.host}\n`);

    const result = await downloadAllMediaFiles();
    
    console.log('\n🎉 SUCCESS!');
    console.log(`✅ Downloaded ${result.summary.successful}/${result.downloads.length} media files`);
    console.log('📊 Files ready for testing in web interface');
    
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

module.exports = { downloadAllMediaFiles };