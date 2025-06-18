# Writing Jira Comments

This directory contains scripts and documentation for writing comments to Jira tickets using the REST API v3.

## Overview

The Jira REST API v3 uses ADF (Atlassian Document Format) for rich text content. Comments can be:
- Plain text
- Rich text with formatting (bold, italic, etc.)
- Include mentions (@user)
- Contain code blocks, tables, lists, etc.
- Include media attachments

## Setup

1. Ensure you have the required environment variables set:
   ```bash
   export JIRA_HOST="https://your-instance.atlassian.net"
   export JIRA_EMAIL="your-email@example.com"
   export JIRA_API_TOKEN="your-api-token"
   ```

2. Make the script executable:
   ```bash
   chmod +x write-jira-comment.js
   ```

## Usage

### Basic Usage

```bash
# Write a rich comment to DE-3417 (default)
node write-jira-comment.js

# Write to a specific ticket
node write-jira-comment.js DE-3417

# Specify comment type (plain, mention, or rich)
node write-jira-comment.js DE-3417 plain
node write-jira-comment.js DE-3417 mention
node write-jira-comment.js DE-3417 rich
```

### Comment Types

1. **Plain Text Comment**
   ```javascript
   {
     body: {
       type: "doc",
       version: 1,
       content: [{
         type: "paragraph",
         content: [{
           type: "text",
           text: "Your comment text here"
         }]
       }]
     }
   }
   ```

2. **Comment with Mention**
   ```javascript
   {
     body: {
       type: "doc",
       version: 1,
       content: [{
         type: "paragraph",
         content: [
           { type: "text", text: "Hey " },
           {
             type: "mention",
             attrs: {
               id: "account-id",
               text: "@userName",
               userType: "DEFAULT"
             }
           },
           { type: "text", text: ", check this out!" }
         ]
       }]
     }
   }
   ```

3. **Rich Comment**
   - Includes headings, lists, code blocks
   - Supports text formatting (bold, italic)
   - Can contain tables and other rich content

## API Details

### Endpoint
```
POST /rest/api/3/issue/{issueIdOrKey}/comment
```

### Authentication
- Uses Basic Authentication with email and API token
- Header: `Authorization: Basic {base64(email:token)}`

### Response
The API returns the created comment object with:
- `id`: Comment ID
- `author`: Author information
- `body`: The ADF content
- `created`: Timestamp
- `updated`: Timestamp

## ADF (Atlassian Document Format)

ADF is a JSON-based format for rich text. Key node types:

### Block Nodes
- `doc` - Root container
- `paragraph` - Text paragraphs
- `heading` - H1-H6 headings
- `bulletList` / `orderedList` - Lists
- `codeBlock` - Code snippets
- `table` - Tables
- `panel` - Info/warning boxes
- `blockquote` - Quotes
- `rule` - Horizontal dividers

### Inline Nodes
- `text` - Plain text
- `mention` - User mentions
- `emoji` - Emoji
- `hardBreak` - Line break
- `inlineCard` - Link previews

### Text Marks
- `strong` - Bold
- `em` - Italic
- `code` - Inline code
- `strike` - Strikethrough
- `underline` - Underline
- `link` - Hyperlinks

## Examples

### Creating a Comment with Table

```javascript
{
  body: {
    type: "doc",
    version: 1,
    content: [{
      type: "table",
      attrs: {
        isNumberColumnEnabled: false,
        layout: "default"
      },
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableHeader",
              content: [{
                type: "paragraph",
                content: [{
                  type: "text",
                  text: "Feature"
                }]
              }]
            },
            {
              type: "tableHeader",
              content: [{
                type: "paragraph",
                content: [{
                  type: "text",
                  text: "Status"
                }]
              }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{
                type: "paragraph",
                content: [{
                  type: "text",
                  text: "API Integration"
                }]
              }]
            },
            {
              type: "tableCell",
              content: [{
                type: "paragraph",
                content: [{
                  type: "text",
                  text: "✅ Complete"
                }]
              }]
            }
          ]
        }
      ]
    }]
  }
}
```

### Creating a Comment with Code Block

```javascript
{
  body: {
    type: "doc",
    version: 1,
    content: [{
      type: "codeBlock",
      attrs: {
        language: "python"
      },
      content: [{
        type: "text",
        text: "def hello_jira():\n    print('Hello from Jira API!')"
      }]
    }]
  }
}
```

## Testing

To test the script:

1. Run with a test ticket:
   ```bash
   node write-jira-comment.js TEST-123 plain
   ```

2. Check the response for the comment ID and URL

3. Verify in Jira UI that the comment appears correctly

## Error Handling

The script handles common errors:
- Missing environment variables
- Invalid ticket keys
- Authentication failures
- Network errors
- API rate limiting

## Rate Limiting

Jira has rate limits. The script should:
- Add delays between bulk operations
- Handle 429 (Too Many Requests) responses
- Implement exponential backoff for retries

## Next Steps

1. **Add Media Attachments**: Extend the script to support file uploads
2. **Batch Comments**: Add support for adding multiple comments
3. **Update/Delete**: Add functions to update or delete existing comments
4. **Webhooks**: Set up webhooks to receive comment notifications
5. **Rich Builder**: Create a builder pattern for complex ADF structures