/**
 * UI Data Models for Squiddles
 * Based on mockup analysis for dashboard, creation, and settings functionality
 */

// ==== USER MANAGEMENT ====

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'pm' | 'tpm' | 'po' | 'eng' | 'sm' | 'other';
  company?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  voiceSettings: VoiceSettings;
  theme: 'dark' | 'light' | 'auto';
  notifications: NotificationSettings;
  panelStates: {
    leftPanelCollapsed: boolean;
    rightPanelCollapsed: boolean;
  };
}

export interface VoiceSettings {
  inputDevice?: string;
  outputDevice?: string;
  sensitivity: number;
  pushToTalk: boolean;
  noiseCancellation: boolean;
  echoCancellation: boolean;
  audioQuality: 'low' | 'standard' | 'high' | 'premium';
  voiceActivationEnabled: boolean;
}

export interface NotificationSettings {
  mentions: boolean;
  comments: boolean;
  ticketUpdates: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  browserNotifications: boolean;
}

// ==== ENHANCED TICKET MANAGEMENT ====

export interface EnhancedTicket {
  id: string;
  jiraKey?: string; // PROD-234, TASK-567, etc.
  title: string;
  description: string;
  type: 'story' | 'task' | 'bug' | 'spike' | 'epic';
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId?: string;
  assigneeName?: string;
  reporterId: string;
  reporterName: string;
  sprintId?: string;
  sprintName?: string;
  projectId: string;
  projectName: string;
  storyPoints?: number;
  acceptanceCriteria?: string[];
  sections: TicketSection[];
  comments: Comment[];
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  
  // Voice-specific fields
  createdViaVoice?: boolean;
  voiceSessionId?: string;
  lastVoiceUpdate?: Date;
}

export interface TicketSection {
  id: string;
  name: string;
  content: string;
  type: 'text' | 'list' | 'checklist';
  order: number;
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  mentions: string[]; // User IDs mentioned
  parentCommentId?: string; // For replies
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  
  // Voice-specific
  createdViaVoice?: boolean;
  voiceTranscript?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

// ==== SPRINT AND PROJECT MANAGEMENT ====

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  velocity: number;
  status: 'future' | 'active' | 'completed';
  tickets: EnhancedTicket[];
  
  // Metrics shown in dashboard
  completedPoints: number;
  totalPoints: number;
  completionPercentage: number;
}

export interface Project {
  id: string;
  name: string;
  key: string; // PROD, TASK, etc.
  description: string;
  lead: User;
  members: User[];
  sprints: Sprint[];
  createdAt: Date;
}

// ==== ACTIVITY FEED AND NOTIFICATIONS ====

export interface ActivityFeedItem {
  id: string;
  type: 'comment' | 'ticket_update' | 'mention' | 'status_change' | 'assignment';
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  targetType: 'ticket' | 'comment' | 'sprint';
  targetId: string;
  targetTitle: string;
  action: string; // "commented on", "updated", "mentioned you in"
  data: any; // Type-specific data
  timestamp: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'comment' | 'ticket_update' | 'system';
  title: string;
  message: string;
  data: any; // Type-specific payload
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// ==== INTEGRATION MANAGEMENT ====

export interface Integration {
  id: string;
  userId: string;
  type: 'jira' | 'slack' | 'pinecone' | 'confluence' | 'openai';
  name: string;
  status: 'connected' | 'disconnected' | 'limited' | 'error';
  config: IntegrationConfig;
  healthMetrics: HealthMetrics;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationConfig {
  baseUrl?: string;
  username?: string;
  apiKey?: string;
  projectKeys?: string[];
  webhookUrl?: string;
  additionalSettings: Record<string, any>;
}

export interface HealthMetrics {
  uptime: number; // Percentage
  responseTime: number; // Milliseconds
  successRate: number; // Percentage
  errorRate: number; // Percentage
  lastChecked: Date;
  errors: HealthError[];
}

export interface HealthError {
  timestamp: Date;
  message: string;
  code?: string;
  resolved: boolean;
}

// ==== TEMPLATE SYSTEM ====

export interface Template {
  id: string;
  name: string;
  type: 'story' | 'bug' | 'task' | 'spike' | 'epic';
  description: string;
  icon: string;
  fields: TemplateField[];
  sections: TemplateSection[];
  tags: string[];
  usageCount: number;
  createdBy: string;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface TemplateSection {
  name: string;
  description: string;
  required: boolean;
  defaultContent?: string;
  type: 'text' | 'list' | 'checklist';
}

// ==== VOICE SESSION ENHANCEMENT ====

export interface EnhancedVoiceSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  commands: VoiceCommand[];
  audioQuality: AudioMetrics;
  context: VoiceContext;
  outcome?: VoiceOutcome;
}

export interface VoiceCommand {
  id: string;
  sessionId: string;
  transcript: string;
  confidence: number;
  intent: string;
  entities: VoiceEntity[];
  response: string;
  timestamp: Date;
  processingTime: number;
  successful: boolean;
}

export interface VoiceEntity {
  type: string;
  value: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface VoiceContext {
  currentPage: string;
  activeTicket?: string;
  activeSprint?: string;
  recentTickets: string[];
  conversationHistory: string[];
}

export interface VoiceOutcome {
  type: 'ticket_created' | 'ticket_updated' | 'navigation' | 'query' | 'error';
  targetId?: string;
  data?: any;
  success: boolean;
  error?: string;
}

export interface AudioMetrics {
  volume: number;
  clarity: number;
  backgroundNoise: number;
  duration: number;
}

// ==== DASHBOARD METRICS ====

export interface DashboardMetrics {
  user: {
    totalTickets: number;
    activeTickets: number;
    completedThisWeek: number;
    mentions: number;
    newComments: number;
  };
  sprint: {
    name: string;
    capacity: number;
    completed: number;
    remaining: number;
    daysLeft: number;
  };
  team: {
    velocity: number;
    burndownRate: number;
    blockedTickets: number;
    overdueTasks: number;
  };
  voice: {
    sessionsToday: number;
    avgSessionLength: number;
    commandSuccessRate: number;
    lastUsed: Date;
  };
}


// ==== FORM TYPES FOR UI ====

export interface TicketCreationForm {
  title: string;
  description: string;
  type: string;
  priority: string;
  assigneeId?: string;
  sprintId?: string;
  sections: {
    name: string;
    content: string;
  }[];
  acceptanceCriteria: string[];
  storyPoints?: number;
}

export interface VoiceSettingsForm {
  inputDevice: string;
  outputDevice: string;
  sensitivity: number;
  pushToTalk: boolean;
  noiseCancellation: boolean;
  echoCancellation: boolean;
  audioQuality: string;
}

export interface IntegrationSetupForm {
  type: string;
  name: string;
  baseUrl: string;
  username?: string;
  apiKey?: string;
  projectKeys: string[];
  testConnection: boolean;
}