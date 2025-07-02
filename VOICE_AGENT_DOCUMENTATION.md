# Voice Agent System Documentation

## Overview

The Squiddles voice agent system is a sophisticated multi-agent voice interface built on OpenAI's Realtime API with WebRTC for real-time audio streaming. It provides natural voice conversation with specialized agents for different integrations (Jira, Confluence, Slack, Gmail).

## Architecture

### Core Components

#### 1. RealtimeClient (`src/app/lib/realtimeClient.ts`)
- **Purpose**: Wrapper around OpenAI's RealtimeSession for browser compatibility
- **Key Features**:
  - WebRTC transport with audio element integration
  - Event emission for connection status, messages, and history updates
  - Session management with ephemeral keys
  - Error handling and connection timeout management

```typescript
export class RealtimeClient {
  #session: RealtimeSession | null = null;
  #events = new MiniEmitter<ClientEvents>();
  #options: RealtimeClientOptions;
}
```

**Critical Implementation Details**:
- Uses `OpenAIRealtimeWebRTC` transport when audio element is provided
- Session config must be minimal - avoid custom `config` objects that break connection
- Connection flow: `getEphemeralKey()` → `session.connect()` → emit 'connected'

#### 2. Session API (`src/app/api/session/route.ts`)
- **Purpose**: Server-side endpoint to create ephemeral keys for OpenAI Realtime API
- **Security**: Keeps API key server-side, returns ephemeral client keys
- **Model**: Uses `gpt-4o-realtime-preview-2024-12-17`

#### 3. Main Voice Interface (`src/app/page.tsx`)
- **State Management**: 
  - `sessionStatus`: "DISCONNECTED" | "CONNECTING" | "CONNECTED"
  - `isListening`: Boolean indicating active conversation state
  - `clientRef`: Reference to RealtimeClient instance
- **Key Functions**:
  - `startSession()`: Initialize and connect voice session
  - `endSession()`: Cleanup and disconnect
  - `toggleListening()`: Smart microphone button behavior

### Agent System

#### Agent Registry (`src/agents/index.ts`)
```typescript
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  minimal: minimalProductManagerScenario,
  jira: jiraIntegrationScenario,
  confluence: confluenceIntegrationScenario,
  slack: slackIntegrationScenario,
  gmail: gmailIntegrationScenario,
  full: [...confluenceIntegrationScenario, ...jiraIntegrationScenario, ...slackIntegrationScenario, ...gmailIntegrationScenario, ...minimalProductManagerScenario],
};
```

**Agent Priorities**: Order matters! First agent in array gets priority for ambiguous requests.

#### Individual Agents

##### Jira Integration Agent (`src/agents/jiraIntegration.ts`)
- **Tools**: `searchJiraTickets`, `createJiraTicket`, `getCurrentSprint`, `getSelectedTicket`
- **Keywords**: "tickets", "issues", "sprint", "jira", "create ticket"
- **Response Pattern**: Concise voice responses, detailed UI display via function output handling

##### Confluence Integration Agent (`src/agents/confluenceIntegration.ts`)
- **Tools**: `searchPages`, `createPage`, `getSpaces`, `checkConfluenceStatus`
- **Keywords**: "pages", "documentation", "docs", "wiki", "confluence"
- **Priority**: Placed before Jira in agent order to catch page requests

##### Voice Configuration (`src/config/voices.ts`)
- **Global Settings**: Voice, tone, speed per agent
- **Style Generation**: Dynamic instruction generation based on voice settings
- **Current Default**: 'echo' voice with 'friendly' tone

## Connection Flow

### Successful Connection Sequence
1. User clicks microphone → `startSession()`
2. Request microphone permissions → `getUserMedia()`
3. Fetch ephemeral key → `GET /api/session`
4. Create RealtimeClient with agents and audio element
5. Setup event listeners (connection_change, history_updated, error)
6. Call `client.connect()` with ephemeral key
7. Session connects → `setSessionStatus("CONNECTED")` + `setIsListening(true)`

### Event Handling
```typescript
client.on("connection_change", (status) => {
  if (status === "connected") {
    setSessionStatus("CONNECTED");
    setIsListening(true); // Critical for UI state
  } else if (status === "disconnected") {
    setSessionStatus("DISCONNECTED");
    setIsListening(false);
  }
});
```

### Function Output Processing
The system automatically displays results from agent function calls:

```typescript
// Jira tickets display
if (functionName === 'searchJiraTickets') {
  const tickets = result.issues.map(issue => ({
    key: issue.key,
    summary: issue.summary,
    // ... format for UI
  }));
  showTickets(tickets, result.total, voiceMessage, searchQuery);
}

// Confluence pages display
if (functionName === 'searchPages') {
  const pages = result.pages.map(page => ({
    key: page.id,
    summary: page.title,
    // ... format for UI
  }));
  showTickets(pages, result.total, voiceMessage, searchQuery);
}
```

## UI Components

### VoiceInterface (`src/app/components/VoiceInterface.tsx`)
- **Purpose**: Main voice conversation UI with glass-themed design
- **Components**: Transcript display, Events log, BottomToolbar controls
- **Props**: Session status, agent selection, transcript items

### BottomToolbar (`src/app/components/BottomToolbar.tsx`)
- **Microphone Button Logic**:
  - Green: Ready to start session
  - Yellow: Connecting
  - Red (pulsing): Listening - click to end session
  - Gray: Disabled/error state

### Transcript (`src/app/components/Transcript.tsx`)
- **Real-time Updates**: Shows conversation flow with user/assistant messages
- **Message Types**: Text, function calls, audio transcriptions

## Key Troubleshooting Patterns

### Connection Issues
1. **Timeout Errors**: Usually WebRTC/firewall blocking
   - Check browser console for specific WebRTC errors
   - Test in different networks (mobile hotspot vs corporate)
   - Verify HTTPS context (required for WebRTC)

2. **Session Configuration Errors**: 
   - Keep RealtimeSession config minimal
   - Avoid custom `turnDetection` or `inputAudioTranscription` configs
   - Follow working OpenAI example pattern exactly

3. **Agent Routing Issues**:
   - Check agent order in `allAgentSets.full`
   - Verify agent instruction keywords don't overlap
   - Use specific keywords to trigger correct agent

### State Management Issues
1. **Microphone Button Stuck**: Ensure `isListening` is set in connection_change handler
2. **Function Results Not Displaying**: Check function name matching in history_updated handler
3. **Agent Selection**: Verify selectedAgentSet is passed to RealtimeClient

## Environment Requirements

```bash
# Required Environment Variables
OPENAI_API_KEY=sk-proj-...  # OpenAI API key with Realtime API access
JIRA_API_TOKEN=ATATT3x...   # Jira API token
JIRA_BASE_URL=https://...   # Jira instance URL
JIRA_USER_EMAIL=...         # Jira user email
CONFLUENCE_BASE_URL=...     # Confluence instance URL (optional)
```

## Development Commands

```bash
npm run dev          # Start development server (port 8888)
npm run build        # Build for production
npm run lint         # ESLint checking
npm test            # Run Jest tests
```

## Dependencies

### Core Voice Dependencies
```json
{
  "@openai/agents": "^0.0.1",        // OpenAI Agents SDK
  "openai": "^4.77.3",               // OpenAI API client
  "uuid": "^11.0.4",                 // UUID generation
  "next": "15.1.0",                  // Next.js framework
  "react": "^18",                    // React
  "react-dom": "^18"                 // React DOM
}
```

### Audio Requirements
- **HTTPS Context**: Required for getUserMedia and WebRTC
- **Microphone Permissions**: Must be granted before session start
- **Audio Format**: PCM16, 24kHz sample rate (OpenAI default)

## Testing

### Manual Testing Checklist
1. **Connection**: 
   - [ ] Microphone button turns green when ready
   - [ ] Clicking starts session (yellow → red)
   - [ ] Audio permissions granted
   - [ ] Session connects (red + pulsing)

2. **Voice Interaction**:
   - [ ] Speech is transcribed in real-time
   - [ ] AI responds with voice
   - [ ] Function calls execute and display results

3. **Agent Routing**:
   - [ ] "Find tickets" → Jira agent
   - [ ] "Find pages" → Confluence agent
   - [ ] "Send message" → Slack agent

4. **Session Management**:
   - [ ] Red microphone click ends session
   - [ ] Disconnection cleans up properly
   - [ ] Can restart session after ending

### Common Test Phrases
```
"Find tickets about authentication"
"Search for confluence pages"
"What's in our current sprint?"
"Create a ticket for user login bug"
"Find documentation about API"
```

## Performance Considerations

1. **Connection Speed**: WebRTC connection typically takes 2-5 seconds
2. **Audio Quality**: Ensure good microphone and stable internet
3. **Agent Response Time**: Function calls add 1-3 seconds to responses
4. **Memory Usage**: Keep session duration reasonable, restart if needed

## Security Notes

1. **API Key Protection**: Never expose OPENAI_API_KEY in browser
2. **Ephemeral Keys**: Rotate automatically, limited lifespan
3. **Microphone Access**: Properly handle permission denials
4. **HTTPS Requirement**: WebRTC requires secure context

## Future Enhancements

1. **Push-to-Talk Mode**: Alternative to always-listening
2. **Custom Wake Words**: Reduce accidental activations
3. **Audio Recording**: Save conversations for later review
4. **Multi-language Support**: Extend beyond English
5. **Advanced Agent Routing**: Better disambiguation between agents

---

**Last Updated**: 2025-07-02
**Status**: Production Ready
**Version**: 1.0.0