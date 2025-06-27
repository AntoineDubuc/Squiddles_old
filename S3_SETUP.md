# S3 Bucket Setup for Jira Attachments

## Overview
This guide explains how to set up an S3 bucket for storing Jira attachments from indexed tickets.

## Bucket Structure
```
squiddles-attachments/
├── jira/
│   ├── DE-1234/
│   │   ├── attachments/
│   │   │   ├── attachment-id-1/
│   │   │   │   └── design-doc.pdf
│   │   │   └── attachment-id-2/
│   │   │       └── screenshot.png
│   └── DE-5678/
│       └── attachments/
│           └── attachment-id-3/
│               └── requirements.docx
├── confluence/
├── gmail/
└── slack/
```

## Setup Steps

### 1. Create S3 Bucket

Using AWS CLI:
```bash
# Create the bucket
aws s3 mb s3://squiddles-attachments --region us-east-1

# Enable versioning (recommended)
aws s3api put-bucket-versioning \
  --bucket squiddles-attachments \
  --versioning-configuration Status=Enabled

# Set up lifecycle policy for cost optimization
aws s3api put-bucket-lifecycle-configuration \
  --bucket squiddles-attachments \
  --lifecycle-configuration file://s3-lifecycle.json
```

### 2. Create IAM Policy

Create a policy for the application to access the bucket:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::squiddles-attachments/*",
        "arn:aws:s3:::squiddles-attachments"
      ]
    }
  ]
}
```

### 3. Configure CORS (if needed for direct browser uploads)
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedOrigins": ["http://localhost:8888", "https://your-domain.com"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 4. Environment Variables

Add to your `.env` file:
```bash
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=squiddles-attachments
```

### 5. Bucket Policy (Optional - for public read access)

If you want attachments to be publicly readable (not recommended for sensitive data):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::squiddles-attachments/jira/*/attachments/*"
    }
  ]
}
```

## Attachment Metadata in Pinecone

When indexing tickets with attachments, we'll store references in Pinecone metadata:
```typescript
{
  attachments: [
    {
      id: "10001",
      filename: "design-doc.pdf",
      mimeType: "application/pdf",
      size: 245632,
      s3Url: "s3://squiddles-attachments/jira/DE-1234/attachments/10001/design-doc.pdf",
      textExtracted: true // If we extracted text for indexing
    }
  ]
}
```

## Cost Optimization

### Lifecycle Rules
Create `s3-lifecycle.json`:
```json
{
  "Rules": [
    {
      "Id": "MoveToIA",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER_FLEXIBLE_RETRIEVAL"
        }
      ]
    },
    {
      "Id": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    }
  ]
}
```

## Security Best Practices

1. **Encryption**: Enable server-side encryption
   ```bash
   aws s3api put-bucket-encryption \
     --bucket squiddles-attachments \
     --server-side-encryption-configuration \
     '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'
   ```

2. **Access Logging**: Enable access logging
   ```bash
   aws s3api put-bucket-logging \
     --bucket squiddles-attachments \
     --bucket-logging-status \
     '{"LoggingEnabled": {"TargetBucket": "squiddles-logs", "TargetPrefix": "s3-access/"}}'
   ```

3. **Block Public Access**: Ensure public access is blocked
   ```bash
   aws s3api put-public-access-block \
     --bucket squiddles-attachments \
     --public-access-block-configuration \
     "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
   ```

## Testing the Setup

Run the test script:
```bash
npm run test:s3-setup
```

This will:
1. Verify AWS credentials
2. Check bucket access
3. Upload a test file
4. Retrieve the test file
5. Clean up

## Next Steps

1. Update the Jira indexer to fetch attachments
2. Implement text extraction for searchable attachments (PDFs, docs)
3. Add attachment preview generation
4. Implement attachment cleanup for deleted tickets