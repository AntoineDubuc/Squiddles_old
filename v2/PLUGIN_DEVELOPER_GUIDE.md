# Squiddles Plugin Developer Guide

Quick reference for creating Squiddles v2 plugins.

## Plugin Anatomy

```typescript
import { Plugin, PluginContext } from '@squiddles/types';

export class MyPlugin implements Plugin {
  // Required metadata
  name = 'my-plugin';
  version = '1.0.0';
  description = 'Does something awesome';
  
  // Lifecycle hooks (required)
  async onLoad(context: PluginContext): Promise<void> {
    // Initialize your plugin
  }
  
  async onUnload(): Promise<void> {
    // Cleanup resources
  }
  
  // Optional features
  commands?: Command[];          // CLI commands
  subscriptions?: EventSub[];    // Event subscriptions
  api?: PluginAPI;              // REST endpoints
  configSchema?: JSONSchema;     // Configuration schema
}
```

## Quick Start

### 1. Create Plugin Project

```bash
mkdir squiddles-plugin-myapp
cd squiddles-plugin-myapp
npm init -y
npm install @squiddles/types --save-peer
npm install typescript @types/node --save-dev
```

### 2. Basic Plugin Structure

```
my-plugin/
├── src/
│   ├── index.ts       # Plugin entry point
│   ├── client.ts      # API client
│   ├── commands.ts    # CLI commands
│   └── types.ts       # Type definitions
├── package.json
├── tsconfig.json
└── README.md
```

### 3. Minimal Plugin Example

```typescript
// src/index.ts
import { Plugin, PluginContext } from '@squiddles/types';

export class MinimalPlugin implements Plugin {
  name = 'minimal';
  version = '1.0.0';
  description = 'A minimal plugin example';
  
  async onLoad(context: PluginContext) {
    console.log('Plugin loaded!');
    
    // Get configuration
    const config = await context.config.get(this.name);
    
    // Subscribe to events
    context.events.on('search:request', this.handleSearch.bind(this));
  }
  
  async onUnload() {
    console.log('Plugin unloaded!');
  }
  
  private async handleSearch(event: any) {
    // Handle search requests
  }
}
```

## Common Patterns

### Adding CLI Commands

```typescript
commands = [
  {
    name: 'myapp:sync',
    description: 'Sync data from MyApp',
    options: [
      { name: '-f, --force', description: 'Force sync' }
    ],
    handler: async (options) => {
      if (options.force) {
        return 'Force syncing...';
      }
      return 'Syncing...';
    }
  }
];
```

### Event Subscriptions

```typescript
// Subscribe to system events
context.events.on('document:created', async (event) => {
  if (event.data.source === 'jira') {
    // React to Jira tickets
  }
});

// Emit custom events
context.events.emit({
  type: 'myapp:data:synced',
  source: this.name,
  data: { count: 42 }
});
```

### Service Registration

```typescript
async onLoad(context: PluginContext) {
  // Create your service
  const client = new MyAppClient(config);
  
  // Register for other plugins to use
  context.registerService('myapp', client);
  
  // Use another plugin's service
  const jira = context.getService('jira');
  if (jira) {
    // Integrate with Jira
  }
}
```

### Storage Access

```typescript
async onLoad(context: PluginContext) {
  // Key-value storage
  await context.storage.set('last-sync', Date.now());
  const lastSync = await context.storage.get('last-sync');
  
  // Collection storage
  const items = context.storage.collection('myapp:items');
  await items.insert({ id: '1', name: 'Item 1' });
  const results = await items.find({ name: /Item/ });
}
```

### Configuration Schema

```typescript
configSchema = {
  type: 'object',
  properties: {
    apiUrl: {
      type: 'string',
      description: 'MyApp API URL',
      default: 'https://api.myapp.com'
    },
    apiKey: {
      type: 'string',
      description: 'API Key',
      required: true
    }
  }
};
```

### Cross-Plugin Communication

```typescript
// Listen for cross-reference requests
context.events.on('search:cross-reference', async (event) => {
  const { ticketKey } = event.data;
  
  // Find related items in your system
  const related = await this.findRelatedItems(ticketKey);
  
  // Emit results
  context.events.emit({
    type: 'search:cross-reference:result',
    source: this.name,
    data: { ticketKey, items: related }
  });
});
```

## Best Practices

### 1. Error Handling

```typescript
async onLoad(context: PluginContext) {
  try {
    const config = await context.config.get(this.name);
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
  } catch (error) {
    context.logger.error(`Failed to load ${this.name}:`, error);
    throw error; // Prevent plugin from loading
  }
}
```

### 2. Async Operations

```typescript
// Use event-driven patterns for long operations
commands = [{
  name: 'myapp:import',
  handler: async (options) => {
    // Start import asynchronously
    this.startImport(options).catch(console.error);
    return 'Import started. Check status with myapp:status';
  }
}];

private async startImport(options: any) {
  // Long running operation
  for await (const batch of this.getBatches()) {
    await this.processBatch(batch);
    
    // Emit progress
    this.context.events.emit({
      type: 'myapp:import:progress',
      data: { processed: batch.length }
    });
  }
}
```

### 3. Testing

```typescript
// __tests__/plugin.test.ts
import { TestContext } from '@squiddles/test-utils';
import { MyPlugin } from '../src';

describe('MyPlugin', () => {
  let plugin: MyPlugin;
  let context: TestContext;
  
  beforeEach(() => {
    context = new TestContext();
    plugin = new MyPlugin();
  });
  
  test('loads successfully', async () => {
    await expect(plugin.onLoad(context)).resolves.not.toThrow();
  });
  
  test('handles search events', async () => {
    await plugin.onLoad(context);
    
    const result = await context.emitAndWait('search:request', {
      query: 'test'
    });
    
    expect(result).toHaveLength(1);
  });
});
```

### 4. Documentation

Include these in your plugin:

```markdown
# MyApp Plugin for Squiddles

## Installation
squiddles plugin install myapp

## Configuration
squiddles config set myapp.apiKey YOUR_API_KEY

## Commands
- `squiddles myapp:sync` - Sync data from MyApp
- `squiddles myapp:search <query>` - Search MyApp

## Events
Emits:
- `myapp:sync:complete` - When sync finishes

Subscribes to:
- `search:request` - Participates in global search
```

## Publishing Your Plugin

### 1. Package.json Setup

```json
{
  "name": "@yourcompany/squiddles-plugin-myapp",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "keywords": ["squiddles", "squiddles-plugin"],
  "squiddles": {
    "type": "plugin",
    "compatibleVersions": "^2.0.0"
  },
  "peerDependencies": {
    "@squiddles/types": "^2.0.0"
  }
}
```

### 2. Build and Publish

```bash
npm run build
npm publish
```

### 3. Users Install

```bash
squiddles plugin install @yourcompany/squiddles-plugin-myapp
```

## Advanced Topics

### Custom Tool for AI Agents

```typescript
// Provide tools for AI agents
tools = [
  {
    name: 'search_myapp',
    description: 'Search MyApp for information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' }
      }
    },
    handler: async ({ query }) => {
      const results = await this.client.search(query);
      return results.map(r => r.summary).join('\n');
    }
  }
];
```

### GraphQL API Extension

```typescript
api = {
  typeDefs: `
    extend type Query {
      myappItems(filter: MyAppFilter): [MyAppItem!]!
    }
    
    type MyAppItem {
      id: ID!
      name: String!
      status: String!
    }
  `,
  resolvers: {
    Query: {
      myappItems: async (_, { filter }) => {
        return this.client.getItems(filter);
      }
    }
  }
};
```

### Webhooks

```typescript
// Register webhook endpoint
api = {
  routes: [
    {
      method: 'POST',
      path: '/webhooks/myapp',
      handler: async (req, res) => {
        const event = req.body;
        
        // Emit as Squiddles event
        this.context.events.emit({
          type: 'myapp:webhook:received',
          data: event
        });
        
        res.json({ success: true });
      }
    }
  ]
};
```

## Resources

- Plugin API Reference: `@squiddles/types`
- Example Plugins: `/examples/plugins/`
- Plugin Registry: https://plugins.squiddles.io
- Community Discord: https://discord.gg/squiddles

## Need Help?

- Check existing plugins for examples
- Ask in #plugin-dev Discord channel
- Submit issues to the main repo
- Contribute your plugin to the community!