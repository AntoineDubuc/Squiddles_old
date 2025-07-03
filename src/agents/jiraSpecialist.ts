/**
 * Jira Specialist Agent - Transparent Ticket Management Expert
 * 
 * This agent handles Jira operations invisibly - users think they're 
 * talking to the main assistant, not a specialist. Returns responses as if
 * from the primary assistant without mentioning delegation or specialization.
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig } from '../config/voices';

// Jira search tool with enhanced natural language responses
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
      console.log('🎫 [Jira Specialist] Search requested:', { query, limit });

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
      console.log('✅ [Jira Specialist] Search completed:', result.issues?.length || 0, 'tickets found');

      // Return clean results without commentary
      return {
        success: true,
        issues: result.issues || [],
        total: result.total || 0
      };

    } catch (error) {
      console.error('❌ [Jira Specialist] Search failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        issues: []
      };
    }
  }
});

// Jira ticket creation tool
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
        description: 'Business value and justification' 
      },
      acceptanceCriteria: { 
        type: 'string', 
        description: 'Clear acceptance criteria' 
      },
      technicalNotes: { 
        type: 'string', 
        description: 'Technical implementation notes (optional)' 
      },
      ticketType: { 
        type: 'string', 
        enum: ['story', 'bug', 'task', 'epic'],
        description: 'Type of ticket to create' 
      }
    },
    required: ['ticketName', 'businessValue', 'acceptanceCriteria', 'ticketType'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { ticketName, businessValue, acceptanceCriteria, technicalNotes, ticketType } = input;

    try {
      console.log('🎫 [Jira Specialist] Creating ticket:', ticketName);

      // Build comprehensive description
      let description = `## Business Value\n${businessValue}\n\n`;
      description += `## Acceptance Criteria\n${acceptanceCriteria}\n\n`;
      if (technicalNotes) {
        description += `## Technical Notes\n${technicalNotes}\n\n`;
      }

      const response = await fetch('/api/jira/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: ticketName,
          description,
          projectKey: 'DE',
          issueType: ticketType === 'story' ? 'Story' : 
                     ticketType === 'bug' ? 'Bug' : 
                     ticketType === 'task' ? 'Task' : 'Story',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ [Jira Specialist] Ticket created:', result.ticket?.key);

      return {
        success: true,
        ticket: result.ticket,
        message: `Ticket ${result.ticket.key} created successfully`
      };

    } catch (error) {
      console.error('❌ [Jira Specialist] Ticket creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Creation failed'
      };
    }
  }
});

const voiceConfig = getAgentVoiceConfig('productManager');

// Jira specialist agent - invisible to users
export const jiraSpecialistAgent = new RealtimeAgent({
  name: 'JiraCapability',
  voice: voiceConfig.voice,
  instructions: `You are Antoine's personal assistant helping with Jira ticket management. When users ask about tickets, want to create tickets, or need ticket information, you handle it seamlessly as if you always had this capability.

CRITICAL: Never mention that you are a specialist, that this was delegated, or that you're transferring anything. Always respond as if you are the main assistant who happens to have access to Jira.

# For Jira Searches
Convert user requests to proper JQL queries:
- Text search: text ~ "search term"
- My tickets: assignee = currentUser()
- Recent tickets: created >= -30d
- By status: status = "In Progress"
- By project: project = "PROJECT_KEY"
- Combine with AND/OR: text ~ "bug" AND status = "Open"

# For Ticket Creation
- Always ask for business value if not provided
- Ensure clear acceptance criteria
- Suggest technical considerations when relevant
- Use appropriate ticket type (story/bug/task/epic)

# Response Style
- Natural and helpful tone
- Present information clearly with ticket keys and links
- Focus on the content, not the process
- Provide context about ticket status and assignments
- Suggest follow-up actions when relevant

# Never Say
- "Transferring to Jira expert"
- "I'm a Jira specialist"  
- "This was delegated to me"
- "Handing off to ticket team"

Instead, seamlessly provide the information as Antoine's unified assistant.`,
  handoffs: [], // No further handoffs - this is a leaf specialist
  tools: [searchJiraTicketsTool, createTicketTool],
  handoffDescription: 'Search, create, and manage Jira tickets and project tasks'
});

export const jiraSpecialistScenario = [jiraSpecialistAgent];