# V2R Voice Assistant - Project Architecture

## Project Overview

V2R is a browser-based voice assistant that converts meeting discussions into Jira user stories through natural conversation. This document outlines the clean, focused architecture aligned with our conservative PRD.

## Folder Structure

```
/Users/antoinedubuc/Squiddles/
├── README.md              # Project overview and quick start
├── package.json           # Dependencies and scripts
├── vite.config.js         # Build configuration
├── index.html             # Main HTML entry point
├── .gitignore             # Git ignore patterns
│
├── src/                   # Source code
│   ├── main.js           # Application entry point
│   ├── styles.css        # Global styles
│   ├── components/       # UI components (VoiceAssistant, etc.)
│   ├── utils/           # Utility functions (speech, API helpers)
│   └── api/             # API integration (OpenAI, Jira)
│
├── public/              # Static assets
├── tests/               # Test files
└── docs/                # Documentation
    ├── prd.md           # Product Requirements Document
    ├── CLAUDE.md        # Development guide for Claude Code
    ├── ideation.md      # Project ideation and expert discussions
    └── project-architecture.md  # This file
```

## Technology Stack

### Frontend
- **Vanilla JavaScript**: No framework overhead, direct Web API access
- **Web Speech API**: Browser-native speech recognition
- **Speech Synthesis API**: Browser-native text-to-speech
- **CSS**: Modern responsive design

### Backend/API
- **Serverless Functions**: Vercel/Netlify functions
- **OpenAI GPT-4**: Conversation logic and requirement extraction
- **Jira REST API**: Direct integration for story creation

### Build & Deploy
- **Vite**: Fast development and build tool
- **Vercel/Netlify**: Static site hosting with serverless functions
- **Git**: Version control

## Removed Files & Content

### Files Removed (Not Aligned with PRD)
- `whisper-documentation.md` - Not needed (using Web Speech API)
- `root_idea.md` - Original complex approach (superseded by PRD)

### Why These Were Removed
1. **whisper-documentation.md**: Contained extensive Whisper audio processing documentation, but our PRD uses browser Web Speech API instead
2. **root_idea.md**: Original complex Voice-to-Requirement system with audio file processing, transcription services, and complex infrastructure - replaced by simpler voice chatbot approach

## Key Architecture Decisions

### 1. Browser-First Approach
- No downloads or installations required
- Uses native browser APIs (Web Speech, Speech Synthesis)
- Works on desktop and mobile browsers

### 2. Serverless Backend
- Minimal infrastructure complexity
- Auto-scaling capabilities
- Cost-effective for startup phase

### 3. Progressive Enhancement
- Core functionality works without advanced features
- Graceful fallbacks when APIs fail
- Mobile-responsive design

### 4. Conservative Tech Choices
- Proven, stable technologies
- Wide browser support
- Minimal dependencies

## Development Phases

### Phase 1: MVP (Days 1-7)
**Target**: Basic voice interface + conversation + story generation

**Files to Create**:
- `src/components/VoiceAssistant.js` - Main voice interface component
- `src/utils/speechRecognition.js` - Web Speech API wrapper
- `src/utils/textToSpeech.js` - Speech synthesis wrapper
- `src/api/openai.js` - OpenAI API integration
- `src/api/jira.js` - Basic Jira export functionality

### Phase 2: Enhancement (Days 8-14)
**Target**: Jira integration + user accounts + conversation history

**Files to Add**:
- `src/components/RequirementsList.js` - Requirements display component
- `src/utils/storage.js` - Local storage management
- `src/api/auth.js` - User authentication
- `tests/` - Unit and integration tests

### Phase 3: Scale (Days 15-21)
**Target**: Performance optimization + marketing site + launch

**Files to Add**:
- `src/utils/analytics.js` - Usage tracking
- `src/components/OnboardingFlow.js` - User onboarding
- Marketing pages and documentation

## Alignment with PRD

This architecture directly supports all PRD requirements:

✅ **Browser-based voice interface** - Web Speech API integration  
✅ **Conversational AI** - OpenAI GPT-4 integration  
✅ **Real-time story generation** - Serverless API functions  
✅ **Jira export** - REST API integration  
✅ **No installation required** - Pure web application  
✅ **Mobile support** - Responsive design  
✅ **Conservative timeline** - 21-day development schedule  

## Next Steps

1. **Day 1**: Begin Phase 1 development with voice interface component
2. **Daily**: Follow development timeline in PRD
3. **Continuous**: Maintain alignment with conservative, achievable goals

This clean architecture ensures we can deliver on our PRD promises while maintaining development velocity and code quality.