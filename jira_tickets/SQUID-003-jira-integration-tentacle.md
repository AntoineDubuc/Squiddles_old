# Implement Jira Integration Tentacle

## Description
Create a specialized tentacle for Jira workflow automation, enabling voice-controlled ticket creation, updates, searches, and management with seamless integration to existing user story templates.

## User Story
As a Technical Product Manager, I want to create and manage Jira tickets through voice commands so that I can efficiently convert user stories into actionable development tasks without manual data entry.

## Priority/Effort
- **Priority**: High
- **Story Points**: 5
- **Estimated Time**: 2-3 days

## Technical Approach
### Dependencies/Prerequisites
- Core tentacle system (SQUID-001) completed
- Product Manager tentacle (SQUID-002) for user story integration
- Jira API access and authentication (mocked for POC)

### Architecture Notes
- Implements Tentacle interface with Jira-specific operations
- Provides capabilities for ticket CRUD operations and workflow management
- Formats user story templates into proper Jira markup
- Handles project configuration and issue type management

### APIs/Data Models
- Jira ticket structure with fields, metadata, and status
- Project information with issue types, components, and versions
- JQL search functionality for ticket discovery
- Formatted descriptions with Jira markup (h2., *, etc.)

## Inputs
- User story templates from Product Manager tentacle
- Voice commands for ticket operations (create, update, search)
- Project keys, issue types, and assignment information
- Search queries and filter criteria

## Outputs
- Created Jira tickets with proper formatting and links
- Updated ticket information and status changes
- Search results with relevant ticket details
- Project configuration and available options

## Acceptance Criteria
- [ ] Voice command "create ticket" generates Jira story from active template
- [ ] Ticket descriptions include all user story sections with proper markup
- [ ] Search functionality finds tickets by keywords and JQL queries
- [ ] Update operations modify specific ticket fields
- [ ] Project information provides configuration options
- [ ] Error handling for API failures and permission issues
- [ ] Integration with Product Manager for seamless workflow

## QA Tests
- [ ] Create ticket from user story template and verify Jira formatting
- [ ] Test search with various queries and validate results
- [ ] Update existing tickets and confirm changes
- [ ] Test project information retrieval and validation
- [ ] Verify error handling for invalid tickets and permissions
- [ ] Test integration flow: create story → create ticket

## Definition of Done
- [ ] Code implemented and tested
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Code reviewed (self-review)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Performance acceptable

---

## Implementation Details (Post-Development)

### Code Created
**Files Modified/Created:**  
- `src/agents/jiraIntegration.ts` - Enhanced Jira Integration agent following exact OpenAI Advanced Agent Example pattern with 5 comprehensive tools and workflow automation instructions (220+ lines)

**Key Code Snippets:**
```typescript
// Direct RealtimeAgent usage following OpenAI reference pattern
import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Tool following exact OpenAI pattern with input: any and type assertion
const createJiraTicketTool = tool({
  name: 'createJiraTicket',
  description: 'Create a Jira ticket from user story information',
  parameters: {
    type: 'object',
    properties: {
      summary: { type: 'string', description: 'Ticket summary/title' },
      description: { type: 'string', description: 'Detailed description' },
      projectKey: { type: 'string', description: 'Project key (e.g. SQUID)', default: 'SQUID' },
      issueType: { type: 'string', description: 'Issue type', default: 'Story' }
    },
    required: ['summary', 'description'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { summary, description, projectKey, issueType } = input as {
      summary: string; description: string; projectKey: string; issueType: string;
    };
    
    const ticketId = `${projectKey}-${Math.floor(Math.random() * 1000) + 100}`;
    const ticket = {
      id: ticketId,
      url: `https://your-domain.atlassian.net/browse/${ticketId}`,
      fields: { summary, description, project: { key: projectKey }, issuetype: { name: issueType } }
    };
    
    return { success: true, ticket, url: ticket.url };
  }
});

// Template conversion tool with proper Jira markup formatting
const createTicketFromTemplateTool = tool({
  name: 'createTicketFromTemplate',
  description: 'Create a Jira ticket from a user story template with proper formatting',
  parameters: {
    type: 'object',
    properties: {
      template: { type: 'object', description: 'User story template object' },
      projectKey: { type: 'string', description: 'Project key', default: 'SQUID' }
    },
    required: ['template'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { template, projectKey } = input as { template: any; projectKey: string; };
    
    // Format template into Jira markup
    const jiraDescription = `
h2. User Story
${template.userStory || 'User story to be defined'}

h2. Business Value
${template.sections?.businessValue || 'Business value to be specified'}

h2. Acceptance Criteria
${template.sections?.acceptanceCriteria || 'Acceptance criteria to be created'}

---
_Created by Squiddles AI on ${new Date().toISOString()}_
    `.trim();
    
    // Generate ticket with proper structure
    const ticketId = `${projectKey}-${Math.floor(Math.random() * 1000) + 100}`;
    const ticket = {
      id: ticketId, url: `https://your-domain.atlassian.net/browse/${ticketId}`,
      fields: { summary: template.title || 'User story from template', description: jiraDescription,
                project: { key: projectKey }, issuetype: { name: 'Story' },
                labels: ['squiddles-generated', 'user-story'] }
    };
    
    return { success: true, ticket, url: ticket.url, templateUsed: template.id };
  }
});

// Update Jira ticket tool following same pattern
const updateJiraTicketTool = tool({
  name: 'updateJiraTicket',
  description: 'Update an existing Jira ticket with new information',
  parameters: {
    type: 'object',
    properties: {
      ticketId: { type: 'string', description: 'Jira ticket ID (e.g. SQUID-123)' },
      field: { type: 'string', description: 'Field to update (summary, description, status, priority)' },
      value: { type: 'string', description: 'New value for the field' }
    },
    required: ['ticketId', 'field', 'value'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { ticketId, field, value } = input as {
      ticketId: string; field: string; value: string;
    };
    
    return { success: true, ticketId, field, value, updated: true };
  }
});

// Search Jira tickets tool following same pattern
const searchJiraTicketsTool = tool({
  name: 'searchJiraTickets',
  description: 'Search for Jira tickets using keywords or JQL query',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query or JQL expression' },
      maxResults: { type: 'number', description: 'Maximum number of results', default: 10 }
    },
    required: ['query'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { query, maxResults } = input as {
      query: string; maxResults: number;
    };
    
    const results = {
      issues: [
        { key: 'SQUID-001', summary: 'Core tentacle system', status: 'Done' },
        { key: 'SQUID-002', summary: 'Product Manager tentacle', status: 'In Progress' }
      ],
      total: 2,
      query
    };
    
    return { success: true, results, total: results.total };
  }
});

// Get project information tool following same pattern
const getProjectInfoTool = tool({
  name: 'getProjectInfo',
  description: 'Get information about available Jira projects and configurations',
  parameters: {
    type: 'object',
    properties: {
      projectKey: { type: 'string', description: 'Specific project key (optional)' }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { projectKey } = input as { projectKey?: string };
    
    const projectInfo = {
      projects: [
        { key: 'SQUID', name: 'Squiddles Voice Interface', issueTypes: ['Story', 'Task', 'Bug', 'Epic'] }
      ],
      issueTypes: ['Story', 'Task', 'Bug', 'Epic'],
      priorities: ['Highest', 'High', 'Medium', 'Low']
    };
    
    return { success: true, projectInfo, queriedProject: projectKey };
  }
});

// Agent following exact OpenAI RealtimeAgent constructor pattern  
export const jiraAgent = new RealtimeAgent({
  name: 'jiraIntegration',
  voice: 'echo',
  instructions: `
# Identity
You are a Jira integration specialist that creates and manages tickets efficiently through comprehensive workflow automation.

# Core Task
Create, update, search, and manage Jira tickets from user stories and voice commands with proper formatting and workflow integration.

# Your Capabilities
1. **createJiraTicket** - Create new tickets with proper formatting and structure
2. **updateJiraTicket** - Update existing tickets (summary, description, status, priority)
3. **searchJiraTickets** - Search for tickets using keywords or JQL queries
4. **createTicketFromTemplate** - Convert user story templates to formatted Jira tickets
5. **getProjectInfo** - Get project configuration and available options

# Instructions
- Listen for requests to create, update, search, or manage Jira workflows
- Use createTicketFromTemplate when handed user story templates from Product Manager
- Use searchJiraTickets to find existing tickets before creating duplicates
- Always provide ticket URLs and IDs for easy access
- Format descriptions with proper Jira markup (h2. headers, * bullets)
- Confirm operations before executing and provide status updates
- Suggest follow-up actions after successful operations

# Voice Interaction Style
- Be systematic and confirmative: "I'll create a Story ticket in project SQUID with proper formatting"
- Provide actionable results: "Ticket SQUID-123 created at [URL]"
- Reference specific capabilities: "Let me search for existing tickets first"
- Suggest next steps: "Would you like me to update the priority or search for related tickets?"
- Confirm template usage: "I've converted your user story template into ticket SQUID-456"
  `,
  handoffs: [], // Will be connected to other agents
  tools: [createJiraTicketTool, updateJiraTicketTool, searchJiraTicketsTool, createTicketFromTemplateTool, getProjectInfoTool],
  handoffDescription: 'Jira ticket management and workflow automation'
});

// Simple scenario export following their pattern
export const jiraScenario = [jiraAgent];
```

### Problems and Solutions
**Problem 1:** Tool parameter schema validation requirements  
- **Root Cause:** OpenAI tools require `required` array even when empty, missing this caused TypeScript compilation errors
- **Solution:** Engineering Manager intervention - added `required: []` to getProjectInfoTool parameter schema following exact reference pattern
- **Why this approach:** Ensures compatibility with OpenAI Realtime API and prevents schema validation failures

**Problem 2:** Comprehensive Jira workflow coverage
- **Root Cause:** SQUID-003 requires 5 different capabilities (create, update, search, template conversion, project info) in single agent
- **Solution:** Implemented 5 separate tools following exact OpenAI tool() pattern with proper parameter typing and execute functions
- **Why this approach:** Maintains OpenAI agent simplicity while providing complete Jira workflow automation

**Problem 3:** Template to Jira markup conversion
- **Root Cause:** User story templates from Product Manager use JSON structure but Jira expects formatted text with specific markup
- **Solution:** Created createTicketFromTemplate tool that converts JSON template sections to Jira markup (h2. headers, proper formatting)
- **Why this approach:** Enables seamless handoff workflow: Product Manager creates template → Jira agent converts to formatted ticket

### Udemy Tutorial Script
"In this lesson, we're implementing the Jira Integration tentacle - the bridge between our AI-generated user stories and your actual project management workflow.

This tentacle is crucial because it transforms our conversational AI work into actionable development tasks. When the Product Manager tentacle creates a user story, the Jira tentacle can instantly convert it into a properly formatted ticket in your project.

Let's understand the key capabilities we're building:
1. Creating tickets with proper Jira formatting
2. Converting user story templates to tickets
3. Searching existing tickets
4. Updating ticket information
5. Managing project configuration

The real power comes from the integration pattern. You can say 'Create a user story for authentication, then create a ticket for it,' and watch as the Product Manager tentacle gathers requirements, creates a template, hands off to the Jira tentacle, and creates a formatted ticket - all through natural conversation.

Let's start coding. Create `src/tentacles/jira-integration.ts`. Here's our core ticket creation capability:

```typescript
const createJiraTicket: TentacleCapability = {
  name: 'createJiraTicket',
  description: 'Create a new Jira ticket with user story content and proper formatting',
  parameters: {
    type: 'object',
    properties: {
      projectKey: { type: 'string', default: 'SQUID' },
      issueType: { type: 'string', enum: ['Story', 'Task', 'Bug', 'Epic'] },
      title: { type: 'string' },
      description: { type: 'string' }
    },
    required: ['title', 'description']
  }
};
```

Notice how we provide sensible defaults and enum constraints. This helps the AI make good decisions about ticket creation without requiring every parameter.

The execute function creates a realistic ticket structure:

```typescript
execute: async (input, details) => {
  // Generate realistic ticket ID
  const ticketId = `${input.projectKey}-${Math.floor(Math.random() * 1000) + 100}`;
  
  const ticket = {
    id: ticketId,
    url: `https://your-domain.atlassian.net/browse/${ticketId}`,
    fields: {
      summary: input.title,
      description: input.description,
      priority: { name: input.priority }
    }
  };
  
  // Store in context for other tentacles to use
  details?.squiddles?.updateContext({
    metadata: { lastCreatedTicket: ticket }
  });
  
  return { success: true, ticket, url: ticket.url };
}
```

The context update is crucial - it allows other tentacles (like Slack integration) to know about the new ticket and potentially notify the team.

Now here's where it gets interesting - the template integration:

```typescript
const createUserStoryFromTemplate: TentacleCapability = {
  name: 'createUserStoryFromTemplate',
  execute: async (input, details) => {
    const { template } = input;
    
    // Convert template to Jira markup
    const jiraDescription = `
h2. User Story
${template.userStory}

h2. Business Value
${template.sections.businessValue}

h2. Acceptance Criteria
${template.sections.acceptanceCriteria.map(criteria => `* ${criteria}`).join('\n')}
    `.trim();
    
    // Use existing ticket creation capability
    return await createJiraTicket.execute({
      title: template.title,
      description: jiraDescription,
      labels: ['squiddles-generated']
    }, details);
  }
};
```

This is a key pattern in Squiddles - capabilities can call other capabilities. This promotes code reuse and consistent behavior.

Let's set up the tentacle configuration:

```typescript
export const jiraIntegrationTentacle: Tentacle = {
  name: 'jiraIntegration',
  specialization: 'Jira ticket management, creation, and workflow automation',
  capabilities: [createJiraTicket, createUserStoryFromTemplate, searchJiraTickets],
  collaborators: ['productManager', 'slackIntegration'],
  handoffTriggers: ['create ticket', 'jira', 'update ticket'],
  instructions: `
    You handle all Jira operations efficiently and systematically.
    Always confirm what you're about to do before executing.
    Provide ticket URLs for easy access.
    Suggest follow-up actions after operations.
  `
};
```

Now let's test the integration. Register both tentacles and try this workflow:

```typescript
// Voice: "Create a user story for user login, then create a ticket"
// Should flow: ProductManager creates template → hands off to Jira → creates ticket
```

You should see the AI create a user story template, then automatically hand off to the Jira tentacle to create a properly formatted ticket.

Great! We've implemented seamless integration between AI conversation and project management. Key concepts we learned:
1. API abstraction with mock implementations
2. Cross-tentacle data flow through shared context
3. Capability composition for complex workflows
4. Format conversion between different systems

In the next lesson, we'll add Slack integration so the team gets notified about these new tickets automatically."