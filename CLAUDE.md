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
npm run dev          # Start development server (port 3002)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint checking
npm test            # Run Jest tests

# Service Testing
npm run test:jira-api         # Test Jira API endpoints
npm run test:pinecone         # Test Pinecone connection
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

### Multi-Agent Registry Pattern
The system follows OpenAI's Advanced Agent Example architecture:
```typescript
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  squiddles: transparentMultiAgentScenario,    // Seamless handoffs (recommended)
  unified: unifiedSquiddlesScenario,           // Single agent fallback
  collaborative: collaborativeSquiddlesScenario, // Visible transfers
}
```

### Smart Model Routing System
**Voice vs Text Input Optimization**:
- **Voice Input**: Automatically routes to Nova Sonic for natural conversation and real-time interaction
- **Text Input**: Automatically routes to Nova Pro for cost-effective text processing
- **Auto-Detection**: Intelligently detects input type based on content patterns and context
- **Fallback Strategy**: Graceful degradation to OpenAI if Nova models are unavailable

**Cost Optimization**:
- Nova Sonic: ~$0.70/hour for voice interactions
- Nova Pro: ~$0.0008 per 1K tokens for text interactions  
- OpenAI Realtime: ~$60/hour (used as fallback only)

**Input Type Detection**:
```typescript
// Explicit context (recommended)
client.sendUserText("Hello", { isTextInput: true, source: 'keyboard' });

// Auto-detection based on content patterns
client.sendUserText("Hello"); // Analyzes for voice vs text characteristics
```

### Voice Interface Components
- Glass-themed UI with gradient borders matching design mockups
- Real-time transcript updates via React contexts
- Connection state management with animated indicators
- Audio element configuration for optimal playback

## Project Structure

```
src/
├── agents/           # Agent implementations with handoff patterns
│   ├── index.ts     # Agent registry following OpenAI example
│   ├── transparentMultiAgent.ts  # Seamless multi-agent system
│   ├── unifiedSquiddles.ts       # Single agent fallback
│   └── [specialist agents]       # Jira, Confluence, Slack, Gmail agents
├── app/
│   ├── api/         # Next.js API routes
│   │   ├── session/route.ts     # WebRTC session endpoint
│   │   ├── responses/route.ts   # Response handling
│   │   ├── jira/               # Jira API endpoints
│   │   ├── confluence/         # Confluence endpoints
│   │   ├── slack/              # Slack endpoints
│   │   └── pinecone/           # Vector search endpoints
│   ├── components/  # React components
│   │   ├── Dashboard.tsx       # Glass-themed PM dashboard
│   │   ├── VoiceInterface.tsx  # Voice conversation UI
│   │   ├── Transcript.tsx      # Real-time conversation display
│   │   ├── Events.tsx          # Debug events panel
│   │   └── BottomToolbar.tsx   # Voice controls
│   ├── contexts/    # React contexts (TranscriptContext, EventContext, etc.)
│   ├── lib/         # Client utilities
│   │   ├── realtimeClient.ts   # OpenAI Realtime API client
│   │   ├── guardrails.ts       # Content moderation
│   │   └── utils.ts            # Utility functions
│   └── services/    # Service integrations
│       ├── jiraService.ts      # React hooks for Jira data
│       └── slackService.ts     # Slack integration hooks
├── lib/             # Shared service integrations
│   ├── jira/jiraClient.ts      # Jira API wrapper
│   ├── confluence/             # Confluence integration
│   ├── slack/                  # Slack integration
│   └── pinecone/               # Vector database service
└── development-archive/        # Experimental features ready for integration
    ├── experimental/           # Advanced components and APIs
    ├── integrations/           # Service libraries
    ├── planning/               # Project management materials
    └── reference/              # Design materials & research
```

## Current Implementation Status

**Phase 1 COMPLETED**: Technical Product Manager voice interface with real Jira integration
- ✅ Voice-driven interface with real-time conversation
- ✅ Multi-agent system with transparent handoffs  
- ✅ Real Jira integration with live mention detection
- ✅ Glass-themed dashboard with activity feeds
- ✅ Comprehensive ADF parsing for Jira comments
- ✅ Production-ready mention detection and urgency classification

The system follows the OpenAI Advanced Agent Example architecture found in `development-archive/reference/research/openai_advanced_agent_example/` which serves as the technical foundation.

## Environment Requirements

### Core AI Models
- `OPENAI_API_KEY` with Realtime API access (fallback for both voice and text)
- `NEXT_PUBLIC_AWS_REGION`, `NEXT_PUBLIC_AWS_ACCESS_KEY_ID`, `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY` for AWS Nova models

### Voice Model Configuration (Nova Sonic)
- `USE_NOVA_SONIC=true` or `VOICE_MODEL=nova-sonic` to enable Nova Sonic for voice
- `NEXT_PUBLIC_NOVA_SONIC_VOICE_ID` (default: 'matthew')
- `NEXT_PUBLIC_NOVA_SONIC_SAMPLE_RATE` (default: '24000')
- `NEXT_PUBLIC_NOVA_SONIC_SESSION_TIMEOUT` (default: '480000')

### Text Model Configuration (Nova Pro)
- `USE_NOVA_PRO=true` or `TEXT_MODEL=nova-pro` to enable Nova Pro for text
- `NEXT_PUBLIC_NOVA_PRO_MODEL_ID` (default: 'amazon.nova-pro-v1:0')
- `NEXT_PUBLIC_NOVA_PRO_MAX_TOKENS` (default: '4096')
- `NEXT_PUBLIC_NOVA_PRO_TEMPERATURE` (default: '0.7')
- `NEXT_PUBLIC_NOVA_PRO_TOP_P` (default: '0.9')

### Model Selection Control
- `AUTO_DETECT_INPUT=true` to enable smart input type detection (default: enabled)
- `PREFERRED_INPUT_TYPE=auto|voice|text` to set preferred input type (default: 'auto')
- `VOICE_FALLBACK_ENABLED=true` to enable voice model fallback (default: enabled)
- `TEXT_FALLBACK_ENABLED=true` to enable text model fallback (default: enabled)

### Service Integrations
- `JIRA_HOST`, `JIRA_EMAIL`, `JIRA_API_TOKEN` for ticket integration
- `PINECONE_API_KEY` for vector search
- `SLACK_BOT_TOKEN` for Slack integration
- `CONFLUENCE_HOST`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN` for documentation

### Technical Requirements
- HTTPS required for WebRTC in production

### Configuration Specifics
- **Next.js Config**: `serverExternalPackages: ['@openai/agents', '@aws-sdk/client-bedrock-runtime']` required
- **TypeScript**: Path alias `@/*` maps to `src/*` for clean imports
- **Port Configuration**: Development server runs on port 3002
- **Model**: Uses `gpt-4o-realtime-preview-2024-12-17` for realtime API
- **Voice**: Consistently uses 'sage' voice across all agents

### Service Integration Patterns
- **Agent Registry**: Centralized in `src/agents/index.ts` following OpenAI example pattern
- **Agent Handoffs**: Configured with bidirectional handoffs between PM, Jira, and Slack agents
- **Tool Execution**: Strongly-typed function calls with conversation context access
- **Context Management**: Dashboard state passed to agents for context-aware responses

## Development Patterns

### Agent Development Pattern
```typescript
const agent = new RealtimeAgent({
  name: 'agentName',
  voice: 'sage',                    // Consistent voice across agents
  instructions: 'Agent behavior',   // Natural language instructions
  tools: [tool1, tool2],           // Available actions
  handoffs: [otherAgent],          // Agent transfer capabilities
});
```

### Tool Implementation Pattern
```typescript
const tool = tool({
  name: 'toolName',
  description: 'What it does',
  parameters: { /* JSON Schema */ },
  execute: async (input, details) => {
    const context = details?.context;
    // Implementation with context access
    return { success: true, result: 'Done!' };
  }
});
```

### Context Management Pattern
```typescript
// Pass dashboard state to agents
const client = new RealtimeClient({
  extraContext: {
    addTranscriptMessage,
    selectedMention: replyState.selectedMention,
    dashboardState: { mentions, tickets },
    apiClients: { jira, confluence, slack }
  }
});
```

## Testing Strategy

The project includes a comprehensive automated voice testing framework in `development-archive/planning/testing-framework/`:

### Voice Testing Framework Architecture
- **Isolated System**: Completely separate from production code with its own dependencies
- **Real Audio Testing**: TTS-generated WAV files injected into WebRTC streams
- **End-to-End Validation**: Tests complete voice → AI → response → UI pipeline
- **Browser Automation**: Playwright controls real browser sessions with audio injection

### Testing Commands
```bash
# From development-archive/planning/testing-framework/ directory
npm install                   # Install isolated test dependencies
npm run generate-audio        # Generate test audio files
npm run test:voice           # Voice interaction tests
npm run test:integration     # UI integration tests
npm run test:performance     # Performance validation
./scripts/run-all-tests.sh   # Complete automated test suite
```