# 🦑 Squiddles

**Multi-Agent SDLC Voice-Activated Web System**

A voice-activated web application that provides unified project visibility and control across developer tools (Jira, Confluence, Slack, Google Workspace) through natural conversation and intelligent visualization.

## 🎯 Project Vision

### The "Project Constellation" Concept
A voice-navigable unified view that connects project information scattered across multiple tools, eliminating context switching and providing complete project intelligence through conversation.

## 🏗️ Architecture

- **Voice Interface**: OpenAI Realtime API + WebRTC
- **UI Design**: Glass-themed, modern dark interface with gradient borders
- **Interaction**: Voice-first with keyboard shortcuts and visual fallbacks

### The Tentacle System
Multi-agent tools that integrate with external services:

1. **Tentacle 1 - Jira Integration**: CRUD operations on tickets, projects, sprints
2. **Tentacle 2 - Confluence Integration**: Documentation access and editing  
3. **Tentacle 3 - Slack Integration**: Team communication context
4. **Tentacle 4 - Google Workspace**: Document collaboration layer

## 🚀 Current Implementation

**Phase 1**: Technical Product Manager Voice Interface
- Target User: Antoine Dubuc (Technical Product Manager)
- Core Feature: AI-assisted user story creation
- Voice-driven template completion with Pinecone search for context
- Integration with Jira for ticket creation

## 📁 Project Structure

```
/
├── docs/                    # Architecture and development docs
├── mockups/                 # UI mockups and prototypes
├── research/                # Voice technology research
├── PRODUCT_STRATEGY.md      # Complete product strategy
├── master_checklist.md      # Development implementation guide
└── research.md              # Voice-to-LLM technology research
```

## 🎭 Target Personas

1. **Antoine Dubuc** - Technical Product Manager (Phase 1)
2. **Alex Chen** - Senior Developer
3. **Sarah Rodriguez** - Engineering Team Lead  
4. **Michael Chen** - Engineering Manager
5. **Casey Morgan** - Product Designer
6. **Jordan Kim** - Product Manager
7. **David Park** - QA Engineer

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Voice**: OpenAI Realtime API with WebRTC
- **Search**: Pinecone vector database
- **Integrations**: Jira, Confluence, Slack, Google Workspace APIs
- **AI**: GPT-4o Realtime + GPT-4.1 for complex reasoning

## 📋 Development Status

- [x] Product Strategy & Design Documentation
- [x] UI Mockups & Glass Theme Design
- [x] Technical Architecture Research
- [x] Development Master Checklist
- [ ] Next.js Project Setup (Phase 1)
- [ ] Voice Interface Implementation (Phase 2)
- [ ] Product Manager Agent (Phase 3)
- [ ] Pinecone & Jira Integration (Phase 4)

## 🎨 Design Philosophy

**"The Terminal for Voice"** - Function over form, voice-first interaction, terminal familiarity with modern glass aesthetics.

## 📚 Documentation

- [`PRODUCT_STRATEGY.md`](./PRODUCT_STRATEGY.md) - Complete product strategy and persona analysis
- [`master_checklist.md`](./master_checklist.md) - Step-by-step development guide
- [`docs/references/`](./docs/references/) - Technical architecture and tutorials
- [`research.md`](./research.md) - Voice technology landscape analysis

---

*Voice-activated development tools for the modern software team.*