# Developer Onboarding Guide
## OpenAI Advanced Agent Example

This comprehensive guide will help you understand, set up, and extend the OpenAI Advanced Agent Example - a sophisticated voice agent system demonstrating multi-agent patterns using the OpenAI Realtime API.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Core Concepts](#core-concepts)
4. [Agent Patterns](#agent-patterns)
5. [Development Workflow](#development-workflow)
6. [Creating New Agents](#creating-new-agents)
7. [Debugging & Troubleshooting](#debugging--troubleshooting)
8. [Best Practices](#best-practices)
9. [Advanced Topics](#advanced-topics)
10. [Resources](#resources)

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key with Realtime API access
- Modern browser with WebRTC support

### Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd openai_advanced_agent_example
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.sample .env
   # Add your OpenAI API key to .env
   echo "OPENAI_API_KEY=your_actual_key_here" > .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
4. **Access Application**
   - Open http://localhost:3000
   - Allow microphone permissions
   - Select a scenario from the dropdown
   - Start talking!

### Common Startup Issues

If localhost:3000 doesn't work:
- Wait 15+ seconds for full compilation (1634 modules)
- Check the terminal shows "Compiled / in Xms" message
- Verify `.env` file has correct API key
- Check `src/app/lib/envSetup.ts` path is `./.env` not `./env`

---

## Architecture Overview

This is a **multi-agent conversational AI system** built on the OpenAI Realtime API with real-time voice interaction. The architecture demonstrates production-ready patterns for building sophisticated voice agents.

### Technology Stack
- **Frontend**: Next.js 15 + TypeScript + React
- **Styling**: Tailwind CSS
- **Voice**: OpenAI Realtime API + WebRTC
- **AI Models**: GPT-4o-realtime, GPT-4.1, o4-mini
- **Agent Framework**: @openai/agents-realtime SDK

### Core Architecture Flow

```
User Speech → WebRTC → OpenAI Realtime API → Agent Processing → Tools/Handoffs → Response → Voice Output
```

### Key Components

```
src/app/
├── agentConfigs/           # Agent definitions & scenarios
│   ├── chatSupervisor/     # Chat-supervisor pattern
│   ├── customerServiceRetail/ # Multi-agent handoff pattern  
│   ├── simpleHandoff.ts    # Basic example
│   ├── realtimeClient.ts   # WebRTC client wrapper
│   └── voiceAgentMetaprompt.txt # Instruction template
├── api/                    # Backend endpoints
│   ├── session/            # Session management
│   └── responses/          # Supervisor agent calls
├── components/             # React UI components
├── contexts/               # State management
├── hooks/                  # Custom React hooks
└── lib/                    # Utility functions
```

### Complete Speech-to-Response Pipeline

**1. Audio Capture & Transport**
```typescript
// WebRTC captures microphone → streams to OpenAI Realtime API
const transport = new OpenAIRealtimeWebRTC({
  useInsecureApiKey: true,
  audioElement: audioElement
});
```

**2. Speech Recognition & Processing**
```typescript
// Whisper converts speech to text (streaming)
client.on('conversation.input_audio_transcription.delta', (ev) => {
  updateTranscriptMessage(itemId, ev.delta, true); // Live transcription
});
```

**3. Agent Decision Making**
```typescript
// Agent analyzes context and decides: respond, call tool, or handoff
const agent = new RealtimeAgent({
  instructions: `When user mentions "return" → transfer to returns agent`,
  tools: [lookupOrder, transferAgent],
  handoffs: [returnsAgent, salesAgent]
});
```

**4. Response Generation & Playback**
```typescript
// Text → TTS → Audio streams back via WebRTC
client.on('response.text.delta', (ev) => {
  updateTranscriptMessage(itemId, ev.delta, true); // Token-by-token streaming
});
```

### State Management Architecture

```
Frontend React State ↔ RealtimeClient ↔ OpenAI RealtimeSession ↔ Active Agent
```

- **Frontend**: UI state, transcript display, user controls
- **RealtimeClient**: Event forwarding, session management wrapper
- **RealtimeSession**: Conversation history, agent switching logic
- **Active Agent**: Current agent processing user input with full context

---

## Core Concepts

### 1. RealtimeAgent

The fundamental building block. Each agent has:

```typescript
const myAgent = new RealtimeAgent({
  name: 'agentName',                    // Unique identifier
  voice: 'sage',                       // Voice setting
  instructions: 'Detailed behavior...',// How the agent behaves
  tools: [tool1, tool2],               // Available functions
  handoffs: [otherAgent1, otherAgent2],// Transfer targets
  handoffDescription: 'What I do'      // Help other agents route
});
```

### 1.1. Agent Memory Model

**Critical Understanding**: The system uses **session-scoped memory** with **no persistence**.

#### **Memory Scope & Lifecycle**
```
User connects → Session starts → Agents remember everything → User disconnects → All memory lost
```

**Example:**
```
User: "Hi, my name is John"
Agent: "Nice to meet you, John!"

[30 minutes later, after multiple agent handoffs]

Agent: "As we discussed earlier, John, your order..."
```

#### **Across Sessions (Zero Memory)**
```
Session 1: "Hi, my name is John"
[Disconnect/Reconnect]
Session 2: "Hi John, how can I help?" 
Agent: "Hello! How can I assist you today?" (No recognition)
```

#### **Technical Memory Implementation**

**Session-Based Storage:**
```typescript
// RealtimeSession maintains conversation history
this.#session = new RealtimeSession(rootAgent, {
  transport: transportValue,
  context: this.#options.extraContext ?? {},
});

// Agents can access full conversation history
execute: async (input, details) => {
  const history: RealtimeItem[] = (details?.context as any)?.history ?? [];
  const conversationSoFar = history.filter(item => item.type === 'message');
  
  // Agent can reference anything said in the session
  return { 
    response: `Based on what you told me earlier about ${previousInfo}...`
  };
}
```

#### **Memory During Agent Handoffs**

**Seamless Context Transfer:**
- When agents hand off, the **entire conversation history is preserved**
- New agents have access to everything said from session start
- User information collected by one agent is available to all subsequent agents

**Example:**
```typescript
// Authentication agent collects info
User: "My name is John Smith, phone (555) 123-4567"
Auth Agent: [Stores in conversation history]

// Later, returns agent can reference this
Returns Agent: "Let me look up your order, John, using phone (555) 123-4567"
```

#### **Memory Limitations**

**What's NOT Remembered:**
- ❌ Previous sessions/conversations
- ❌ User preferences across sessions  
- ❌ Historical interaction patterns
- ❌ Long-term customer data

**What IS Remembered:**
- ✅ Everything said in current session
- ✅ User information collected during session
- ✅ Context across agent handoffs
- ✅ Tool call results and data

**Privacy Implication**: Complete conversation privacy through intentional memory loss between sessions.

### 2. Agent Handoffs

Agents automatically get `transfer_to_<name>` tools based on their `handoffs` array:

```typescript
// Authentication agent can transfer to these
authAgent.handoffs = [returnsAgent, salesAgent, humanAgent];
// This creates: transfer_to_returns, transfer_to_sales, transfer_to_human
```

### 3. Tools System Architecture

Tools are functions agents can call to integrate with business logic, databases, APIs, and external systems.

#### **Tool Definition Pattern**

```typescript
import { tool } from '@openai/agents/realtime';

const myTool = tool({
  name: 'lookupOrder',
  description: 'Find customer order by phone number',
  parameters: {
    type: 'object',
    properties: {
      phone: { type: 'string', pattern: '^\\(\\d{3}\\) \\d{3}-\\d{4}$' }
    },
    required: ['phone']
  },
  execute: async (input, details) => {
    const { phone } = input;
    
    // Tool has access to full conversation history
    const history = (details?.context as any)?.history ?? [];
    
    // Your business logic here
    const order = await database.findOrder(phone);
    
    return { 
      orderNumber: order.id,
      status: order.status,
      items: order.items 
    };
  }
});
```

#### **Tool Execution Flow**

1. **Agent Decision**: "User wants order lookup, I need to call lookupOrder tool"
2. **Parameter Extraction**: Agent identifies phone number from conversation
3. **Tool Call**: `execute()` function runs with parameters + conversation context
4. **Result Integration**: Tool result becomes part of conversation history
5. **Agent Response**: Agent uses tool result to formulate response

#### **Advanced Tool Patterns**

**Supervisor Tool (Chat-Supervisor Pattern):**
```typescript
const getNextResponseFromSupervisor = tool({
  name: 'getNextResponseFromSupervisor',
  description: 'Get guidance from intelligent supervisor for complex decisions',
  execute: async (input, details) => {
    // Sends full conversation to GPT-4.1 for complex reasoning
    const response = await fetch('/api/responses', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4.1',
        input: conversationHistory,
        tools: supervisorAgentTools
      })
    });
    
    return { nextResponse: response.content };
  }
});
```

**Database Integration Tool:**
```typescript
const authenticateUser = tool({
  name: 'authenticate_user_information',
  description: 'Verify user identity with phone, SSN, and DOB',
  parameters: {
    type: 'object',
    properties: {
      phone_number: { type: 'string', pattern: '^\\(\\d{3}\\) \\d{3}-\\d{4}$' },
      last_4_digits: { type: 'string', description: 'Last 4 of SSN or credit card' },
      date_of_birth: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }
    },
    required: ['phone_number', 'date_of_birth', 'last_4_digits']
  },
  execute: async (input) => {
    // Simulate authentication check
    const authenticated = await verifyUserIdentity(input);
    return {
      authenticated,
      user: authenticated ? { name: 'John Smith', tier: 'Premium' } : null
    };
  }
});
```

### 4. Intent Recognition & Agent Decision Making

**Critical Insight**: This system uses **pure AI reasoning** for intent recognition - no traditional intent classification, keyword matching, or NLP processing.

#### **How Agents Understand User Intent**

Agents use the natural language understanding capabilities of GPT models guided by detailed instructions:

```typescript
instructions: `
# Identity
You are a customer service agent for Snowy Peak Boards (snowboard company).

# Intent Recognition & Routing
When users mention:
- "return", "refund", "exchange", "defective" → transfer to returns agent
- "buy", "purchase", "sale", "new board" → transfer to sales agent  
- "billing", "account", "payment", "charge" → handle directly with billing tools
- "frustrated", "manager", "supervisor" → transfer to human agent

# Decision Process
1. Analyze user's complete message in context
2. Identify primary intent and emotional tone
3. Determine if you can handle it or need to transfer
4. Execute appropriate action (respond, call tool, handoff)
`
```

#### **AI Reasoning Examples**

**Simple Intent:**
```
User: "I want to return my snowboard"
Agent Reasoning: User mentioned "return" + "snowboard" → this is a return request → transfer to returns agent
Action: Call transfer_to_returns tool
```

**Complex Intent:**
```
User: "I bought a board last week but it's the wrong size, can I exchange it for a different one?"
Agent Reasoning: User wants to exchange (form of return) → mentions timing ("last week") → specific issue ("wrong size") → returns agent handles exchanges
Action: Call transfer_to_returns tool
```

**Emotional Context:**
```
User: "I'm really frustrated, this is the third time I'm calling about this issue"
Agent Reasoning: User is frustrated + repeat issue → emotional escalation needed → transfer to human agent for better experience
Action: Call transfer_to_simulatedHuman tool
```

#### **No Traditional NLP Components**

The system **doesn't use**:
- ❌ Keyword matching engines
- ❌ Intent classification models  
- ❌ Entity extraction tools
- ❌ Rule-based routing systems

Instead it relies on:
- ✅ **Natural language instructions** that guide AI reasoning
- ✅ **Contextual understanding** from full conversation history
- ✅ **Multi-model intelligence** (realtime + GPT-4.1 for complex decisions)
- ✅ **Emergent behavior** from well-crafted agent instructions

### 5. Session Management & State Architecture

#### **Session Lifecycle Management**

```typescript
enum SessionStatus { "DISCONNECTED" | "CONNECTING" | "CONNECTED" }

// Session establishment flow
const connectToRealtime = async () => {
  setSessionStatus("CONNECTING");
  
  // 1. Get ephemeral key from OpenAI
  const EPHEMERAL_KEY = await fetch('/api/session').then(r => r.text());
  
  // 2. Create RealtimeClient with all agents
  const client = new RealtimeClient({
    getEphemeralKey: () => EPHEMERAL_KEY,
    initialAgents: [authAgent, returnsAgent, salesAgent], // All available agents
    audioElement: audioRef.current,
    extraContext: { addTranscriptBreadcrumb } // Custom context
  });
  
  // 3. Establish WebRTC connection
  await client.connect();
  setSessionStatus("CONNECTED");
};
```

#### **Agent Switching Architecture**

```typescript
// All agents registered with session, but only one is "active"
const reorderedAgents = [...selectedAgentSet];
const activeAgentIndex = reorderedAgents.findIndex(a => a.name === selectedAgentName);

// Move selected agent to position 0 (becomes root/active agent)
if (activeAgentIndex > 0) {
  const [agent] = reorderedAgents.splice(activeAgentIndex, 1);
  reorderedAgents.unshift(agent);
}

// RealtimeSession maintains all agents but routes to first one
const session = new RealtimeSession(reorderedAgents[0], {
  transport: webrtcTransport,
  context: extraContext
});
```

#### **State Persistence Layers**

**Frontend State (React Context):**
```typescript
// TranscriptContext - Conversation display
const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);

// EventContext - Debug logging  
const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);

// Local Storage - UI preferences
localStorage.setItem('claude-ptt-mode', isPTTActive);
localStorage.setItem('claude-audio-playback', !isAudioMuted);
```

**Session State (OpenAI Realtime API):**
```typescript
// Conversation history maintained server-side
// Agents access via context in tool execution
execute: async (input, details) => {
  const history: RealtimeItem[] = (details?.context as any)?.history ?? [];
  const messages = history.filter(item => item.type === 'message');
  // Agent can reference anything said in session
}
```

#### **WebRTC Connection Management**

```typescript
// Audio element setup for SDK
const sdkAudioElement = React.useMemo(() => {
  if (typeof window === 'undefined') return undefined;
  const el = document.createElement('audio');
  el.autoplay = true;
  el.style.display = 'none';
  document.body.appendChild(el);
  return el;
}, []);

// Transport configuration
const transport = new OpenAIRealtimeWebRTC({
  useInsecureApiKey: true,
  audioElement: sdkAudioElement
});
```

#### **Push-to-Talk Implementation**

```typescript
// PTT affects server-side voice activity detection
const turnDetection = isPTTActive
  ? null  // Disable server VAD - user controls when to speak
  : {
      type: 'server_vad',
      threshold: 0.9,
      prefix_padding_ms: 300,
      silence_duration_ms: 500,
      create_response: true,
    };

// Update session configuration
client.sendEvent({
  type: 'session.update',
  session: { turn_detection: turnDetection }
});
```

---

## Agent Handoff Deep-Dive

### How Agent Handoffs Work Internally

Agent handoffs are the core mechanism that enables seamless transitions between specialized agents. Here's the complete technical flow:

#### **1. Handoff Tool Creation**

Agents automatically get `transfer_to_<name>` tools based on their `handoffs` array:

```typescript
// Agent configuration creates transfer tools automatically
const authAgent = new RealtimeAgent({
  name: 'authentication',
  handoffs: [returnsAgent, salesAgent, humanAgent] 
  // This creates: transfer_to_returns, transfer_to_sales, transfer_to_simulatedHuman
});
```

#### **2. Handoff Trigger Process**

```typescript
// 1. Agent decides handoff is needed based on instructions
Agent: "I'll transfer you to our returns specialist"

// 2. Agent calls transfer tool
[Internally calls transfer_to_returns tool]

// 3. Frontend detects handoff pattern
const toolName: string = (item as any).name ?? '';
const handoffMatch = toolName.match(/^transfer_to_(.+)$/);
if (handoffMatch) {
  const newAgentName = handoffMatch[1];
  
  // 4. Find matching agent in current scenario
  const candidate = selectedAgentConfigSet?.find(
    (a) => a.name.toLowerCase() === newAgentName.toLowerCase(),
  );
  
  // 5. Switch active agent
  if (candidate && candidate.name !== selectedAgentName) {
    setSelectedAgentName(candidate.name);
  }
}
```

#### **3. Context Preservation During Handoffs**

**Complete Memory Transfer:**
```typescript
// When agent switches, new agent gets FULL conversation history
execute: async (input, details) => {
  const history: RealtimeItem[] = (details?.context as any)?.history ?? [];
  
  // New agent can reference anything from session start
  const userInfo = extractUserInfoFromHistory(history);
  const previousAgentNotes = extractAgentNotesFromHistory(history);
  
  return { 
    response: `Hi ${userInfo.name}, I see you were speaking with our authentication team about ${previousAgentNotes.topic}...`
  };
}
```

**Seamless Experience Example:**
```
User: "Hi, I'm John Smith, I want to return my snowboard"

Auth Agent: 
- Collects: name="John Smith", intent="return"
- Authenticates user with phone/DOB
- Calls: transfer_to_returns

Returns Agent:
- Inherits: Full conversation including name, phone, authentication status
- Continues: "Hi John, I can help with your snowboard return. I see you're already authenticated..."
```

#### **4. Handoff Configuration Patterns**

**Bidirectional Handoffs:**
```typescript
// Agents can transfer to each other as needed
authAgent.handoffs = [returnsAgent, salesAgent, humanAgent];
returnsAgent.handoffs = [authAgent, salesAgent, humanAgent]; // Can go back to auth
salesAgent.handoffs = [authAgent, returnsAgent, humanAgent];
humanAgent.handoffs = [authAgent, returnsAgent, salesAgent]; // Can route anywhere
```

**Linear Workflow:**
```typescript
// Simple progression through specialists
greeterAgent.handoffs = [haikuWriterAgent];
haikuWriterAgent.handoffs = []; // End of workflow
```

#### **5. Handoff Decision Logic**

Agents use instructions to determine when to handoff:

```typescript
instructions: `
# When to Transfer
- User asks about returns/exchanges → transfer_to_returns
- User wants to buy something → transfer_to_sales  
- User is frustrated or asks for manager → transfer_to_simulatedHuman
- Authentication required → transfer_to_authentication

# How to Transfer
1. Briefly explain what you're doing: "Let me connect you with our returns specialist"
2. Call the appropriate transfer_to_* tool
3. The specialist will continue the conversation with full context
`
```

## Agent Patterns

### Pattern 1: Chat-Supervisor

**Use Case**: Leverage powerful text models for complex reasoning while maintaining real-time voice interaction.

**Architecture**:
- **Chat Agent** (gpt-4o-realtime-mini): Handles basic conversation, info collection
- **Supervisor Agent** (gpt-4.1): Complex reasoning, tool calls, decision-making

**Implementation**: `src/app/agentConfigs/chatSupervisor/`

```typescript
// Chat agent defers complex decisions
const chatAgent = new RealtimeAgent({
  name: 'chat',
  instructions: `
    You can handle: greetings, chitchat, collecting basic info
    For anything complex, call getNextResponseFromSupervisor tool
    Always say "Just a second" before calling supervisor
  `,
  tools: [getNextResponseFromSupervisor],
  handoffs: []
});
```

**When to Use**: 
- ✅ Existing powerful text-based agent you want to make voice-enabled
- ✅ Complex business logic requiring high intelligence
- ✅ Cost-sensitive (realtime-mini + gpt-4.1 cheaper than full gpt-4o-realtime)

### Pattern 2: Sequential Handoffs

**Use Case**: Specialized agents handle specific domains, transferring users between experts.

**Architecture**: Graph of specialist agents with bidirectional transfers

**Implementation**: `src/app/agentConfigs/customerServiceRetail/`

```typescript
// Define specialist agents
const authAgent = new RealtimeAgent({ name: 'auth', ... });
const returnsAgent = new RealtimeAgent({ name: 'returns', ... });
const salesAgent = new RealtimeAgent({ name: 'sales', ... });

// Create handoff graph
authAgent.handoffs = [returnsAgent, salesAgent, humanAgent];
returnsAgent.handoffs = [authAgent, salesAgent, humanAgent];
salesAgent.handoffs = [authAgent, returnsAgent, humanAgent];
```

**When to Use**:
- ✅ Clear user journey with distinct phases (auth → service)
- ✅ Domain-specific expertise needed
- ✅ Complex workflows spanning multiple departments

### Pattern 3: Simple Handoffs

**Use Case**: Basic routing between a few specialized functions.

**Implementation**: `src/app/agentConfigs/simpleHandoff.ts`

```typescript
const greeter = new RealtimeAgent({
  name: 'greeter',
  instructions: "Greet user, ask if they want haiku. If yes, transfer.",
  handoffs: [haikuWriter]
});

const haikuWriter = new RealtimeAgent({
  name: 'haikuWriter', 
  instructions: "Ask for topic, write haiku about it",
  handoffs: []
});
```

**When to Use**:
- ✅ Simple routing logic
- ✅ Few distinct functions
- ✅ Learning/prototyping

---

## Event Flow & Real-Time Processing

### Complete Event Pipeline Architecture

The system processes events through multiple layers to maintain real-time responsiveness:

#### **1. Event Flow Layers**

```
WebRTC Transport → RealtimeClient → React Event Handlers → UI Updates
```

#### **2. Real-Time Streaming Implementation**

**User Speech Processing:**
```typescript
// Live transcription as user speaks
client.on('message', (ev) => {
  if (ev.type === 'conversation.input_audio_transcription.delta') {
    // Shows "Transcribing..." immediately, then real text
    updateTranscriptMessage(ev.item_id, ev.delta, true);
  }
  
  if (ev.type === 'conversation.input_audio_transcription.completed') {
    // Final transcript replaces streaming version
    updateTranscriptMessage(ev.item_id, ev.transcript, false);
  }
});
```

**Assistant Response Streaming:**
```typescript
// Token-by-token response streaming
if (ev.type === 'response.text.delta' || ev.type === 'response.audio_transcript.delta') {
  const itemId = (ev as any).item_id ?? (ev as any).itemId;
  const delta = (ev as any).delta ?? (ev as any).text;
  
  // Ensure message exists
  if (!transcriptItemsRef.current.some((t) => t.itemId === itemId)) {
    addTranscriptMessage(itemId, 'assistant', '');
  }
  
  // Append delta for streaming effect
  updateTranscriptMessage(itemId, delta, true);
}
```

#### **3. Tool Call Event Handling**

```typescript
// Tool calls appear as breadcrumbs in transcript
client.on('history_added', (item) => {
  if (item.type === 'function_call') {
    addTranscriptBreadcrumb(`🔧 ${item.name}`, {
      arguments: item.arguments,
      output: item.output,
      agent: selectedAgentName
    });
  }
  
  // Detect agent handoffs
  const handoffMatch = item.name?.match(/^transfer_to_(.+)$/);
  if (handoffMatch) {
    const newAgentKey = handoffMatch[1];
    // Switch active agent in UI
    setSelectedAgentName(newAgentKey);
  }
});
```

#### **4. Audio Recording & Processing**

**Multi-Stream Recording:**
```typescript
const startRecording = async (remoteStream: MediaStream) => {
  // Capture both user microphone and assistant audio
  const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();
  
  // Mix both streams
  const remoteSource = audioContext.createMediaStreamSource(remoteStream);
  const micSource = audioContext.createMediaStreamSource(micStream);
  
  remoteSource.connect(destination);
  micSource.connect(destination);
  
  // Record combined audio
  const mediaRecorder = new MediaRecorder(destination.stream, { 
    mimeType: "audio/webm" 
  });
  
  // Handle recording data
  mediaRecorder.ondataavailable = (event) => {
    recordedChunks.push(event.data);
  };
};
```

#### **5. Error Handling & Recovery**

**Connection Error Recovery:**
```typescript
client.on('connection_change', (status) => {
  setSessionStatus(status);
  
  if (status === 'disconnected') {
    // Attempt reconnection
    setTimeout(() => {
      if (sessionStatus === 'disconnected') {
        connectToRealtime();
      }
    }, 3000);
  }
});
```

**Guardrail Processing:**
```typescript
// Real-time content moderation
export const moderationGuardrail = {
  name: 'moderation_guardrail',
  async execute({ agentOutput }: { agentOutput: string }) {
    const res = await runGuardrailClassifier(agentOutput);
    const triggered = res.moderationCategory !== 'NONE';
    
    return {
      tripwireTriggered: triggered,
      outputInfo: res,
    };
  },
};

// Handle guardrail events in UI
if (ev.type === 'guardrail_tripped') {
  // Show warning or replace content
  updateTranscriptMessage(itemId, '[Content filtered]', false);
}
```

## Development Workflow

### 1. Project Structure

```bash
# Agent development
src/app/agentConfigs/yourAgent/
├── index.ts              # Main agent export
├── agent1.ts            # Individual agent definitions
├── agent2.ts
└── sampleData.ts        # Mock data for tools

# Add to registry
src/app/agentConfigs/index.ts
```

### 2. Development Commands

```bash
npm run dev        # Start development server
npm run build      # Production build  
npm run lint       # Code linting
npm run typecheck  # TypeScript validation
```

### 3. Testing Workflow

1. **Start Development Server**: `npm run dev`
2. **Select Your Agent**: Use scenario dropdown in UI
3. **Test Voice Interaction**: Speak naturally to test intent recognition
4. **Monitor Events**: Use right panel to see raw WebRTC events
5. **Check Console**: Look for errors or debug information
6. **Test Handoffs**: Trigger transfers between agents

### 4. Debugging Tools & Techniques

#### **Frontend Developer Tools**

**Event Panel (Right Side):**
- Shows all WebRTC events in real-time
- Filter by event type (audio, conversation, session)
- Click events to see full JSON payload
- Monitor handoff patterns and tool calls

**Transcript Panel (Left Side):**
- Real-time conversation flow
- Tool call breadcrumbs with expandable details
- Agent switch indicators
- Message streaming visualization

**Browser Console Debugging:**
```typescript
// Enable detailed logging
localStorage.setItem('claude-debug', 'true');

// Monitor specific event types
client.on('message', (ev) => {
  if (ev.type.includes('function_call')) {
    console.log('🔧 Tool call:', ev);
  }
  if (ev.type.includes('handoff')) {
    console.log('🔄 Agent handoff:', ev);
  }
});
```

#### **Backend Debugging**

**Tool Execution Logging:**
```typescript
execute: async (input, details) => {
  console.log('🔧 Tool called:', {
    name: 'lookupOrder',
    input,
    conversationHistory: (details?.context as any)?.history?.length || 0,
    activeAgent: details?.agentName
  });
  
  try {
    const result = await yourBusinessLogic(input);
    console.log('✅ Tool result:', result);
    return result;
  } catch (error) {
    console.error('❌ Tool error:', error);
    return { error: 'Unable to process request' };
  }
}
```

**Agent Instruction Debugging:**
```typescript
// Temporary debug mode for agents
instructions: `
${yourMainInstructions}

# DEBUG MODE (remove in production)
- Always explain your reasoning: "I'm thinking..."
- Confirm understanding: "I understand you want to..."  
- Announce actions: "I'm going to call the lookup tool because..."
- State what you learned: "From that tool call, I learned..."
`
```

#### **Network Debugging**

**API Call Monitoring:**
- `/api/session` - Session creation and ephemeral keys
- `/api/responses` - Supervisor agent calls (Chat-Supervisor pattern)
- WebRTC signaling events in Network tab

**Session Debugging:**
```typescript
// Monitor session state changes
useEffect(() => {
  console.log('Session status changed:', sessionStatus);
  if (sessionStatus === 'connected') {
    console.log('Active agents:', selectedAgentConfigSet?.map(a => a.name));
    console.log('Current agent:', selectedAgentName);
  }
}, [sessionStatus, selectedAgentName]);
```

#### **Audio Debugging**

**WebRTC Diagnostics:**
```typescript
// Monitor audio streams
useEffect(() => {
  if (audioElement) {
    audioElement.addEventListener('loadstart', () => {
      console.log('🔊 Audio loading started');
    });
    
    audioElement.addEventListener('canplay', () => {
      console.log('🔊 Audio ready to play');
    });
    
    audioElement.addEventListener('error', (e) => {
      console.error('🔊 Audio error:', e);
    });
  }
}, [audioElement]);
```

**Recording State Monitoring:**
```typescript
// Track recording status
useEffect(() => {
  console.log('Recording state:', {
    isRecording,
    recordedChunks: recordedChunks.length,
    audioElement: !!audioElement
  });
}, [isRecording, recordedChunks.length]);
```

---

## Creating New Agents

### Step 1: Design Your Agent System

**Questions to Answer**:
- What user intents will you handle?
- Do you need multiple specialists or one generalist?
- What tools/integrations are required?
- What's the conversation flow?

### Step 2: Create Agent Configuration

```bash
# Create new agent directory
mkdir src/app/agentConfigs/myNewAgent
touch src/app/agentConfigs/myNewAgent/index.ts
```

### Step 3: Define Your Agents

```typescript
// src/app/agentConfigs/myNewAgent/index.ts
import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Example: Technical support agent
const techSupportAgent = new RealtimeAgent({
  name: 'techSupport',
  voice: 'sage',
  handoffDescription: 'Technical support specialist for troubleshooting',
  
  instructions: `
    # Identity
    You are a helpful technical support specialist.
    
    # Personality
    - Patient and thorough
    - Uses simple, non-technical language
    - Always confirms understanding
    
    # Process
    1. Understand the technical issue
    2. Ask clarifying questions
    3. Provide step-by-step solutions
    4. Confirm resolution
    
    # When to Transfer
    - Complex hardware issues → transfer to hardware specialist
    - Billing questions → transfer to billing agent
  `,
  
  tools: [
    tool({
      name: 'searchKnowledgeBase',
      description: 'Search technical documentation for solutions',
      parameters: {
        type: 'object',
        properties: {
          issue: { type: 'string', description: 'Description of technical issue' },
          category: { type: 'string', enum: ['software', 'hardware', 'network'] }
        },
        required: ['issue', 'category']
      },
      execute: async (input) => {
        const { issue, category } = input;
        // Your knowledge base search logic
        return {
          solutions: [
            { title: 'Solution 1', steps: ['Step 1', 'Step 2'] },
            { title: 'Solution 2', steps: ['Alternative approach'] }
          ]
        };
      }
    })
  ],
  
  handoffs: [] // Will add other agents later
});

export const myNewAgentScenario = [techSupportAgent];
```

### Step 4: Register Your Agent

```typescript
// src/app/agentConfigs/index.ts
import { myNewAgentScenario } from './myNewAgent';

export const allAgentSets: Record<string, RealtimeAgent[]> = {
  simpleHandoff: simpleHandoffScenario,
  customerServiceRetail: customerServiceRetailScenario,
  chatSupervisor: chatSupervisorScenario,
  myNewAgent: myNewAgentScenario, // Add your agent here
};
```

### Step 5: Test Your Agent

1. Restart development server
2. Select "myNewAgent" from scenario dropdown
3. Test voice interactions
4. Iterate on instructions and tools

### Step 6: Advanced Features

**Add Multiple Agents with Handoffs**:
```typescript
const routingAgent = new RealtimeAgent({
  name: 'router',
  instructions: 'Route users to appropriate specialists',
  handoffs: [techSupportAgent, billingAgent, salesAgent]
});

const billingAgent = new RealtimeAgent({
  name: 'billing', 
  instructions: 'Handle billing and payment issues',
  handoffs: [techSupportAgent, salesAgent]
});

// Create bidirectional handoffs
techSupportAgent.handoffs = [billingAgent, salesAgent];

export const myNewAgentScenario = [routingAgent, techSupportAgent, billingAgent];
```

**Add Complex Tools**:
```typescript
const complexTool = tool({
  name: 'escalateToHuman',
  description: 'Escalate complex issues to human support',
  parameters: {
    type: 'object',
    properties: {
      severity: { type: 'string', enum: ['low', 'medium', 'high'] },
      summary: { type: 'string', description: 'Brief issue summary' },
      customerInfo: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          phone: { type: 'string' }
        }
      }
    },
    required: ['severity', 'summary']
  },
  execute: async (input, details) => {
    const { severity, summary, customerInfo } = input;
    const history = (details?.context as any)?.history ?? [];
    
    // Create support ticket
    const ticket = await createSupportTicket({
      severity,
      summary,
      customerInfo,
      conversationHistory: history
    });
    
    return {
      ticketId: ticket.id,
      estimatedWaitTime: '5-10 minutes',
      message: 'A human agent will contact you shortly'
    };
  }
});
```

---

## Debugging & Troubleshooting

### Common Issues

**1. Agent Not Responding**
```typescript
// Check agent instructions are clear
instructions: `
# Clear task definition needed
You are a [specific role] who helps with [specific tasks].

# Clear decision boundaries  
When user asks about X → do Y
When user asks about Z → transfer to agent W
`
```

**2. Handoffs Not Working**
```typescript
// Verify handoffs array is populated
agent1.handoffs = [agent2, agent3]; // ✅ Correct
agent1.handoffs = []; // ❌ No handoffs available

// Check handoff descriptions are clear
handoffDescription: 'Handles billing and payment issues' // ✅ Clear
handoffDescription: 'Helper agent' // ❌ Too vague
```

**3. Tools Not Being Called**
```typescript
// Make sure tool descriptions are specific
description: 'Look up customer order by phone number' // ✅ Clear when to use
description: 'Helpful function' // ❌ Agent won't know when to call

// Check required parameters are documented
parameters: {
  type: 'object',
  properties: {
    phone: { 
      type: 'string', 
      description: 'Phone number in format (xxx) xxx-xxxx', // ✅ Clear format
      pattern: '^\\(\\d{3}\\) \\d{3}-\\d{4}$' // ✅ Validation
    }
  },
  required: ['phone'] // ✅ Required fields specified
}
```

**4. Environment Issues**
```bash
# Check environment file path
# src/app/lib/envSetup.ts should have:
dotenv.config({path: './.env'}); // ✅ Correct
dotenv.config({path: './env'});  // ❌ Wrong path

# Verify API key is set
echo $OPENAI_API_KEY
# Should show your key, not empty
```

### Debugging Techniques

**1. Add Console Logging**
```typescript
export const debugTool = tool({
  name: 'debugHelper',
  description: 'Debug tool to understand context',
  parameters: { type: 'object', properties: {} },
  execute: async (input, details) => {
    console.log('Current context:', details?.context);
    console.log('Conversation history:', (details?.context as any)?.history);
    return { debug: 'Check console for context info' };
  }
});
```

**2. Monitor WebRTC Events**
- Open browser dev tools
- Watch the Events panel (right side of UI)
- Look for `response.function_call_delta` events
- Check for `session.updated` events during handoffs

**3. Test Tool Logic Separately**
```typescript
// Test your tool logic outside the agent
const testInput = { phone: '(555) 123-4567' };
const result = await myTool.execute(testInput, mockContext);
console.log('Tool result:', result);
```

**4. Validate Agent Instructions**
```typescript
// Add this to your agent during development
instructions: `
${yourMainInstructions}

# DEBUG MODE
- Always explain your reasoning before taking actions
- Say "I'm thinking about..." before making decisions  
- Confirm your understanding: "I understand you want to..."
`
```

---

## Best Practices

### 1. Agent Design

**Clear Identity & Purpose**
```typescript
instructions: `
# Identity ✅
You are Sarah, a friendly customer service agent specializing in product returns.

# Vague identity ❌  
You are a helpful assistant.
```

**Specific Behavioral Guidelines**
```typescript
instructions: `
# Personality
- Warm and empathetic tone
- Use filler words occasionally ("um", "let me see")  
- Pace: medium speed with brief pauses
- Always confirm spelling of names and numbers

# Process
1. Greet warmly and ask how you can help
2. Collect necessary information systematically  
3. Explain each step before taking action
4. Summarize decisions and next steps
`
```

**Clear Decision Boundaries**
```typescript
instructions: `
# What I Handle
- Product returns and exchanges
- Return policy questions
- Order status lookups

# When to Transfer
- New purchases → transfer to sales agent
- Billing issues → transfer to billing agent  
- Complaints/escalations → transfer to manager agent
`
```

### 2. Tool Design

**Descriptive Names and Descriptions**
```typescript
// ✅ Good tool design
tool({
  name: 'lookupCustomerOrderByPhone',
  description: 'Find customer order details using their phone number. Use this when customer mentions an order or wants to return/exchange items.',
  // ...
})

// ❌ Poor tool design  
tool({
  name: 'lookup',
  description: 'Looks up stuff',
  // ...
})
```

**Robust Input Validation**
```typescript
parameters: {
  type: 'object',
  properties: {
    phone: {
      type: 'string',
      description: 'Customer phone number in format (xxx) xxx-xxxx',
      pattern: '^\\(\\d{3}\\) \\d{3}-\\d{4}$'
    },
    orderDate: {
      type: 'string', 
      description: 'Order date in YYYY-MM-DD format',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$'
    }
  },
  required: ['phone'],
  additionalProperties: false
}
```

**Error Handling**
```typescript
execute: async (input) => {
  try {
    const result = await externalAPI.lookup(input.phone);
    
    if (!result) {
      return { 
        error: 'No order found for this phone number',
        suggestion: 'Please verify the phone number or try a different contact method'
      };
    }
    
    return { order: result };
    
  } catch (error) {
    console.error('Order lookup failed:', error);
    return { 
      error: 'Unable to look up order at this time',
      suggestion: 'Please try again in a few minutes or contact support'
    };
  }
}
```

### 3. Handoff Design

**Clear Handoff Descriptions**
```typescript
// ✅ Specific and actionable
handoffDescription: 'Billing specialist who handles payment issues, refunds, and account charges. Route here for billing disputes, payment failures, or account balance questions.'

// ❌ Too vague
handoffDescription: 'Helpful billing agent'
```

**Logical Agent Graphs**
```typescript
// ✅ Bidirectional handoffs where it makes sense
authAgent.handoffs = [returnsAgent, salesAgent, billingAgent];
returnsAgent.handoffs = [authAgent, billingAgent]; // Can go back to auth or escalate to billing
salesAgent.handoffs = [authAgent, billingAgent];   // Similar paths

// ❌ Confusing handoff patterns
authAgent.handoffs = [returnsAgent];
returnsAgent.handoffs = [salesAgent]; // Dead end - can't get back to auth
```

### 4. Instruction Writing

**Use Specific Examples**
```typescript
instructions: `
# Greeting Examples
- "Hi there! I'm Sarah from the returns department. How can I help you today?"
- "Hello! This is Sarah. I understand you'd like to return something?"

# Confirmation Examples  
- "Let me confirm that phone number: (5-5-5) 1-2-3-4-5-6-7. Is that correct?"
- "So you purchased the Alpine Snowboard on December 15th, and it arrived damaged. Is that right?"
`
```

**State Machine Patterns**
```typescript
instructions: `
# Conversation Flow
1. Greeting - Warm welcome and offer help
2. Information Collection - Gather order details systematically
3. Issue Understanding - Understand the specific problem  
4. Solution Proposal - Offer appropriate resolution
5. Confirmation - Confirm next steps and timeline

# Transitions
- After step 2, if no order found → ask for alternative lookup method
- After step 4, if customer unsatisfied → transfer to manager
- After step 5 → conversation complete, offer additional help
`
```

### 5. Performance Optimization

**Cost Management**
```typescript
// Use cheaper models where appropriate
const basicChatAgent = new RealtimeAgent({
  // For simple routing/info collection, use realtime-mini
  model: 'gpt-4o-realtime-mini', 
  instructions: 'Simple routing logic...'
});

const complexSupervisor = {
  // For complex reasoning, use full model
  model: 'gpt-4.1',
  instructions: 'Complex business logic...'
};
```

**Minimize Context Length**
```typescript
// Keep instructions focused and concise
instructions: `
# Core Task
Handle product returns efficiently.

# Key Process
1. Verify order → 2. Understand issue → 3. Process return

# Transfer Rules  
- Billing issues → billing agent
- New purchases → sales agent
`
```

---

## Production Considerations

### Performance Optimization

#### **Cost Management Strategies**

**Model Selection by Complexity:**
```typescript
// Use cheaper models for simple tasks
const routingAgent = new RealtimeAgent({
  // For basic routing/info collection
  model: 'gpt-4o-realtime-mini', // Lower cost
  instructions: 'Simple routing logic...'
});

// Reserve powerful models for complex reasoning
const supervisorAgent = {
  model: 'gpt-4.1', // Higher intelligence
  instructions: 'Complex business logic...'
};
```

**Instruction Optimization:**
```typescript
// Keep instructions focused and concise
instructions: `
# Core Task: Handle product returns efficiently
# Key Process: 1. Verify order → 2. Understand issue → 3. Process return
# Transfer Rules: Billing → billing agent, New purchases → sales agent
`

// Avoid verbose instructions that increase token usage
```

#### **Latency Optimization**

**Streaming Response Strategy:**
```typescript
// Immediate acknowledgment while processing
instructions: `
When calling tools that take time:
1. Immediately respond: "Let me look that up for you"
2. Call the tool
3. Provide results when available

Use filler phrases: "Just a moment", "Let me check", "One second"
`
```

**Efficient Tool Design:**
```typescript
// Minimize tool execution time
execute: async (input) => {
  // Use connection pooling
  const db = getPooledConnection();
  
  // Implement timeouts
  const result = await Promise.race([
    db.query(input.query),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    )
  ]);
  
  return result;
}
```

### Security & Privacy

#### **Data Handling Best Practices**

**Sensitive Information Management:**
```typescript
// Never log sensitive data
execute: async (input) => {
  const sanitizedInput = {
    ...input,
    ssn: input.ssn ? '***-**-' + input.ssn.slice(-4) : undefined,
    creditCard: input.creditCard ? '****-****-****-' + input.creditCard.slice(-4) : undefined
  };
  console.log('Tool called with:', sanitizedInput);
}
```

**Session Security:**
```typescript
// Implement session timeouts
useEffect(() => {
  const timeout = setTimeout(() => {
    if (sessionStatus === 'connected') {
      disconnectFromRealtime();
      alert('Session expired for security');
    }
  }, 30 * 60 * 1000); // 30 minutes

  return () => clearTimeout(timeout);
}, [sessionStatus]);
```

#### **Guardrail Implementation**

**Content Moderation:**
```typescript
export const customGuardrail = {
  name: 'business_policy_guardrail',
  async execute({ agentOutput }: { agentOutput: string }) {
    // Check for business policy violations
    const violations = [
      { pattern: /competitor/i, category: 'COMPETITOR_MENTION' },
      { pattern: /refund.*100%/i, category: 'UNAUTHORIZED_PROMISE' }
    ];
    
    for (const violation of violations) {
      if (violation.pattern.test(agentOutput)) {
        return {
          tripwireTriggered: true,
          category: violation.category,
          replacement: '[Response filtered - policy violation]'
        };
      }
    }
    
    return { tripwireTriggered: false };
  }
};
```

### Scalability Patterns

#### **Multi-Tenant Architecture**

```typescript
// Tenant-specific agent configurations
const createTenantAgent = (tenantConfig: TenantConfig) => {
  return new RealtimeAgent({
    name: 'customerService',
    instructions: `
      Company: ${tenantConfig.companyName}
      Products: ${tenantConfig.products.join(', ')}
      Policies: ${tenantConfig.policies}
      Brand Voice: ${tenantConfig.brandVoice}
    `,
    tools: tenantConfig.enabledTools,
    handoffs: tenantConfig.agentFlow
  });
};
```

#### **Load Balancing Considerations**

```typescript
// Distribute session creation across regions
const getOptimalEndpoint = async () => {
  const endpoints = [
    'https://api.openai.com/v1/realtime/sessions',
    'https://api-eu.openai.com/v1/realtime/sessions'
  ];
  
  // Route based on user location or load
  return selectEndpointByLatency(endpoints);
};
```

#### **Monitoring & Analytics**

```typescript
// Track agent performance
const logAgentMetrics = (agentName: string, interaction: any) => {
  analytics.track('agent_interaction', {
    agent: agentName,
    duration: interaction.duration,
    toolsCalled: interaction.tools.length,
    handoffs: interaction.handoffs.length,
    userSatisfaction: interaction.rating,
    timestamp: new Date().toISOString()
  });
};
```

## Advanced Topics

### 1. Custom Supervisor Patterns

Create your own chat-supervisor implementation:

```typescript
const customSupervisorTool = tool({
  name: 'consultExpert',
  description: 'Get expert guidance for complex medical questions',
  parameters: {
    type: 'object',
    properties: {
      question: { type: 'string', description: 'The medical question needing expert input' },
      patientContext: { type: 'string', description: 'Relevant patient information' }
    },
    required: ['question']
  },
  execute: async (input, details) => {
    const response = await fetch('/api/expert-consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          {
            role: 'system',
            content: 'You are a medical expert providing guidance to healthcare assistants...'
          },
          {
            role: 'user', 
            content: `Question: ${input.question}\nContext: ${input.patientContext || 'None provided'}`
          }
        ],
        tools: medicalTools // Your specialized tools
      })
    });
    
    const result = await response.json();
    return { expertGuidance: result.content };
  }
});
```

### 2. External Integrations

**Database Integration**
```typescript
import { DatabaseClient } from './lib/database';

const dbTool = tool({
  name: 'lookupCustomerRecord',
  description: 'Retrieve customer information from CRM',
  parameters: {
    type: 'object',
    properties: {
      customerId: { type: 'string' },
      email: { type: 'string' }
    }
  },
  execute: async (input) => {
    const db = new DatabaseClient();
    const customer = await db.customers.findUnique({
      where: { 
        id: input.customerId || undefined,
        email: input.email || undefined
      },
      include: { orders: true, tickets: true }
    });
    
    return {
      customer: customer ? {
        name: customer.name,
        tier: customer.tier,
        recentOrders: customer.orders.slice(0, 3),
        openTickets: customer.tickets.filter(t => t.status === 'open')
      } : null
    };
  }
});
```

**API Integration**
```typescript
const inventoryTool = tool({
  name: 'checkProductAvailability',
  description: 'Check if product is in stock',
  parameters: {
    type: 'object',
    properties: {
      productId: { type: 'string' },
      quantity: { type: 'number', minimum: 1 }
    },
    required: ['productId']
  },
  execute: async (input) => {
    const response = await fetch(`${process.env.INVENTORY_API_URL}/products/${input.productId}/availability`, {
      headers: {
        'Authorization': `Bearer ${process.env.INVENTORY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      return { error: 'Unable to check inventory at this time' };
    }
    
    const data = await response.json();
    return {
      available: data.stock > (input.quantity || 1),
      stockLevel: data.stock,
      estimatedRestock: data.restockDate
    };
  }
});
```

### 3. Custom Session Management

**Extended Context**
```typescript
// In your React component
const client = new RealtimeClient({
  getEphemeralKey: async () => {
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: currentUser?.id,
        sessionMetadata: {
          source: 'web-app',
          page: window.location.pathname,
          userAgent: navigator.userAgent
        }
      })
    });
    return response.text();
  },
  initialAgents: agents,
  extraContext: {
    customerId: currentUser?.id,
    userTier: currentUser?.tier,
    recentActivity: userActivity
  }
});
```

**Session Persistence**
```typescript
// api/session/route.ts
export async function POST(request: Request) {
  const { customerId, sessionMetadata } = await request.json();
  
  // Store session in database
  const session = await db.session.create({
    data: {
      customerId,
      metadata: sessionMetadata,
      createdAt: new Date()
    }
  });
  
  // Create OpenAI session with custom context
  const response = await openai.beta.realtime.sessions.create({
    model: 'gpt-4o-realtime-preview',
    instructions: 'Base instructions...',
    context: {
      sessionId: session.id,
      customerId,
      ...sessionMetadata
    }
  });
  
  return new Response(response.client_secret.value);
}
```

### 4. Advanced Agent Coordination

**Multi-Step Workflows**
```typescript
const workflowAgent = new RealtimeAgent({
  name: 'workflow',
  instructions: `
    You coordinate complex multi-step processes.
    
    # Workflow States
    - COLLECTING_INFO: Gathering required information
    - VALIDATING: Checking information accuracy  
    - PROCESSING: Executing the main task
    - CONFIRMING: Getting final approval
    - COMPLETED: Process finished
    
    Track workflow state and guide user through each step.
  `,
  tools: [
    tool({
      name: 'updateWorkflowState',
      description: 'Update the current workflow state',
      parameters: {
        type: 'object',
        properties: {
          state: { type: 'string', enum: ['COLLECTING_INFO', 'VALIDATING', 'PROCESSING', 'CONFIRMING', 'COMPLETED'] },
          data: { type: 'object', description: 'Workflow data collected so far' }
        },
        required: ['state']
      },
      execute: async (input, details) => {
        // Update workflow state in context
        const context = details?.context as any;
        context.workflowState = input.state;
        context.workflowData = { ...context.workflowData, ...input.data };
        
        return { 
          currentState: input.state,
          nextSteps: getNextSteps(input.state)
        };
      }
    })
  ]
});
```

---

## Resources

### Documentation
- [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-realtime)
- [Next.js Documentation](https://nextjs.org/docs)
- [WebRTC Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

### Example Prompts
- `src/app/agentConfigs/voiceAgentMetaprompt.txt` - Comprehensive prompt template
- [Voice Agent Metaprompter GPT](https://chatgpt.com/g/g-678865c9fb5c81918fa28699735dd08e-voice-agent-metaprompt-gpt)

### Code References
- **Authentication Flow**: `src/app/agentConfigs/customerServiceRetail/authentication.ts`
- **Tool Implementation**: `src/app/agentConfigs/customerServiceRetail/returns.ts` 
- **Handoff Logic**: `src/app/agentConfigs/customerServiceRetail/index.ts`
- **Session Management**: `src/app/agentConfigs/realtimeClient.ts`
- **UI Integration**: `src/app/App.tsx`

### Community
- [OpenAI Developer Forum](https://community.openai.com/)
- [GitHub Issues](https://github.com/openai/openai-realtime-agents/issues)

---

## Next Steps

1. **Explore Existing Agents**: Start by testing the three provided scenarios
2. **Modify Instructions**: Try changing agent personalities and behaviors  
3. **Add Simple Tools**: Create basic tools for your use case
4. **Design Agent Flow**: Plan your multi-agent handoff strategy
5. **Build & Test**: Create your custom agent scenario
6. **Deploy**: Consider production deployment strategies

---

*This onboarding guide covers the essential concepts for developing with the OpenAI Advanced Agent Example. As you build more complex agents, refer back to the best practices and advanced topics sections for guidance.*