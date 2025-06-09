# V2R Voice Assistant

A browser-based voice assistant that helps Product Managers convert meeting discussions into structured Jira user stories through natural conversation.

## Core Value Proposition
"Talk about your meeting, get Jira stories"

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd Squiddles
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
/
├── src/
│   ├── components/     # UI components
│   ├── utils/         # Utility functions
│   └── api/           # API integration
├── public/            # Static assets
├── docs/              # Project documentation
├── tests/             # Test files
└── package.json       # Project configuration
```

## Key Features (MVP)

- **Voice Interface**: Browser-based speech recognition
- **Conversational AI**: Natural dialogue for requirement extraction
- **Story Generation**: Automatic Jira-formatted user stories
- **Export Options**: Copy/paste, CSV, direct Jira integration

## Documentation

- [Product Requirements Document](docs/prd.md)
- [Development Guide](docs/CLAUDE.md)
- [Project Ideation](docs/ideation.md)

## Browser Support

- Chrome 70+
- Edge 79+
- Safari 14+
- Firefox 85+
- Mobile browsers (iOS Safari, Android Chrome)

## Technology Stack

- **Frontend**: Vanilla JavaScript + Web APIs
- **Speech**: Web Speech API + Speech Synthesis API
- **AI**: OpenAI GPT-4 API
- **Deployment**: Vercel/Netlify
- **Build Tool**: Vite

## License

MIT