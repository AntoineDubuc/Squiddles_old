#!/usr/bin/env tsx
/**
 * Test script to verify S3 bucket setup
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'squiddles-attachments';

async function testS3Setup() {
  console.log('🧪 Testing S3 Setup...\n');

  // Test 1: Check AWS credentials
  console.log('1️⃣ Checking AWS credentials...');
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found in environment variables');
    console.log('   Please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to your .env file');
    return false;
  }
  console.log('✅ AWS credentials found\n');

  // Test 2: List buckets (verify credentials work)
  console.log('2️⃣ Verifying AWS access...');
  try {
    const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
    console.log(`✅ Can access AWS S3 (found ${Buckets?.length || 0} buckets)\n`);
  } catch (error: any) {
    console.error('❌ Failed to access AWS S3:', error.message);
    console.log('   Please check your AWS credentials');
    return false;
  }

  // Test 3: Upload test file
  console.log('3️⃣ Testing file upload...');
  const testKey = 'test/connection-test.txt';
  const testContent = `Squiddles S3 test file\nCreated at: ${new Date().toISOString()}`;
  
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
      Metadata: {
        'test': 'true',
        'created-by': 'test-script'
      }
    }));
    console.log(`✅ Successfully uploaded test file to s3://${BUCKET_NAME}/${testKey}\n`);
  } catch (error: any) {
    console.error('❌ Failed to upload test file:', error.message);
    if (error.name === 'NoSuchBucket') {
      console.log(`   The bucket "${BUCKET_NAME}" does not exist. Please create it first.`);
      console.log('   Run: aws s3 mb s3://' + BUCKET_NAME);
    }
    return false;
  }

  // Test 4: Retrieve test file
  console.log('4️⃣ Testing file retrieval...');
  try {
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testKey
    }));
    
    const body = await response.Body?.transformToString();
    if (body === testContent) {
      console.log('✅ Successfully retrieved and verified test file\n');
    } else {
      console.log('⚠️ Retrieved file but content mismatch\n');
    }
  } catch (error: any) {
    console.error('❌ Failed to retrieve test file:', error.message);
    return false;
  }

  // Test 5: Delete test file
  console.log('5️⃣ Cleaning up test file...');
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testKey
    }));
    console.log('✅ Successfully deleted test file\n');
  } catch (error: any) {
    console.error('⚠️ Failed to delete test file:', error.message);
    // Not a critical error
  }

  // Test 6: Test Jira attachment path
  console.log('6️⃣ Testing Jira attachment upload path...');
  const jiraTestKey = 'jira/DE-TEST/attachments/test-attachment-id/test-document.pdf';
  const jiraTestContent = Buffer.from('Mock PDF content');
  
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: jiraTestKey,
      Body: jiraTestContent,
      ContentType: 'application/pdf',
      Metadata: {
        'ticket-key': 'DE-TEST',
        'attachment-id': 'test-attachment-id',
        'source': 'jira'
      }
    }));
    console.log('✅ Successfully tested Jira attachment path structure');
    
    // Clean up
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: jiraTestKey
    }));
    console.log('✅ Cleaned up test Jira attachment\n');
  } catch (error: any) {
    console.error('❌ Failed Jira attachment test:', error.message);
    return false;
  }

  console.log('🎉 All S3 tests passed! Your bucket is ready for use.\n');
  console.log('📋 Configuration:');
  console.log(`   Bucket: ${BUCKET_NAME}`);
  console.log(`   Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Run: npm run index:de-tickets');
  console.log('   2. The script will index DE team tickets since last Tuesday');
  
  return true;
}

// Run the test
if (require.main === module) {
  testS3Setup()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

export { testS3Setup };