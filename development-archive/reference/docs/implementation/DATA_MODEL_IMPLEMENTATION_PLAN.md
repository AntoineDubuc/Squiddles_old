# Squiddles Data Model Implementation Plan

Based on comprehensive UI mockup analysis, this document outlines the data models, database schemas, and API endpoints needed to fully implement the Squiddles voice-activated project management system.

## 📋 **Implementation Summary**

### ✅ **Completed**
- Core voice session types (`TranscriptItem`, `EventItem`)
- Basic ticket model for Pinecone integration
- Audio configuration and session management
- OpenAI Realtime API integration types

### 🎯 **New Additions (Ready to Implement)**
- **UI Data Models**: `/src/app/types/ui-models.ts` (✅ Created)
- **API Endpoint Types**: `/src/app/types/api-endpoints.ts` (✅ Created)
- **Type Exports**: Updated main `types.ts` to re-export all new types (✅ Done)

## 🏗️ **Database Schema Requirements**

### **Priority 1: Core Tables**

```sql
-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('pm', 'tpm', 'po', 'eng', 'sm', 'other')),
  company VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jira_key VARCHAR(50) UNIQUE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('story', 'task', 'bug', 'spike', 'epic')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('todo', 'in_progress', 'in_review', 'done')),
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee_id UUID REFERENCES users(id),
  reporter_id UUID REFERENCES users(id) NOT NULL,
  sprint_id UUID,
  project_id UUID NOT NULL,
  story_points INTEGER,
  acceptance_criteria JSONB,
  sections JSONB,
  created_via_voice BOOLEAN DEFAULT FALSE,
  voice_session_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  mentions JSONB, -- Array of user IDs
  parent_comment_id UUID REFERENCES comments(id),
  created_via_voice BOOLEAN DEFAULT FALSE,
  voice_transcript TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Voice Sessions
CREATE TABLE voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  context JSONB,
  outcome JSONB,
  audio_quality JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Voice Commands
CREATE TABLE voice_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES voice_sessions(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  confidence DECIMAL(3,2),
  intent VARCHAR(100),
  entities JSONB,
  response TEXT,
  processing_time INTEGER, -- milliseconds
  successful BOOLEAN DEFAULT TRUE,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### **Priority 2: Project Management Tables**

```sql
-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  key VARCHAR(20) UNIQUE NOT NULL, -- PROD, TASK, etc.
  description TEXT,
  lead_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sprints
CREATE TABLE sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  goal TEXT,
  start_date DATE,
  end_date DATE,
  capacity INTEGER,
  velocity INTEGER,
  status VARCHAR(50) CHECK (status IN ('future', 'active', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Integrations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('jira', 'slack', 'pinecone', 'confluence', 'openai')),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('connected', 'disconnected', 'limited', 'error')),
  config JSONB NOT NULL,
  health_metrics JSONB,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('story', 'bug', 'task', 'spike', 'epic')),
  description TEXT,
  icon VARCHAR(50),
  fields JSONB,
  sections JSONB,
  tags JSONB,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT FALSE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Priority 3: Activity and Notifications**

```sql
-- Activity Feed
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  actor_id UUID REFERENCES users(id) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  data JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  INDEX idx_activity_timestamp (timestamp DESC),
  INDEX idx_activity_actor (actor_id, timestamp DESC)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_notifications_user_unread (user_id, read, created_at DESC)
);
```

## 🔧 **Next Steps for Implementation**

### **Phase 1: Core Infrastructure (Week 1)**
1. Set up database with core tables (users, tickets, comments, voice_sessions)
2. Implement basic CRUD API endpoints for tickets and users
3. Create user authentication system
4. Set up voice session management

### **Phase 2: Voice Integration (Week 2)**
1. Enhance voice command processing with new data models
2. Implement voice-to-ticket creation pipeline
3. Add voice session persistence and retrieval
4. Create voice settings management

### **Phase 3: UI Backend (Week 3)**
1. Implement dashboard data aggregation endpoints
2. Create activity feed and notification systems
3. Add integration management APIs
4. Build template system

### **Phase 4: Advanced Features (Week 4)**
1. Implement search functionality with Pinecone
2. Add real-time notifications via WebSockets
3. Create comprehensive health monitoring
4. Implement onboarding flow APIs

## 📊 **API Endpoints to Implement**

### **Critical for Dashboard UI**
- `GET /api/dashboard/data` - Main dashboard data
- `GET /api/user/profile` - User information
- `GET /api/tickets` - Ticket listings with filtering
- `GET /api/activity-feed` - Recent activity
- `GET /api/notifications` - User notifications

### **Critical for Ticket Creation UI**
- `POST /api/tickets` - Create new tickets
- `GET /api/templates` - Available templates
- `POST /api/voice/command` - Process voice commands
- `GET /api/sprints` - Available sprints for assignment

### **Critical for Settings UI**
- `GET/PUT /api/user/preferences` - User preferences
- `GET/PUT /api/integrations` - Integration management
- `POST /api/integrations/:id/test` - Test connections
- `GET /api/voice/settings` - Voice configuration

## 🔄 **Real-time Features Required**

### **WebSocket Events**
- `activity_update` - New activity feed items
- `notification` - Real-time notifications
- `ticket_update` - Ticket changes from other users
- `voice_session_update` - Voice session state changes
- `integration_status_change` - Integration health updates

### **Voice Processing Pipeline**
1. **Audio Input** → Voice Session Creation
2. **Speech Recognition** → Transcript + Confidence
3. **Intent Processing** → Structured Commands
4. **Action Execution** → Ticket/Comment Creation
5. **Response Generation** → Voice Feedback
6. **Session Logging** → Analytics and History

## 🚀 **Migration Strategy**

### **From Existing Codebase**
1. **Preserve Current Voice System**: Enhance existing `TranscriptItem` and `EventItem` types
2. **Extend Pinecone Integration**: Use existing document types, add new metadata fields
3. **Upgrade API Routes**: Enhance existing `/api/session` and `/api/pinecone` endpoints
4. **Maintain Compatibility**: Ensure existing OpenAI Realtime integration continues working

### **Database Migration Plan**
1. Create new tables alongside existing Pinecone documents
2. Implement data sync between relational DB and vector DB
3. Gradually migrate mockup functionality to use new data models
4. Add indexes and constraints incrementally

## 🎯 **Success Metrics**

### **Technical Metrics**
- API response times < 200ms for dashboard data
- Voice command processing < 2 seconds end-to-end
- 99.9% uptime for core ticket management features
- Real-time notification delivery < 500ms

### **User Experience Metrics**
- Voice command success rate > 95%
- Dashboard load time < 1 second
- Ticket creation flow completion rate > 90%
- User onboarding completion rate > 80%

---

This comprehensive data model implementation plan provides the foundation needed to transform the Squiddles UI mockups into a fully functional voice-activated project management system. The modular approach allows for iterative development while maintaining system stability and performance.