/**
 * Unified Squiddles Agent - All capabilities in one agent
 * No transfers, no handoffs, just direct execution
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig } from '../config/voices';

// Confluence search tool
const searchPagesTool = tool({
  name: 'searchPages',
  description: 'Search for Confluence pages by title or get recent pages',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query for page titles (optional - if not provided, returns recent pages)'
      },
      spaceKey: {
        type: 'string',
        description: 'Confluence space key to limit search to (optional)'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 25)',
        default: 25
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { query, spaceKey, limit = 25 } = input as { 
      query?: string; 
      spaceKey?: string; 
      limit?: number; 
    };

    try {
      console.log('🔍 Confluence search requested:', { query, spaceKey, limit });

      const searchParams = new URLSearchParams();
      if (query) searchParams.append('query', query);
      if (spaceKey) searchParams.append('spaceKey', spaceKey);
      if (limit) searchParams.append('limit', limit.toString());

      const response = await fetch(`/api/confluence/pages?${searchParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Confluence search completed:', result.pages?.length || 0, 'pages found');

      return {
        success: true,
        pages: result.pages || [],
        total: result.total || 0,
        message: query 
          ? `Found ${result.total || 0} pages matching "${query}"`
          : `Found ${result.total || 0} recent pages`
      };

    } catch (error) {
      console.error('❌ Confluence search failed:', error);
      return {
        success: false,
        error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        pages: []
      };
    }
  }
});

// Jira search tool
const searchJiraTicketsTool = tool({
  name: 'searchJiraTickets',
  description: 'Search for Jira tickets using JQL queries. For text search, use: text ~ "search term"',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'JQL query string (e.g., "text ~ \\"bug\\"" for text search, "assignee = currentUser()" for my tickets)'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of tickets to return (default: 20)',
        default: 20
      }
    },
    required: ['query'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { query, limit = 20 } = input as { query: string; limit?: number; };

    try {
      console.log('🎫 Jira search requested:', { query, limit });

      const searchParams = new URLSearchParams();
      searchParams.append('jql', query);
      searchParams.append('maxResults', limit.toString());

      const response = await fetch(`/api/jira/search?${searchParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Jira search completed:', result.issues?.length || 0, 'tickets found');

      return {
        success: true,
        issues: result.issues || [],
        total: result.total || 0,
        message: `Found ${result.total || 0} tickets matching "${query}"`
      };

    } catch (error) {
      console.error('❌ Jira search failed:', error);
      return {
        success: false,
        error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        issues: []
      };
    }
  }
});

// Ticket creation tool
const createTicketTool = tool({
  name: 'createTicket',
  description: 'Create a comprehensive ticket with all required fields',
  parameters: {
    type: 'object',
    properties: {
      ticketName: { 
        type: 'string', 
        description: 'The ticket title/name' 
      },
      businessValue: { 
        type: 'string', 
        description: 'The business value and why this matters' 
      },
      context: { 
        type: 'string', 
        description: 'Background context and relevant information' 
      },
      ticketType: { 
        type: 'string', 
        enum: ['story', 'bug', 'task', 'spike'],
        description: 'Type of ticket: story, bug, task, or spike' 
      },
      acceptanceCriteria: { 
        type: 'string', 
        description: 'Clear acceptance criteria for completion' 
      },
      productReviewDataPoints: { 
        type: 'string', 
        description: 'Data points needed for product review' 
      }
    },
    required: ['ticketName', 'businessValue', 'context', 'ticketType', 'acceptanceCriteria', 'productReviewDataPoints'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { 
      ticketName, 
      businessValue, 
      context, 
      ticketType, 
      acceptanceCriteria, 
      productReviewDataPoints 
    } = input;

    try {
      const description = `## Business Value\n${businessValue}\n\n## Context\n${context}\n\n## Acceptance Criteria\n${acceptanceCriteria}\n\n## Product Review Data Points\n${productReviewDataPoints}`;

      const issueTypeMap: Record<string, string> = {
        'story': 'Story',
        'bug': 'Bug',
        'task': 'Task',
        'spike': 'Spike'
      };

      const response = await fetch('/api/jira/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: ticketName,
          description,
          projectKey: 'DE',
          issueType: issueTypeMap[ticketType] || 'Story',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        ticket: result.ticket,
        message: `✅ Jira ticket ${result.ticket.key} created successfully!`
      };

    } catch (error) {
      console.error('❌ Failed to create Jira ticket:', error);
      return {
        success: false,
        error: `Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

const voiceConfig = getAgentVoiceConfig('productManager');

// Unified agent with all capabilities
export const unifiedSquiddlesAgent = new RealtimeAgent({
  name: 'unifiedSquiddles',
  voice: voiceConfig.voice,
  instructions: `You are Antoine's personal technical product management assistant. You help with Jira tickets, Confluence pages, team communication, and strategic planning.

# Core Capabilities
- **Jira Integration**: Search tickets, create stories/bugs/tasks
- **Confluence Integration**: Search and find documentation pages  
- **Product Management**: Help refine ideas and create well-structured tickets
- **Strategic Planning**: Brainstorm solutions and technical approaches

# Communication Style
Be warm, friendly, and direct. Execute requests immediately without mentioning transfers or handoffs.

# For Confluence Requests
When users ask for Confluence pages (like "show me LinkedIn pages"), immediately use the searchPages tool to find and display the pages. Don't mention connecting to specialists.

# For Jira Requests  
When users ask about tickets or want to create tickets, use the appropriate Jira tools directly.

For Jira searches, convert user requests to JQL:
- Text search: text ~ "search term"
- My tickets: assignee = currentUser()
- Project tickets: project = "PROJECT_KEY"
- Status: status = "In Progress"
- Recent tickets: created >= -30d
- Combine with AND/OR: text ~ "bug" AND status = "Open"

# For General Requests
Provide helpful, actionable responses and use the relevant tools to get real data when needed.

IMPORTANT: Never mention transferring to other agents or specialists. You handle everything directly.`,
  handoffs: [],
  tools: [
    searchPagesTool,
    searchJiraTicketsTool, 
    createTicketTool
  ],
  handoffDescription: 'Unified assistant for all product management, Jira, and Confluence tasks'
});

export const unifiedSquiddlesScenario = [unifiedSquiddlesAgent];