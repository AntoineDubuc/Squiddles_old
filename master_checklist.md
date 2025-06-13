# Squiddles Development Master Checklist
## Technical Product Manager Voice Interface Implementation

**Target**: First UI for Antoine Dubuc (Technical Product Manager)  
**Goal**: AI-assisted user story creation with voice interface  
**Based on**: OpenAI Advanced Agent Example architecture + Product Strategy

---

## 📋 **Phase 1: Project Foundation Setup**

### 1.1 Environment & Dependencies
- [ ] Create Next.js 15 project with TypeScript
- [ ] Install exact dependencies from working example:
  - [ ] `@openai/agents@^0.0.1`
  - [ ] `openai@^4.77.3` 
  - [ ] `react@^19.0.0`
  - [ ] `react-dom@^19.0.0`
  - [ ] `uuid@^11.0.4`
  - [ ] `zod@^3.24.1`
  - [ ] `@types/uuid@^10`
- [ ] Setup Tailwind CSS for styling
- [ ] Configure `.env` with `OPENAI_API_KEY`
- [ ] Verify API key has Realtime API access

### 1.2 Project Structure
- [ ] Create folder structure:
  ```
  src/app/
  ├── agentConfigs/
  │   └── productManager/
  ├── api/
  │   ├── session/
  │   └── responses/
  ├── components/
  ├── contexts/
  ├── hooks/
  ├── lib/
  └── types/
  ```
- [ ] Copy core types from working example (`src/app/types/index.ts`)
- [ ] Setup environment validation (`src/app/lib/env.ts`)

---

## 📋 **Phase 2: Core Voice Infrastructure**

### 2.1 Session Management
- [ ] Create `/api/session/route.ts` endpoint
  - [ ] POST endpoint to OpenAI Realtime API
  - [ ] Return ephemeral key for WebRTC connection
  - [ ] Use model: `gpt-4o-realtime-preview-2024-12-17`
- [ ] Test session creation endpoint manually

### 2.2 Realtime Client Setup
- [ ] Create `RealtimeClient` wrapper (`src/app/lib/realtimeClient.ts`)
  - [ ] Copy exact implementation from working example
  - [ ] Support for ephemeral key retrieval
  - [ ] WebRTC transport with audio element
  - [ ] Event forwarding system
- [ ] Create audio management hook (`src/app/hooks/useAudioSetup.ts`)
  - [ ] HTMLAudioElement creation and configuration
  - [ ] Autoplay, playsInline settings
  - [ ] Error handling for audio setup

### 2.3 Event System
- [ ] Create event contexts (`src/app/contexts/`)
  - [ ] `TranscriptContext.tsx` for conversation history
  - [ ] `EventContext.tsx` for debugging events
- [ ] Implement event handlers for:
  - [ ] `conversation.input_audio_transcription.delta`
  - [ ] `response.text.delta` / `response.audio_transcript.delta`
  - [ ] `response.function_call_delta`
  - [ ] `session.updated`
  - [ ] Connection state changes

---

## 📋 **Phase 3: Product Manager Agent**

### 3.1 Agent Configuration
- [ ] Create Product Manager agent (`src/app/agentConfigs/productManager/index.ts`)
- [ ] Agent instructions focusing on:
  - [ ] User story creation workflow detection
  - [ ] Template-based story structuring
  - [ ] AI reasoning for intent (no hardcoded triggers)
  - [ ] Natural conversation flow
- [ ] Set voice to 'sage' for consistency
- [ ] Configure agent name as 'productManager'

### 3.2 Agent Instructions Template
```typescript
instructions: `
# Identity
You are an AI assistant helping Antoine Dubuc, a Technical Product Manager, 
create well-structured user stories using voice interaction.

# Core Capabilities
- Detect when Antoine wants to create user stories
- Help fill out user story templates systematically
- Search for related tickets and context
- Guide through template sections naturally

# User Story Template Structure
When creating stories, fill out these sections:
- BUSINESS VALUE: Why this matters
- CONTEXT: Background information  
- SPIKE GOAL: What needs to be accomplished
- INPUTS: Resources and information sources
- OUTPUTS: Expected deliverables
- ACCEPTANCE CRITERIA: Success conditions
- PM REVIEW DATA POINTS: Review criteria

# Voice Interaction Style
- Conversational and professional
- Ask clarifying questions naturally
- Explain what you're doing: "Let me search for similar tickets..."
- Provide progress updates: "I'm filling out the business value section..."
`
```

### 3.3 Template System Integration
- [ ] Create template configuration structure
- [ ] Define template field types and validation
- [ ] Create template rendering system
- [ ] Support for dynamic template loading

---

## 📋 **Phase 4: Tools Implementation**

### 4.1 Pinecone Search Tool
- [ ] Setup Pinecone client and configuration
- [ ] Create search tool (`src/app/tools/pineconeSearch.ts`):
  ```typescript
  const searchRelatedTickets = tool({
    name: 'searchRelatedTickets',
    description: 'Search Pinecone for similar tickets and context',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query for related content' },
        limit: { type: 'number', default: 5 }
      },
      required: ['query']
    },
    execute: async (input) => {
      // Pinecone search implementation
    }
  });
  ```
- [ ] Test Pinecone connectivity and search results
- [ ] Format search results for AI consumption

### 4.2 Template Management Tools
- [ ] Create template population tool
- [ ] Create template validation tool
- [ ] Create template saving/loading tools
- [ ] Implement real-time template field updates

### 4.3 Jira Integration Tool
- [ ] Create Jira API client
- [ ] Create ticket creation tool:
  ```typescript
  const createJiraTicket = tool({
    name: 'createJiraTicket',
    description: 'Create a new Jira ticket with user story content',
    parameters: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        description: { type: 'string' },
        projectKey: { type: 'string' },
        issueType: { type: 'string', default: 'Story' }
      },
      required: ['summary', 'description', 'projectKey']
    },
    execute: async (input) => {
      // Jira ticket creation
    }
  });
  ```
- [ ] Test Jira API connectivity
- [ ] Handle Jira authentication (API tokens)

---

## 📋 **Phase 5: UI Components**

### 5.1 Main Voice Interface
- [ ] Create main voice component (`src/app/components/VoiceAgent.tsx`)
- [ ] Implement glass-themed styling matching mockup
- [ ] Header with persona indicator (Technical Product Manager - Antoine Dubuc)
- [ ] Voice prompt area with gradient borders
- [ ] Connection status indicator with animated dot

### 5.2 User Story Creation Panel
- [ ] Create dynamic panel that appears when creating stories
- [ ] Template field components with gradient borders
- [ ] Real-time typing animation for AI responses
- [ ] Progress indicators for multi-step workflow
- [ ] Field validation and error states

### 5.3 Context Panel
- [ ] Related tickets display from Pinecone search
- [ ] Knowledge base results
- [ ] Quick actions (Save Draft, Create in Jira)
- [ ] Search result cards with similarity scores
- [ ] Hover effects and interactions

### 5.4 Conversation Log
- [ ] Real-time conversation history
- [ ] User vs AI message differentiation
- [ ] Timestamps and status indicators
- [ ] Expandable tool call details
- [ ] Export conversation capability

---

## 📋 **Phase 6: Integration & Event Flow**

### 6.1 Voice Intent Detection
- [ ] Implement AI-based intent recognition (no hardcoded triggers)
- [ ] Handle phrases like:
  - "I need to write a user story for..."
  - "Help me create a story about..."
  - "Let's document the requirements for..."
- [ ] Context-aware conversation flow
- [ ] Memory of previous interactions in session

### 6.2 Template Workflow
- [ ] Auto-trigger template panel on story creation intent
- [ ] Progressive template filling with AI assistance
- [ ] Real-time search for related context
- [ ] Field-by-field completion with voice guidance
- [ ] Validation before Jira creation

### 6.3 Search Integration
- [ ] Trigger Pinecone searches automatically based on context
- [ ] Display results in context panel
- [ ] Allow manual search refinement
- [ ] Click-to-insert relevant information
- [ ] Relevance scoring and ranking

---

## 📋 **Phase 7: Advanced Features**

### 7.1 Template Configuration
- [ ] Template editor interface
- [ ] Save/load custom templates
- [ ] Template sharing across team
- [ ] Version control for templates
- [ ] Import/export template definitions

### 7.2 Session Management
- [ ] Save draft stories in progress
- [ ] Resume interrupted sessions
- [ ] Session timeout handling
- [ ] Auto-save functionality
- [ ] Session history and recovery

### 7.3 Collaboration Features
- [ ] Share story drafts with team
- [ ] Comments and feedback system
- [ ] Approval workflow integration
- [ ] Notification system
- [ ] Team template libraries

---

## 📋 **Phase 8: Automated Voice Testing Framework**

### 8.1 Test Audio Generation System
- [ ] Setup OpenAI TTS for test file generation:
  - [ ] Install TTS dependencies and configure API
  - [ ] Create test scenario library (50+ voice commands)
  - [ ] Generate audio files with different voices (alloy, echo, nova, etc.)
  - [ ] Create variations: fast/slow speech, background noise, accents
  - [ ] Test file naming convention: `{scenario}_{voice}_{speed}_{background}.wav`
- [ ] Create test audio generation script:
  ```bash
  npm run generate-test-audio
  ```
- [ ] Test scenarios include:
  - [ ] "Create a user story for login functionality"
  - [ ] "Add acceptance criteria for payment processing"
  - [ ] "Generate epic for mobile app redesign"
  - [ ] Short commands: "Create story", "Save draft"
  - [ ] Long complex commands with technical terms
  - [ ] Edge cases: interruptions, corrections, unclear speech

### 8.2 Automated Testing Framework
- [ ] Setup Jest + Puppeteer for browser automation
- [ ] Create voice testing utilities:
  - [ ] Mock MediaDevices.getUserMedia for test audio
  - [ ] Audio playback simulation in headless browser
  - [ ] Transcription accuracy measurement
  - [ ] Response time benchmarking
- [ ] Test runner for voice scenarios:
  ```javascript
  describe('Voice Interface Tests', () => {
    test('recognizes create story command', async () => {
      await playTestAudio('create_story_alloy_1.0_clean.wav');
      expect(transcription).toContain('create');
      expect(transcription).toContain('story');
    });
  });
  ```
- [ ] Regression test suite for voice accuracy
- [ ] Performance benchmarking dashboard

### 8.3 Voice Testing Tools & Utilities
- [ ] Developer testing panel in UI:
  - [ ] "Run Voice Tests" button
  - [ ] Real-time test results display
  - [ ] Accuracy metrics and failure analysis
  - [ ] Audio file playback for debugging
- [ ] Voice command recording tool:
  - [ ] Record new test scenarios easily
  - [ ] Export recorded audio as test files
  - [ ] Batch processing for test generation
- [ ] Testing configuration management:
  - [ ] Test suite configuration files
  - [ ] Custom test scenarios per feature
  - [ ] CI/CD integration settings

### 8.4 Continuous Integration Testing
- [ ] GitHub Actions workflow for voice tests:
  ```yaml
  name: Voice Interface Tests
  on: [push, pull_request]
  jobs:
    voice-tests:
      - name: Generate test audio files
      - name: Run voice recognition tests
      - name: Upload test results
  ```
- [ ] Automated regression testing on code changes
- [ ] Performance benchmarking in CI pipeline
- [ ] Test result artifacts and reporting
- [ ] Slack/email notifications for test failures

### 8.5 Manual Testing & Quality Assurance
- [ ] Voice recognition accuracy testing
- [ ] Intent detection with various phrases
- [ ] Audio playback and WebRTC connectivity
- [ ] Browser compatibility (Chrome, Safari, Firefox)
- [ ] Microphone permissions handling
- [ ] Real user testing with Antoine Dubuc

### 8.6 Integration Testing
- [ ] Test Pinecone search with various queries
- [ ] Test Jira ticket creation end-to-end
- [ ] Test template system with different configurations
- [ ] Test error handling and recovery
- [ ] Test session timeout and reconnection

### 8.7 UI/UX Testing
- [ ] Test glass theme styling across browsers
- [ ] Test responsive design on different screen sizes
- [ ] Test accessibility with screen readers
- [ ] Test keyboard navigation
- [ ] Test touch interactions on mobile

### 8.8 Performance Testing
- [ ] Test with large conversation histories
- [ ] Test WebRTC latency and quality
- [ ] Test Pinecone search response times
- [ ] Test memory usage with long sessions
- [ ] Test concurrent user sessions

---

## 📋 **Phase 9: Production Preparation**

### 9.1 Security & Configuration
- [ ] Environment variable validation
- [ ] API key security best practices
- [ ] Rate limiting implementation
- [ ] Error logging and monitoring
- [ ] HTTPS enforcement

### 9.2 Deployment Setup
- [ ] Build optimization
- [ ] Asset compression and caching
- [ ] CDN configuration for static assets
- [ ] Database setup (if needed for sessions)
- [ ] Monitoring and alerting

### 9.3 Documentation
- [ ] User guide for Technical Product Managers
- [ ] API documentation
- [ ] Troubleshooting guide
- [ ] Configuration reference
- [ ] Known limitations and workarounds

---

## 📋 **Phase 10: Launch & Iteration**

### 10.1 Soft Launch
- [ ] Deploy to staging environment
- [ ] Test with Antoine Dubuc (real user testing)
- [ ] Gather feedback on voice interaction flow
- [ ] Refine AI instructions based on usage
- [ ] Fix any discovered issues

### 10.2 Monitoring & Optimization
- [ ] Set up usage analytics
- [ ] Monitor voice recognition accuracy
- [ ] Track user story creation success rates
- [ ] Monitor API usage and costs
- [ ] Performance optimization based on real usage

### 10.3 Feature Expansion
- [ ] Plan additional personas (Alex Chen, Sarah Rodriguez, etc.)
- [ ] Plan additional tentacles (Confluence, Slack, Google Workspace)
- [ ] Iterate on template system based on feedback
- [ ] Expand voice command capabilities
- [ ] Add team collaboration features

---

## 🔧 **Development Notes**

### Technical Constraints
- Must use exact OpenAI SDK versions from working example
- WebRTC requires HTTPS in production
- Microphone permissions needed for voice interface
- Real-time API has usage-based pricing
- Pinecone vector database required for search

### Success Criteria
- [ ] Antoine can create complete user stories using only voice
- [ ] Template sections fill automatically with AI assistance
- [ ] Related tickets appear in context panel during creation
- [ ] Voice recognition accuracy >90% for technical terms (measured via automated tests)
- [ ] End-to-end story creation in <5 minutes
- [ ] Automated test suite covers >95% of voice command scenarios
- [ ] Regression tests catch voice accuracy issues before deployment
- [ ] Voice test generation completes in <2 minutes for full suite

### Critical Dependencies
- OpenAI Realtime API availability and performance
- Pinecone vector search performance and accuracy
- Jira API reliability and authentication
- WebRTC browser support and audio quality
- Next.js 15 stability and performance

---

**Document Status**: Master Implementation Checklist  
**Target Developer**: Junior Developer (Claude Code)  
**Estimated Effort**: 8-12 weeks for complete implementation
**Testing Framework**: Adds 2-3 weeks but saves 4-6 weeks in manual testing and debugging  
**Priority Order**: Phases 1-6 for MVP, Phases 7-10 for production-ready system