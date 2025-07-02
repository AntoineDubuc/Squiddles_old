/**
 * Conversational Product Manager Agent - Gathers ticket requirements through structured conversation
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig, generateStyleInstructions } from '../config/voices';

// Enhanced ticket creation tool with all required fields
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
    } = input as { 
      ticketName: string; 
      businessValue: string; 
      context: string; 
      ticketType: string; 
      acceptanceCriteria: string; 
      productReviewDataPoints: string; 
    };

    try {
      // Format the description with all the gathered information
      const description = `## Business Value
${businessValue}

## Context
${context}

## Acceptance Criteria
${acceptanceCriteria}

## Product Review Data Points
${productReviewDataPoints}`;

      // Map ticketType to Jira issue type
      const issueTypeMap: Record<string, string> = {
        'story': 'Story',
        'bug': 'Bug',
        'task': 'Task',
        'spike': 'Spike'
      };

      // Create ticket via Jira API
      const response = await fetch('/api/jira/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: ticketName,
          description,
          projectKey: 'DE', // Default project
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

// Transfer tools for multi-agent handoffs
const transferToJiraTool = tool({
  name: 'transfer_to_jira',
  description: 'Transfer the conversation to the Jira agent for ticket implementation and management',
  parameters: {
    type: 'object',
    properties: {
      purpose: {
        type: 'string',
        description: 'The specific Jira task or reason for transfer'
      },
      context: {
        type: 'string',
        description: 'Current conversation context and planning details to pass along'
      }
    },
    required: ['purpose', 'context'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { purpose, context } = input;
    return {
      transfer: true,
      targetAgent: 'jiraIntegration',
      assistant_response: `Perfect! Let me connect you with our Jira specialist to ${purpose}.`,
      additionalInstructions: `The user has been brainstorming and planning with the Product Manager and now needs help with ${purpose}. Planning context: ${context}`
    };
  }
});

const transferToConfluenceTool = tool({
  name: 'transfer_to_confluence',
  description: 'Transfer the conversation to the Confluence agent for documentation creation',
  parameters: {
    type: 'object',
    properties: {
      purpose: {
        type: 'string',
        description: 'The documentation task or reason for transfer'
      },
      context: {
        type: 'string',
        description: 'Current conversation context and planning details to pass along'
      }
    },
    required: ['purpose', 'context'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { purpose, context } = input;
    return {
      transfer: true,
      targetAgent: 'confluenceIntegration',
      assistant_response: `Great idea! Let me connect you with our documentation specialist to ${purpose}.`,
      additionalInstructions: `The user has been planning with the Product Manager and now needs help with documentation for ${purpose}. Planning context: ${context}`
    };
  }
});

const transferToSlackTool = tool({
  name: 'transfer_to_slack',
  description: 'Transfer the conversation to the Slack agent for team communication and updates',
  parameters: {
    type: 'object',
    properties: {
      purpose: {
        type: 'string',
        description: 'The communication task or reason for transfer'
      },
      context: {
        type: 'string',
        description: 'Current conversation context and planning details to pass along'
      }
    },
    required: ['purpose', 'context'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { purpose, context } = input;
    return {
      transfer: true,
      targetAgent: 'slackIntegration',
      assistant_response: `Excellent! I'll connect you with our communication specialist to ${purpose}.`,
      additionalInstructions: `The user has been planning with the Product Manager and now needs help with team communication for ${purpose}. Planning context: ${context}`
    };
  }
});

const voiceConfig = getAgentVoiceConfig('productManager');

export const minimalProductManagerAgent = new RealtimeAgent({
  name: 'productManager',
  voice: voiceConfig.voice,
  instructions: `You are Antoine's personal technical product management assistant and brainstorming partner. You help refine ideas and create well-structured tickets through collaborative conversation.

${generateStyleInstructions('productManager')}

# Your Brainstorming Style:
- Think like a senior PM who asks the right questions
- Challenge assumptions and suggest alternatives  
- Help uncover the real problem behind the request
- Suggest technical considerations and edge cases
- Be genuinely curious and collaborative

# Ticket Creation Flow (Collaborative, not rigid):
Start with open exploration, then guide toward these required fields:
1. **Ticket Name** - Help craft a clear, descriptive title
2. **Business Value** - Dig into the "why" and impact 
3. **Context** - Understand the full background and constraints
4. **Ticket Type** - Determine if it's a story, bug, task, or spike
5. **Acceptance Criteria** - Define clear success conditions together
6. **Product Review Data Points** - Identify measurable outcomes

# Conversation Approach:
- Start broad: "Tell me about what you're trying to solve"
- Ask "why" to understand deeper motivations
- Suggest alternatives: "Have you considered..." or "What if we..."
- Probe for edge cases: "What happens when..."
- Help prioritize: "Given your other work, how important is this?"
- Refine together: "Let me repeat back what I heard..." 
- Validate understanding: "Does this capture what you meant?"

# Brainstorming Questions (use contextually):
- "What problem are users actually experiencing?"
- "What's the current workaround? Why isn't it good enough?"
- "Who else is affected by this? How?"
- "What would happen if we don't fix this?"
- "Is this a symptom of a bigger issue?"
- "What's the simplest version that would work?"
- "How would engineering/design approach this differently?"

# Technical PM Perspective:
- Consider technical debt and maintainability
- Think about scalability and performance implications
- Suggest phased approaches for complex features
- Identify dependencies and risks
- Recommend metrics and monitoring

# Use createTicket tool only when:
- All 6 required fields are well-defined
- The user seems satisfied with the refinement
- You've helped them think through alternatives

Be Antoine's thought partner, not just a form-filler. Help him create better tickets through real collaboration.

# When the user is ready to create the ticket in Jira:
- Use the createTicket tool to capture all the refined information
- The ticket will be created directly in Jira with all the details we discussed

# Agent Collaboration - HANDOFF WHEN APPROPRIATE:
- For ticket management: "Let me connect you with our Jira specialist" → transfer_to_jira
- For documentation creation: "I'll get our documentation expert" → transfer_to_confluence
- For team communication: "Our communication specialist can help" → transfer_to_slack
- Examples:
  * "Now let's implement this" → transfer_to_jira
  * "We should document this approach" → transfer_to_confluence
  * "Let's inform the team about this plan" → transfer_to_slack

You lead strategic thinking and planning, then collaborate with specialists for implementation.`,
  handoffs: [],
  tools: [createTicketTool, transferToJiraTool, transferToConfluenceTool, transferToSlackTool],
  handoffDescription: 'Collaborative product manager agent for brainstorming and creating refined tickets',
});

export const minimalProductManagerScenario = [minimalProductManagerAgent];