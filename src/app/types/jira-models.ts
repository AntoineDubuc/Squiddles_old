/**
 * Enhanced Jira Data Models with ADF Support
 * Based on JIRA_COMMENT_PARSING_REFERENCE.md breakthrough analysis
 * Supports real Jira comments, mentions, and rich content
 */

// ==== CORE ADF (ATLASSIAN DOCUMENT FORMAT) TYPES ====

export interface ADFDocument {
  type: 'doc';
  version: 1;
  content: ADFNode[];
}

export interface ADFNode {
  type: string;
  attrs?: Record<string, any>;
  content?: ADFNode[];
  text?: string;
  marks?: ADFMark[];
}

export interface ADFMark {
  type: string;
  attrs?: Record<string, any>;
}

// ==== ADF CONTENT ANALYSIS ====

export interface ADFContentAnalysis {
  text: string;
  tables: ADFTable[];
  media: ADFMedia[];
  mentions: ADFMention[];
  codeBlocks: ADFCodeBlock[];
  hasRichContent: boolean;
  contentTypes: string[];
}

export interface ADFTable {
  rows: Array<{
    cells: Array<{ text: string; isHeader: boolean }>;
  }>;
  maxCols: number;
  layout?: string;
}

export interface ADFMedia {
  id: string;
  type: 'media' | 'mediaGroup' | 'mediaSingle';
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  dimensions?: string;
  downloadUrl?: string;
  collection?: string;
}

export interface ADFMention {
  id: string; // Jira account ID
  displayName: string;
  text: string;
  userType: string;
}

export interface ADFCodeBlock {
  language?: string;
  content: string;
}

// ==== ENHANCED JIRA USER TYPES ====

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls?: {
    '16x16'?: string;
    '24x24'?: string;
    '32x32'?: string;
    '48x48'?: string;
  };
  active: boolean;
  accountType: 'atlassian' | 'app' | 'customer';
}

export interface JiraUserMention {
  accountId: string;
  displayName: string;
  username?: string; // For legacy support
  avatarUrl?: string;
  isCurrentUser: boolean;
  mentionCount: number;
  lastMentioned: Date;
}

// ==== ENHANCED JIRA COMMENT TYPES ====

export interface JiraComment {
  id: string;
  author: JiraUser;
  body: ADFDocument | string; // Can be ADF or plain text
  renderedBody?: string; // HTML rendered version
  created: string; // ISO date string
  updated: string; // ISO date string
  updateAuthor?: JiraUser;
  
  // Enhanced analysis
  adfAnalysis?: ADFContentAnalysis;
  mentions: JiraUserMention[];
  attachmentIds?: string[];
  
  // Jira-specific
  jsdPublic?: boolean;
  visibility?: {
    type: string;
    value: string;
  };
}

export interface JiraAttachment {
  id: string;
  filename: string;
  author: JiraUser;
  created: string;
  size: number;
  mimeType: string;
  content: string; // Download URL
  thumbnail?: string;
  
  // Enhanced metadata
  downloaded?: boolean;
  localPath?: string;
  webPath?: string;
  isImage: boolean;
  isDocument: boolean;
}

// ==== ENHANCED TICKET TYPES ====

export interface EnhancedJiraTicket {
  // Basic Jira fields
  id: string;
  key: string; // PROD-234, etc.
  summary: string;
  description?: ADFDocument | string;
  
  // Ticket metadata
  issueType: {
    id: string;
    name: string;
    iconUrl: string;
    subtask: boolean;
  };
  status: {
    id: string;
    name: string;
    categoryId: string;
    category: 'new' | 'indeterminate' | 'done';
  };
  priority: {
    id: string;
    name: string;
    iconUrl: string;
  };
  
  // People
  assignee?: JiraUser;
  reporter: JiraUser;
  creator: JiraUser;
  
  // Project context
  project: {
    id: string;
    key: string;
    name: string;
    avatarUrls?: Record<string, string>;
  };
  
  // Sprint/Agile
  sprint?: {
    id: string;
    name: string;
    state: 'closed' | 'active' | 'future';
    startDate?: string;
    endDate?: string;
  };
  
  // Enhanced comment data
  comments: JiraComment[];
  totalComments: number;
  commentsWithMentions: number;
  currentUserMentions: number;
  lastCommentDate?: Date;
  
  // Attachments
  attachments: JiraAttachment[];
  
  // Timestamps
  created: string;
  updated: string;
  resolutiondate?: string;
  
  // Custom fields (commonly used)
  storyPoints?: number;
  epicLink?: string;
  labels: string[];
  components: Array<{ id: string; name: string }>;
  fixVersions: Array<{ id: string; name: string }>;
  
  // Analytics
  mentionAnalytics: {
    totalMentions: number;
    uniqueUsersWhoMentioned: number;
    lastMentionDate?: Date;
    mentionFrequency: Record<string, number>; // userId -> count
  };
}

// ==== MENTION RESOLUTION & UTILITIES ====

export interface MentionContext {
  ticketKey: string;
  commentId: string;
  mentionedUser: JiraUserMention;
  mentioningUser: JiraUser;
  mentionText: string;
  contextBefore: string;
  contextAfter: string;
  timestamp: Date;
  isUrgent: boolean;
}

export interface MentionPattern {
  pattern: RegExp;
  type: 'jira_adf' | 'jira_legacy' | 'email' | 'username' | 'display_name';
  parser: (match: RegExpMatchArray) => string; // Returns account ID
}

// ==== ACTIVITY FEED TYPES ====

export interface JiraActivity {
  id: string;
  type: 'comment_created' | 'comment_updated' | 'mention_added' | 'ticket_updated' | 'ticket_assigned';
  ticketKey: string;
  ticketTitle: string;
  actor: JiraUser;
  target?: JiraUser; // For mentions, assignments
  timestamp: Date;
  
  // Context
  commentId?: string;
  commentPreview?: string;
  mentions?: JiraUserMention[];
  changes?: Array<{
    field: string;
    fromValue?: string;
    toValue?: string;
  }>;
  
  // UI helpers
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
}

// ==== REAL-TIME SYNC TYPES ====

export interface JiraCommentEvent {
  eventType: 'jira:issue_updated';
  issue: {
    id: string;
    key: string;
  };
  comment?: {
    id: string;
    created: string;
    updated: string;
    author: JiraUser;
  };
  user: JiraUser;
  timestamp: number;
  webhookEvent: string;
}

// ==== API RESPONSE TYPES ====

export interface JiraCommentsResponse {
  startAt: number;
  maxResults: number;
  total: number;
  comments: JiraComment[];
}

export interface JiraSearchResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: EnhancedJiraTicket[];
}

// ==== ERROR TYPES ====

export interface JiraApiError {
  errorMessages: string[];
  errors: Record<string, string>;
  status: number;
  type: 'validation' | 'permission' | 'not_found' | 'rate_limit' | 'server_error';
}

// ==== CONFIGURATION TYPES ====

export interface JiraIntegrationConfig {
  host: string; // https://company.atlassian.net
  email: string;
  apiToken: string;
  
  // User context
  currentUser: {
    accountId: string;
    emailAddress: string;
    displayName: string;
  };
  
  // Feature flags
  features: {
    adfParsing: boolean;
    mediaDownload: boolean;
    realTimeSync: boolean;
    mentionNotifications: boolean;
  };
  
  // Cache settings
  cache: {
    userDataTtl: number; // seconds
    commentDataTtl: number;
    enableDiskCache: boolean;
  };
}

// ==== DASHBOARD INTEGRATION TYPES ====

export interface DashboardMentionItem {
  id: string;
  ticketKey: string;
  ticketTitle: string;
  commentId: string;
  commentAuthor: JiraUser;
  commentPreview: string;
  mentionContext: string;
  timestamp: Date;
  isRead: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  
  // Rich content indicators
  hasMedia: boolean;
  hasTable: boolean;
  hasCode: boolean;
  mediaCount: number;
  
  // Actions
  quickReplyEnabled: boolean;
  directLinkUrl: string;
}

export interface DashboardActivityFeed {
  mentions: DashboardMentionItem[];
  recentComments: JiraComment[];
  ticketUpdates: JiraActivity[];
  unreadCount: number;
  lastRefresh: Date;
  hasMore: boolean;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}