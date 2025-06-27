# Quick Start: Index Data Engineering Tickets

## Prerequisites

1. **Jira Credentials** (should already be in your `.env` file):
   ```bash
   JIRA_HOST=https://your-instance.atlassian.net
   JIRA_USER_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   ```

2. **Pinecone Credentials** (should already be in your `.env` file):
   ```bash
   PINECONE_API_KEY=your-pinecone-api-key
   PINECONE_INDEX_NAME=your-index-name
   ```

3. **AWS S3 Credentials** (add these to your `.env` file):
   ```bash
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   S3_BUCKET_NAME=squiddles-attachments
   ```

## Step 1: Create S3 Bucket (if not exists)

```bash
# Using AWS CLI
aws s3 mb s3://squiddles-attachments --region us-east-1
```

## Step 2: Test S3 Setup

```bash
npm run test:s3-setup
```

This will verify:
- AWS credentials are working
- Bucket is accessible
- Can upload/download files

## Step 3: Index DE Team Tickets

```bash
npm run index:de-tickets
```

This will:
- Find all Data Engineering (DE) tickets updated since last Tuesday
- Index ticket content and comments to Pinecone
- Store metadata for filtering and search

## What Gets Indexed

For each ticket:
- **Title and Description**: Main ticket content
- **Comments**: All comments with mention detection
- **Metadata**: 
  - Issue type, status, priority
  - Project and ticket keys
  - Assignee and reporter
  - Labels and components
  - Detected mentions (@mentions)
  - Creation and update dates

## Monitoring Progress

The script will show:
- Connection status
- Number of tickets being processed
- Indexing progress
- Final statistics

## Attachment Support (Coming Next)

The S3 bucket is set up for storing attachments with this structure:
```
jira/DE-1234/attachments/attachment-id/filename.pdf
```

Next phase will add:
- Automatic attachment download from Jira
- Upload to S3 with proper organization
- Text extraction from PDFs/docs for search
- Attachment references in Pinecone metadata

## Troubleshooting

### Jira Connection Failed
- Check JIRA_HOST, JIRA_USER_EMAIL, and JIRA_API_TOKEN in .env
- Verify API token has correct permissions

### S3 Access Denied
- Check AWS credentials in .env
- Ensure IAM user has S3 permissions
- Verify bucket name is correct

### No Tickets Found
- Check if there are actually DE tickets updated since last Tuesday
- Try adjusting the date range in the script