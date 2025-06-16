# Squiddles - Voice-Activated Multi-Agent System

Squiddles is a voice-activated multi-agent web system that provides a unified project management interface through natural voice conversation. Built with Next.js 15 and OpenAI's Realtime API, it targets technical product managers and software development teams.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Key Features](#key-features)

## Prerequisites

Before setting up Squiddles, ensure you have the following installed:

- **Node.js** 18.17 or later
- **npm** (comes with Node.js)
- **Git**
- A modern web browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- **OpenAI API Key** with Realtime API access

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/squiddles.git
   cd squiddles
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials (see [Environment Variables](#environment-variables) section)

4. **Verify setup**
   ```bash
   npm run lint
   npm run build
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone Configuration (Optional - for search functionality)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name

# Jira Configuration (Optional - for Jira integration)
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token

# Slack Configuration (Optional - for Slack integration)
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_APP_TOKEN=xapp-your-slack-app-token

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting API Keys

- **OpenAI API Key**: 
  1. Go to [platform.openai.com](https://platform.openai.com)
  2. Navigate to API Keys section
  3. Create a new key with Realtime API access
  4. **Important**: Your account must have access to the Realtime API preview

- **Pinecone** (for vector search):
  1. Sign up at [pinecone.io](https://www.pinecone.io)
  2. Create a new project and index
  3. Copy your API key and environment details

- **Jira** (for ticket integration):
  1. Go to [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
  2. Create a new API token
  3. Use your Atlassian email and the generated token

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm run start
```

## Common Issues and Troubleshooting

### 1. OpenAI API Key Issues

**Problem**: "Invalid API key" or "Realtime API access denied"

**Solution**:
- Verify your API key is correctly set in `.env.local`
- Ensure your OpenAI account has access to the Realtime API preview
- Check that there are no extra spaces or quotes around the API key
- Try generating a new API key if the issue persists

### 2. CORS/WebRTC Connection Issues

**Problem**: "Failed to establish WebRTC connection" or CORS errors

**Solution**:
- Ensure you're accessing the app via `http://localhost:3000` (not `127.0.0.1`)
- Check that your browser supports WebRTC
- Try disabling browser extensions that might block WebRTC
- For production, ensure HTTPS is properly configured

### 3. Microphone Access

**Problem**: "Microphone access denied" or no audio input

**Solution**:
- Click "Allow" when prompted for microphone permissions
- Check your browser's site permissions for localhost:3000
- Ensure no other application is using the microphone
- Try refreshing the page and granting permissions again

### 4. Build Errors

**Problem**: TypeScript or ESLint errors during build

**Solution**:
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules .next
npm install

# Run type checking
npm run typecheck

# Fix linting issues
npm run lint -- --fix
```

### 5. Missing Dependencies

**Problem**: Module not found errors

**Solution**:
```bash
# Install all dependencies
npm install

# If specific module is missing
npm install [module-name]
```

## Development Workflow

### Code Quality Commands

```bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run typecheck

# Run tests (when available)
npm test

# Format code (if prettier is configured)
npm run format
```

### Git Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally

3. Run quality checks before committing:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   ```

5. Push and create a pull request

### Hot Reloading

The development server supports hot reloading:
- Changes to React components update instantly
- API route changes require a page refresh
- Environment variable changes require restarting the dev server

## Project Structure

```
squiddles/
├── src/
│   ├── agents/           # Agent implementations
│   │   ├── productManager.ts
│   │   ├── jiraIntegration.ts
│   │   └── slackIntegration.ts
│   ├── app/
│   │   ├── api/         # Next.js API routes
│   │   │   ├── session/route.ts    # WebRTC session endpoint
│   │   │   └── responses/route.ts  # Response handling
│   │   ├── components/  # React components
│   │   │   ├── BottomToolbar.tsx   # Voice controls
│   │   │   ├── Transcript.tsx      # Conversation display
│   │   │   └── Events.tsx          # Real-time events
│   │   ├── contexts/    # React contexts
│   │   ├── lib/         # Client utilities
│   │   └── page.tsx     # Main application page
│   └── lib/             # Shared utilities
├── public/              # Static assets
├── research/            # Reference implementations
├── testing-framework/   # Voice testing tools
├── .env.local          # Environment variables (create this)
├── .env.example        # Environment template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── next.config.js      # Next.js config
```

## Key Features

- **Voice-Activated Interface**: Natural voice conversations using OpenAI's Realtime API
- **Multi-Agent System**: Specialized agents for different tasks (PM, Jira, Slack, etc.)
- **Real-time Transcription**: Live conversation display with speaker identification
- **Context-Aware Search**: Pinecone integration for finding related information
- **Tool Integration**: Connect with Jira, Slack, Confluence, and other tools
- **Glass-Themed UI**: Modern, translucent interface design

## Additional Resources

- [CLAUDE.md](./CLAUDE.md) - AI assistant instructions and patterns
- [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Research Examples](./research/) - Reference implementations

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review existing GitHub issues
3. Create a new issue with detailed information about your problem

---

Built with ❤️ for technical product managers and development teams.