/**
 * Slack Client - Following Jira Client Pattern
 * Provides server-side Slack API integration
 */

import { WebClient } from '@slack/web-api';
import type { 
  ChatPostMessageResponse, 
  ConversationsCreateResponse,
  ConversationsListResponse,
  ChatScheduleMessageResponse,
  SearchMessagesResponse
} from '@slack/web-api';

export interface SlackMessage {
  ts: string;
  channel: string;
  user: string;
  text: string;
  blocks?: any[];
  thread_ts?: string;
  permalink?: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  is_member: boolean;
  purpose?: { value: string };
  topic?: { value: string };
  created: number;
  num_members?: number;
}

export interface SendMessageInput {
  channel: string;
  text: string;
  blocks?: any[];
  thread_ts?: string;
  urgent?: boolean;
}

export interface CreateChannelInput {
  name: string;
  purpose?: string;
  is_private?: boolean;
}

export interface ScheduleMessageInput {
  channel: string;
  text: string;
  post_at: number;
  blocks?: any[];
}

export class SlackClient {
  private client: WebClient;
  
  constructor(token: string) {
    if (!token) {
      throw new Error('Slack token is required');
    }
    
    this.client = new WebClient(token);
  }

  /**
   * Send a message to a Slack channel or user
   */
  async sendMessage(input: SendMessageInput): Promise<ChatPostMessageResponse> {
    try {
      const result = await this.client.chat.postMessage({
        channel: input.channel,
        text: input.text,
        blocks: input.blocks,
        thread_ts: input.thread_ts,
        unfurl_links: true,
        unfurl_media: true
      });
      
      return result;
    } catch (error) {
      console.error('Failed to send Slack message:', error);
      throw new Error(`Slack API error: ${error}`);
    }
  }

  /**
   * Create a new Slack channel
   */
  async createChannel(input: CreateChannelInput): Promise<ConversationsCreateResponse> {
    try {
      const result = await this.client.conversations.create({
        name: input.name.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
        is_private: input.is_private || false
      });

      // Set channel purpose if provided
      if (input.purpose && result.channel?.id) {
        await this.client.conversations.setPurpose({
          channel: result.channel.id,
          purpose: input.purpose
        });
      }

      return result;
    } catch (error) {
      console.error('Failed to create Slack channel:', error);
      throw new Error(`Slack API error: ${error}`);
    }
  }

  /**
   * List channels accessible to the bot
   */
  async listChannels(excludeArchived: boolean = true): Promise<SlackChannel[]> {
    try {
      const result = await this.client.conversations.list({
        exclude_archived: excludeArchived,
        types: 'public_channel,private_channel'
      });

      return (result.channels || []).map(channel => ({
        id: channel.id!,
        name: channel.name!,
        is_private: channel.is_private || false,
        is_member: channel.is_member || false,
        purpose: channel.purpose,
        topic: channel.topic,
        created: channel.created || 0,
        num_members: channel.num_members
      }));
    } catch (error) {
      console.error('Failed to list Slack channels:', error);
      throw new Error(`Slack API error: ${error}`);
    }
  }

  /**
   * Search for messages in Slack
   */
  async searchMessages(query: string, count: number = 20): Promise<{
    messages: SlackMessage[];
    total: number;
  }> {
    try {
      const result = await this.client.search.messages({
        query,
        count,
        sort: 'timestamp'
      });

      const messages = (result.messages?.matches || []).map(match => ({
        ts: match.ts!,
        channel: match.channel?.id || '',
        user: match.user || '',
        text: match.text || '',
        permalink: match.permalink
      }));

      return {
        messages,
        total: result.messages?.total || 0
      };
    } catch (error) {
      console.error('Failed to search Slack messages:', error);
      // Don't throw for search failures, return empty results
      return { messages: [], total: 0 };
    }
  }

  /**
   * Schedule a message for future delivery
   */
  async scheduleMessage(input: ScheduleMessageInput): Promise<ChatScheduleMessageResponse> {
    try {
      const result = await this.client.chat.scheduleMessage({
        channel: input.channel,
        text: input.text,
        post_at: input.post_at,
        blocks: input.blocks
      });
      
      return result;
    } catch (error) {
      console.error('Failed to schedule Slack message:', error);
      throw new Error(`Slack API error: ${error}`);
    }
  }

  /**
   * Get bot info for verification
   */
  async getBotInfo(): Promise<{ ok: boolean; user?: any }> {
    try {
      const result = await this.client.auth.test();
      return {
        ok: result.ok || false,
        user: result
      };
    } catch (error) {
      console.error('Failed to get Slack bot info:', error);
      return { ok: false };
    }
  }

  /**
   * Format a message for ticket notifications
   */
  static formatTicketNotification(ticket: any): { text: string; blocks: any[] } {
    const text = `🎫 New ${ticket.fields?.issuetype?.name || 'Ticket'} Created: ${ticket.key}`;
    
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
          text: `*<${ticket.url}|${ticket.key}>*: ${ticket.fields?.summary || 'New ticket'}`
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
            text: `*Project:*\n${ticket.fields?.project?.key || 'Unknown'}`
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

    return { text, blocks };
  }
}

// Export a singleton instance factory
let clientInstance: SlackClient | null = null;

export function getSlackClient(): SlackClient {
  if (!clientInstance) {
    const token = process.env.BOT_OAUTH_TOKEN || process.env.SLACK_BOT_TOKEN;
    if (!token) {
      throw new Error('BOT_OAUTH_TOKEN or SLACK_BOT_TOKEN environment variable is required');
    }
    clientInstance = new SlackClient(token);
  }
  return clientInstance;
}