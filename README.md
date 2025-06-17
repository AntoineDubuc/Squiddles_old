<div align="center">
  <img src="public/images/squiddles_logo.png" alt="Squiddles Logo" width="200"/>
  
  # 🦑 Squiddles - Voice-Activated Multi-Agent System
  
  **Official Developer Onboarding Guide**
</div>

Squiddles is a voice-activated multi-agent web system that provides a unified project management interface through natural voice conversation. Built with Next.js 15 and OpenAI's Realtime API, it targets technical product managers and software development teams.

Each "tentacle" represents a specialized AI agent that can handle different aspects of project management - from Jira ticket management to Slack communications, all controlled through natural voice commands.

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- **Node.js** 18.17+ and **npm**
- **OpenAI API Key** with Realtime API access ([Get here](https://platform.openai.com))
- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)

### Setup
```bash
# 1. Clone and install
git clone <your-repo-url>
cd squiddles
npm install

# 2. Environment setup
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local

# 3. Start development server
npm run dev
# → http://localhost:8888

# 4. Wait for full compilation (IMPORTANT!)
# - First startup takes 15-20 seconds
# - Wait for "✓ Compiled / in Xms" message
# - Don't navigate to localhost:8888 until compilation is complete

# 5. Test the voice interface
# - Dashboard loads automatically
# - Click voice button → grant microphone permission  
# - Say "Create a user story for user authentication"
```

**That's it!** You now have a working voice-powered dashboard.

### ⚠️ Important Startup Notes
- **First startup**: Allow 15-20 seconds for Next.js to compile all modules
- **Ready vs Compiled**: Server says "Ready" but isn't accessible until "Compiled" appears
- **Environment file**: Must be `.env.local` (not `.env`) for Next.js applications

---

## 🏗️ Architecture Overview

### What You're Working On
Squiddles is a **voice-first dashboard** that lets product managers interact with their tools through natural conversation. Think "Hey Siri" but for project management.

**Current State**: Working voice interface + glass-themed dashboard with plans for Jira/Slack integration.

### Core Application Flow
```
🏠 Dashboard (default view)
└── Glass-themed PM dashboard with metrics, activity feed, mentions

🎙️ Voice Interface  
└── Real-time conversation with OpenAI agents
    ├── Live transcript streaming
    ├── Event logging (debugging)
    └── Content moderation
```

### Technical Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Voice**: OpenAI Realtime API with WebRTC
- **Architecture**: Multi-agent system with handoffs
- **Styling**: CSS-in-JS (inline styles matching mockups)

---

## 📁 Codebase Architecture

### **Active Core Application** (`src/` - 18 files)

Your actual working application consists of these essential files:

```
src/
├── app/
│   ├── layout.tsx                    ← Root layout with providers
│   ├── page.tsx                      ← Main app (routes Dashboard ↔ Voice)
│   ├── test-direct/page.tsx          ← Direct dashboard test
│   ├── components/                   ← UI Components (5 files)
│   │   ├── Dashboard.tsx             ← Main dashboard (glass-themed)
│   │   ├── VoiceInterface.tsx        ← Voice conversation UI
│   │   ├── Transcript.tsx            ← Real-time conversation display
│   │   ├── Events.tsx                ← Debug events panel
│   │   └── BottomToolbar.tsx         ← Voice controls
│   ├── contexts/                     ← State Management (2 files)
│   │   ├── TranscriptContext.tsx     ← Conversation state
│   │   └── EventContext.tsx          ← Event logging state
│   ├── lib/                          ← Voice System (2 files)
│   │   ├── realtimeClient.ts         ← OpenAI Realtime API client
│   │   └── guardrails.ts             ← Content moderation
│   ├── api/                          ← Server APIs (2 files)
│   │   ├── session/route.ts          ← OpenAI session creation
│   │   └── responses/route.ts        ← Guardrails API endpoint
│   └── types.ts                      ← Core TypeScript definitions
├── agents/                           ← AI Agents (2 files)
│   ├── index.ts                      ← Agent registry
│   └── minimalProductManager.ts      ← Active voice agent
└── lib/                             ← Authentication (2 files)
    ├── auth.ts                       ← Mock authentication
    └── mock-data/users.ts            ← Development user data
```

### **Development Archive** (`development-archive/`)

Extensive experimental infrastructure ready for integration:

```
development-archive/
├── experimental/                     ← Ready-to-integrate code
│   ├── components/                   ← Advanced UI components
│   │   ├── VoiceDemo.tsx            ← Voice component showcase
│   │   ├── VoiceInput.tsx           ← Alternative voice widget
│   │   └── dashboard/               ← Modular dashboard pieces
│   ├── api/                         ← Complete service integrations
│   │   ├── jira/                    ← Full Jira API integration
│   │   ├── pinecone/                ← Vector search system
│   │   ├── tickets/                 ← Ticket management
│   │   └── auth/                    ← Authentication system
│   ├── agents/                      ← Specialized AI agents
│   │   ├── productManager.ts        ← Full-featured PM agent
│   │   ├── jiraIntegration.ts       ← Jira ticket creation
│   │   └── slackIntegration.ts      ← Slack messaging
│   └── types/                       ← Comprehensive TypeScript defs
├── integrations/                    ← Service libraries
├── reference/                       ← Design materials & research
└── planning/                        ← Project management materials
```

---

## 🎙️ Voice System Deep Dive

### How Voice Works
1. **Session Start**: `page.tsx` → `/api/session` → OpenAI ephemeral key
2. **WebRTC**: `realtimeClient.ts` establishes real-time audio connection
3. **Agents**: `minimalProductManager.ts` processes voice commands
4. **Guardrails**: `guardrails.ts` moderates AI responses via `/api/responses`
5. **UI Updates**: Live transcript streaming via React contexts

### Agent System
```typescript
// Current: Single minimal agent
defaultAgentSetKey = 'minimal'  // → minimalProductManager.ts

// Available agents (in development-archive/experimental/agents/):
- productManager.ts     ← Full-featured PM agent  
- jiraIntegration.ts    ← Jira ticket creation
- slackIntegration.ts   ← Slack messaging
```

### Voice Commands That Work
```
"Create a user story for user authentication"
"Help me write a product requirements document"  
"What should I work on next?"
```

---

## 🛠️ Development Workflow

### Daily Development
```bash
npm run dev              # Start development (port 8888)
npm run build            # Production build
npm run lint             # Code quality check
```

### Making Changes

**Dashboard Changes**:
- Edit `src/app/components/Dashboard.tsx`
- Uses inline CSS-in-JS styles (matches mockups exactly)

**Voice Changes**:
- Agent behavior: `src/agents/minimalProductManager.ts`
- UI: `src/app/components/VoiceInterface.tsx`
- Real-time logic: `src/app/lib/realtimeClient.ts`

**Adding New Features**:
- Most infrastructure already exists in `development-archive/experimental/`
- Copy relevant files to `src/` and update imports

### Code Quality
```bash
# Before committing
npm run lint             # ESLint checking
npm run build            # Verify build success

# Git workflow
git checkout -b feature/your-feature
# Make changes...
npm run lint && npm run build
git commit -m "feat: your change description"
```

---

## 🔧 Common Development Tasks

### Adding a New Voice Command
```typescript
// Edit src/agents/minimalProductManager.ts
const newTool = tool({
  name: 'yourCommand',
  description: 'What it does',
  parameters: { /* schema */ },
  execute: async (input) => {
    // Your logic here
    return { success: true, result: 'Done!' };
  }
});

// Add to agent tools array
tools: [existingTool, newTool]
```

### Adding Dashboard Features
```typescript
// Edit src/app/components/Dashboard.tsx
// Add your JSX with inline CSS-in-JS styling
// Follow existing mockup patterns
```

### Integrating Experimental Features
```bash
# Copy from development-archive
cp development-archive/experimental/components/VoiceInput.tsx src/app/components/
# Update imports and add to component tree
```

### Voice Testing
```bash
# Automated testing framework
cd development-archive/planning/testing-framework
npm install
npm run generate-audio   # Creates test audio files
npm run test:voice       # Automated voice tests
```

---

## ⚙️ Environment Configuration

### Required Environment Variables
Create `.env.local` with:

```bash
# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here

# Optional integrations (for future features)
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name

SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_APP_TOKEN=xapp-your-slack-app-token
```

### Getting API Keys

**OpenAI API Key** (Required):
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys section
3. Create a new key with Realtime API access
4. **Important**: Your account must have access to the Realtime API preview

**Jira** (Optional, for future integration):
1. Go to [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Create a new API token
3. Use your Atlassian email and the generated token

---

## 🚨 Troubleshooting

### Voice Not Working
```bash
# Check browser console for errors
# Verify OPENAI_API_KEY in .env.local
# Try different browser (Chrome recommended)
# Check microphone permissions
```

### Build Errors
```bash
npm run lint              # Check for TypeScript/ESLint issues
rm -rf .next node_modules # Clean cache
npm install               # Reinstall dependencies
```

### Microphone Access Issues
- Click "Allow" when prompted for microphone permissions
- Check browser's site permissions for localhost:8888
- Ensure no other application is using the microphone
- Try refreshing the page and granting permissions again

### WebRTC Connection Issues
- Ensure you're accessing via `http://localhost:8888` (not `127.0.0.1`)
- Check that your browser supports WebRTC
- Try disabling browser extensions that might block WebRTC

---

## 🎯 Development Priorities

### Current Focus
1. **Voice Reliability**: Improve conversation flow and agent responses
2. **Dashboard Polish**: Enhance UI/UX based on user feedback  
3. **Agent Intelligence**: Better user story creation and natural language understanding

### Next Phase (Experimental → Production)
1. **Jira Integration**: Move from `development-archive/experimental/api/jira/` to active
2. **Advanced Dashboard**: Integrate modular components from `development-archive/experimental/components/dashboard/`
3. **Multi-Agent System**: Enable agent handoffs between PM, Jira, and Slack agents

---

## 📚 Important Development Notes

### CSS Styling
- **Current**: Inline CSS-in-JS in `Dashboard.tsx`
- **Reason**: Matches HTML mockups exactly
- **Don't**: Add separate CSS files (will break styling)

### Voice System
- **Don't**: Modify `realtimeClient.ts` without understanding WebRTC
- **Do**: Focus on agent behavior and UI components
- **Remember**: Always test with real voice, not just code

### Port Configuration
- **Development**: `localhost:8888` (not 3000)
- **Reason**: Avoids conflicts with other Next.js projects

### Project Architecture
- **Active Code**: Only edit files in `src/` for production features
- **Experimental**: Use `development-archive/experimental/` for new features
- **Testing**: Use `development-archive/planning/testing-framework/` for voice testing

---

## 📖 Additional Resources

- **Architecture Deep Dive**: `development-archive/reference/docs/`
- **Voice Testing**: `development-archive/planning/testing-framework/`
- **UI Mockups**: `development-archive/reference/mockups/`
- **OpenAI Reference**: `development-archive/reference/research/`
- **API Documentation**: `development-archive/experimental/api/`

### External Documentation
- [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review `development-archive/reference/docs/TROUBLESHOOTING.md`
3. Check existing GitHub issues
4. Create a new issue with detailed information

---

## 🎉 Welcome to the Team!

You now have:
- ✅ **Working voice-powered dashboard** (18 core files)
- ✅ **Comprehensive experimental infrastructure** (ready to integrate)
- ✅ **Complete development environment** (testing, docs, examples)
- ✅ **Clear development workflow** (active vs experimental code)

**Focus on the core 18-file active codebase first**, then explore the experimental archive when ready to add new features.

Built with ❤️ for technical product managers and development teams. 🦑