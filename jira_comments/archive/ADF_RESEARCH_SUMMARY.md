# 🔍 ADF (Atlassian Document Format) Research Summary

## Overview

Jira comments use **Atlassian Document Format (ADF)**, a JSON-based rich text format that can contain much more than plain text. This document summarizes research findings on detecting and parsing different content types in ADF.

## Key Findings

### 1. **ADF Structure**
- ADF is a JSON object with hierarchical nodes
- Two categories: **block nodes** (structural) and **inline nodes** (content)
- JSON Schema available at: `http://go.atlassian.com/adf-json-schema`

### 2. **Table Detection & Structure**

**Tables are detectable** by checking for the `table` node type in ADF:

```json
{
  "type": "table",
  "attrs": {
    "isNumberColumnEnabled": false,
    "layout": "default",
    "width": 760,
    "displayMode": "default"
  },
  "content": [
    {
      "type": "tableRow",
      "content": [
        {
          "type": "tableHeader",
          "content": [...]
        },
        {
          "type": "tableCell", 
          "content": [...]
        }
      ]
    }
  ]
}
```

**Table Attributes**:
- `isNumberColumnEnabled`: Adds row numbering
- `layout`: Table alignment (`default`, `center`, `left`)
- `width`: Table width in pixels
- `displayMode`: Column scaling behavior (`default`, `fixed`)

**Table Hierarchy**:
- `table` → `tableRow` → `tableCell`/`tableHeader`

### 3. **Other Rich Content Types**

The ADF format supports many non-text content types:

#### **Media Content**
- `media`: Individual media items
- `mediaGroup`: Multiple media items
- `mediaSingle`: Single media with caption

#### **Code Content**
- `codeBlock`: Code blocks with syntax highlighting
- Attributes include `language` parameter

#### **Interactive Content**
- `mention`: User mentions (@username)
- `inlineCard`/`blockCard`: Link previews
- `panel`: Colored info/warning panels

#### **Structural Content**
- `heading`: H1-H6 headings
- `bulletList`/`orderedList`: Lists
- `blockquote`: Quote blocks
- `rule`: Horizontal dividers

## Practical Implementation

### Detection Functions

I've created a comprehensive ADF analyzer (`adf-content-detector.js`) that can:

```javascript
// Basic detection
hasTable(adfDocument)          // → boolean
hasMedia(adfDocument)          // → boolean  
hasCodeBlock(adfDocument)      // → boolean

// Detailed analysis
analyzeADFContent(adfDocument) // → full analysis object
getContentTypeSummary(adf)     // → simplified summary
```

### Integration with Jira Scripts

You can enhance the existing Jira mention scripts to detect rich content:

```javascript
// In comment processing loop
if (typeof comment.body === 'object') {
  const analysis = analyzeADFContent(comment.body);
  
  if (analysis.hasRichContent) {
    console.log(`Rich content found: ${analysis.summary.primaryContentTypes.join(', ')}`);
    
    if (analysis.contentTypes.tables > 0) {
      console.log(`Tables: ${analysis.tables.length}`);
    }
  }
}
```

## Content Type Detection Results

Based on testing with sample data:

| Content Type | Detection Method | Rich Content? |
|--------------|------------------|---------------|
| Plain text | `type: 'text'` | ❌ No |
| Tables | `type: 'table'` | ✅ Yes |
| Code blocks | `type: 'codeBlock'` | ✅ Yes |
| Media/Images | `type: 'media'`, `mediaSingle`, `mediaGroup` | ✅ Yes |
| User mentions | `type: 'mention'` | ❌ No (inline) |
| Links | `type: 'inlineCard'`, `blockCard` | ✅ Yes |
| Lists | `type: 'bulletList'`, `orderedList` | ❌ No |
| Headings | `type: 'heading'` | ❌ No |
| Panels | `type: 'panel'` | ✅ Yes |

## API Limitations & Workarounds

### HTML ↔ ADF Conversion
- **Official API**: Discontinued (was at `api.atlassian.com/pf-editor-service/convert`)
- **Workaround**: Use `?expand=renderedBody` parameter to get HTML version
- **Community Tools**: `htmltoadf` GitHub library for conversion

### Current Status
- No official conversion API available
- Community maintains conversion libraries
- Feature request open: `JRACLOUD-77436`

## Practical Usage

### For Mention Detection
- ADF mentions use `type: 'mention'` with user account IDs
- More reliable than text pattern matching
- Contains `displayName`, `id`, and `userType` attributes

### For Content Analysis
- Check `node.type` to identify content types
- Recursively traverse `content` arrays
- Use `attrs` object for additional metadata

### For Integration
- Can detect if comment needs special handling
- Identify comments with complex formatting
- Extract structured data (table contents, code, etc.)

## Example Use Cases

1. **Comment Complexity Analysis**: Identify comments that need rich formatting
2. **Content Migration**: Detect which comments have tables/media for migration
3. **Notification Logic**: Different handling for comments with @mentions vs. tables
4. **Search Enhancement**: Index structured content separately from plain text
5. **Report Generation**: Extract table data for automated reporting

## Files Created

1. **`adf-content-detector.js`**: Full ADF analysis tool
2. **Enhanced mention scripts**: Can now detect rich content alongside mentions
3. **This summary document**: Research findings and implementation guide

## Next Steps

1. **Integrate** ADF detection into existing Jira scripts
2. **Enhance** mention detection to use ADF mention nodes
3. **Extract** structured data (tables, code) for further processing
4. **Monitor** official Atlassian API developments for better conversion tools

---

This research establishes that **Jira comments can contain rich HTML-like content** stored as ADF JSON, and we now have the tools to detect and parse these different content types programmatically.