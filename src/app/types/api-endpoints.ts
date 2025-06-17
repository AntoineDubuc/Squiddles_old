/**
 * API Endpoint Types for Squiddles
 * Defines request/response shapes for all API routes supporting the UI mockups
 */

import { 
  User, 
  EnhancedTicket, 
  Comment, 
  Sprint, 
  ActivityFeedItem, 
  Notification, 
  Integration, 
  Template, 
  EnhancedVoiceSession, 
  DashboardMetrics,
  TicketCreationForm,
  VoiceSettingsForm,
  IntegrationSetupForm,
  ApiResponse,
  PaginatedResponse 
} from './ui-models';

// ==== AUTHENTICATION & USER MANAGEMENT ====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface UserProfileUpdateRequest {
  name?: string;
  company?: string;
  role?: string;
  avatarUrl?: string;
}

export interface UserPreferencesUpdateRequest {
  voiceSettings?: Partial<VoiceSettingsForm>;
  theme?: 'dark' | 'light' | 'auto';
  notifications?: {
    mentions?: boolean;
    comments?: boolean;
    ticketUpdates?: boolean;
    systemAlerts?: boolean;
    emailNotifications?: boolean;
    browserNotifications?: boolean;
  };
  panelStates?: {
    leftPanelCollapsed?: boolean;
    rightPanelCollapsed?: boolean;
  };
}

// ==== TICKET MANAGEMENT ====

export interface TicketListQuery {
  page?: number;
  limit?: number;
  assigneeId?: string;
  reporterId?: string;
  sprintId?: string;
  projectId?: string;
  status?: string[];
  type?: string[];
  priority?: string[];
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TicketCreateRequest extends TicketCreationForm {
  voiceSessionId?: string;
  templateId?: string;
}

export interface TicketUpdateRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  sprintId?: string;
  storyPoints?: number;
  sections?: {
    id?: string;
    name: string;
    content: string;
  }[];
  acceptanceCriteria?: string[];
}

export interface CommentCreateRequest {
  content: string;
  mentions?: string[];
  parentCommentId?: string;
  voiceSessionId?: string;
  voiceTranscript?: string;
}

export interface CommentUpdateRequest {
  content: string;
  mentions?: string[];
}

// ==== SPRINT MANAGEMENT ====

export interface SprintCreateRequest {
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
}

export interface SprintUpdateRequest {
  name?: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
  capacity?: number;
  status?: 'future' | 'active' | 'completed';
}

// ==== VOICE & AI PROCESSING ====

export interface VoiceSessionCreateRequest {
  context?: {
    currentPage: string;
    activeTicket?: string;
    activeSprint?: string;
  };
}

export interface VoiceCommandRequest {
  sessionId: string;
  transcript: string;
  confidence: number;
  audioData?: string; // Base64 encoded
  context?: any;
}

export interface VoiceCommandResponse {
  response: string;
  intent: string;
  entities: any[];
  actions?: VoiceAction[];
  success: boolean;
}

export interface VoiceAction {
  type: 'navigate' | 'create_ticket' | 'update_ticket' | 'search' | 'execute_command';
  target?: string;
  data?: any;
}

export interface AIProcessIntentRequest {
  text: string;
  context: {
    currentPage: string;
    userId: string;
    recentTickets?: string[];
    activeProjects?: string[];
  };
}

export interface AIProcessIntentResponse {
  intent: string;
  confidence: number;
  entities: any[];
  suggestedActions: VoiceAction[];
  response: string;
}

// ==== INTEGRATION MANAGEMENT ====

export interface IntegrationCreateRequest extends IntegrationSetupForm {
  type: 'jira' | 'slack' | 'pinecone' | 'confluence';
}

export interface IntegrationUpdateRequest {
  name?: string;
  config?: {
    baseUrl?: string;
    username?: string;
    apiKey?: string;
    projectKeys?: string[];
    additionalSettings?: Record<string, any>;
  };
}

export interface IntegrationTestRequest {
  integrationId: string;
  testType?: 'connection' | 'authentication' | 'permissions';
}

export interface IntegrationTestResponse {
  success: boolean;
  message: string;
  details?: {
    responseTime: number;
    statusCode: number;
    capabilities: string[];
    errors?: string[];
  };
}

export interface IntegrationSyncRequest {
  integrationId: string;
  syncType: 'full' | 'incremental';
  entities?: ('tickets' | 'comments' | 'users' | 'projects')[];
}

export interface IntegrationSyncResponse {
  syncId: string;
  status: 'started' | 'in_progress' | 'completed' | 'failed';
  progress?: {
    total: number;
    processed: number;
    errors: number;
  };
  startedAt: Date;
  estimatedCompletion?: Date;
}

// ==== ACTIVITY FEED & NOTIFICATIONS ====

export interface ActivityFeedQuery {
  page?: number;
  limit?: number;
  types?: string[];
  actorId?: string;
  targetType?: string;
  unreadOnly?: boolean;
  since?: Date;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  types?: string[];
  unreadOnly?: boolean;
  since?: Date;
}

export interface NotificationMarkReadRequest {
  notificationIds: string[];
}

export interface MentionQuery {
  page?: number;
  limit?: number;
  resolved?: boolean;
  since?: Date;
}

// ==== TEMPLATE MANAGEMENT ====

export interface TemplateCreateRequest {
  name: string;
  type: 'story' | 'bug' | 'task' | 'spike' | 'epic';
  description: string;
  icon: string;
  fields: any[];
  sections: any[];
  tags: string[];
  isPublic: boolean;
}

export interface TemplateUpdateRequest {
  name?: string;
  description?: string;
  icon?: string;
  fields?: any[];
  sections?: any[];
  tags?: string[];
  isPublic?: boolean;
}

export interface TemplateQuery {
  type?: string[];
  tags?: string[];
  isPublic?: boolean;
  search?: string;
  sortBy?: 'name' | 'usageCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ==== SEARCH ====

export interface SearchQuery {
  query: string;
  types?: ('tickets' | 'comments' | 'templates' | 'users')[];
  filters?: {
    projectId?: string;
    assigneeId?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    status?: string[];
  };
  limit?: number;
  includeContent?: boolean;
}

export interface SearchResult {
  type: 'ticket' | 'comment' | 'template' | 'user';
  id: string;
  title: string;
  description: string;
  score: number;
  highlights: string[];
  metadata: any;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  processingTime: number;
  suggestions?: string[];
}

// ==== DASHBOARD DATA ====

export interface DashboardDataQuery {
  period?: 'today' | 'week' | 'month' | 'quarter';
  includeMetrics?: boolean;
  includeActivity?: boolean;
  includeNotifications?: boolean;
}

export interface DashboardDataResponse {
  user: User;
  metrics: DashboardMetrics;
  recentActivity: ActivityFeedItem[];
  notifications: Notification[];
  activeSprint?: Sprint;
  recentTickets: EnhancedTicket[];
  mentions: ActivityFeedItem[];
  teamActivity: ActivityFeedItem[];
}

// ==== SYSTEM HEALTH & MONITORING ====

export interface SystemHealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    openai: ServiceHealth;
    pinecone: ServiceHealth;
    integrations: ServiceHealth;
  };
  uptime: number;
  version: string;
  lastChecked: Date;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastError?: {
    timestamp: Date;
    message: string;
  };
}

export interface ErrorRecoveryOption {
  id: string;
  title: string;
  description: string;
  action: 'retry' | 'reset' | 'contact_support' | 'navigate';
  actionData?: any;
  severity: 'low' | 'medium' | 'high';
}

export interface ErrorRecoveryResponse {
  error: {
    code: string;
    message: string;
    context: any;
  };
  options: ErrorRecoveryOption[];
  supportInfo: {
    ticketId?: string;
    contactEmail: string;
    documentationUrl: string;
  };
}

// ==== ONBOARDING ====

export interface OnboardingStepRequest {
  step: number;
  data: any;
  completed: boolean;
}

export interface OnboardingStatusResponse {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  userData: {
    profile: Partial<User>;
    selectedIntegrations: string[];
    voiceTestPassed: boolean;
    preferences: any;
  };
}

// ==== UTILITY TYPES ====

export type ApiEndpoint = 
  // Auth
  | 'POST /api/auth/login'
  | 'POST /api/auth/logout'
  | 'POST /api/auth/refresh'
  
  // User
  | 'GET /api/user/profile'
  | 'PUT /api/user/profile'
  | 'GET /api/user/preferences'
  | 'PUT /api/user/preferences'
  
  // Tickets
  | 'GET /api/tickets'
  | 'POST /api/tickets'
  | 'GET /api/tickets/:id'
  | 'PUT /api/tickets/:id'
  | 'DELETE /api/tickets/:id'
  | 'GET /api/tickets/:id/comments'
  | 'POST /api/tickets/:id/comments'
  | 'PUT /api/comments/:id'
  | 'DELETE /api/comments/:id'
  
  // Sprints
  | 'GET /api/sprints'
  | 'POST /api/sprints'
  | 'GET /api/sprints/:id'
  | 'PUT /api/sprints/:id'
  | 'GET /api/sprints/:id/tickets'
  
  // Voice
  | 'POST /api/voice/session'
  | 'DELETE /api/voice/session/:id'
  | 'POST /api/voice/command'
  | 'GET /api/voice/history'
  | 'GET /api/voice/settings'
  | 'PUT /api/voice/settings'
  | 'POST /api/ai/process-intent'
  
  // Integrations
  | 'GET /api/integrations'
  | 'POST /api/integrations'
  | 'PUT /api/integrations/:id'
  | 'DELETE /api/integrations/:id'
  | 'POST /api/integrations/:id/test'
  | 'GET /api/integrations/:id/health'
  | 'POST /api/integrations/:id/sync'
  
  // Activity & Notifications
  | 'GET /api/activity-feed'
  | 'GET /api/notifications'
  | 'PUT /api/notifications/mark-read'
  | 'POST /api/notifications/mark-all-read'
  | 'GET /api/mentions'
  
  // Templates
  | 'GET /api/templates'
  | 'POST /api/templates'
  | 'GET /api/templates/:id'
  | 'PUT /api/templates/:id'
  | 'DELETE /api/templates/:id'
  
  // Search
  | 'GET /api/search'
  | 'POST /api/search/advanced'
  
  // Dashboard
  | 'GET /api/dashboard/data'
  | 'GET /api/dashboard/metrics'
  
  // System
  | 'GET /api/health'
  | 'GET /api/system/status'
  | 'GET /api/error-recovery/options'
  
  // Onboarding
  | 'GET /api/onboarding/status'
  | 'POST /api/onboarding/step'
  | 'POST /api/onboarding/complete';