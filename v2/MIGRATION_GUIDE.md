# Squiddles V2 Migration Guide

This guide provides step-by-step instructions for migrating from the current monolithic architecture to the new modular, plugin-based architecture.

## Pre-Migration Checklist

- [ ] Backup current codebase
- [ ] Document all environment variables
- [ ] List all current integrations and features
- [ ] Identify custom business logic
- [ ] Plan downtime windows
- [ ] Set up new repository structure

## Step-by-Step Migration

### Step 1: Set Up Monorepo Structure

```bash
# Create new v2 structure
mkdir squiddles-v2
cd squiddles-v2

# Initialize monorepo with pnpm
pnpm init
```

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
  - 'plugins/*'
  - 'apps/*'
```

Create base `package.json`:
```json
{
  "name": "squiddles",
  "version": "2.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "plugins/*",
    "apps/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "latest",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Step 2: Create Core Types Package

```bash
mkdir -p packages/types/src
cd packages/types
```

Create `packages/types/package.json`:
```json
{
  "name": "@squiddles/types",
  "version": "2.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc -w"
  }
}
```

Create `packages/types/src/index.ts`:
```typescript
// Export all type definitions
export * from './plugin';
export * from './event';
export * from './command';
export * from './config';
export * from './storage';
export * from './metadata';
```

### Step 3: Migrate Jira Integration

#### Current Structure (Monolithic):
```typescript
// src/agents/jiraIntegration.ts
export const jiraIntegrationAgent = new RealtimeAgent({
  name: 'jiraIntegration',
  instructions: '...',
  tools: [searchJiraTicketsTool, createJiraTicketTool],
  // ... lots of mixed concerns
});
```

#### New Structure (Plugin):

Create `plugins/jira/src/index.ts`:
```typescript
import { Plugin, PluginContext } from '@squiddles/types';
import { JiraClient } from './client';
import { JiraIndexer } from './indexer';
import { JiraCommands } from './commands';

export class JiraPlugin implements Plugin {
  name = 'jira';
  version = '2.0.0';
  
  private client: JiraClient;
  private indexer: JiraIndexer;
  
  async onLoad(context: PluginContext) {
    // Get configuration
    const config = await context.config.get('jira');
    
    // Initialize client
    this.client = new JiraClient({
      host: config.host,
      email: config.email,
      apiToken: config.apiToken
    });
    
    // Initialize indexer if search plugin is available
    const searchService = context.getService('search');
    if (searchService) {
      this.indexer = new JiraIndexer(this.client, searchService);
    }
    
    // Register service for other plugins
    context.registerService('jira', this.client);
    
    // Subscribe to events
    context.events.on('document:request:jira', this.handleDocumentRequest.bind(this));
  }
  
  commands = [
    {
      name: 'jira:ticket:create',
      description: 'Create a new Jira ticket',
      options: [
        { name: '-p, --project <key>', description: 'Project key' },
        { name: '-t, --type <type>', description: 'Issue type' },
        { name: '-s, --summary <text>', description: 'Ticket summary' }
      ],
      handler: async (options) => {
        const ticket = await this.client.createTicket({
          project: options.project,
          issueType: options.type,
          summary: options.summary
        });
        return `Created ticket: ${ticket.key}`;
      }
    }
  ];
}
```

Create `plugins/jira/src/client.ts`:
```typescript
// Extract and refactor from current jiraClient.ts
export class JiraClient {
  constructor(private config: JiraConfig) {}
  
  async createTicket(data: CreateTicketData): Promise<JiraTicket> {
    // Refactored implementation
  }
  
  async searchTickets(jql: string): Promise<JiraTicket[]> {
    // Refactored implementation
  }
}
```

### Step 4: Create Event Bus

Create `packages/core/src/events/bus.ts`:
```typescript
import { Event, EventHandler } from '@squiddles/types';

export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();
  
  on(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    this.handlers.get(eventType)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }
  
  async emit(event: Event): Promise<void> {
    const handlers = this.handlers.get(event.type) || new Set();
    
    // Execute all handlers in parallel
    await Promise.all(
      Array.from(handlers).map(handler => 
        handler(event).catch(err => 
          console.error(`Error in handler for ${event.type}:`, err)
        )
      )
    );
  }
}
```

### Step 5: Implement CLI Framework

Create `packages/cli/src/index.ts`:
```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import { PluginManager } from '@squiddles/core';
import { ConfigManager } from '@squiddles/core';

class SquiddlesCLI {
  private program: Command;
  private pluginManager: PluginManager;
  private configManager: ConfigManager;
  
  constructor() {
    this.program = new Command();
    this.pluginManager = new PluginManager();
    this.configManager = new ConfigManager();
  }
  
  async run() {
    // Setup base commands
    this.program
      .name('squiddles')
      .description('Unified project management CLI')
      .version('2.0.0');
    
    // Initialize command
    this.program
      .command('init')
      .description('Initialize Squiddles in current directory')
      .action(async () => {
        await this.configManager.init();
        console.log('✅ Squiddles initialized');
      });
    
    // Plugin commands
    const pluginCmd = this.program.command('plugin');
    
    pluginCmd
      .command('install <name>')
      .description('Install a plugin')
      .action(async (name) => {
        await this.pluginManager.install(name);
        console.log(`✅ Plugin ${name} installed`);
      });
    
    // Load all plugins and register their commands
    await this.loadPlugins();
    
    // Parse arguments
    await this.program.parseAsync(process.argv);
  }
  
  private async loadPlugins() {
    const plugins = await this.pluginManager.loadAll();
    
    for (const plugin of plugins) {
      // Register plugin commands
      for (const cmd of plugin.commands || []) {
        this.registerCommand(cmd, plugin.name);
      }
    }
  }
  
  private registerCommand(cmd: any, pluginName: string) {
    const parts = cmd.name.split(':');
    let command = this.program;
    
    // Build nested command structure
    for (const part of parts) {
      command = command.command(part);
    }
    
    command
      .description(cmd.description)
      .action(async (...args) => {
        try {
          const result = await cmd.handler(...args);
          if (result) console.log(result);
        } catch (error) {
          console.error(`Error in ${pluginName}:${cmd.name}:`, error);
          process.exit(1);
        }
      });
    
    // Add options
    for (const opt of cmd.options || []) {
      command.option(opt.name, opt.description, opt.default);
    }
  }
}

// Run CLI
const cli = new SquiddlesCLI();
cli.run().catch(console.error);
```

### Step 6: Migrate Search/Pinecone Integration

Transform current multiSourceService into a plugin:

Create `plugins/pinecone/src/index.ts`:
```typescript
import { Plugin, PluginContext } from '@squiddles/types';
import { Pinecone } from '@pinecone-database/pinecone';
import { MinimalMetadata } from './metadata';

export class PineconePlugin implements Plugin {
  name = 'pinecone';
  version = '2.0.0';
  
  private pinecone: Pinecone;
  private index: any;
  
  async onLoad(context: PluginContext) {
    const config = await context.config.get('pinecone');
    
    this.pinecone = new Pinecone({
      apiKey: config.apiKey
    });
    
    this.index = this.pinecone.index(config.indexName);
    
    // Register as search provider
    context.registerService('search', {
      index: this.indexDocument.bind(this),
      search: this.search.bind(this),
      delete: this.deleteDocument.bind(this)
    });
    
    // Listen for indexing requests
    context.events.on('document:created', this.handleDocumentCreated.bind(this));
    context.events.on('document:updated', this.handleDocumentUpdated.bind(this));
    context.events.on('document:deleted', this.handleDocumentDeleted.bind(this));
  }
  
  private async indexDocument(doc: any) {
    const embedding = await this.generateEmbedding(doc.content);
    
    const metadata: MinimalMetadata = {
      id: doc.id,
      source: doc.source,
      type: doc.type,
      createdAt: Date.now(),
      title: doc.title,
      author: doc.author,
      projectKey: doc.projectKey,
      ticketKeys: this.extractTicketKeys(doc.content),
      status: doc.status,
      priority: doc.priority,
      mentions: this.extractMentions(doc.content)
    };
    
    await this.index.upsert([{
      id: doc.id,
      values: embedding,
      metadata
    }]);
  }
  
  commands = [
    {
      name: 'search',
      description: 'Search across all integrated platforms',
      options: [
        { name: '-s, --source <source>', description: 'Filter by source' },
        { name: '-t, --type <type>', description: 'Filter by type' },
        { name: '-p, --project <key>', description: 'Filter by project' }
      ],
      handler: async (query: string, options: any) => {
        const results = await this.search(query, options);
        return this.formatSearchResults(results);
      }
    }
  ];
}
```

### Step 7: Transform Voice/AI to Plugin

Create `plugins/voice/src/index.ts`:
```typescript
import { Plugin, PluginContext } from '@squiddles/types';
import { RealtimeClient } from '@openai/realtime-api-beta';

export class VoicePlugin implements Plugin {
  name = 'voice';
  version = '2.0.0';
  
  private client: RealtimeClient;
  private context: PluginContext;
  
  async onLoad(context: PluginContext) {
    this.context = context;
    const config = await context.config.get('openai');
    
    this.client = new RealtimeClient({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: false
    });
    
    // Register voice service
    context.registerService('voice', {
      startSession: this.startSession.bind(this),
      endSession: this.endSession.bind(this)
    });
  }
  
  commands = [
    {
      name: 'voice',
      description: 'Start voice interface',
      handler: async () => {
        console.log('Starting voice interface...');
        
        // Set up voice session
        await this.startSession();
        
        // Keep process alive
        process.stdin.resume();
        
        console.log('Voice interface active. Press Ctrl+C to exit.');
      }
    }
  ];
  
  private async startSession() {
    await this.client.connect();
    
    // Configure tools based on available plugins
    const tools = this.buildToolsFromPlugins();
    
    await this.client.updateSession({
      instructions: this.buildInstructions(),
      tools,
      voice: 'sage'
    });
    
    // Set up event handlers
    this.client.on('conversation.item.completed', (event) => {
      this.handleConversationItem(event);
    });
  }
  
  private buildToolsFromPlugins() {
    const tools = [];
    
    // Check if Jira plugin is available
    if (this.context.hasService('jira')) {
      tools.push({
        type: 'function',
        name: 'search_jira_tickets',
        description: 'Search for Jira tickets',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' }
          }
        }
      });
    }
    
    // Add other plugin tools...
    
    return tools;
  }
}
```

### Step 8: Create Migration Scripts

Create `scripts/migrate-config.ts`:
```typescript
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Migration script to convert .env to new config format
async function migrateConfig() {
  const envPath = path.join(process.cwd(), '.env');
  const env = fs.readFileSync(envPath, 'utf8');
  
  const config = {
    jira: {
      host: process.env.JIRA_BASE_URL,
      email: process.env.JIRA_USER_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN
    },
    slack: {
      token: process.env.SLACK_BOT_TOKEN,
      appToken: process.env.SLACK_APP_TOKEN
    },
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY,
      indexName: process.env.PINECONE_INDEX_NAME
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY
    }
  };
  
  // Write new config
  const configPath = path.join(process.env.HOME!, '.squiddles', 'config.json');
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log('✅ Configuration migrated to', configPath);
}

migrateConfig().catch(console.error);
```

### Step 9: Update UI to Use API

Transform current direct imports to API calls:

#### Before:
```typescript
// src/app/components/Dashboard.tsx
import { useJiraActivityFeed } from '../services/jiraService';

export function Dashboard() {
  const { activities, loading } = useJiraActivityFeed();
  // ...
}
```

#### After:
```typescript
// apps/web/src/components/Dashboard.tsx
import { useQuery } from '@apollo/client';
import { GET_ACTIVITIES } from '../graphql/queries';

export function Dashboard() {
  const { data, loading } = useQuery(GET_ACTIVITIES, {
    variables: { sources: ['jira'] }
  });
  // ...
}
```

Create GraphQL Gateway:
```typescript
// apps/api/src/index.ts
import { ApolloServer } from '@apollo/server';
import { EventBus } from '@squiddles/core';

const typeDefs = `
  type Query {
    activities(sources: [String!]): [Activity!]!
    search(query: String!, filters: SearchFilters): [SearchResult!]!
  }
  
  type Mutation {
    createTicket(input: CreateTicketInput!): Ticket!
    sendMessage(channel: String!, message: String!): Message!
  }
  
  type Subscription {
    activityCreated(sources: [String!]): Activity!
  }
`;

const resolvers = {
  Query: {
    activities: async (_, { sources }, { dataSources }) => {
      // Query plugins for activities
      const results = await eventBus.emit({
        type: 'query:activities',
        data: { sources }
      });
      return results;
    }
  }
};
```

### Step 10: Testing Strategy

Create integration tests for each plugin:

```typescript
// plugins/jira/src/__tests__/integration.test.ts
import { PluginManager, EventBus, ConfigManager } from '@squiddles/core';
import { JiraPlugin } from '../index';

describe('Jira Plugin Integration', () => {
  let pluginManager: PluginManager;
  let eventBus: EventBus;
  
  beforeEach(async () => {
    eventBus = new EventBus();
    pluginManager = new PluginManager({ eventBus });
    
    // Load plugin
    await pluginManager.load(JiraPlugin);
  });
  
  test('should handle ticket creation command', async () => {
    const result = await pluginManager.executeCommand('jira:ticket:create', {
      project: 'TEST',
      type: 'Bug',
      summary: 'Test ticket'
    });
    
    expect(result).toMatch(/Created ticket: TEST-\d+/);
  });
  
  test('should emit events on ticket creation', async () => {
    const handler = jest.fn();
    eventBus.on('document:created', handler);
    
    await pluginManager.executeCommand('jira:ticket:create', {
      project: 'TEST',
      type: 'Bug',
      summary: 'Test ticket'
    });
    
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'document:created',
        data: expect.objectContaining({
          source: 'jira',
          type: 'ticket'
        })
      })
    );
  });
});
```

## Migration Timeline

### Week 1-2: Foundation
- Set up monorepo structure
- Create core packages (types, events, plugin-system)
- Build CLI framework

### Week 3-4: Core Plugins
- Migrate Jira integration
- Migrate Pinecone/search
- Create plugin testing framework

### Week 5-6: Remaining Plugins
- Migrate Slack integration
- Migrate Confluence integration
- Migrate GitHub integration
- Migrate Gmail integration

### Week 7-8: Advanced Features
- Migrate AI/Voice functionality
- Create GraphQL API gateway
- Update UI to use API

### Week 9-10: Testing & Optimization
- Integration testing
- Performance optimization
- Documentation

### Week 11-12: Deployment
- Set up CI/CD for monorepo
- Create plugin registry
- Deploy v2 in parallel with v1

## Rollback Plan

If issues arise during migration:

1. **Plugin Level**: Disable problematic plugin, fallback to direct integration
2. **API Level**: Route traffic back to v1 endpoints
3. **Full Rollback**: Revert to v1 deployment

## Post-Migration Checklist

- [ ] All integrations working via plugins
- [ ] CLI commands tested and documented
- [ ] API gateway handling all UI requests
- [ ] Performance metrics acceptable
- [ ] Documentation updated
- [ ] Team trained on new architecture
- [ ] Monitoring and alerting configured

## Benefits Realized

After migration, you'll have:

1. **Independent deployments** - Deploy plugins separately
2. **Better testing** - Test each plugin in isolation
3. **Easier maintenance** - Clear boundaries and responsibilities
4. **Extensibility** - Third-party plugins possible
5. **Performance** - Scale components independently
6. **Developer experience** - Cleaner, more maintainable code