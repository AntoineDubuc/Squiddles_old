# Development Archive

This directory contains experimental, reference, and planning materials that are not part of the active application but are valuable for future development.

## Structure

### `experimental/` - Ready-to-integrate code
- `components/` - UI components built but not used in main app
- `api/` - Server endpoints implemented but not called by frontend  
- `agents/` - AI agents ready for integration
- `types/` - Comprehensive TypeScript definitions

### `integrations/` - Service integration libraries
- `jira/` - Complete Jira API integration
- `pinecone/` - Vector search implementation
- `tests/` - Integration test suites

### `reference/` - Design and research materials
- `research/` - OpenAI reference implementation
- `mockups/` - Original HTML/CSS mockups
- `docs/` - Detailed documentation

### `planning/` - Project management materials
- `jira_tickets/` - Development tickets and planning
- `testing-framework/` - Automated voice testing system

## Usage

To integrate experimental code into the active application:

1. Copy files from `experimental/` to appropriate `src/` locations
2. Update import paths and dependencies
3. Add to component tree or API routes
4. Test thoroughly before deployment

All experimental code follows the same patterns as active code and should integrate seamlessly.
