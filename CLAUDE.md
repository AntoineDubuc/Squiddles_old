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
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint checking
npm test            # Run Jest tests
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

## Project Structure

```
src/
├── agents/           # Agent implementations (productManager, jiraIntegration, etc.)
├── app/
│   ├── api/         # Next.js API routes (session, responses)
│   ├── components/  # React components (BottomToolbar, Events, Transcript)
│   ├── contexts/    # React contexts (EventContext, TranscriptContext)
│   └── lib/         # Utilities (guardrails, realtimeClient)
└── lib/             # Shared utilities
```

## Current Implementation Status

**Phase 1 Target**: Technical Product Manager voice interface for user story creation
- Voice-driven template completion
- Pinecone search for related tickets
- Jira integration for ticket creation
- Target user: Antoine Dubuc (Technical Product Manager)

The system follows the OpenAI Advanced Agent Example architecture found in `research/openai_advanced_agent_example/` which serves as the technical foundation.

## Testing Strategy

The project includes an automated voice testing framework:
- TTS-generated test audio files for consistent testing
- Voice recognition accuracy measurement
- Regression tests for voice command scenarios
- Planned CI/CD integration for automated voice testing

## Environment Requirements

- `OPENAI_API_KEY` with Realtime API access
- Pinecone configuration for vector search
- Jira API credentials for ticket integration
- HTTPS required for WebRTC in production