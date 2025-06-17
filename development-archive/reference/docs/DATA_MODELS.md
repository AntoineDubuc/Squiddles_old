# Squiddles Data Models & Entity Documentation

## Overview
This document defines all data entities, their relationships, and storage strategies for the Squiddles voice-activated project management system.

## Storage Strategy
- **PostgreSQL**: Core relational data (users, tickets, projects)
- **Pinecone**: Vector embeddings for semantic search
- **Redis**: Session data, real-time state, caching
- **Local Storage**: User preferences, draft tickets

---

## Core Entities

### User
Represents a system user (Product Manager, Developer, etc.)
```typescript
interface User {
  id: string; // UUID
  email: string;
  name: string;
  role: UserRole;
  jiraAccountId?: string;
  slackUserId?: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  teams: Team[];
  preferences: UserPreferences;
  voiceSessions: VoiceSession[];
}

enum UserRole {
  PRODUCT_MANAGER = 'PRODUCT_MANAGER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
  TEAM_LEAD = 'TEAM_LEAD',
  ENGINEERING_MANAGER = 'ENGINEERING_MANAGER',
  QA_ENGINEER = 'QA_ENGINEER'
}
```

### Team
Represents a team or project group
```typescript
interface Team {
  id: string;
  name: string;
  jiraProjectKey: string; // e.g., "SQUID"
  slackChannelId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  members: TeamMember[];
  tickets: Ticket[];
  sprints: Sprint[];
}

interface TeamMember {
  userId: string;
  teamId: string;
  role: TeamMemberRole;
  joinedAt: Date;
  
  // Relations
  user: User;
  team: Team;
}

enum TeamMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}
```

### Ticket
Represents any work item (Story, Task, Bug, etc.)
```typescript
interface Ticket {
  id: string;
  key: string; // e.g., "PROD-234"
  type: TicketType;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  storyPoints?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assigneeId?: string;
  reporterId: string;
  
  // Relations
  teamId: string;
  sprintId?: string;
  parentId?: string; // For sub-tasks
  templateId?: string; // Template used to create
  
  // Content sections (flexible based on type)
  sections: TicketSection[];
  
  // External IDs
  jiraId?: string;
  confluencePageId?: string;
  
  // For Pinecone
  embedding?: number[]; // Vector embedding of title + description
}

enum TicketType {
  STORY = 'STORY',
  TASK = 'TASK',
  BUG = 'BUG',
  SPIKE = 'SPIKE',
  EPIC = 'EPIC',
  SUB_TASK = 'SUB_TASK'
}

enum TicketStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}

enum Priority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

interface TicketSection {
  id: string;
  name: string; // e.g., "Acceptance Criteria", "Technical Notes"
  content: string;
  order: number;
  required: boolean;
}
```

### Comment
Represents comments on tickets
```typescript
interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  
  // Mentions
  mentions: Mention[];
  
  // External
  jiraCommentId?: string;
  
  // Relations
  ticket: Ticket;
  author: User;
  
  // For notifications
  readBy: CommentRead[];
}

interface Mention {
  userId: string;
  position: number; // Position in content
  resolved: boolean;
}

interface CommentRead {
  commentId: string;
  userId: string;
  readAt: Date;
  dismissed: boolean;
}
```

### Template
Reusable ticket templates
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  type: TicketType;
  icon: string; // Emoji
  isDefault: boolean;
  isPublic: boolean;
  
  // Ownership
  createdBy: string;
  teamId?: string; // null = personal template
  
  // Template content
  sections: TemplateSection[];
  
  // Usage tracking
  usageCount: number;
  lastUsedAt?: Date;
  
  // Metadata
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TemplateSection {
  id: string;
  name: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  order: number;
  defaultContent?: string;
}
```

### Sprint
Represents a development sprint
```typescript
interface Sprint {
  id: string;
  name: string;
  teamId: string;
  startDate: Date;
  endDate: Date;
  goal?: string;
  status: SprintStatus;
  
  // Relations
  tickets: Ticket[];
  
  // Metrics
  plannedPoints: number;
  completedPoints: number;
  
  createdAt: Date;
  updatedAt: Date;
}

enum SprintStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
```

---

## Voice & AI Entities

### VoiceSession
Represents a voice interaction session
```typescript
interface VoiceSession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  
  // Session data
  commands: VoiceCommand[];
  context: SessionContext;
  
  // Agent tracking
  activeAgent: AgentType;
  agentHandoffs: AgentHandoff[];
}

interface SessionContext {
  currentTicketId?: string;
  currentTemplateId?: string;
  recentTicketIds: string[];
  conversationState: Record<string, any>;
}
```

### VoiceCommand
Individual voice commands/interactions
```typescript
interface VoiceCommand {
  id: string;
  sessionId: string;
  timestamp: Date;
  
  // Voice data
  transcript: string;
  confidence: number;
  audioUrl?: string;
  
  // Processing
  intent: CommandIntent;
  entities: Record<string, any>;
  
  // Response
  agentResponse: string;
  actions: CommandAction[];
  
  // For Pinecone - search similar commands
  embedding?: number[];
}

enum CommandIntent {
  CREATE_TICKET = 'CREATE_TICKET',
  SEARCH_TICKETS = 'SEARCH_TICKETS',
  UPDATE_TICKET = 'UPDATE_TICKET',
  CHECK_MENTIONS = 'CHECK_MENTIONS',
  VIEW_SPRINT = 'VIEW_SPRINT',
  APPLY_TEMPLATE = 'APPLY_TEMPLATE',
  // ... more intents
}

interface CommandAction {
  type: string;
  payload: Record<string, any>;
  result: ActionResult;
}

enum ActionResult {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}
```

### AgentHandoff
Tracks handoffs between AI agents
```typescript
interface AgentHandoff {
  id: string;
  sessionId: string;
  fromAgent: AgentType;
  toAgent: AgentType;
  reason: string;
  context: Record<string, any>;
  timestamp: Date;
}

enum AgentType {
  PRODUCT_MANAGER = 'PRODUCT_MANAGER',
  JIRA_INTEGRATION = 'JIRA_INTEGRATION',
  SLACK_INTEGRATION = 'SLACK_INTEGRATION',
  SEARCH = 'SEARCH'
}
```

---

## Integration Entities

### ActivityFeed
Aggregated activity from various sources
```typescript
interface Activity {
  id: string;
  type: ActivityType;
  userId: string; // Who should see this
  source: ActivitySource;
  
  // Polymorphic reference
  entityType: EntityType;
  entityId: string;
  
  // Display data
  title: string;
  description: string;
  metadata: Record<string, any>;
  
  // Interaction
  actionUrl?: string;
  actions: ActivityAction[];
  
  // Status
  read: boolean;
  dismissed: boolean;
  priority: ActivityPriority;
  
  createdAt: Date;
  expiresAt?: Date;
}

enum ActivityType {
  MENTION = 'MENTION',
  COMMENT = 'COMMENT',
  TICKET_UPDATE = 'TICKET_UPDATE',
  SPRINT_UPDATE = 'SPRINT_UPDATE',
  ASSIGNMENT = 'ASSIGNMENT'
}

enum ActivitySource {
  JIRA = 'JIRA',
  SLACK = 'SLACK',
  SYSTEM = 'SYSTEM'
}

enum ActivityPriority {
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

interface ActivityAction {
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}
```

---

## User Settings & Preferences

### UserPreferences
User-specific settings
```typescript
interface UserPreferences {
  userId: string;
  
  // UI Preferences
  theme: 'dark' | 'light' | 'auto';
  density: 'compact' | 'normal' | 'comfortable';
  
  // Voice Settings
  voiceActivation: 'push-to-talk' | 'always-on' | 'keyword';
  voiceLanguage: string;
  audioFeedback: boolean;
  
  // Notification Settings
  notifications: NotificationSettings;
  
  // Default Values
  defaultTeamId?: string;
  defaultTemplates: Record<TicketType, string>; // templateId per type
  
  // Privacy
  shareVoiceData: boolean;
  allowAnalytics: boolean;
  
  updatedAt: Date;
}

interface NotificationSettings {
  mentions: NotificationLevel;
  teamComments: NotificationLevel;
  assignments: NotificationLevel;
  sprintUpdates: NotificationLevel;
  
  // Filtering
  mutedTickets: string[];
  mutedUsers: string[];
  quietHours: {
    enabled: boolean;
    start: string; // "09:00"
    end: string; // "17:00"
    timezone: string;
  };
}

enum NotificationLevel {
  ALL = 'ALL',
  IMPORTANT = 'IMPORTANT',
  NONE = 'NONE'
}
```

---

## Pinecone Vector Storage

### PineconeDocument
Documents stored in Pinecone for semantic search
```typescript
interface PineconeDocument {
  id: string; // Same as entity ID
  type: PineconeDocType;
  
  // Vector data
  embedding: number[]; // 1536 dimensions for OpenAI
  
  // Metadata for filtering
  metadata: {
    type: string;
    teamId?: string;
    userId?: string;
    createdAt: number; // Unix timestamp
    status?: string;
    priority?: string;
    
    // Type-specific metadata
    [key: string]: any;
  };
  
  // Original content (for retrieval)
  content: {
    title: string;
    description: string;
    fullText: string;
  };
}

enum PineconeDocType {
  TICKET = 'TICKET',
  COMMENT = 'COMMENT',
  TEMPLATE = 'TEMPLATE',
  VOICE_COMMAND = 'VOICE_COMMAND',
  DOCUMENTATION = 'DOCUMENTATION'
}
```

### Search Query
```typescript
interface SearchQuery {
  query: string;
  type?: PineconeDocType[];
  filters?: {
    teamId?: string;
    userId?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    status?: string[];
  };
  limit?: number;
  includeContent?: boolean;
}

interface SearchResult {
  id: string;
  score: number; // Similarity score
  document: PineconeDocument;
  highlights?: string[]; // Relevant snippets
}
```

---

## Relationships Diagram

```
User ──────┬──> Teams (many-to-many via TeamMember)
     │     │
     │     └──> Templates (one-to-many)
     │     │
     │     └──> VoiceSessions (one-to-many)
     │     │
     │     └──> Activities (one-to-many)
     │
     └─────────> UserPreferences (one-to-one)

Team ──────┬──> Tickets (one-to-many)
     │     │
     │     └──> Sprints (one-to-many)
     │     │
     │     └──> TeamMembers (one-to-many)
     │
     └─────────> Templates (one-to-many)

Ticket ────┬──> Comments (one-to-many)
     │     │
     │     └──> Sprint (many-to-one)
     │     │
     │     └──> Template (many-to-one)
     │
     └─────────> Team (many-to-one)

VoiceSession ──> VoiceCommands (one-to-many)
           │
           └──> AgentHandoffs (one-to-many)

Pinecone ──> Stores embeddings for:
         │     - Tickets
         │     - Comments
         │     - Templates
         │     - Voice Commands
         │
         └──> Enables semantic search across all content
```

---

## Data Flow Examples

### Creating a Ticket via Voice
1. User speaks: "Create a bug for checkout issue"
2. VoiceCommand created with transcript
3. Intent recognized as CREATE_TICKET
4. Template selected based on type (BUG)
5. Ticket created with template sections
6. Ticket embedding generated and stored in Pinecone
7. Activity created for team members
8. Jira ticket created (if integrated)

### Searching for Similar Tickets
1. User speaks: "Find tickets about payment"
2. Query embedding generated from "payment"
3. Pinecone search with teamId filter
4. Results ranked by similarity score
5. Recent comments included if relevant
6. Results presented with highlights

### Mention Notification Flow
1. Comment created in Jira with @mention
2. Webhook triggers comment sync
3. Comment parsed for mentions
4. Activity created for mentioned user
5. Notification sent based on preferences
6. Comment embedding stored in Pinecone

---

## Implementation Notes

### Database Indexes
- User: email, jiraAccountId
- Ticket: key, teamId, status, assigneeId
- Comment: ticketId, authorId, createdAt
- Activity: userId, read, priority, createdAt
- Template: teamId, type, isDefault

### Pinecone Namespaces
- `tickets`: All ticket embeddings
- `comments`: All comment embeddings
- `templates`: Template embeddings
- `commands`: Voice command history
- `docs`: Documentation/knowledge base

### Caching Strategy
- User preferences: Local storage + Redis
- Active sprint: Redis with 15-min TTL
- Team membership: Redis with 1-hour TTL
- Recent activities: Redis with 5-min TTL
- Pinecone results: Redis with 30-min TTL

### Security Considerations
- Row-level security for team data
- Separate Pinecone indexes per organization
- Encrypted voice recordings
- PII masking in embeddings
- Audit logs for all data access

---

This data model provides a comprehensive foundation for building Squiddles with proper separation of concerns, scalability, and integration capabilities.