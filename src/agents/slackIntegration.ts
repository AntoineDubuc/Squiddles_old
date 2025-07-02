/**
 * Slack Integration Agent - Production Ready
 * Following OpenAI Advanced Agent Example Pattern with real API calls
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig, generateStyleInstructions } from '../config/voices';

// Send Slack message tool using real API
const sendSlackMessageTool = tool({
  name: 'sendSlackMessage',
  description: 'Send a message to a Slack channel or direct message',
  parameters: {
    type: 'object',
    properties: {
      channel: { 
        type: 'string', 
        description: 'Channel (#general) or user (@username) to send message to' 
      },
      message: { 
        type: 'string', 
        description: 'Message content to send' 
      },
      urgent: { 
        type: 'boolean', 
        description: 'Mark as urgent notification', 
        default: false 
      }
    },
    required: ['channel', 'message'],
    additionalProperties: false
  },
  execute: async (input: any, context?: any) => {
    const { channel, message, urgent } = input as {
      channel: string;
      message: string;
      urgent: boolean;
    };
    
    try {
      const response = await fetch('/api/slack/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          text: message,
          urgent
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      return {
        success: true,
        message: `Message sent to ${channel}`,
        permalink: result.message.permalink,
        timestamp: result.sent_at
      };
    } catch (error) {
      console.error('Failed to send Slack message:', error);
      return {
        success: false,
        error: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

// Notify about ticket creation using real API with rich formatting
const notifyTicketCreatedTool = tool({
  name: 'notifyTicketCreated',
  description: 'Send a formatted notification about a newly created Jira ticket',
  parameters: {
    type: 'object',
    properties: {
      ticket: { 
        type: 'object', 
        description: 'Jira ticket object with fields and metadata' 
      },
      channel: { 
        type: 'string', 
        description: 'Slack channel for notification', 
        default: '#product-updates' 
      }
    },
    required: ['ticket'],
    additionalProperties: false
  },
  execute: async (input: any, context?: any) => {
    const { ticket, channel = '#product-updates' } = input as {
      ticket: any;
      channel: string;
    };
    
    try {
      // Create rich Slack blocks for ticket notification
      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🎫 New ${ticket.fields?.issuetype?.name || 'Ticket'} Created`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${ticket.url || '#'}|${ticket.key || ticket.id}>*: ${ticket.fields?.summary || 'New ticket'}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Priority:*\n${ticket.fields?.priority?.name || 'Medium'}`
            },
            {
              type: 'mrkdwn',
              text: `*Project:*\n${ticket.fields?.project?.key || 'SQUID'}`
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Created by Squiddles AI • ${new Date().toLocaleString()}`
            }
          ]
        }
      ];
      
      const response = await fetch('/api/slack/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          text: `🎫 New ${ticket.fields?.issuetype?.name || 'Ticket'} Created: ${ticket.key || ticket.id}`,
          blocks
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send notification');
      }
      
      return {
        success: true,
        message: `Ticket notification sent to ${channel}`,
        ticketKey: ticket.key || ticket.id,
        permalink: result.message.permalink
      };
    } catch (error) {
      console.error('Failed to send ticket notification:', error);
      return {
        success: false,
        error: `Failed to send notification: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

// Search Slack messages using real API
const searchSlackHistoryTool = tool({
  name: 'searchSlackHistory',
  description: 'Search message history in Slack channels for context and information',
  parameters: {
    type: 'object',
    properties: {
      query: { 
        type: 'string', 
        description: 'Search query terms' 
      },
      maxResults: { 
        type: 'number', 
        description: 'Maximum number of results', 
        default: 10 
      }
    },
    required: ['query'],
    additionalProperties: false
  },
  execute: async (input: any, context?: any) => {
    const { query, maxResults = 10 } = input as {
      query: string;
      maxResults: number;
    };
    
    try {
      const response = await fetch(`/api/slack/search?query=${encodeURIComponent(query)}&count=${maxResults}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }
      
      return {
        success: true,
        query,
        results: result.results,
        total: result.total,
        message: `Found ${result.total} messages matching "${query}"`
      };
    } catch (error) {
      console.error('Failed to search Slack messages:', error);
      return {
        success: false,
        error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        results: []
      };
    }
  }
});

// Create Slack channel using real API
const createSlackChannelTool = tool({
  name: 'createSlackChannel',
  description: 'Create a new Slack channel for team collaboration',
  parameters: {
    type: 'object',
    properties: {
      name: { 
        type: 'string', 
        description: 'Channel name (without # prefix)' 
      },
      purpose: { 
        type: 'string', 
        description: 'Channel purpose or description' 
      },
      isPrivate: { 
        type: 'boolean', 
        description: 'Create as private channel', 
        default: false 
      }
    },
    required: ['name', 'purpose'],
    additionalProperties: false
  },
  execute: async (input: any, context?: any) => {
    const { name, purpose, isPrivate = false } = input as {
      name: string;
      purpose: string;
      isPrivate: boolean;
    };
    
    try {
      const response = await fetch('/api/slack/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          purpose,
          is_private: isPrivate
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create channel');
      }
      
      return {
        success: true,
        channel: result.channel,
        message: `Created ${isPrivate ? 'private' : 'public'} channel #${result.channel.name}`,
        channelUrl: result.channel.url
      };
    } catch (error) {
      console.error('Failed to create Slack channel:', error);
      return {
        success: false,
        error: `Failed to create channel: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

// Schedule Slack reminder using real API
const scheduleSlackReminderTool = tool({
  name: 'scheduleSlackReminder',
  description: 'Schedule a reminder message for future delivery',
  parameters: {
    type: 'object',
    properties: {
      message: { 
        type: 'string', 
        description: 'Reminder message content' 
      },
      channel: { 
        type: 'string', 
        description: 'Channel or user to send reminder to' 
      },
      whenMinutes: { 
        type: 'number', 
        description: 'Minutes from now to send reminder', 
        default: 60 
      }
    },
    required: ['message', 'channel'],
    additionalProperties: false
  },
  execute: async (input: any, context?: any) => {
    const { message, channel, whenMinutes = 60 } = input as {
      message: string;
      channel: string;
      whenMinutes: number;
    };
    
    try {
      const postAt = Math.floor((Date.now() + (whenMinutes * 60 * 1000)) / 1000);
      
      const response = await fetch('/api/slack/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          text: `⏰ Reminder: ${message}`,
          post_at: postAt
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to schedule reminder');
      }
      
      return {
        success: true,
        reminder: result.scheduled_message,
        message: `Reminder scheduled for ${new Date(postAt * 1000).toLocaleString()}`,
        scheduledFor: result.scheduled_message.post_at
      };
    } catch (error) {
      console.error('Failed to schedule Slack reminder:', error);
      return {
        success: false,
        error: `Failed to schedule reminder: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

// Transfer tools for multi-agent handoffs
const transferToJiraTool = tool({
  name: 'transfer_to_jira',
  description: 'Transfer the conversation to the Jira agent for ticket creation and management',
  parameters: {
    type: 'object',
    properties: {
      purpose: {
        type: 'string',
        description: 'The ticket-related task or reason for transfer'
      },
      context: {
        type: 'string',
        description: 'Current conversation context to pass along'
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
      assistant_response: `I'll connect you with our Jira specialist to ${purpose}.`,
      additionalInstructions: `The user was working with team communication and now needs help with ${purpose}. Previous context: ${context}`
    };
  }
});

const transferToConfluenceTool = tool({
  name: 'transfer_to_confluence',
  description: 'Transfer the conversation to the Confluence agent for documentation tasks',
  parameters: {
    type: 'object',
    properties: {
      purpose: {
        type: 'string',
        description: 'The documentation task or reason for transfer'
      },
      context: {
        type: 'string',
        description: 'Current conversation context to pass along'
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
      assistant_response: `Let me connect you with our documentation specialist for ${purpose}.`,
      additionalInstructions: `The user was working with team communication and now needs help with documentation for ${purpose}. Previous context: ${context}`
    };
  }
});

const transferToProductManagerTool = tool({
  name: 'transfer_to_product_manager',
  description: 'Transfer the conversation to the Product Manager agent for strategic planning',
  parameters: {
    type: 'object',
    properties: {
      task: {
        type: 'string',
        description: 'The planning or strategy task'
      },
      context: {
        type: 'string',
        description: 'Current conversation context to pass along'
      }
    },
    required: ['task', 'context'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { task, context } = input;
    return {
      transfer: true,
      targetAgent: 'minimalProductManager',
      assistant_response: `I'll connect you with our product strategy specialist for ${task}.`,
      additionalInstructions: `The user was working with team communication and now needs help with product planning for ${task}. Previous context: ${context}`
    };
  }
});

const voiceConfig = getAgentVoiceConfig('slackIntegration');

// Main Slack Integration Agent
export const slackIntegrationAgent = new RealtimeAgent({
  name: 'slackIntegration',
  voice: voiceConfig.voice,
  instructions: `
# Identity
You are a Slack integration specialist that manages team communication and notifications efficiently.

# Core Task
Handle team communication through Slack messages, automated notifications, channel management, and workflow integration with other agents.

# Your Capabilities
1. **sendSlackMessage** - Send messages to channels or direct messages with formatting
2. **notifyTicketCreated** - Send formatted notifications about new Jira tickets
3. **searchSlackHistory** - Search message history for context and information  
4. **createSlackChannel** - Create new channels for team collaboration
5. **scheduleSlackReminder** - Schedule future reminder messages

# Instructions
- Listen for requests to send messages, notify team, or manage Slack workflows
- Use notifyTicketCreated automatically when other agents create tickets that need team awareness
- Always use appropriate formatting and emojis for professional appearance
- Provide clear confirmation of message delivery with timestamps and links
- Suggest follow-up actions after successful communications
- Be friendly and collaborative in tone while maintaining professionalism
- Handle API errors gracefully and suggest alternatives

# Voice Interaction Style
- Be confirmative and friendly: "I'll send that message to #general right away"
- Provide actionable results: "Message sent to #product-updates with permalink"
- Reference specific capabilities: "Let me search our message history for that topic"
- Suggest next steps: "Would you like me to schedule a follow-up reminder?"
- Acknowledge integrations: "I've notified the team about the new ticket SQUID-123"
- Report errors helpfully: "I had trouble sending that message, let me try again"

# Agent Collaboration - HANDOFF WHEN NEEDED:
- For ticket creation: "Let me connect you with our Jira specialist" → transfer_to_jira
- For documentation: "I'll get our documentation expert" → transfer_to_confluence
- For strategic planning: "Our product manager can help with that" → transfer_to_product_manager
- Examples:
  * "Create a ticket about this issue" → transfer_to_jira
  * "Document this process" → transfer_to_confluence
  * "Should we change our approach?" → transfer_to_product_manager

You handle team communication and notifications, but collaborate with specialists for other needs.
  `,
  handoffs: [],
  tools: [
    sendSlackMessageTool, 
    notifyTicketCreatedTool, 
    searchSlackHistoryTool, 
    createSlackChannelTool, 
    scheduleSlackReminderTool,
    transferToJiraTool,
    transferToConfluenceTool,
    transferToProductManagerTool
  ],
  handoffDescription: 'Team communication and Slack workspace management with real-time notifications'
});

// Export scenario following established pattern
export const slackIntegrationScenario = [slackIntegrationAgent];