# 🧪 Sandbox - Jira Mentions Test

This sandbox contains isolated proof-of-concept scripts that are completely separate from the main Squiddles application.

## 🎯 Jira Mentions Scripts

**Purpose**: Verify that we can successfully retrieve Jira comments and identify mentions.

**Status**: Ready to test

### Multiple Analysis Scripts Available:

1. **📄 Markdown Report** (`jira-mentions-test.js`) - Human-readable mention summary
2. **📊 JSON Export** (`jira-mentions-json.js`) - Complete raw data
3. **📋 Tables & Rich Content** (`jira-mentions-with-tables.js`) - Detects tables, code blocks, rich formatting
4. **🖼️ Images & Mentions** (`jira-mentions-with-images.js`) - Finds comments with both images AND mentions (any user)

### Prerequisites

You need your Jira credentials set as environment variables:

```bash
export JIRA_HOST="https://your-domain.atlassian.net"
export JIRA_EMAIL="your-email@company.com"  
export JIRA_API_TOKEN="your-jira-api-token"
```

### Running the Scripts

**Markdown Report (Human-readable)**:
```bash
cd sandbox
node jira-mentions-test.js
# → Generates: jira-mentions-YYYY-MM-DD.md
```

**JSON Export (Raw data)**:
```bash
cd sandbox
node jira-mentions-json.js
# → Generates: jira-mentions-YYYY-MM-DD.json
```

**Tables & Rich Content Analysis**:
```bash
cd sandbox
node jira-mentions-with-tables.js
# → Generates: jira-mentions-with-tables-YYYY-MM-DD.md
```

**Images & Mentions Analysis**:
```bash
cd sandbox
node jira-mentions-with-images.js
# → Generates: jira-images-mentions-YYYY-MM-DD.md
```

### What Both Scripts Do

1. **Searches** for all tickets updated in the last 2 weeks
2. **Retrieves** comments from each ticket
3. **Scans** comment text for mentions of your email/username
4. **Processes** Atlassian Document Format (ADF) from comments
5. **Exports** findings in chosen format

### Output Differences

**Markdown Report** (`jira-mentions-test.js`):
- 📄 Human-readable summary
- 🎯 Focus on actionable mentions
- 📋 Clean formatting for quick review
- 📝 Comment excerpts and links

**JSON Export** (`jira-mentions-json.js`):
- 📊 Complete raw data structure
- 🔧 Full ticket and comment objects
- 🗂️ Both ADF and extracted text versions
- 💾 Machine-readable for further processing

### Expected Output

```
🦑 Jira Mentions Test - Starting...
📅 Looking for mentions in last 2 weeks (since Mon Jan 01 2024)
🎯 Target user: your-email@company.com

🔍 Searching for tickets updated in last 2 weeks...
📋 Found 25 recently updated tickets
⏳ Processing 1/25: PROJ-123 - Fix user authentication bug
⏳ Processing 2/25: PROJ-124 - Add dashboard metrics
...
🎉 SUCCESS!
📊 Found 3 mentions
📄 Report saved: jira-mentions-2024-01-15.md
```

### What Success Looks Like

- ✅ **Connection**: Successfully connects to Jira API
- ✅ **Authentication**: Credentials work correctly
- ✅ **Search**: Retrieves recently updated tickets
- ✅ **Comments**: Fetches comments from tickets
- ✅ **Processing**: Scans comments for mentions
- ✅ **Output**: Generates readable markdown report

### Troubleshooting

**"Missing Jira configuration" error:**
- Check environment variables are set correctly
- Verify JIRA_HOST includes `https://` and `.atlassian.net`

**"HTTP 401" error:**
- Check JIRA_EMAIL is correct
- Verify JIRA_API_TOKEN is valid and not expired
- Test credentials at [id.atlassian.com](https://id.atlassian.com)

**"HTTP 403" error:**
- Your account may not have permission to access API
- Contact Jira admin for API access

**No mentions found:**
- This might be correct! 
- Check the mention patterns in the script
- Manually verify if there should be mentions

### Next Steps

If this test succeeds:
1. ✅ **Proven**: Jira API integration works
2. 🔄 **Iterate**: Refine mention detection patterns
3. 🚀 **Integrate**: Move functionality to main Squiddles app
4. 🎯 **Expand**: Add real-time mention monitoring

### Files Generated

**From Markdown Script**:
- `jira-mentions-YYYY-MM-DD.md` - Human-readable report

**From JSON Script**:  
- `jira-mentions-YYYY-MM-DD.json` - Complete raw data

**Both Scripts**:
- Console output shows progress and results

---

**Note**: This is a completely isolated test. It doesn't affect the main Squiddles application or modify any Jira data.