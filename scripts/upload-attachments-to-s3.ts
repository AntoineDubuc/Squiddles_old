#!/usr/bin/env tsx
/**
 * Actually download Jira attachments and upload them to S3
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { pipeline } from 'stream/promises';

async function uploadAttachmentsToS3() {
  console.log('📎 Uploading Jira attachments to S3...\n');
  
  try {
    // Initialize S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });
    
    const bucketName = process.env.S3_BUCKET_NAME || 'squiddles-attachments';
    
    // Check if bucket exists
    console.log(`🪣 Checking S3 bucket: ${bucketName}...`);
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log('✅ Bucket exists\n');
    } catch (error: any) {
      if (error.name === 'NotFound') {
        console.log('📦 Creating bucket...');
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log('✅ Bucket created\n');
      } else {
        throw error;
      }
    }
    
    // Fetch DE-3270 to get attachments
    console.log('🎫 Fetching DE-3270 attachments...');
    const response = await fetch(
      `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/issue/DE-3270?expand=renderedFields`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString('base64')}`,
          'Accept': 'application/json',
        },
        method: 'GET'
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get issue: ${response.statusText}`);
    }

    const issue = await response.json();
    const attachments = issue.fields.attachment || [];
    
    if (attachments.length === 0) {
      console.log('No attachments found.');
      return;
    }
    
    console.log(`Found ${attachments.length} attachments\n`);
    
    // Process each attachment
    for (const attachment of attachments) {
      console.log(`📥 Downloading ${attachment.filename}...`);
      
      // Download from Jira
      const downloadResponse = await fetch(attachment.content, {
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString('base64')}`,
        }
      });
      
      if (!downloadResponse.ok) {
        console.error(`❌ Failed to download ${attachment.filename}`);
        continue;
      }
      
      // Create S3 key
      const s3Key = `jira/${issue.key}/${attachment.id}_${attachment.filename}`;
      
      console.log(`📤 Uploading to S3: ${s3Key}...`);
      
      // Convert response to buffer
      const buffer = Buffer.from(await downloadResponse.arrayBuffer());
      
      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: attachment.mimeType,
        Metadata: {
          'jira-ticket': issue.key,
          'jira-attachment-id': attachment.id,
          'original-filename': attachment.filename,
          'author': attachment.author.displayName,
          'created': attachment.created
        }
      });
      
      await s3Client.send(uploadCommand);
      
      const s3Url = `https://${bucketName}.s3.amazonaws.com/${s3Key}`;
      console.log(`✅ Uploaded: ${s3Url}\n`);
      
      // Show what would be stored in document store
      console.log('📝 Document store would update attachment with:');
      console.log({
        attachmentId: attachment.id,
        s3Url: s3Url,
        s3Key: s3Key,
        uploadedAt: new Date().toISOString()
      });
      console.log();
    }
    
    console.log('✅ All attachments uploaded to S3!');
    
  } catch (error: any) {
    if (error.message?.includes('AWS_ACCESS_KEY_ID')) {
      console.error('\n❌ AWS credentials not configured!');
      console.error('\nPlease add to your .env:');
      console.error('AWS_ACCESS_KEY_ID=your-access-key');
      console.error('AWS_SECRET_ACCESS_KEY=your-secret-key');
      console.error('AWS_REGION=us-east-1');
      console.error('S3_BUCKET_NAME=squiddles-attachments');
    } else {
      console.error('❌ Error:', error.message || error);
    }
    process.exit(1);
  }
}

// Run the upload
uploadAttachmentsToS3()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });