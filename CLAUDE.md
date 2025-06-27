# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Squiddles is a voice-activated multi-agent web system built with Next.js 15 and OpenAI's Realtime API. It provides a unified project management interface through natural voice conversation, targeting technical product managers and software development teams.

### Core Architecture
- **Voice Interface**: OpenAI Realtime API with WebRTC for real-time audio
- **Multi-Agent System**: Specialized "tentacles" for different integrations (Jira, Slack, Confluence)
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS with glass-themed UI
- **Search**: Pinecone vector database for contextual information retrieval

## Development Commands

```bash
# Development
npm run dev          # Start development server (port 8888)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint checking
npm test            # Run Jest tests

# Service Testing
npm run test:pinecone         # Test Pinecone connection
npm run test:pinecone-service # Test Pinecone service layer
npm run test:pinecone-api     # Test Pinecone API endpoints
npm run test:jira-api         # Test Jira API endpoints

# Voice Testing Framework (in testing-framework/)
cd testing-framework
npm install                   # Install isolated test dependencies
npm run generate-audio        # Generate test audio files
npm run test:voice           # Voice interaction tests
npm run test:integration     # UI integration tests
npm run test:performance     # Performance validation
./scripts/run-all-tests.sh   # Complete automated test suite
```

## Key Technical Patterns

### Agent Configuration Structure
Agents are configured in `src/agents/` with this pattern:
- Each agent has specialized instructions and tools
- Voice interface uses 'sage' voice consistently
- Tool execution context includes conversation history
- Session management preserves context across agent handoffs

### Realtime API Integration
- Session endpoint at `/api/session/route.ts` provides ephemeral keys
- WebRTC transport handles audio streaming
- Event-driven architecture processes real-time deltas
- Uses `gpt-4o-realtime-preview-2024-12-17` model

### Voice Interface Components
- Glass-themed UI with gradient borders matching design mockups
- Real-time transcript updates via React contexts
- Connection state management with animated indicators
- Audio element configuration for optimal playback

### Jira Integration Architecture
**Production-Ready ADF Processing Pipeline**:
- `src/app/api/jira/activity/route.ts` - Server-side API for secure Jira access
- `src/app/lib/jira-utils.ts` - Comprehensive ADF parsing utilities (12/14 content types)
- `src/app/types/jira-models.ts` - Complete TypeScript interfaces for Jira data
- `src/app/services/jiraService.ts` - React hooks for dashboard integration

**Mention Detection Strategy**:
1. **ADF Mentions**: Recursive parsing of structured mention nodes with account ID matching
2. **Legacy Patterns**: Fallback text pattern matching for `[~accountid:xxx]`, `@antoine`, `@dubuc`
3. **Rich Content**: Table, media, and code block detection for enhanced UI presentation
4. **Urgency Classification**: Keyword-based priority detection (critical, high, medium, low)

## Project Structure

```
src/
├── agents/           # Agent implementations with handoff patterns
│   ├── index.ts     # Agent registry following OpenAI example
│   ├── productManager.ts    # Main PM agent with user story templates
│   ├── jiraIntegration.ts   # Jira ticket creation and management
│   ├── slackIntegration.ts  # Slack messaging integration
│   └── testSimple.ts        # Minimal test agent
├── app/
│   ├── api/         # Next.js API routes
│   │   ├── session/route.ts     # WebRTC session endpoint
│   │   ├── responses/route.ts   # Response handling
│   │   ├── jira/               # ✅ PRODUCTION Jira API endpoints
│   │   │   └── activity/route.ts    # Real mention detection (15+ active)
│   │   ├── pinecone/           # Vector search endpoints
│   │   └── dashboard/          # Dashboard data endpoints
│   ├── components/  # React components
│   │   ├── Dashboard.tsx       # ✅ Real Jira data integration
│   │   ├── BottomToolbar.tsx   # Voice controls
│   │   ├── Events.tsx          # Real-time events display
│   │   └── Transcript.tsx      # Conversation display
│   ├── contexts/    # React contexts (EventContext, TranscriptContext, UserContext)
│   ├── lib/         # Client utilities
│   │   ├── jira-utils.ts       # ✅ ADF parsing (12/14 content types)
│   │   └── realtimeClient.ts   # WebRTC client
│   ├── services/    # Service integrations
│   │   └── jiraService.ts      # ✅ React hooks for real Jira data
│   └── types/       # TypeScript definitions
│       └── jira-models.ts      # ✅ Complete Jira data models
├── lib/             # Shared service integrations
│   ├── jira/        # Jira client and API wrapper
│   ├── pinecone/    # Vector database service
│   ├── auth.ts      # Authentication utilities
│   └── validation/  # Schema validation
├── development-archive/
│   └── integrations/jira/      # ✅ Production Jira client
│       └── jiraClient.ts       # ExtendTV integration
└── testing-framework/  # Isolated voice testing system
```

## Current Implementation Status

**Phase 1 COMPLETED**: Technical Product Manager voice interface with real Jira integration
- ✅ Voice-driven template completion
- ✅ Real-time Jira comment mention detection
- ✅ Comprehensive ADF (Atlassian Document Format) parsing
- ✅ Live dashboard with 15+ active mentions from ExtendTV Jira instance
- ✅ Priority-based urgency classification and rich content detection
- ✅ Production-ready mention detection supporting all Jira comment formats
- Target user: Antoine Dubuc (Technical Product Manager)

The system follows the OpenAI Advanced Agent Example architecture found in `research/openai_advanced_agent_example/` which serves as the technical foundation.

### Jira Integration Status
**PRODUCTION READY** - Successfully integrated with ExtendTV Jira instance:
- Real-time mention detection across 50+ tickets from last 30 days
- ADF parsing with 12/14 content types supported (based on `JIRA_COMMENT_PARSING_REFERENCE.md`)
- Comprehensive mention pattern detection including legacy formats and account IDs
- Server-side API routes for secure credential handling
- Dashboard displays real mentions with urgency classification and rich content indicators

## Testing Strategy

The project includes a comprehensive automated voice testing framework in `testing-framework/`:

### Voice Testing Framework Architecture
- **Isolated System**: Completely separate from production code with its own dependencies
- **Black-Box Testing**: External browser automation testing actual user experience
- **Real Audio Testing**: TTS-generated WAV files injected into WebRTC streams
- **End-to-End Validation**: Tests complete voice → AI → response → UI pipeline

### Key Testing Patterns
- **Audio Generation**: `npm run generate-audio` creates realistic test audio using OpenAI TTS
- **Browser Automation**: Playwright controls real browser sessions with audio injection
- **Performance Measurement**: Measures actual response latency and streaming validation
- **Comprehensive Reporting**: Detailed test reports with screenshots and network logs

### Testing Commands
```bash
# From testing-framework/ directory
npm run test:voice        # Voice interaction validation
npm run test:integration  # UI integration testing
npm run test:performance  # Latency and streaming tests
npm run test:all         # Complete test suite
./scripts/run-all-tests.sh  # Automated end-to-end testing
```

## Environment Requirements

- `OPENAI_API_KEY` with Realtime API access
- Pinecone configuration for vector search
- Jira API credentials for ticket integration
- Confluence API credentials for documentation integration
- HTTPS required for WebRTC in production

### Confluence Configuration
- `CONFLUENCE_HOST` or `CONFLUENCE_BASE_URL` - Your Confluence instance URL
- `CONFLUENCE_EMAIL` - User email for authentication (can reuse JIRA_USER_EMAIL)
- `CONFLUENCE_API_TOKEN` - Confluence API token (can reuse JIRA_API_TOKEN if same Atlassian account)

### Configuration Specifics
- **Next.js Config**: `serverExternalPackages: ['@openai/agents']` required for OpenAI agents
- **TypeScript**: Path alias `@/*` maps to `src/*` for clean imports
- **Port Configuration**: Development server runs on port 8888 to avoid conflicts
- **Model**: Uses `gpt-4o-realtime-preview-2024-12-17` for realtime API
- **Voice**: Consistently uses 'sage' voice across all agents

### Service Integration Patterns
- **Jira Client**: Exported from `src/lib/jira/` with TypeScript interfaces
- **Pinecone Service**: Exported from `src/lib/pinecone/` with vector search utilities
- **Agent Registry**: Centralized in `src/agents/index.ts` following OpenAI example pattern
- **Agent Handoffs**: Configured with bidirectional handoffs between PM, Jira, and Slack agents