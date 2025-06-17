#!/usr/bin/env node

/**
 * ADF Content Type Detector
 * Analyzes Atlassian Document Format (ADF) comments to detect tables, media, and other non-text content
 */

/**
 * Detect content types in ADF document
 * @param {Object} adfDocument - The ADF document object
 * @returns {Object} Content analysis results
 */
function analyzeADFContent(adfDocument) {
  const analysis = {
    contentTypes: {
      text: 0,
      tables: 0,
      codeBlocks: 0,
      media: 0,
      mentions: 0,
      links: 0,
      panels: 0,
      lists: 0,
      headings: 0,
      rules: 0, // horizontal rules
      blockquotes: 0,
      other: 0
    },
    tables: [],
    codeBlocks: [],
    media: [],
    mentions: [],
    hasRichContent: false,
    textContent: '',
    structuredContent: []
  };

  /**
   * Recursively analyze ADF nodes
   */
  function analyzeNode(node, depth = 0) {
    if (!node || typeof node !== 'object') return;

    const nodeType = node.type;
    const indent = '  '.repeat(depth);

    // Track the node structure
    analysis.structuredContent.push({
      type: nodeType,
      depth: depth,
      attrs: node.attrs || {},
      hasContent: !!(node.content && node.content.length > 0)
    });

    switch (nodeType) {
      // TEXT CONTENT
      case 'text':
        analysis.contentTypes.text++;
        analysis.textContent += (node.text || '');
        break;

      case 'paragraph':
        // Paragraphs contain text - analyze their content
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // TABLES
      case 'table':
        analysis.contentTypes.tables++;
        analysis.hasRichContent = true;
        
        const tableData = {
          layout: node.attrs?.layout || 'default',
          isNumberColumnEnabled: node.attrs?.isNumberColumnEnabled || false,
          width: node.attrs?.width,
          displayMode: node.attrs?.displayMode || 'default',
          rows: [],
          cellCount: 0
        };

        if (node.content) {
          node.content.forEach(rowNode => {
            if (rowNode.type === 'tableRow') {
              const row = {
                cells: [],
                headers: []
              };
              
              if (rowNode.content) {
                rowNode.content.forEach(cellNode => {
                  tableData.cellCount++;
                  const cellContent = extractTextFromNode(cellNode);
                  
                  if (cellNode.type === 'tableCell') {
                    row.cells.push({
                      content: cellContent,
                      colwidth: cellNode.attrs?.colwidth,
                      attrs: cellNode.attrs
                    });
                  } else if (cellNode.type === 'tableHeader') {
                    row.headers.push({
                      content: cellContent,
                      colwidth: cellNode.attrs?.colwidth,
                      attrs: cellNode.attrs
                    });
                  }
                });
              }
              tableData.rows.push(row);
            }
          });
        }

        analysis.tables.push(tableData);
        
        // Continue analyzing table content
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      case 'tableRow':
      case 'tableCell':
      case 'tableHeader':
        // These are handled by the table case above, but continue analyzing their content
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // CODE BLOCKS
      case 'codeBlock':
        analysis.contentTypes.codeBlocks++;
        analysis.hasRichContent = true;
        
        const codeContent = extractTextFromNode(node);
        analysis.codeBlocks.push({
          language: node.attrs?.language,
          content: codeContent,
          attrs: node.attrs
        });
        
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // MEDIA (images, videos, files)
      case 'media':
      case 'mediaGroup':
      case 'mediaSingle':
        analysis.contentTypes.media++;
        analysis.hasRichContent = true;
        
        analysis.media.push({
          type: nodeType,
          id: node.attrs?.id,
          collection: node.attrs?.collection,
          width: node.attrs?.width,
          height: node.attrs?.height,
          attrs: node.attrs
        });
        
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // MENTIONS
      case 'mention':
        analysis.contentTypes.mentions++;
        analysis.mentions.push({
          id: node.attrs?.id,
          text: node.attrs?.text,
          displayName: node.attrs?.displayName,
          userType: node.attrs?.userType,
          attrs: node.attrs
        });
        break;

      // LINKS
      case 'inlineCard':
      case 'blockCard':
        analysis.contentTypes.links++;
        analysis.hasRichContent = true;
        break;

      // PANELS
      case 'panel':
        analysis.contentTypes.panels++;
        analysis.hasRichContent = true;
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // LISTS
      case 'bulletList':
      case 'orderedList':
        analysis.contentTypes.lists++;
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      case 'listItem':
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // HEADINGS
      case 'heading':
        analysis.contentTypes.headings++;
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // RULES (horizontal lines)
      case 'rule':
        analysis.contentTypes.rules++;
        analysis.hasRichContent = true;
        break;

      // BLOCKQUOTES
      case 'blockquote':
        analysis.contentTypes.blockquotes++;
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // ROOT DOCUMENT
      case 'doc':
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;

      // OTHER/UNKNOWN
      default:
        if (nodeType) {
          analysis.contentTypes.other++;
        }
        
        // Still analyze content if it exists
        if (node.content) {
          node.content.forEach(child => analyzeNode(child, depth + 1));
        }
        break;
    }
  }

  /**
   * Extract text content from a node recursively
   */
  function extractTextFromNode(node) {
    if (!node) return '';
    
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractTextFromNode).join('');
    }
    
    return '';
  }

  // Start analysis
  analyzeNode(adfDocument);

  // Calculate summary
  analysis.summary = {
    totalNodes: analysis.structuredContent.length,
    hasStructuredContent: analysis.hasRichContent,
    isPlainText: analysis.contentTypes.text > 0 && !analysis.hasRichContent,
    contentComplexity: analysis.hasRichContent ? 'complex' : 'simple',
    primaryContentTypes: Object.entries(analysis.contentTypes)
      .filter(([type, count]) => count > 0)
      .sort(([,a], [,b]) => b - a)
      .map(([type]) => type)
  };

  return analysis;
}

/**
 * Check if ADF content contains tables
 */
function hasTable(adfDocument) {
  const analysis = analyzeADFContent(adfDocument);
  return analysis.contentTypes.tables > 0;
}

/**
 * Check if ADF content contains media
 */
function hasMedia(adfDocument) {
  const analysis = analyzeADFContent(adfDocument);
  return analysis.contentTypes.media > 0;
}

/**
 * Check if ADF content contains code blocks
 */
function hasCodeBlock(adfDocument) {
  const analysis = analyzeADFContent(adfDocument);
  return analysis.contentTypes.codeBlocks > 0;
}

/**
 * Get a simplified content type summary
 */
function getContentTypeSummary(adfDocument) {
  const analysis = analyzeADFContent(adfDocument);
  return {
    isPlainText: analysis.summary.isPlainText,
    hasTable: analysis.contentTypes.tables > 0,
    hasMedia: analysis.contentTypes.media > 0,
    hasCodeBlock: analysis.contentTypes.codeBlocks > 0,
    hasMentions: analysis.contentTypes.mentions > 0,
    hasRichContent: analysis.hasRichContent,
    contentTypes: analysis.summary.primaryContentTypes
  };
}

// Example usage and testing
if (require.main === module) {
  console.log('🔍 ADF Content Type Detector - Testing...\n');

  // Test cases
  const testCases = [
    {
      name: 'Simple text',
      adf: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Hello world' }
            ]
          }
        ]
      }
    },
    {
      name: 'Table with data',
      adf: {
        type: 'doc',
        content: [
          {
            type: 'table',
            attrs: { layout: 'default', isNumberColumnEnabled: false },
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Header 1' }]
                      }
                    ]
                  },
                  {
                    type: 'tableHeader',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Header 2' }]
                      }
                    ]
                  }
                ]
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Cell 1' }]
                      }
                    ]
                  },
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Cell 2' }]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      name: 'Code block',
      adf: {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: { language: 'javascript' },
            content: [
              { type: 'text', text: 'console.log("Hello world");' }
            ]
          }
        ]
      }
    },
    {
      name: 'Mixed content with mention',
      adf: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Hi ' },
              {
                type: 'mention',
                attrs: {
                  id: '712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e',
                  text: '@Antoine Dubuc',
                  displayName: 'Antoine Dubuc'
                }
              },
              { type: 'text', text: ' please review this.' }
            ]
          }
        ]
      }
    }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. Testing: ${testCase.name}`);
    console.log('=' .repeat(40));
    
    const analysis = analyzeADFContent(testCase.adf);
    const summary = getContentTypeSummary(testCase.adf);
    
    console.log('📊 Content Types:', JSON.stringify(summary, null, 2));
    console.log('🔢 Counts:', analysis.contentTypes);
    
    if (analysis.tables.length > 0) {
      console.log('📋 Tables found:', analysis.tables.length);
      analysis.tables.forEach((table, i) => {
        console.log(`   Table ${i + 1}: ${table.rows.length} rows, ${table.cellCount} cells`);
      });
    }
    
    if (analysis.mentions.length > 0) {
      console.log('👤 Mentions found:', analysis.mentions.length);
      analysis.mentions.forEach(mention => {
        console.log(`   - ${mention.displayName || mention.text}`);
      });
    }
  });

  console.log('\n✅ Testing completed!');
}

module.exports = {
  analyzeADFContent,
  hasTable,
  hasMedia,
  hasCodeBlock,
  getContentTypeSummary
};