#!/usr/bin/env tsx
/**
 * Script to index Data Engineering team tickets since last Tuesday to Pinecone
 * with S3 attachment storage support
 */

// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

// Now import other modules
import { getJiraIndexer } from '../src/lib/pinecone/indexers/jiraIndexer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client (we'll set this up after creating the bucket)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'squiddles-attachments';

/**
 * Calculate the date of last Tuesday
 */
function getLastTuesday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Calculate days since last Tuesday
  // If today is Tuesday (2), we want 7 days ago
  // If today is Wednesday (3), we want 8 days ago, etc.
  let daysToSubtract;
  if (dayOfWeek >= 2) {
    // Wednesday to Saturday
    daysToSubtract = dayOfWeek - 2 + 7;
  } else {
    // Sunday or Monday
    daysToSubtract = dayOfWeek + 5;
  }
  
  const lastTuesday = new Date(today);
  lastTuesday.setDate(today.getDate() - daysToSubtract);
  lastTuesday.setHours(0, 0, 0, 0); // Start of day
  
  return lastTuesday;
}

/**
 * Format date for JQL query
 */
function formatDateForJQL(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Upload attachment to S3
 */
async function uploadAttachmentToS3(
  ticketKey: string,
  attachmentId: string,
  attachmentData: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `jira/${ticketKey}/attachments/${attachmentId}/${filename}`;
  
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: attachmentData,
      ContentType: contentType,
      Metadata: {
        'ticket-key': ticketKey,
        'attachment-id': attachmentId,
        'source': 'jira'
      }
    }));
    
    return `s3://${S3_BUCKET_NAME}/${key}`;
  } catch (error) {
    console.error(`Failed to upload attachment ${filename} to S3:`, error);
    throw error;
  }
}

/**
 * Main indexing function
 */
async function indexDETickets() {
  console.log('🚀 Starting Data Engineering tickets indexing...');
  
  const jiraIndexer = getJiraIndexer();
  
  // Test Jira connection first
  console.log('🔌 Testing Jira connection...');
  const connectionTest = await jiraIndexer.testConnection();
  
  if (!connectionTest.success) {
    console.error('❌ Jira connection failed:', connectionTest.error);
    process.exit(1);
  }
  
  console.log('✅ Jira connection successful');
  
  // Calculate date range
  const lastTuesday = getLastTuesday();
  const jqlDate = formatDateForJQL(lastTuesday);
  
  console.log(`📅 Indexing tickets updated since: ${lastTuesday.toDateString()} (${jqlDate})`);
  
  // Build JQL query for Data Engineering tickets
  const jql = `project = DE AND updated >= "${jqlDate}" ORDER BY updated DESC`;
  
  console.log(`🔍 JQL Query: ${jql}`);
  
  try {
    // Get stats before indexing
    console.log('📊 Getting pre-indexing stats...');
    const statsBefore = await jiraIndexer.getIndexingStats('DE');
    console.log('Stats before:', statsBefore);
    
    // Perform indexing
    console.log('🎫 Starting ticket indexing...');
    await jiraIndexer.indexTicketsByJQL(jql);
    
    // Get stats after indexing
    console.log('📊 Getting post-indexing stats...');
    const statsAfter = await jiraIndexer.getIndexingStats('DE');
    console.log('Stats after:', statsAfter);
    
    console.log('✅ Indexing completed successfully!');
    
    // Note about attachments
    console.log('\n📎 Note: Attachment handling will be implemented in the next phase.');
    console.log('   This will require updating the jiraIndexer to fetch and process attachments.');
    
  } catch (error) {
    console.error('❌ Error during indexing:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  indexDETickets()
    .then(() => {
      console.log('🎉 Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { getLastTuesday, formatDateForJQL, uploadAttachmentToS3 };