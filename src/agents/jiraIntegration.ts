/**
 * Jira Integration Agent - Following OpenAI Advanced Agent Example Pattern
 * Based on: research/openai_advanced_agent_example/src/app/agentConfigs/simpleHandoff.ts
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Simple Jira ticket creation tool
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
      summary: string;
      description: string;
      projectKey: string;
      issueType: string;
    };
    
    // Generate realistic ticket ID and structure
    const ticketId = `${projectKey}-${Math.floor(Math.random() * 1000) + 100}`;
    const ticket = {
      id: ticketId,
      url: `https://your-domain.atlassian.net/browse/${ticketId}`,
      fields: {
        summary,
        description,
        project: { key: projectKey },
        issuetype: { name: issueType }
      }
    };
    
    return { success: true, ticket, url: ticket.url };
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
      ticketId: string;
      field: string;
      value: string;
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
      query: string;
      maxResults: number;
    };
    
    // Mock search results following their simple pattern
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

// Create ticket from user story template tool following same pattern
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
    const { template, projectKey } = input as {
      template: any;
      projectKey: string;
    };
    
    // Format template into Jira markup
    const jiraDescription = `
h2. User Story
${template.userStory || 'User story to be defined'}

h2. Business Value
${template.sections?.businessValue || 'Business value to be specified'}

h2. Context
${template.sections?.context || 'Context to be filled'}

h2. Acceptance Criteria
${template.sections?.acceptanceCriteria || 'Acceptance criteria to be created'}

---
_Created by Squiddles AI on ${new Date().toISOString()}_
    `.trim();
    
    const ticketId = `${projectKey}-${Math.floor(Math.random() * 1000) + 100}`;
    const ticket = {
      id: ticketId,
      url: `https://your-domain.atlassian.net/browse/${ticketId}`,
      fields: {
        summary: template.title || 'User story from template',
        description: jiraDescription,
        project: { key: projectKey },
        issuetype: { name: 'Story' },
        labels: ['squiddles-generated', 'user-story']
      }
    };
    
    return { success: true, ticket, url: ticket.url, templateUsed: template.id };
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
    
    // Mock project information
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

// Agent following their exact constructor pattern
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

export const jiraScenario = [jiraAgent];