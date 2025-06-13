/**
 * Slack Integration Agent - Following OpenAI Advanced Agent Example Pattern
 * Based on: research/openai_advanced_agent_example/src/app/agentConfigs/simpleHandoff.ts
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Send Slack message tool following exact OpenAI pattern
const sendSlackMessageTool = tool({
  name: 'sendSlackMessage',
  description: 'Send a message to a Slack channel or direct message',
  parameters: {
    type: 'object',
    properties: {
      channel: { type: 'string', description: 'Channel (#general) or user (@username)' },
      message: { type: 'string', description: 'Message content to send' },
      urgent: { type: 'boolean', description: 'Urgent notification flag', default: false }
    },
    required: ['channel', 'message'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { channel, message, urgent } = input as {
      channel: string;
      message: string;
      urgent: boolean;
    };
    
    // Generate realistic Slack message structure
    const slackMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channel,
      text: message,
      timestamp: new Date().toISOString(),
      user: 'squiddles-bot',
      permalink: `https://your-workspace.slack.com/archives/${channel.replace('#', '')}/p${Date.now()}`
    };
    
    return { success: true, message: slackMessage, channel, urgent };
  }
});

// Notify about ticket creation tool following same pattern
const notifyTicketCreatedTool = tool({
  name: 'notifyTicketCreated',
  description: 'Send a formatted notification about a newly created Jira ticket',
  parameters: {
    type: 'object',
    properties: {
      ticket: { type: 'object', description: 'Jira ticket object with fields and metadata' },
      channel: { type: 'string', description: 'Slack channel for notification', default: '#product-updates' }
    },
    required: ['ticket'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { ticket, channel } = input as {
      ticket: any;
      channel: string;
    };
    
    // Create rich Slack notification message
    const notificationMessage = `🎫 *New ${ticket.fields?.issuetype?.name || 'Ticket'} Created*

*<${ticket.url}|${ticket.id}>*: ${ticket.fields?.summary || 'New ticket'}

*Priority:* ${ticket.fields?.priority?.name || 'Medium'}
*Project:* ${ticket.fields?.project?.key || 'SQUID'}

_Created by Squiddles AI at ${new Date().toLocaleString()}_`;

    const slackMessage = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channel,
      text: notificationMessage,
      timestamp: new Date().toISOString(),
      user: 'squiddles-bot',
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: `🎫 New ${ticket.fields?.issuetype?.name || 'Ticket'} Created` }
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `*<${ticket.url}|${ticket.id}>*: ${ticket.fields?.summary}` }
        }
      ]
    };
    
    return { success: true, message: slackMessage, ticketNotified: ticket.id };
  }
});

// Search Slack messages tool following same pattern
const searchSlackHistoryTool = tool({
  name: 'searchSlackHistory',
  description: 'Search message history in Slack channels for context and information',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query terms' },
      channel: { type: 'string', description: 'Specific channel to search (optional)' },
      maxResults: { type: 'number', description: 'Maximum number of results', default: 10 }
    },
    required: ['query'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { query, channel, maxResults } = input as {
      query: string;
      channel?: string;
      maxResults: number;
    };
    
    // Mock search results following their simple pattern
    const results = {
      messages: [
        { 
          id: 'msg_001', 
          text: `Found message containing "${query}"`, 
          channel: channel || '#general',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          user: 'team_member'
        },
        { 
          id: 'msg_002', 
          text: `Another message with "${query}" context`, 
          channel: channel || '#product-updates',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          user: 'product_manager'
        }
      ],
      total: 2,
      query,
      searchedChannel: channel
    };
    
    return { success: true, results, total: results.total };
  }
});

// Create Slack channel tool following same pattern
const createSlackChannelTool = tool({
  name: 'createSlackChannel',
  description: 'Create a new Slack channel for team collaboration',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Channel name (without # prefix)' },
      purpose: { type: 'string', description: 'Channel purpose or description' },
      isPrivate: { type: 'boolean', description: 'Create as private channel', default: false }
    },
    required: ['name', 'purpose'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { name, purpose, isPrivate } = input as {
      name: string;
      purpose: string;
      isPrivate: boolean;
    };
    
    const channel = {
      id: `C${Date.now()}`,
      name: name.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      purpose,
      isPrivate,
      url: `https://your-workspace.slack.com/archives/${name}`,
      created: new Date().toISOString()
    };
    
    return { success: true, channel, channelName: `#${channel.name}` };
  }
});

// Schedule Slack reminder tool following same pattern
const scheduleSlackReminderTool = tool({
  name: 'scheduleSlackReminder',
  description: 'Schedule a reminder message for future delivery',
  parameters: {
    type: 'object',
    properties: {
      message: { type: 'string', description: 'Reminder message content' },
      channel: { type: 'string', description: 'Channel or user to send reminder to' },
      whenMinutes: { type: 'number', description: 'Minutes from now to send reminder', default: 60 }
    },
    required: ['message', 'channel'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { message, channel, whenMinutes } = input as {
      message: string;
      channel: string;
      whenMinutes: number;
    };
    
    const scheduledTime = new Date(Date.now() + (whenMinutes * 60 * 1000));
    const reminder = {
      id: `reminder_${Date.now()}`,
      message,
      channel,
      scheduledFor: scheduledTime.toISOString(),
      status: 'scheduled'
    };
    
    return { success: true, reminder, scheduledFor: scheduledTime.toLocaleString() };
  }
});

// Agent following their exact constructor pattern
export const slackAgent = new RealtimeAgent({
  name: 'slackIntegration',
  voice: 'alloy',
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
- Use notifyTicketCreated when other agents create tickets that need team awareness
- Always use appropriate formatting and emojis for professional appearance
- Provide clear confirmation of message delivery with timestamps and links
- Suggest follow-up actions after successful communications
- Be friendly and collaborative in tone while maintaining professionalism

# Voice Interaction Style
- Be confirmative and friendly: "I'll send that message to #general right away"
- Provide actionable results: "Message sent to #product-updates at 2:30 PM"
- Reference specific capabilities: "Let me search our message history for that topic"
- Suggest next steps: "Would you like me to schedule a follow-up reminder?"
- Acknowledge integrations: "I've notified the team about the new ticket SQUID-123"
  `,
  handoffs: [], // Will be connected to other agents
  tools: [sendSlackMessageTool, notifyTicketCreatedTool, searchSlackHistoryTool, createSlackChannelTool, scheduleSlackReminderTool],
  handoffDescription: 'Team communication and Slack workspace management'
});

// Simple scenario export following their pattern
export const slackScenario = [slackAgent];