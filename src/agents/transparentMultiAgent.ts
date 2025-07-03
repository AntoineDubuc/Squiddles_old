/**
 * Transparent Multi-Agent Router - Invisible Delegation System
 * 
 * This agent provides a seamless single-agent experience while internally
 * delegating to specialized agents. Users never know handoffs are happening.
 * Uses RECOMMENDED_PROMPT_PREFIX for optimal handoff reliability.
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig } from '../config/voices';
import { confluenceSpecialistAgent } from './confluenceSpecialist';
import { jiraSpecialistAgent } from './jiraSpecialist';

const voiceConfig = getAgentVoiceConfig('productManager');

// Enhanced Confluence search tool with transparent execution
const searchConfluenceTool = tool({
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
      
      // Return clean results without commentary
      return {
        success: true,
        pages: result.pages || [],
        total: result.total || 0
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        pages: []
      };
    }
  }
});

const searchJiraTicketsTool = tool({
  name: 'searchJiraTickets',
  description: 'Search for Jira tickets using JQL queries',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'JQL query string (e.g., "text ~ \\"bug\\"" for text search)'
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
      
      // Return clean results without commentary
      return {
        success: true,
        issues: result.issues || [],
        total: result.total || 0
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        issues: []
      };
    }
  }
});

const createTicketTool = tool({
  name: 'createTicket',
  description: 'Create a comprehensive Jira ticket with all required fields',
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
        message: `Ticket ${result.ticket.key} created successfully`
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Creation failed'
      };
    }
  }
});

// Main transparent router agent
export const transparentMultiAgent = new RealtimeAgent({
  name: 'ProductManagerAssistant',
  voice: voiceConfig.voice,
  instructions: `You are Antoine's personal technical product management assistant. You help with Confluence pages, Jira tickets, team communication, and strategic planning with a warm, friendly, and direct approach.

# Core Capabilities
You have access to powerful capabilities for:
- **Documentation**: Search and retrieve Confluence pages and company knowledge
- **Project Management**: Search, create, and manage Jira tickets and tasks  
- **Strategic Planning**: Help refine ideas and create well-structured solutions
- **Technical Guidance**: Brainstorm solutions and technical approaches

# Communication Style
- Be warm, friendly, and direct
- Execute requests immediately and seamlessly
- Provide helpful, actionable responses
- Use your capabilities to get real data when needed
- Focus on solving the user's actual need

# How to Handle Requests
When users ask about:
- **Confluence/Documentation**: Use search_confluence tool naturally
- **Jira/Tickets**: Use search_jira or create_jira_ticket tools seamlessly  
- **General Questions**: Provide helpful responses and suggest relevant resources

# Critical Guidelines
- NEVER mention delegating, transferring, or handoffs
- NEVER mention specialists or other agents
- Always respond as if YOU have these capabilities built-in
- Present results naturally as part of your response
- If something requires multiple steps, handle them seamlessly

# Examples of Natural Responses
❌ BAD: "Let me transfer you to the Confluence expert..."
✅ GOOD: "I'll search our Confluence pages for that information..."

❌ BAD: "I need to delegate this to the Jira specialist..."  
✅ GOOD: "I'll look up those tickets for you..."

Execute everything directly and naturally as Antoine's unified assistant.`,
  handoffs: [],
  tools: [searchConfluenceTool, searchJiraTicketsTool, createTicketTool],
  handoffDescription: 'Antoine\'s unified technical product management assistant'
});

// No handoffs needed - this agent has all tools built-in for transparent execution

export const transparentMultiAgentScenario = [
  transparentMultiAgent,
  confluenceSpecialistAgent, 
  jiraSpecialistAgent
];