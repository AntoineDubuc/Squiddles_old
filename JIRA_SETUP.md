# 🎯 Jira Integration Setup Guide

**Status**: ✅ **READY** - Dashboard now displays real Jira comments with mentions

## Quick Start with Real Jira Data

### 1. **Configure Environment Variables**

Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your Jira credentials in `.env.local`:
```bash
# Required for Jira integration
JIRA_HOST=https://your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token

# Required for voice features
OPENAI_API_KEY=your-openai-key
```

### 2. **Get Your Jira API Token**

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a name like "Squiddles Integration"
4. Copy the token and add it to your `.env.local`

### 3. **Start the Application**

```bash
npm run dev
```

Navigate to `http://localhost:3000` and you'll see:
- ✅ Real Jira tickets from your projects
- ✅ Actual comments with mentions parsed from ADF
- ✅ Priority-based urgency indicators
- ✅ Rich content detection (tables, images, code)
- ✅ Interactive action buttons

## What You'll See in the Dashboard

### **Real Activity Feed**
- **Mentions**: Comments where you're @mentioned with urgency classification
- **Rich Content**: Visual indicators for attachments, tables, and code blocks
- **Live Data**: Automatically refreshes every 5 minutes
- **Error Handling**: Clear messages if Jira is unavailable

### **Smart Features**
- **ADF Parsing**: Full Atlassian Document Format support
- **Priority Detection**: Automatic urgency classification based on content
- **User Resolution**: Real user avatars and display names
- **Time Formatting**: Relative time display (2h ago, 1d ago, etc.)

## Data Processing Pipeline

The integration follows this flow:

```
Jira API → ADF Analysis → Mention Detection → Dashboard Display
    ↓            ↓              ↓               ↓
Real tickets  Rich content   User mentions   Priority UI
Comments      Tables/Media   Context aware   Real-time
```

## Supported Content Types

Based on production analysis of real Jira instances:

| Content Type | Status | Example |
|--------------|--------|---------|
| **User Mentions** | ✅ | `@AntoineDubuc` |
| **Tables** | ✅ | Performance data, test results |
| **Images/Media** | ✅ | Screenshots, diagrams |
| **Code Blocks** | ✅ | Error messages, configs |
| **Lists** | ✅ | Requirements, steps |
| **Links** | ✅ | Documentation references |

## Troubleshooting

### **No Activity Showing**
- Check your Jira credentials in `.env.local`
- Verify you have access to projects with recent activity
- Look for error messages in the activity section

### **Authentication Errors**
- Regenerate your Jira API token
- Ensure your email matches your Jira account
- Check your Jira instance URL format

### **Missing Mentions**
- The system looks for mentions in the last 7 days
- Only shows mentions where you're specifically @mentioned
- Check that your Jira account ID is being detected correctly

## Development Notes

### **Data Models**
- Enhanced types in `src/app/types/jira-models.ts`
- ADF parsing utilities in `src/app/lib/jira-utils.ts`
- Service layer in `src/app/services/jiraService.ts`

### **Performance**
- Batched API requests to avoid rate limiting
- Intelligent caching with 5-minute refresh
- User data caching to minimize API calls

### **Security**
- API tokens stored securely in environment variables
- No credentials logged or exposed to client
- Rate limiting protection built-in

## Next Steps: Pinecone Integration

Once you have real Jira data flowing, we can enhance it with vector storage:

1. **Store Comments**: Vector embeddings of comment content
2. **Semantic Search**: Find related discussions across tickets
3. **Context Retrieval**: Intelligent mention context for voice interface
4. **Historical Analysis**: Patterns in team communication

The data is now **ready for vector storage** with rich metadata and processed content!

---

**Ready to see real Jira data in your dashboard? Follow the setup steps above!** 🚀