/**
 * Jira Integration Agent - Real Jira API integration
 * Handles ticket search, creation, and sprint management
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig, generateStyleInstructions } from '../config/voices';

// Search Jira tickets tool
const searchJiraTicketsTool = tool({
  name: 'searchJiraTickets',
  description: 'Search for Jira tickets using JQL query or keywords',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query or JQL expression (e.g., "project = DE AND sprint in openSprints()", "AFS", "assignee = currentUser()")'
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of results to return (default: 20)',
        default: 20
      }
    },
    required: ['query'],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { query, maxResults = 20 } = input as { 
      query: string; 
      maxResults?: number; 
    };

    try {
      console.log('🔍 Jira search requested:', { query, maxResults });

      // Build search parameters
      const searchParams = new URLSearchParams();
      searchParams.append('jql', query);
      searchParams.append('maxResults', maxResults.toString());

      // Search tickets via API
      const response = await fetch(`/api/jira/search?${searchParams.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        issues: result.issues,
        total: result.total,
        message: `Found ${result.issues.length} tickets${result.total > result.issues.length ? ` (showing first ${result.issues.length} of ${result.total})` : ''}`
      };

    } catch (error) {
      console.error('❌ Failed to search Jira tickets:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to search tickets: ${errorMessage}`
      };
    }
  }
});

// Create Jira ticket tool
const createJiraTicketTool = tool({
  name: 'createJiraTicket',
  description: 'Create a new Jira ticket with summary, description, and other fields',
  parameters: {
    type: 'object',
    properties: {
      summary: {
        type: 'string',
        description: 'Ticket title/summary'
      },
      description: {
        type: 'string',
        description: 'Detailed description of the ticket'
      },
      projectKey: {
        type: 'string',
        description: 'Project key (e.g., "DE", "SQUID")',
        default: 'DE'
      },
      issueType: {
        type: 'string',
        description: 'Issue type (e.g., "Story", "Bug", "Task")',
        default: 'Story'
      },
      priority: {
        type: 'string',
        description: 'Priority level (e.g., "High", "Medium", "Low")'
      },
      assignee: {
        type: 'string',
        description: 'Assignee username or email'
      }
    },
    required: ['summary', 'description'],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { 
      summary, 
      description, 
      projectKey = 'DE', 
      issueType = 'Story',
      priority,
      assignee
    } = input as { 
      summary: string; 
      description: string; 
      projectKey?: string;
      issueType?: string;
      priority?: string;
      assignee?: string;
    };

    try {
      console.log('🎫 Creating Jira ticket:', {
        summary,
        projectKey,
        issueType,
        descriptionLength: description.length
      });

      // Create ticket via API
      const response = await fetch('/api/jira/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary,
          description,
          projectKey,
          issueType,
          priority,
          assignee
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
      console.error('❌ Failed to create Jira ticket:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to create ticket: ${errorMessage}`
      };
    }
  }
});

// Get information about the currently selected ticket
const getSelectedTicketTool = tool({
  name: 'getSelectedTicket',
  description: 'Get information about the currently selected ticket from the dashboard',
  parameters: {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    try {
      console.log('🎯 Getting selected ticket info, details:', details);
      
      // Access the selected mention from the context
      const selectedMention = details?.selectedMention;
      
      if (!selectedMention) {
        return {
          success: false,
          error: 'No ticket is currently selected. Please select a ticket from the dashboard first.'
        };
      }

      return {
        success: true,
        selectedTicket: {
          ticketKey: selectedMention.ticketKey,
          summary: selectedMention.summary,
          status: selectedMention.status,
          priority: selectedMention.priority,
          assignee: selectedMention.assignee,
          urgency: selectedMention.urgency,
          commentPreview: selectedMention.commentPreview,
          commentAuthor: selectedMention.commentAuthor,
          timestamp: selectedMention.timestamp,
          directLinkUrl: selectedMention.directLinkUrl
        },
        message: `Selected ticket: ${selectedMention.ticketKey} - ${selectedMention.summary || 'No summary available'}`
      };

    } catch (error) {
      console.error('❌ Failed to get selected ticket:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to get selected ticket: ${errorMessage}`
      };
    }
  }
});

// Get current sprint tickets tool
const getCurrentSprintTool = tool({
  name: 'getCurrentSprint',
  description: 'Get tickets in the current/active sprint for a project',
  parameters: {
    type: 'object',
    properties: {
      projectKey: {
        type: 'string',
        description: 'Project key to get sprint for (e.g., "DE")',
        default: 'DE'
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { projectKey = 'DE' } = input as { projectKey?: string };

    try {
      console.log('🏃‍♂️ Getting current sprint for project:', projectKey);

      // Use JQL to find current sprint tickets
      const jql = `project = ${projectKey} AND sprint in openSprints() ORDER BY priority DESC, created DESC`;
      
      const searchParams = new URLSearchParams();
      searchParams.append('jql', jql);
      searchParams.append('maxResults', '50');

      const response = await fetch(`/api/jira/search?${searchParams.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        issues: result.issues,
        total: result.total,
        projectKey,
        message: `Found ${result.issues.length} tickets in current sprint for project ${projectKey}`
      };

    } catch (error) {
      console.error('❌ Failed to get current sprint:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to get current sprint: ${errorMessage}`
      };
    }
  }
});

const voiceConfig = getAgentVoiceConfig('jiraIntegration');

export const jiraIntegrationAgent = new RealtimeAgent({
  name: 'jiraIntegration',
  voice: voiceConfig.voice,
  instructions: `You are Antoine's Jira ticket management assistant. You help search for tickets, create new tickets, and manage sprint work.

${generateStyleInstructions('jiraIntegration')}

# SELECTED TICKET CONTEXT:
When a user has selected a specific ticket from the dashboard, you have access to that ticket's context through the selectedMention parameter in your tools. 

# CONTEXT-AWARE RESPONSES:
CRITICAL: When this agent is active, it means a user has likely selected a ticket from the dashboard. ALWAYS start by using getSelectedTicket to check if there's a selected ticket before asking for ticket keys.

- If a user asks "Summarize this ticket" → IMMEDIATELY use getSelectedTicket first
- If a user asks "What's the status?" → IMMEDIATELY use getSelectedTicket first
- If a user asks "Reply to this" → IMMEDIATELY use getSelectedTicket first
- If a user asks anything about "this ticket" → IMMEDIATELY use getSelectedTicket first
- When you detect context-specific questions, ALWAYS check for selected ticket first
- If getSelectedTicket returns a ticket, use that information and don't ask for ticket keys

# Priority Actions - You Handle These IMMEDIATELY:
- ANY mention of "tickets", "jira", "sprint", "issues", "stories", "bugs"
- "Search for tickets", "Find tickets", "Show me tickets"
- "What's in our current sprint?", "Current sprint tickets", "Sprint backlog"
- "Create a ticket", "Make a ticket", "New ticket"
- "AFS tickets", "tickets about [topic]", "assigned to me"
- Sprint-related queries and ticket searches

# Your Tools:
- **getSelectedTicket**: Get information about the currently selected ticket (use this first when user refers to "this ticket" or asks context-specific questions)
- **searchJiraTickets**: Search for tickets using JQL or keywords
- **createJiraTicket**: Create new tickets with summary, description, etc.
- **getCurrentSprint**: Get tickets in the current/active sprint

# Command Recognition - RESPOND IMMEDIATELY TO:

## Context-Aware Commands (when ticket is selected):
- "Summarize this ticket" → Use getSelectedTicket to get full ticket info
- "What's the status of this?" → Use getSelectedTicket then describe status
- "Who is assigned to this?" → Use getSelectedTicket then mention assignee
- "What's the priority?" → Use getSelectedTicket then describe priority
- "Reply to this saying [message]" → Use getSelectedTicket to identify ticket, then compose reply
- "Find documentation about this" → Use getSelectedTicket to get topic, then search Confluence

## General Commands:
- "Do we have AFS tickets in our current sprint?" → Use getCurrentSprint then filter for AFS
- "Search for [topic] tickets" → Use searchJiraTickets with query
- "What tickets are assigned to me?" → Use searchJiraTickets with "assignee = currentUser()"
- "Show current sprint" → Use getCurrentSprint
- "Create a ticket for [topic]" → Use createJiraTicket
- "Find bugs about [topic]" → Use searchJiraTickets with "type = Bug AND text ~ '[topic]'"

# Response Formatting - CRITICAL:
When using searchJiraTickets or getCurrentSprint:
1. NEVER show raw JSON or tool output to the user
2. Always provide a human-friendly summary first
3. Format results as a readable list with key information
4. Example: "I found 3 AFS-related tickets in the current sprint:
   • DE-3293: AFS Metric Implementation (High priority, assigned to John)
   • DE-3294: AFS UI Updates (Medium priority, in progress)
   • DE-3295: AFS Testing (Low priority, not started)"
5. Include ticket keys, titles, status, priority, and assignee when available
6. DO NOT include raw tool output, JSON data, or technical details

# Context Awareness:
- Default project is "DE" unless specified otherwise
- Use appropriate JQL queries for complex searches
- Provide ticket URLs when available for easy access
- Suggest related actions after searches (create ticket, update status, etc.)

You take priority over other agents for ANY ticket or sprint-related questions.`,
  handoffs: [],
  tools: [searchJiraTicketsTool, createJiraTicketTool, getCurrentSprintTool, getSelectedTicketTool],
  handoffDescription: 'Jira integration agent for ticket management and sprint queries',
});

export const jiraIntegrationScenario = [jiraIntegrationAgent];