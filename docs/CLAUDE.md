# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the planning and development for **Squiddles** - a Voice-to-Requirement (V2R) feature for an AI SDLC Agent. The system will transcribe stakeholder meetings and automatically convert verbal requirements into structured Jira user stories.

## Architecture

The planned system follows this workflow:
```
[Audio Input] → [Transcription] → [NLP Processing] → [Requirement Extraction] → 
[Conflict Detection] → [User Story Generation] → [Review Interface] → [Jira Integration]
```

**Core Components:**
- **Audio Input**: Zoom/Teams/Meet integrations + file upload
- **Transcription**: OpenAI Whisper API with speaker diarization
- **NLP Processing**: GPT-4 for extraction, spaCy for entity recognition
- **Storage**: Pinecone for vector similarity, Redis for queuing
- **API**: Node.js + Express backend
- **Frontend**: Next.js + Tailwind UI
- **Integration**: Jira Cloud REST API v3

## Development Status

Currently in **planning phase** - only contains the Product Requirements Document (`root_idea.md`). No code implementation exists yet.

## Key Requirements

- **Performance**: <30s per minute of audio processing, <10s per requirement extraction
- **Accuracy**: 95%+ transcription accuracy, 90%+ story approval without edits
- **Security**: OAuth2 with Jira permissions, encrypted audio storage, 30-day retention
- **Scalability**: Support 50+ concurrent processing jobs

## Implementation Phases

1. **MVP (Weeks 1-4)**: Core transcription + basic extraction + Jira integration
2. **Enhancement (Weeks 5-8)**: Conflict detection + meeting integrations
3. **Scale (Weeks 9-12)**: Advanced NLP + multi-language + batch processing

## Success Metrics

- 70% reduction in requirement documentation time
- 95% requirement capture rate
- 50% reduction in clarification cycles