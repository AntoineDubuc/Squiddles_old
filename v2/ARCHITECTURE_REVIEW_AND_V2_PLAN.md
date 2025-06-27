# Squiddles Architecture Review and V2 Modernization Plan

## Executive Summary

Squiddles has evolved into a tightly coupled monolithic Next.js application with significant architectural debt. This document outlines a comprehensive plan to transform it into a modular, scalable, CLI-first platform with plugin support.

## Current State Analysis

### Pain Points
1. **Tight Coupling**: UI components directly import services, agents contain business logic
2. **No Clear Boundaries**: Business logic scattered across API routes, agents, services, and utilities
3. **Monolithic Deployment**: Everything bundled in a single Next.js app
4. **Inconsistent Patterns**: Each integration follows different implementation patterns
5. **Limited Testability**: Cannot test components in isolation
6. **Scaling Issues**: Cannot scale individual components independently

### Technical Debt
- Mixed concerns throughout codebase
- No dependency injection
- Direct environment variable access
- No abstraction layers
- Synchronous processing only
- No event-driven architecture

## Proposed V2 Architecture

### Core Principles
1. **CLI-First**: Core functionality accessible via CLI
2. **Plugin Architecture**: Integrations as plugins
3. **Event-Driven**: Loosely coupled components via event bus
4. **API-First**: Clear REST/GraphQL APIs
5. **Microservices-Ready**: Can be deployed as monolith or microservices
6. **Clean Architecture**: Clear separation of concerns

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLI Interface                            │
│                    squiddles <command> [options]                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      Core Framework                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   Command   │  │    Event     │  │   Plugin Manager       │ │
│  │   Router    │  │     Bus      │  │  • Load/Unload         │ │
│  │             │  │              │  │  • Dependency Inject   │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   Config    │  │   Storage    │  │   Authentication       │ │
│  │   Manager   │  │  Abstraction │  │   & Authorization      │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                         Plugin Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │    Jira     │  │    Slack     │  │    Confluence          │ │
│  │   Plugin    │  │   Plugin     │  │     Plugin             │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   GitHub    │  │    Gmail     │  │    Pinecone            │ │
│  │   Plugin    │  │   Plugin     │  │   Search Plugin        │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  AI Agent   │  │   Voice      │  │    Custom              │ │
│  │   Plugin    │  │   Plugin     │  │    Plugins...          │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                     Optional UI Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  Next.js    │  │   GraphQL    │  │   WebSocket            │ │
│  │   Web UI    │  │   Gateway    │  │    Server              │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Component Design

### 1. Core Framework

#### Directory Structure
```
squiddles-v2/
├── packages/
│   ├── core/                 # Core framework
│   │   ├── src/
│   │   │   ├── cli/         # CLI command handlers
│   │   │   ├── commands/    # Command definitions
│   │   │   ├── config/      # Configuration management
│   │   │   ├── events/      # Event bus implementation
│   │   │   ├── plugins/     # Plugin system
│   │   │   ├── storage/     # Storage abstraction
│   │   │   └── auth/        # Auth system
│   │   └── package.json
│   │
│   ├── types/               # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── plugin.ts
│   │   │   ├── event.ts
│   │   │   ├── command.ts
│   │   │   └── config.ts
│   │   └── package.json
│   │
│   ├── plugins/             # Official plugins
│   │   ├── jira/
│   │   ├── slack/
│   │   ├── confluence/
│   │   ├── github/
│   │   ├── gmail/
│   │   ├── pinecone/
│   │   ├── ai-agent/
│   │   └── voice/
│   │
│   └── ui/                  # Optional UI packages
│       ├── web/             # Next.js web app
│       ├── desktop/         # Electron app
│       └── mobile/          # React Native app
│
├── scripts/                 # Build and dev scripts
├── docs/                    # Documentation
└── examples/               # Example configurations and plugins
```

### 2. Plugin Architecture

#### Plugin Interface
```typescript
// packages/types/src/plugin.ts
export interface Plugin {
  name: string;
  version: string;
  description: string;
  
  // Lifecycle hooks
  onLoad(context: PluginContext): Promise<void>;
  onUnload(): Promise<void>;
  
  // Command registration
  commands?: Command[];
  
  // Event subscriptions
  subscriptions?: EventSubscription[];
  
  // API endpoints (optional)
  api?: PluginAPI;
  
  // Configuration schema
  configSchema?: JSONSchema;
  
  // Dependencies
  dependencies?: string[];
}

export interface PluginContext {
  config: ConfigManager;
  events: EventBus;
  storage: StorageAdapter;
  auth: AuthManager;
  logger: Logger;
  
  // Plugin can register its own services
  registerService<T>(name: string, service: T): void;
  
  // Plugin can get other services
  getService<T>(name: string): T;
}
```

#### Example Plugin Implementation
```typescript
// packages/plugins/jira/src/index.ts
import { Plugin, PluginContext } from '@squiddles/types';
import { JiraClient } from './client';
import { JiraCommands } from './commands';
import { JiraEventHandlers } from './events';

export class JiraPlugin implements Plugin {
  name = 'jira';
  version = '2.0.0';
  description = 'Jira integration for Squiddles';
  
  private client: JiraClient;
  private context: PluginContext;
  
  configSchema = {
    type: 'object',
    properties: {
      host: { type: 'string' },
      email: { type: 'string' },
      apiToken: { type: 'string' }
    },
    required: ['host', 'email', 'apiToken']
  };
  
  commands = [
    {
      name: 'jira:ticket:create',
      description: 'Create a Jira ticket',
      handler: this.createTicket.bind(this)
    },
    {
      name: 'jira:ticket:search',
      description: 'Search Jira tickets',
      handler: this.searchTickets.bind(this)
    }
  ];
  
  subscriptions = [
    {
      event: 'search:cross-reference',
      handler: this.handleCrossReference.bind(this)
    }
  ];
  
  async onLoad(context: PluginContext) {
    this.context = context;
    const config = await context.config.get('jira');
    
    this.client = new JiraClient(config);
    
    // Register Jira service for other plugins
    context.registerService('jira:client', this.client);
    
    // Subscribe to relevant events
    context.events.on('user:mention', this.handleUserMention.bind(this));
  }
  
  async onUnload() {
    // Cleanup
    this.client.disconnect();
  }
  
  // Command handlers
  async createTicket(args: any) {
    // Implementation
  }
  
  async searchTickets(args: any) {
    // Implementation
  }
  
  // Event handlers
  async handleCrossReference(event: any) {
    // Implementation
  }
  
  async handleUserMention(event: any) {
    // Implementation
  }
}
```

### 3. CLI Design

#### Command Structure
```bash
# Core commands
squiddles init                      # Initialize configuration
squiddles plugin install <name>     # Install plugin
squiddles plugin list              # List installed plugins
squiddles config set <key> <value> # Set configuration

# Plugin commands (dynamically loaded)
squiddles jira ticket create       # Create Jira ticket
squiddles jira ticket search <query> # Search tickets
squiddles slack send <channel> <message> # Send Slack message
squiddles search <query>           # Cross-platform search

# AI/Voice commands
squiddles chat                     # Start interactive chat
squiddles voice                    # Start voice interface

# Server mode (for UI)
squiddles serve                    # Start API server
squiddles serve --ui               # Start with web UI
```

#### CLI Implementation
```typescript
// packages/core/src/cli/index.ts
import { Command } from 'commander';
import { PluginManager } from '../plugins';
import { ConfigManager } from '../config';
import { EventBus } from '../events';

export class CLI {
  private program: Command;
  private pluginManager: PluginManager;
  private configManager: ConfigManager;
  private eventBus: EventBus;
  
  constructor() {
    this.program = new Command();
    this.setupCore();
  }
  
  private setupCore() {
    this.program
      .name('squiddles')
      .description('Unified project management CLI')
      .version('2.0.0');
    
    // Core commands
    this.program
      .command('init')
      .description('Initialize Squiddles configuration')
      .action(this.handleInit.bind(this));
    
    // Plugin commands
    const pluginCmd = this.program
      .command('plugin')
      .description('Manage plugins');
    
    pluginCmd
      .command('install <name>')
      .action(this.handlePluginInstall.bind(this));
    
    pluginCmd
      .command('list')
      .action(this.handlePluginList.bind(this));
  }
  
  async run(argv: string[]) {
    // Load plugins and their commands
    await this.pluginManager.loadAll();
    
    // Register plugin commands dynamically
    for (const plugin of this.pluginManager.getPlugins()) {
      for (const command of plugin.commands || []) {
        this.registerPluginCommand(plugin.name, command);
      }
    }
    
    // Parse and execute
    await this.program.parseAsync(argv);
  }
  
  private registerPluginCommand(pluginName: string, command: any) {
    const [mainCmd, ...subCmds] = command.name.split(':');
    
    let cmd = this.program.command(mainCmd);
    for (const sub of subCmds) {
      cmd = cmd.command(sub);
    }
    
    cmd
      .description(command.description)
      .action(async (...args) => {
        await this.executePluginCommand(pluginName, command, args);
      });
  }
}
```

### 4. Event-Driven Architecture

#### Event Bus
```typescript
// packages/core/src/events/bus.ts
export interface Event {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  data: any;
  metadata?: Record<string, any>;
}

export class EventBus {
  private handlers: Map<string, Set<EventHandler>>;
  private middleware: EventMiddleware[];
  
  emit(event: Event): Promise<void> {
    // Run through middleware
    for (const mw of this.middleware) {
      event = await mw.process(event);
    }
    
    // Notify handlers
    const handlers = this.handlers.get(event.type) || new Set();
    const promises = Array.from(handlers).map(h => h(event));
    
    await Promise.all(promises);
  }
  
  on(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }
  
  off(eventType: string, handler: EventHandler): void {
    this.handlers.get(eventType)?.delete(handler);
  }
}
```

#### Common Events
```typescript
// Cross-cutting events that plugins can emit/subscribe to
export enum SystemEvents {
  // Search events
  SEARCH_REQUEST = 'search:request',
  SEARCH_RESULT = 'search:result',
  
  // User events  
  USER_MENTION = 'user:mention',
  USER_ASSIGNED = 'user:assigned',
  
  // Document events
  DOCUMENT_CREATED = 'document:created',
  DOCUMENT_UPDATED = 'document:updated',
  DOCUMENT_LINKED = 'document:linked',
  
  // Notification events
  NOTIFICATION_URGENT = 'notification:urgent',
  NOTIFICATION_MENTION = 'notification:mention',
  
  // AI events
  AI_QUERY = 'ai:query',
  AI_RESPONSE = 'ai:response',
  
  // Voice events
  VOICE_COMMAND = 'voice:command',
  VOICE_TRANSCRIPTION = 'voice:transcription'
}
```

### 5. Storage Abstraction

```typescript
// packages/core/src/storage/adapter.ts
export interface StorageAdapter {
  // Key-value operations
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  
  // Collection operations
  collection<T>(name: string): Collection<T>;
  
  // Transaction support
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;
}

// Implementations can be:
// - SQLite for local CLI
// - PostgreSQL for server mode
// - Redis for caching
// - S3 for file storage
```

### 6. Configuration Management

```typescript
// packages/core/src/config/manager.ts
export class ConfigManager {
  private sources: ConfigSource[];
  
  constructor() {
    this.sources = [
      new EnvConfigSource(),        // Environment variables
      new FileConfigSource(),       // ~/.squiddles/config.json
      new CliConfigSource(),        // CLI arguments
      new RemoteConfigSource()      // Remote config server
    ];
  }
  
  async get<T>(key: string): Promise<T> {
    // Merge from all sources with precedence
    for (const source of this.sources.reverse()) {
      const value = await source.get(key);
      if (value !== undefined) return value;
    }
    return undefined;
  }
  
  async set(key: string, value: any, source: string = 'file'): Promise<void> {
    const configSource = this.sources.find(s => s.name === source);
    await configSource?.set(key, value);
  }
}
```

## Migration Strategy

### Phase 1: Core Extraction (Weeks 1-4)
1. **Extract Core Types**
   - Create `@squiddles/types` package
   - Define all interfaces and types
   - No implementation, just contracts

2. **Build Event Bus**
   - Create `@squiddles/events` package
   - Implement pub/sub system
   - Add event middleware support

3. **Create Plugin System**
   - Create `@squiddles/plugin-system` package
   - Implement plugin loader
   - Add dependency injection

4. **Build CLI Framework**
   - Create `@squiddles/cli` package
   - Implement command router
   - Add plugin command registration

### Phase 2: Service Extraction (Weeks 5-8)
1. **Extract Jira Integration**
   - Move to `@squiddles/plugin-jira`
   - Implement plugin interface
   - Add CLI commands
   - Remove from monolith

2. **Extract Slack Integration**
   - Move to `@squiddles/plugin-slack`
   - Implement plugin interface
   - Add CLI commands
   - Remove from monolith

3. **Extract Other Integrations**
   - Confluence → `@squiddles/plugin-confluence`
   - GitHub → `@squiddles/plugin-github`
   - Gmail → `@squiddles/plugin-gmail`

### Phase 3: AI/Voice Extraction (Weeks 9-10)
1. **Extract AI Agent System**
   - Move to `@squiddles/plugin-ai`
   - Make agents configurable
   - Support custom agents

2. **Extract Voice Interface**
   - Move to `@squiddles/plugin-voice`
   - Make it optional
   - Support multiple voice providers

### Phase 4: UI Decoupling (Weeks 11-12)
1. **Create API Gateway**
   - Build GraphQL API
   - Add WebSocket support
   - Implement authentication

2. **Refactor UI**
   - Remove direct service imports
   - Use GraphQL client
   - Make UI deployment independent

### Phase 5: Testing & Documentation (Weeks 13-14)
1. **Testing**
   - Unit tests for each package
   - Integration tests for plugins
   - E2E tests for CLI

2. **Documentation**
   - API documentation
   - Plugin development guide
   - Migration guide

## Plugin Development Guide

### Creating a Custom Plugin

```typescript
// my-plugin/src/index.ts
import { Plugin, PluginContext } from '@squiddles/types';

export class MyPlugin implements Plugin {
  name = 'my-plugin';
  version = '1.0.0';
  description = 'My custom Squiddles plugin';
  
  commands = [{
    name: 'my:command',
    description: 'Does something cool',
    options: [
      { name: '--flag', description: 'A flag option' }
    ],
    handler: async (args) => {
      console.log('Hello from my plugin!', args);
    }
  }];
  
  async onLoad(context: PluginContext) {
    // Subscribe to events
    context.events.on('search:request', async (event) => {
      // Add your search results
      context.events.emit({
        type: 'search:result',
        source: this.name,
        data: {
          results: await this.search(event.data.query)
        }
      });
    });
  }
  
  async onUnload() {
    // Cleanup
  }
  
  private async search(query: string) {
    // Your search implementation
    return [];
  }
}
```

### Plugin Distribution

```json
// my-plugin/package.json
{
  "name": "@mycompany/squiddles-my-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "squiddles": {
    "type": "plugin",
    "compatibleVersions": "^2.0.0"
  },
  "peerDependencies": {
    "@squiddles/types": "^2.0.0"
  }
}
```

## Benefits of V2 Architecture

### 1. **Modularity**
- Each integration is a separate package
- Can be developed and deployed independently
- Clear boundaries and interfaces

### 2. **Scalability**
- Can run as single process or distributed
- Horizontal scaling of specific plugins
- Event-driven architecture supports async processing

### 3. **Maintainability**
- Clear separation of concerns
- Consistent patterns across plugins
- Easy to understand and modify

### 4. **Extensibility**
- Third-party plugins supported
- Custom integrations without forking
- Plugin marketplace potential

### 5. **Testability**
- Each component can be tested in isolation
- Mock implementations easy to create
- Clear interfaces for testing

### 6. **Flexibility**
- CLI-first but UI-ready
- Multiple deployment options
- Progressive enhancement

## Implementation Timeline

**Month 1**: Core framework and plugin system
**Month 2**: Migrate existing integrations to plugins
**Month 3**: UI decoupling and API gateway
**Month 4**: Testing, documentation, and launch

## Conclusion

This architecture transformation will position Squiddles as a modern, extensible platform that can grow with user needs while maintaining clean code and clear boundaries. The CLI-first approach ensures maximum flexibility while the plugin system enables unlimited extensibility.