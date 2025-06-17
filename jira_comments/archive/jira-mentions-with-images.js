#!/usr/bin/env node

/**
 * Jira Comments with Images and Mentions Detector
 * Finds comments that contain both images/media AND mentions (to anyone)
 * Completely isolated test - does not depend on main codebase
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
            const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
            process.env[key.trim()] = value.trim();
          }
        }
      });
      
      console.log(`📁 Loaded environment variables from: ${envPath}`);
    } else {
      console.log(`⚠️  No .env file found at: ${envPath}`);
    }
  } catch (error) {
    console.warn(`⚠️  Failed to load .env file: ${error.message}`);
  }
}

// Load environment variables first
loadEnvFile();

// Configuration
const JIRA_CONFIG = {
  host: process.env.JIRA_HOST || process.env.JIRA_BASE_URL,
  email: process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL,
  token: process.env.JIRA_API_TOKEN
};

// Date range: last 2 weeks
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
 * Analyze ADF content for images and mentions
 */
function analyzeADFContent(adfBody) {
  if (!adfBody) return { 
    text: '', 
    media: [], 
    mentions: [], 
    hasMedia: false, 
    hasMentions: false 
  };
  
  let text = '';
  let media = [];
  let mentions = [];
  
  function processNode(node) {
    if (!node) return '';
    
    // Handle text nodes
    if (node.type === 'text') {
      return node.text || '';
    }
    
    // Handle media nodes (images, videos, files)
    if (['media', 'mediaGroup', 'mediaSingle'].includes(node.type)) {
      const mediaItem = {
        type: node.type,
        id: node.attrs?.id,
        collection: node.attrs?.collection,
        width: node.attrs?.width,
        height: node.attrs?.height,
        alt: node.attrs?.alt,
        url: node.attrs?.url,
        fileName: node.attrs?.fileName,
        fileSize: node.attrs?.fileSize,
        mimeType: node.attrs?.mimeType,
        attrs: node.attrs
      };
      
      media.push(mediaItem);
      
      // Return a placeholder in text
      const mediaType = getMediaType(mediaItem);
      return `\n[${mediaType}: ${mediaItem.fileName || mediaItem.id || 'media'}]\n`;
    }
    
    // Handle mention nodes
    if (node.type === 'mention') {
      const mention = {
        id: node.attrs?.id,
        text: node.attrs?.text,
        displayName: node.attrs?.displayName,
        userType: node.attrs?.userType,
        attrs: node.attrs
      };
      
      mentions.push(mention);
      return `@${mention.displayName || mention.text || mention.id}`;
    }
    
    // Handle content arrays (recursive)
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(processNode).join('');
    }
    
    return '';
  }
  
  function getMediaType(mediaItem) {
    if (mediaItem.mimeType) {
      if (mediaItem.mimeType.startsWith('image/')) return 'IMAGE';
      if (mediaItem.mimeType.startsWith('video/')) return 'VIDEO';
      if (mediaItem.mimeType.startsWith('audio/')) return 'AUDIO';
      return 'FILE';
    }
    
    if (mediaItem.fileName) {
      const ext = mediaItem.fileName.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return 'IMAGE';
      if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return 'VIDEO';
      if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) return 'AUDIO';
    }
    
    return 'MEDIA';
  }
  
  try {
    if (adfBody.content && Array.isArray(adfBody.content)) {
      text = adfBody.content.map(processNode).join(' ');
    } else {
      text = processNode(adfBody);
    }
  } catch (error) {
    console.warn('⚠️  Failed to analyze ADF content:', error.message);
    return { 
      text: JSON.stringify(adfBody), 
      media: [], 
      mentions: [], 
      hasMedia: false, 
      hasMentions: false 
    };
  }
  
  return { 
    text: text.trim(), 
    media, 
    mentions, 
    hasMedia: media.length > 0, 
    hasMentions: mentions.length > 0 
  };
}

/**
 * Process tickets and find comments with images and mentions
 */
async function findCommentsWithImagesAndMentions() {
  try {
    console.log('🦑 Jira Comments with Images & Mentions - Starting...');
    console.log(`📅 Looking in last 2 weeks (since ${TWO_WEEKS_AGO.toDateString()})`);
    console.log(`🎯 Finding comments with BOTH images AND mentions (to anyone)`);
    console.log('');

    // Validate configuration
    if (!JIRA_CONFIG.host || !JIRA_CONFIG.email || !JIRA_CONFIG.token) {
      throw new Error('Missing Jira configuration. Please set JIRA_HOST, JIRA_EMAIL, and JIRA_API_TOKEN environment variables.');
    }

    // Get recent tickets
    const searchResults = await getRecentTickets();
    console.log(`📋 Found ${searchResults.issues.length} recently updated tickets`);
    
    const commentsWithBoth = [];
    const commentsWithImagesOnly = [];
    const commentsWithMentionsOnly = [];
    let processedCount = 0;
    let totalImagesFound = 0;
    let totalMentionsFound = 0;

    // Process each ticket
    for (const issue of searchResults.issues) {
      processedCount++;
      console.log(`⏳ Processing ${processedCount}/${searchResults.issues.length}: ${issue.key} - ${issue.fields.summary}`);
      
      try {
        // Get comments for this ticket
        const commentsData = await getTicketComments(issue.key);
        
        console.log(`   📝 Found ${commentsData.comments.length} total comments`);
        
        // Check each comment for images and mentions
        for (const comment of commentsData.comments) {
          const commentDate = new Date(comment.created);
          
          // Only check comments from last 2 weeks
          if (commentDate >= TWO_WEEKS_AGO) {
            // Analyze comment content
            let analysis = { text: '', media: [], mentions: [], hasMedia: false, hasMentions: false };
            
            if (typeof comment.body === 'string') {
              analysis.text = comment.body;
              // Look for basic mention patterns in plain text
              const mentionPatterns = /@\w+|@@\w+/g;
              const textMentions = comment.body.match(mentionPatterns) || [];
              analysis.hasMentions = textMentions.length > 0;
              if (textMentions.length > 0) {
                analysis.mentions = textMentions.map(mention => ({
                  text: mention,
                  displayName: mention,
                  source: 'text'
                }));
              }
            } else if (comment.body && comment.body.content) {
              // Atlassian Document Format - analyze for media and mentions
              analysis = analyzeADFContent(comment.body);
            }
            
            totalImagesFound += analysis.media.length;
            totalMentionsFound += analysis.mentions.length;
            
            if (analysis.media.length > 0) {
              console.log(`   🖼️  Found ${analysis.media.length} media item(s) in comment by ${comment.author?.displayName}`);
            }
            
            if (analysis.mentions.length > 0) {
              console.log(`   👤 Found ${analysis.mentions.length} mention(s) in comment by ${comment.author?.displayName}`);
            }
            
            // Categorize comments
            const commentData = {
              ticketKey: issue.key,
              ticketTitle: issue.fields.summary,
              ticketUrl: `${JIRA_CONFIG.host}/browse/${issue.key}`,
              commentId: comment.id,
              commentAuthor: comment.author?.displayName || 'Unknown',
              commentDate: comment.created,
              commentText: analysis.text,
              commentUrl: `${JIRA_CONFIG.host}/browse/${issue.key}?focusedCommentId=${comment.id}`,
              media: analysis.media,
              mentions: analysis.mentions,
              hasMedia: analysis.hasMedia,
              hasMentions: analysis.hasMentions
            };
            
            if (analysis.hasMedia && analysis.hasMentions) {
              commentsWithBoth.push(commentData);
              console.log(`   ✨ MATCH! Comment has both images AND mentions`);
            } else if (analysis.hasMedia) {
              commentsWithImagesOnly.push(commentData);
            } else if (analysis.hasMentions) {
              commentsWithMentionsOnly.push(commentData);
            }
          }
        }
        
        // Small delay to be nice to Jira API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.warn(`⚠️  Failed to get comments for ${issue.key}: ${error.message}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   🖼️  Total images found: ${totalImagesFound}`);
    console.log(`   👤 Total mentions found: ${totalMentionsFound}`);
    console.log(`   ✨ Comments with BOTH images & mentions: ${commentsWithBoth.length}`);
    console.log(`   🖼️  Comments with images only: ${commentsWithImagesOnly.length}`);
    console.log(`   👤 Comments with mentions only: ${commentsWithMentionsOnly.length}`);
    
    return {
      commentsWithBoth,
      commentsWithImagesOnly,
      commentsWithMentionsOnly,
      stats: {
        totalImages: totalImagesFound,
        totalMentions: totalMentionsFound,
        bothCount: commentsWithBoth.length,
        imagesOnlyCount: commentsWithImagesOnly.length,
        mentionsOnlyCount: commentsWithMentionsOnly.length
      }
    };

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `jira-images-mentions-${timestamp}.md`;
  
  let markdown = `# 🖼️ Jira Comments with Images & Mentions Report\n\n`;
  markdown += `**Generated:** ${new Date().toLocaleString()}\n`;
  markdown += `**Period:** Last 2 weeks (since ${TWO_WEEKS_AGO.toDateString()})\n`;
  markdown += `**Search Scope:** All users (mentions to anyone)\n\n`;
  
  markdown += `## 📊 Summary\n\n`;
  markdown += `- **🖼️ Total Images Found:** ${results.stats.totalImages}\n`;
  markdown += `- **👤 Total Mentions Found:** ${results.stats.totalMentions}\n`;
  markdown += `- **✨ Comments with BOTH:** ${results.stats.bothCount}\n`;
  markdown += `- **🖼️ Comments with Images Only:** ${results.stats.imagesOnlyCount}\n`;
  markdown += `- **👤 Comments with Mentions Only:** ${results.stats.mentionsOnlyCount}\n\n`;
  
  if (results.commentsWithBoth.length > 0) {
    markdown += `## ✨ Comments with BOTH Images & Mentions\n\n`;
    
    results.commentsWithBoth.forEach((comment, index) => {
      markdown += `### ${index + 1}. ${comment.ticketKey}: ${comment.ticketTitle}\n\n`;
      markdown += `- **Author:** ${comment.commentAuthor}\n`;
      markdown += `- **Date:** ${new Date(comment.commentDate).toLocaleString()}\n`;
      markdown += `- **Ticket:** [${comment.ticketKey}](${comment.ticketUrl})\n`;
      markdown += `- **Comment:** [View Comment](${comment.commentUrl})\n`;
      markdown += `- **Images:** ${comment.media.length} media item(s)\n`;
      markdown += `- **Mentions:** ${comment.mentions.length} mention(s)\n\n`;
      
      // Show media details
      if (comment.media.length > 0) {
        markdown += `**Media Found:**\n`;
        comment.media.forEach((mediaItem, i) => {
          const mediaType = getMediaTypeFromItem(mediaItem);
          markdown += `- ${i + 1}. **${mediaType}**: ${mediaItem.fileName || mediaItem.id || 'Unknown'}\n`;
          if (mediaItem.mimeType) markdown += `  - Type: ${mediaItem.mimeType}\n`;
          if (mediaItem.fileSize) markdown += `  - Size: ${formatFileSize(mediaItem.fileSize)}\n`;
          if (mediaItem.width && mediaItem.height) markdown += `  - Dimensions: ${mediaItem.width}×${mediaItem.height}\n`;
        });
        markdown += `\n`;
      }
      
      // Show mentions
      if (comment.mentions.length > 0) {
        markdown += `**Mentions Found:**\n`;
        comment.mentions.forEach((mention, i) => {
          markdown += `- ${i + 1}. ${mention.displayName || mention.text}\n`;
        });
        markdown += `\n`;
      }
      
      markdown += `**Comment Content:**\n`;
      markdown += `\`\`\`\n${comment.commentText.substring(0, 500)}${comment.commentText.length > 500 ? '...' : ''}\n\`\`\`\n\n`;
      markdown += `---\n\n`;
    });
  } else {
    markdown += `## ✨ Comments with BOTH Images & Mentions\n\n`;
    markdown += `No comments found with both images and mentions in the last 2 weeks.\n\n`;
  }
  
  // Show separate sections for images-only and mentions-only if they exist
  if (results.commentsWithImagesOnly.length > 0) {
    markdown += `## 🖼️ Comments with Images Only (Top 5)\n\n`;
    results.commentsWithImagesOnly.slice(0, 5).forEach((comment, index) => {
      markdown += `### ${index + 1}. ${comment.ticketKey} - ${comment.commentAuthor}\n`;
      markdown += `- **Images:** ${comment.media.length}\n`;
      markdown += `- **Link:** [View Comment](${comment.commentUrl})\n\n`;
    });
    
    if (results.commentsWithImagesOnly.length > 5) {
      markdown += `*...and ${results.commentsWithImagesOnly.length - 5} more comments with images only*\n\n`;
    }
  }
  
  if (results.commentsWithMentionsOnly.length > 0) {
    markdown += `## 👤 Comments with Mentions Only (Top 5)\n\n`;
    results.commentsWithMentionsOnly.slice(0, 5).forEach((comment, index) => {
      markdown += `### ${index + 1}. ${comment.ticketKey} - ${comment.commentAuthor}\n`;
      markdown += `- **Mentions:** ${comment.mentions.length}\n`;
      markdown += `- **Link:** [View Comment](${comment.commentUrl})\n\n`;
    });
    
    if (results.commentsWithMentionsOnly.length > 5) {
      markdown += `*...and ${results.commentsWithMentionsOnly.length - 5} more comments with mentions only*\n\n`;
    }
  }
  
  markdown += `## 🔧 Technical Details\n\n`;
  markdown += `- **Script:** jira-mentions-with-images.js\n`;
  markdown += `- **Jira Host:** ${JIRA_CONFIG.host}\n`;
  markdown += `- **Search Period:** ${TWO_WEEKS_AGO.toISOString()} to ${new Date().toISOString()}\n`;
  markdown += `- **Media Detection:** ✅ Images, videos, and files\n`;
  markdown += `- **Mention Detection:** ✅ ADF mentions and text patterns\n`;
  markdown += `- **Status:** Script completed successfully ✅\n`;
  
  // Write to file
  const outputPath = path.join(__dirname, filename);
  fs.writeFileSync(outputPath, markdown);
  
  return { filename, outputPath };
}

/**
 * Helper functions
 */
function getMediaTypeFromItem(mediaItem) {
  if (mediaItem.mimeType) {
    if (mediaItem.mimeType.startsWith('image/')) return 'IMAGE';
    if (mediaItem.mimeType.startsWith('video/')) return 'VIDEO';
    if (mediaItem.mimeType.startsWith('audio/')) return 'AUDIO';
    return 'FILE';
  }
  
  if (mediaItem.fileName) {
    const ext = mediaItem.fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return 'IMAGE';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return 'VIDEO';
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) return 'AUDIO';
  }
  
  return 'MEDIA';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main execution
 */
async function main() {
  try {
    const results = await findCommentsWithImagesAndMentions();
    const report = generateMarkdownReport(results);
    
    console.log('');
    console.log('🎉 SUCCESS!');
    console.log(`✨ Found ${results.stats.bothCount} comments with both images & mentions`);
    console.log(`🖼️  Found ${results.stats.imagesOnlyCount} comments with images only`);
    console.log(`👤 Found ${results.stats.mentionsOnlyCount} comments with mentions only`);
    console.log(`📄 Report saved: ${report.filename}`);
    console.log(`📁 Full path: ${report.outputPath}`);
    console.log('');
    console.log('✅ Jira images & mentions analysis completed successfully!');
    
  } catch (error) {
    console.error('');
    console.error('❌ FAILED!');
    console.error(`Error: ${error.message}`);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('1. Check your environment variables (JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN)');
    console.error('2. Verify Jira API access and permissions');
    console.error('3. Check network connectivity to Jira instance');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { findCommentsWithImagesAndMentions, generateMarkdownReport };