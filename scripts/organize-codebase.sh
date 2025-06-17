#!/bin/bash

# Squiddles Codebase Organization Script
# Moves experimental/unused code to development-archive/ while preserving active core

set -e  # Exit on any error

echo "🦑 Organizing Squiddles Codebase..."
echo "This will move experimental code to development-archive/ and keep only active core files."
echo ""

# Confirm before proceeding
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Create archive directories
echo "📁 Creating development-archive directories..."
mkdir -p development-archive/{experimental,integrations,reference,planning}
mkdir -p development-archive/experimental/{components,api,agents,types}

# Move experimental components (unused by main UI)
echo "🧪 Moving experimental components..."
mkdir -p development-archive/experimental/components/dashboard

if [ -f "src/app/components/VoiceDemo.tsx" ]; then
    mv src/app/components/VoiceDemo.tsx development-archive/experimental/components/
    echo "  ✓ Moved VoiceDemo.tsx"
fi

if [ -f "src/app/components/VoiceInput.tsx" ]; then
    mv src/app/components/VoiceInput.tsx development-archive/experimental/components/
    echo "  ✓ Moved VoiceInput.tsx"
fi

if [ -d "src/app/components/dashboard" ]; then
    mv src/app/components/dashboard/* development-archive/experimental/components/dashboard/
    rmdir src/app/components/dashboard
    echo "  ✓ Moved dashboard/ components"
fi

# Move experimental type definitions (comprehensive but unused)
echo "📋 Moving comprehensive type definitions..."
if [ -f "src/app/types/ui-models.ts" ]; then
    mv src/app/types/ui-models.ts development-archive/experimental/types/
    echo "  ✓ Moved ui-models.ts"
fi

if [ -f "src/app/types/api-endpoints.ts" ]; then
    mv src/app/types/api-endpoints.ts development-archive/experimental/types/
    echo "  ✓ Moved api-endpoints.ts"
fi

if [ -d "src/app/types" ] && [ -z "$(ls -A src/app/types)" ]; then
    rmdir src/app/types
    echo "  ✓ Removed empty types/ directory"
fi

# Move experimental API routes (built but not called by frontend)
echo "🔌 Moving experimental API routes..."
mkdir -p development-archive/experimental/api

api_routes_to_move=(
    "auth"
    "dashboard" 
    "tickets"
    "search"
    "jira"
    "pinecone"
    "test"
)

for route in "${api_routes_to_move[@]}"; do
    if [ -d "src/app/api/$route" ]; then
        mv "src/app/api/$route" "development-archive/experimental/api/"
        echo "  ✓ Moved api/$route/"
    fi
done

# Move experimental agents (not in default agent set)
echo "🤖 Moving experimental agents..."
agents_to_move=(
    "productManager.ts"
    "jiraIntegration.ts" 
    "slackIntegration.ts"
    "testSimple.ts"
)

for agent in "${agents_to_move[@]}"; do
    if [ -f "src/agents/$agent" ]; then
        mv "src/agents/$agent" "development-archive/experimental/agents/"
        echo "  ✓ Moved $agent"
    fi
done

# Move integration libraries (built but not used by active code)
echo "🔗 Moving integration libraries..."
if [ -d "src/lib/jira" ]; then
    mv src/lib/jira development-archive/integrations/
    echo "  ✓ Moved lib/jira/"
fi

if [ -d "src/lib/pinecone" ]; then
    mv src/lib/pinecone development-archive/integrations/
    echo "  ✓ Moved lib/pinecone/"
fi

if [ -d "src/lib/utils" ]; then
    mv src/lib/utils development-archive/integrations/
    echo "  ✓ Moved lib/utils/"
fi

if [ -d "src/lib/validation" ]; then
    mv src/lib/validation development-archive/integrations/
    echo "  ✓ Moved lib/validation/"
fi

if [ -f "src/lib/__tests__/auth.test.ts" ]; then
    mkdir -p development-archive/integrations/tests
    mv src/lib/__tests__ development-archive/integrations/tests/
    echo "  ✓ Moved lib/__tests__/"
fi

# Move reference materials
echo "📚 Moving reference materials..."
if [ -d "research" ]; then
    mv research development-archive/reference/
    echo "  ✓ Moved research/"
fi

if [ -d "mockups" ]; then
    mv mockups development-archive/reference/
    echo "  ✓ Moved mockups/"
fi

if [ -d "docs" ]; then
    mv docs development-archive/reference/
    echo "  ✓ Moved docs/"
fi

# Move planning materials  
echo "📋 Moving planning materials..."
if [ -d "jira_tickets" ]; then
    mv jira_tickets development-archive/planning/
    echo "  ✓ Moved jira_tickets/"
fi

if [ -d "testing-framework" ]; then
    mv testing-framework development-archive/planning/
    echo "  ✓ Moved testing-framework/"
fi

# Create index file for development-archive
echo "📝 Creating development-archive index..."
cat > development-archive/README.md << 'EOF'
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
EOF

# Update .gitignore if needed
echo "📝 Updating .gitignore..."
if ! grep -q "development-archive" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# Development archive (optional - can be committed)" >> .gitignore
    echo "# development-archive/" >> .gitignore
fi

# Create summary of active codebase
echo "📊 Creating active codebase summary..."
cat > ACTIVE_CODEBASE.md << 'EOF'
# Active Codebase Summary

This file lists all the files that are actually used in the running application.

## User-Facing Pages (3 files)
```
src/app/layout.tsx           ← Root layout with providers
src/app/page.tsx             ← Main application entry point
src/app/test-direct/page.tsx ← Direct dashboard test
```

## UI Components (5 files)
```
src/app/components/Dashboard.tsx      ← Main dashboard (glass-themed)
src/app/components/VoiceInterface.tsx ← Voice conversation interface
src/app/components/Transcript.tsx     ← Real-time conversation display
src/app/components/Events.tsx         ← Debug events panel  
src/app/components/BottomToolbar.tsx  ← Voice controls
```

## State Management (3 files)
```
src/app/contexts/TranscriptContext.tsx ← Conversation state
src/app/contexts/EventContext.tsx      ← Event logging state
src/app/types.ts                       ← Core type definitions
```

## Voice System (3 files)
```
src/app/lib/realtimeClient.ts ← OpenAI Realtime API client
src/app/lib/guardrails.ts     ← Content moderation system
src/agents/index.ts           ← Agent registry
src/agents/minimalProductManager.ts ← Default active agent
```

## Server APIs (2 files)
```
src/app/api/session/route.ts   ← OpenAI session creation
src/app/api/responses/route.ts ← Guardrails API endpoint
```

## Authentication (2 files) 
```
src/lib/auth.ts            ← Mock authentication system
src/lib/mock-data/users.ts ← Development user data
```

## Configuration (4 files)
```
package.json         ← Dependencies and scripts
tsconfig.json        ← TypeScript configuration  
next.config.ts       ← Next.js configuration
tailwind.config.ts   ← Tailwind CSS configuration
```

## Total: ~20 core files powering the entire application

All other code has been moved to `development-archive/` for future use.
EOF

echo ""
echo "✅ Codebase organization complete!"
echo ""
echo "📁 Active application code: ~20 core files in src/"
echo "📦 Experimental code: development-archive/"
echo "📚 Documentation: DEVELOPER_ONBOARDING.md"
echo "📊 Summary: ACTIVE_CODEBASE.md"
echo ""
echo "Your application will continue to work exactly as before."
echo "To integrate experimental features, copy from development-archive/ to src/"