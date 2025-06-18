/**
 * Jira Utilities for ADF Parsing and Mention Resolution
 * Implements the breakthrough ADF parsing from JIRA_COMMENT_PARSING_REFERENCE.md
 */

import {
  ADFDocument,
  ADFNode,
  ADFContentAnalysis,
  ADFTable,
  ADFMedia,
  ADFMention,
  ADFCodeBlock,
  JiraComment,
  JiraUserMention,
  MentionContext,
  MentionPattern,
  DashboardMentionItem,
  JiraUser
} from '../types/jira-models';

// ==== ADF PARSING UTILITIES ====

/**
 * Comprehensive ADF content analysis
 * Based on production-tested parsing from the reference document
 */
export function analyzeADFContent(adfBody: ADFDocument | string): ADFContentAnalysis {
  const analysis: ADFContentAnalysis = {
    text: '',
    tables: [],
    media: [],
    mentions: [],
    codeBlocks: [],
    hasRichContent: false,
    contentTypes: []
  };

  // Handle plain text fallback
  if (typeof adfBody === 'string') {
    analysis.text = adfBody;
    return analysis;
  }

  function processNode(node: ADFNode): string {
    if (!node || typeof node !== 'object') return '';

    // Track content types found
    if (node.type && !analysis.contentTypes.includes(node.type)) {
      analysis.contentTypes.push(node.type);
    }

    switch (node.type) {
      case 'text':
        return node.text || '';
        
      case 'table':
        analysis.hasRichContent = true;
        analysis.tables.push(processTable(node));
        return '\n[TABLE]\n';
        
      case 'media':
      case 'mediaGroup':  
      case 'mediaSingle':
        analysis.hasRichContent = true;
        analysis.media.push(...processMedia(node));
        return '\n[MEDIA]\n';
        
      case 'mention':
        analysis.mentions.push(processMention(node));
        return `@${node.attrs?.displayName || node.attrs?.text || 'Unknown'}`;
        
      case 'codeBlock':
        analysis.hasRichContent = true;
        analysis.codeBlocks.push(processCodeBlock(node));
        return '\n[CODE]\n';
        
      case 'paragraph':
      case 'listItem':
      case 'tableHeader':
      case 'tableCell':
        if (node.content && Array.isArray(node.content)) {
          return node.content.map(processNode).join('');
        }
        return '';
        
      case 'bulletList':
      case 'orderedList':
        if (node.content && Array.isArray(node.content)) {
          return '\n' + node.content.map(processNode).join('\n') + '\n';
        }
        return '';
        
      case 'heading':
        if (node.content && Array.isArray(node.content)) {
          const level = node.attrs?.level || 1;
          const headingText = node.content.map(processNode).join('');
          return '\n' + '#'.repeat(level) + ' ' + headingText + '\n';
        }
        return '';
        
      case 'blockquote':
        if (node.content && Array.isArray(node.content)) {
          return '\n> ' + node.content.map(processNode).join('') + '\n';
        }
        return '';
        
      case 'rule':
        return '\n---\n';
        
      case 'panel':
        analysis.hasRichContent = true;
        if (node.content && Array.isArray(node.content)) {
          const panelType = node.attrs?.panelType || 'info';
          return `\n[${panelType.toUpperCase()} PANEL]\n${node.content.map(processNode).join('')}\n`;
        }
        return '';
        
      case 'inlineCard':
      case 'blockCard':
        const url = node.attrs?.url || 'Unknown URL';
        return `[Link: ${url}]`;
        
      default:
        if (node.content && Array.isArray(node.content)) {
          return node.content.map(processNode).join('');
        }
        return '';
    }
  }

  try {
    if (adfBody.content && Array.isArray(adfBody.content)) {
      analysis.text = adfBody.content.map(processNode).join(' ');
    } else {
      analysis.text = processNode(adfBody as ADFNode);
    }
  } catch (error) {
    console.warn('ADF parsing error:', error);
    analysis.text = JSON.stringify(adfBody);
    // @ts-ignore
    analysis.error = error.message;
  }

  return analysis;
}

function processTable(tableNode: ADFNode): ADFTable {
  const table: ADFTable = {
    rows: [],
    maxCols: 0,
    layout: tableNode.attrs?.layout
  };

  if (!tableNode.content) return table;

  tableNode.content.forEach(rowNode => {
    if (rowNode.type === 'tableRow' && rowNode.content) {
      const row = {
        cells: rowNode.content.map(cellNode => ({
          text: extractTextFromNode(cellNode),
          isHeader: cellNode.type === 'tableHeader'
        }))
      };
      
      table.rows.push(row);
      table.maxCols = Math.max(table.maxCols, row.cells.length);
    }
  });

  return table;
}

function processMedia(mediaNode: ADFNode): ADFMedia[] {
  const mediaItems: ADFMedia[] = [];

  function extractMediaInfo(node: ADFNode): ADFMedia | null {
    if (!['media', 'mediaGroup', 'mediaSingle'].includes(node.type)) return null;

    return {
      id: node.attrs?.id || '',
      type: node.type as 'media' | 'mediaGroup' | 'mediaSingle',
      fileName: node.attrs?.fileName,
      mimeType: node.attrs?.mimeType,
      fileSize: node.attrs?.fileSize,
      dimensions: node.attrs?.width && node.attrs?.height 
        ? `${node.attrs.width}×${node.attrs.height}` 
        : undefined,
      collection: node.attrs?.collection
    };
  }

  if (mediaNode.type === 'mediaGroup' && mediaNode.content) {
    mediaNode.content.forEach(childNode => {
      const mediaInfo = extractMediaInfo(childNode);
      if (mediaInfo) mediaItems.push(mediaInfo);
    });
  } else {
    const mediaInfo = extractMediaInfo(mediaNode);
    if (mediaInfo) mediaItems.push(mediaInfo);
  }

  return mediaItems;
}

function processMention(mentionNode: ADFNode): ADFMention {
  return {
    id: mentionNode.attrs?.id || '',
    displayName: mentionNode.attrs?.displayName || mentionNode.attrs?.text || 'Unknown User',
    text: mentionNode.attrs?.text || '',
    userType: mentionNode.attrs?.userType || 'DEFAULT'
  };
}

function processCodeBlock(codeNode: ADFNode): ADFCodeBlock {
  return {
    language: codeNode.attrs?.language,
    content: extractTextFromNode(codeNode)
  };
}

function extractTextFromNode(node: ADFNode): string {
  if (node.text) return node.text;
  if (node.content) {
    return node.content.map(extractTextFromNode).join('');
  }
  return '';
}

// ==== MENTION UTILITIES ====

/**
 * Comprehensive mention detection patterns
 * Supports all Jira mention formats discovered in production
 */
export const MENTION_PATTERNS: MentionPattern[] = [
  // Jira ADF format (primary)
  {
    pattern: /\[~accountid:([^\]]+)\]/g,
    type: 'jira_adf',
    parser: (match) => match[1]
  },
  
  // Legacy Jira format  
  {
    pattern: /\[~([^\]]+)\]/g,
    type: 'jira_legacy',
    parser: (match) => match[1]
  },
  
  // Email format
  {
    pattern: /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    type: 'email',
    parser: (match) => match[1]
  },
  
  // Username format
  {
    pattern: /@([a-zA-Z0-9._-]+)/g,
    type: 'username',
    parser: (match) => match[1]
  }
];

/**
 * Extract all mentions from text using multiple patterns
 */
export function extractMentions(text: string, userMap?: Map<string, JiraUser>): JiraUserMention[] {
  const mentions: JiraUserMention[] = [];
  const seenIds = new Set<string>();

  MENTION_PATTERNS.forEach(pattern => {
    const regex = new RegExp(pattern.pattern);
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const identifier = pattern.parser(match);
      
      // Skip if already processed
      if (seenIds.has(identifier)) continue;
      seenIds.add(identifier);
      
      // Try to resolve user info
      const user = userMap?.get(identifier);
      const mention: JiraUserMention = {
        accountId: user?.accountId || identifier,
        displayName: user?.displayName || identifier,
        username: pattern.type === 'username' ? identifier : undefined,
        avatarUrl: user?.avatarUrls?.['48x48'],
        isCurrentUser: false, // Will be set by caller
        mentionCount: 1,
        lastMentioned: new Date()
      };
      
      mentions.push(mention);
    }
  });

  return mentions;
}

/**
 * Check if a user is mentioned in a comment
 */
export function isUserMentioned(comment: JiraComment, userAccountId: string): boolean {
  // Check ADF mentions first
  if (comment.adfAnalysis?.mentions) {
    return comment.adfAnalysis.mentions.some(mention => mention.id === userAccountId);
  }
  
  // Fallback to text parsing
  const text = typeof comment.body === 'string' ? comment.body : comment.renderedBody || '';
  const mentions = extractMentions(text);
  return mentions.some(mention => mention.accountId === userAccountId);
}

/**
 * Get mention context around a user mention
 */
export function getMentionContext(text: string, userIdentifier: string, contextLength = 50): MentionContext | null {
  const patterns = MENTION_PATTERNS.filter(p => 
    p.type === 'jira_adf' || p.type === 'jira_legacy'
  );
  
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.pattern);
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const identifier = pattern.parser(match);
      
      if (identifier === userIdentifier) {
        const startIndex = Math.max(0, match.index - contextLength);
        const endIndex = Math.min(text.length, match.index + match[0].length + contextLength);
        
        return {
          ticketKey: '', // To be filled by caller
          commentId: '', // To be filled by caller
          mentionedUser: {
            accountId: identifier,
            displayName: identifier,
            isCurrentUser: false,
            mentionCount: 1,
            lastMentioned: new Date()
          },
          mentioningUser: {} as JiraUser, // To be filled by caller
          mentionText: match[0],
          contextBefore: text.substring(startIndex, match.index),
          contextAfter: text.substring(match.index + match[0].length, endIndex),
          timestamp: new Date(),
          isUrgent: false
        };
      }
    }
  }
  
  return null;
}

// ==== DASHBOARD UTILITIES ====

/**
 * Convert Jira comment to dashboard mention item
 */
export function createDashboardMentionItem(
  comment: JiraComment,
  ticketKey: string,
  ticketTitle: string,
  currentUserAccountId: string
): DashboardMentionItem | null {
  
  if (!isUserMentioned(comment, currentUserAccountId)) {
    return null;
  }

  const analysis = comment.adfAnalysis || analyzeADFContent(comment.body);
  const mentionContext = getMentionContext(analysis.text, currentUserAccountId);
  
  return {
    id: `${ticketKey}-${comment.id}`,
    ticketKey,
    ticketTitle,
    commentId: comment.id,
    commentAuthor: comment.author,
    commentPreview: truncateText(analysis.text, 150),
    mentionContext: (mentionContext?.contextBefore || '') + (mentionContext?.mentionText || '') + (mentionContext?.contextAfter || ''),
    timestamp: new Date(comment.created),
    isRead: false,
    urgency: determineUrgency(analysis.text, ticketTitle),
    
    // Rich content indicators
    hasMedia: analysis.media.length > 0,
    hasTable: analysis.tables.length > 0,
    hasCode: analysis.codeBlocks.length > 0,
    mediaCount: analysis.media.length,
    
    // Actions
    quickReplyEnabled: true,
    directLinkUrl: `#/ticket/${ticketKey}/comment/${comment.id}`
  };
}

/**
 * Filter comments for current user mentions
 */
export function getCommentsWithMentions(
  comments: JiraComment[],
  currentUserAccountId: string
): JiraComment[] {
  return comments.filter(comment => isUserMentioned(comment, currentUserAccountId));
}

/**
 * Group mentions by urgency
 */
export function groupMentionsByUrgency(mentions: DashboardMentionItem[]): {
  critical: DashboardMentionItem[];
  high: DashboardMentionItem[];
  medium: DashboardMentionItem[];
  low: DashboardMentionItem[];
} {
  return {
    critical: mentions.filter(m => m.urgency === 'critical'),
    high: mentions.filter(m => m.urgency === 'high'),
    medium: mentions.filter(m => m.urgency === 'medium'),
    low: mentions.filter(m => m.urgency === 'low')
  };
}

// ==== HELPER FUNCTIONS ====

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function determineUrgency(text: string, ticketTitle: string): 'low' | 'medium' | 'high' | 'critical' {
  const urgentKeywords = ['urgent', 'critical', 'blocking', 'asap', 'immediately'];
  const highKeywords = ['important', 'priority', 'needed', 'required'];
  
  const combinedText = (text + ' ' + ticketTitle).toLowerCase();
  
  if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'critical';
  }
  
  if (highKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'high';
  }
  
  // Check for question patterns
  if (combinedText.includes('?') || combinedText.includes('can you') || combinedText.includes('could you')) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Table to Markdown converter (from reference document)
 */
export function tableToMarkdown(adfTable: ADFTable): string {
  if (!adfTable.rows || adfTable.rows.length === 0) {
    return '| (Empty Table) |\n|---|\n';
  }
  
  let markdown = '';
  
  adfTable.rows.forEach((row, rowIndex) => {
    const cellTexts = row.cells.map(cell => {
      return (cell.text || ' ').replace(/\|/g, '\\|');
    });
    
    // Ensure consistent column count
    while (cellTexts.length < adfTable.maxCols) {
      cellTexts.push(' ');
    }
    
    markdown += `| ${cellTexts.join(' | ')} |\n`;
    
    // Add separator after first row
    if (rowIndex === 0) {
      const separator = Array(adfTable.maxCols).fill('---').join(' | ');
      markdown += `| ${separator} |\n`;
    }
  });
  
  return markdown;
}

/**
 * Detect mention patterns in text
 */
export function detectMentionPatterns(text: string, userEmail: string): string[] {
  const username = userEmail.split('@')[0];
  
  const patterns = [
    userEmail,
    username,
    `@${userEmail}`,
    `@${username}`,
    `[~${username}]`,
    `[~${userEmail}]`,
    username.charAt(0).toUpperCase() + username.slice(1),
    
    // Common variations based on email
    ...(username.includes('.') ? [
      username.replace('.', ' '),
      username.split('.').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ')
    ] : [])
  ];
  
  const lowerText = text.toLowerCase();
  
  return patterns.filter(pattern => 
    lowerText.includes(pattern.toLowerCase())
  );
}