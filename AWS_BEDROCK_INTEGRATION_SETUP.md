# AWS Bedrock Integration Requirements for Nova Sonic

## Overview
This document outlines the complete setup requirements for integrating AWS Nova Sonic with the Squiddles voice interface, replacing the current OpenAI Realtime API implementation.

## Current AWS Infrastructure Status
✅ **Already Configured:**
- `@aws-sdk/client-s3` - S3 client for AWS (v3.837.0)
- `dotenv` - Environment variable management (v16.5.0)
- S3 setup documentation exists

⚠️ **Needs Addition:**
- AWS SDK for Bedrock Runtime
- IAM permissions configuration
- Nova Sonic-specific environment variables

## Required AWS SDK Dependencies

### 1. Add Bedrock Runtime SDK
Add to `package.json` dependencies:
```json
{
  "@aws-sdk/client-bedrock-runtime": "^3.670.0",
  "@aws-sdk/credential-providers": "^3.670.0"
}
```

### 2. Install Dependencies
```bash
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/credential-providers
```

## Environment Variables Configuration

### 1. Create `.env.local` File
Create a new environment file with the following variables:
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# Bedrock Configuration  
AWS_BEDROCK_REGION=us-east-1
AWS_BEDROCK_MAX_TOKENS=4096
AWS_BEDROCK_TEMPERATURE=0.7
AWS_BEDROCK_TOP_P=0.9
AWS_BEDROCK_MAX_RETRIES=3

# Nova Sonic Specific
NOVA_SONIC_MODEL_ID=amazon.nova-sonic-v1:0
NOVA_SONIC_VOICE_ID=matthew
NOVA_SONIC_SAMPLE_RATE=24000
NOVA_SONIC_SESSION_TIMEOUT=480000

# Feature Flags
USE_NOVA_SONIC=false
ENABLE_VOICE_FALLBACK=true
```

### 2. Update `.gitignore`
Add to `.gitignore` to prevent committing credentials:
```gitignore
# Environment files
.env.local
.env.production.local
.env.development.local
.env.test.local
```

## IAM Permissions Setup

### 1. Required IAM Policy
Create an IAM policy with these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BedrockAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithBidirectionalStream",
        "bedrock:ListFoundationModels",
        "bedrock:GetFoundationModel"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/amazon.nova-sonic-v1:0",
        "arn:aws:bedrock:*:*:model/*"
      ]
    },
    {
      "Sid": "BedrockMetrics",
      "Effect": "Allow",
      "Action": [
        "bedrock:GetModelInvocationLoggingConfiguration",
        "bedrock:GetUsage",
        "bedrock:ListModelCustomizationJobs"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2. AWS Managed Policy (Alternative)
For development, you can use the AWS managed policy:
```
AmazonBedrockFullAccess
```

### 3. Credential Options
Choose one of these authentication methods:

**Option A: IAM User (Development)**
1. Create IAM user with Bedrock permissions
2. Generate access keys
3. Set in environment variables

**Option B: IAM Role (Production)**
1. Create IAM role with Bedrock permissions
2. Configure EC2/ECS/Lambda to assume role
3. Use instance/container credentials

**Option C: AWS Profile (Local Development)**
1. Configure AWS CLI profile
2. Use profile-based authentication
3. Set `AWS_PROFILE` environment variable

## Model Access Configuration

### 1. Enable Nova Sonic Model
In AWS Console:
1. Navigate to Amazon Bedrock
2. Go to "Model access" in the left sidebar
3. Request access to "Amazon Nova Sonic"
4. Wait for approval (usually immediate)

### 2. Regional Availability
Nova Sonic is available in these regions:
- `us-east-1` (N. Virginia) - **Recommended**
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)

## Technical Implementation Structure

### 1. Nova Sonic Client Architecture
```typescript
// File: src/lib/novaSonicClient.ts
export interface NovaSonicConfig {
  region: string;
  modelId: string;
  voiceId: string;
  sampleRate: number;
  sessionTimeout: number;
}

export class NovaSonicClient {
  private client: BedrockRuntimeClient;
  private config: NovaSonicConfig;
  
  constructor(config: NovaSonicConfig);
  async connect(): Promise<void>;
  async disconnect(): Promise<void>;
  sendAudioChunk(audioData: ArrayBuffer): Promise<void>;
  onAudioReceived(callback: (audio: ArrayBuffer) => void): void;
}
```

### 2. Event System Mapping
Map OpenAI events to Nova Sonic events:
```typescript
// OpenAI -> Nova Sonic Event Mapping
const eventMap = {
  'session.updated': 'sessionStart',
  'input_audio_buffer.clear': 'contentStart',
  'response.create': 'promptStart',
  'connection_change': 'connectionStateChange'
};
```

### 3. Feature Toggle Implementation
```typescript
// File: src/config/voiceProvider.ts
export const getVoiceProvider = () => {
  return process.env.USE_NOVA_SONIC === 'true' 
    ? 'nova-sonic' 
    : 'openai';
};
```

## Development Workflow

### 1. Phase 1: Setup & Authentication
- [ ] Install required AWS SDK packages
- [ ] Configure environment variables
- [ ] Set up IAM permissions
- [ ] Enable Nova Sonic model access
- [ ] Test authentication with basic API call

### 2. Phase 2: Parallel Implementation
- [ ] Create Nova Sonic client parallel to OpenAI client
- [ ] Implement event mapping system
- [ ] Add feature toggle mechanism
- [ ] Create audio format conversion utilities

### 3. Phase 3: Integration Testing
- [ ] Unit tests for Nova Sonic client
- [ ] Integration tests with feature toggle
- [ ] Performance comparison testing
- [ ] Cost monitoring implementation

## Configuration Files Updates

### 1. Update `next.config.ts`
Add Bedrock runtime to external packages:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@openai/agents', 
    '@aws-sdk/client-bedrock-runtime'
  ],
  env: {
    AWS_REGION: process.env.AWS_REGION,
    NOVA_SONIC_MODEL_ID: process.env.NOVA_SONIC_MODEL_ID,
  }
};
```

### 2. Update `tsconfig.json`
Add type definitions:
```json
{
  "compilerOptions": {
    "types": ["node"],
    "paths": {
      "@/*": ["./src/*"],
      "@/lib/nova-sonic": ["./src/lib/novaSonicClient"]
    }
  }
}
```

## Security Considerations

### 1. Environment Variable Security
- Never commit `.env.local` files
- Use AWS Secrets Manager for production
- Rotate access keys regularly
- Use least privilege IAM policies

### 2. Network Security
- Use HTTPS for all Bedrock API calls
- Implement request signing with AWS SigV4
- Set appropriate timeout values
- Handle connection failures gracefully

### 3. Cost Controls
- Set usage alerts in AWS
- Implement session time limits
- Monitor token consumption
- Use feature flags for gradual rollout

## Testing Strategy

### 1. Unit Tests
```typescript
// File: src/lib/__tests__/novaSonicClient.test.ts
describe('NovaSonicClient', () => {
  test('should connect successfully', async () => {
    const client = new NovaSonicClient(testConfig);
    await expect(client.connect()).resolves.not.toThrow();
  });
});
```

### 2. Integration Tests
```typescript
// File: src/__tests__/voiceProvider.integration.test.ts
describe('Voice Provider Integration', () => {
  test('should switch between OpenAI and Nova Sonic', () => {
    // Test feature toggle functionality
  });
});
```

### 3. Performance Tests
- Latency comparison (OpenAI vs Nova Sonic)
- Audio quality assessment
- Cost per session measurement
- Session stability testing

## Migration Checklist

### Pre-Migration
- [ ] AWS account setup completed
- [ ] IAM permissions configured
- [ ] Nova Sonic model access approved
- [ ] Environment variables configured
- [ ] Dependencies installed

### Development
- [ ] Nova Sonic client implementation
- [ ] Event system mapping completed
- [ ] Feature toggle implemented
- [ ] Audio format handlers created
- [ ] Error handling implemented

### Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Performance benchmarks completed
- [ ] Cost analysis validated
- [ ] Security audit completed

### Deployment
- [ ] Feature flag deployed
- [ ] Monitoring systems active
- [ ] Cost alerts configured
- [ ] Rollback plan ready
- [ ] Documentation updated

## Troubleshooting Guide

### Common Issues

**Authentication Errors:**
```
Error: CredentialsError: Missing credentials
```
**Solution:** Verify AWS credentials and IAM permissions

**Model Access Denied:**
```
Error: AccessDeniedException: User is not authorized
```
**Solution:** Enable Nova Sonic model access in Bedrock console

**Timeout Errors:**
```
Error: TimeoutError: Request timed out
```
**Solution:** Increase timeout values and check network connectivity

### Debug Commands
```bash
# Test AWS credentials
aws sts get-caller-identity

# List available Bedrock models
aws bedrock list-foundation-models --region us-east-1

# Test Bedrock permissions
aws bedrock invoke-model --model-id amazon.nova-sonic-v1:0 --body '{}' --region us-east-1
```

## Support Resources

### Documentation
- [AWS Bedrock User Guide](https://docs.aws.amazon.com/bedrock/)
- [Nova Sonic API Reference](https://docs.aws.amazon.com/nova/latest/userguide/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)

### AWS Support
- AWS Developer Forums
- AWS Support Cases (if on paid plan)
- AWS Community Discord

### Cost Monitoring
- AWS Cost Explorer
- CloudWatch billing alarms
- Bedrock usage dashboards

---

## Next Steps

1. **Complete this setup checklist**
2. **Move to POC implementation phase**
3. **Begin parallel Nova Sonic client development**
4. **Implement feature toggle system**

This setup provides the foundation for the Nova Sonic migration while maintaining the ability to fallback to OpenAI if needed.