/**
 * Slack Service Layer - React Hooks and Utilities
 * Following the pattern of jiraService.ts
 */

import { useState, useEffect } from 'react';
import type { 
  SlackMessage, 
  SlackChannel, 
  SlackSearchResult,
  SlackBotInfo 
} from '../types/slack-models';

// Hook for Slack bot connection status
export function useSlackConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [botInfo, setBotInfo] = useState<SlackBotInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        setLoading(true);
        const response = await fetch('/api/slack/messages');
        const data = await response.json();
        
        setIsConnected(data.success);
        setBotInfo(data.bot);
        setError(null);
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err.message : 'Connection failed');
      } finally {
        setLoading(false);
      }
    }

    checkConnection();
  }, []);

  return { isConnected, botInfo, loading, error };
}

// Hook for listing Slack channels
export function useSlackChannels() {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshChannels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/slack/channels');
      const data = await response.json();
      
      if (data.success) {
        setChannels(data.channels);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to load channels');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load channels');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshChannels();
  }, []);

  return { channels, loading, error, refreshChannels };
}

// Function to send a Slack message
export async function sendSlackMessage(
  channel: string, 
  text: string, 
  options?: {
    blocks?: any[];
    thread_ts?: string;
    urgent?: boolean;
  }
): Promise<{ success: boolean; error?: string; permalink?: string }> {
  try {
    const response = await fetch('/api/slack/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel,
        text,
        ...options
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return { 
        success: true, 
        permalink: data.message?.permalink 
      };
    } else {
      return { 
        success: false, 
        error: data.error || 'Failed to send message' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

// Function to create a Slack channel
export async function createSlackChannel(
  name: string,
  purpose?: string,
  isPrivate: boolean = false
): Promise<{ success: boolean; error?: string; channel?: SlackChannel }> {
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

    const data = await response.json();
    
    if (data.success) {
      return { 
        success: true, 
        channel: data.channel 
      };
    } else {
      return { 
        success: false, 
        error: data.error || 'Failed to create channel' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

// Function to search Slack messages
export async function searchSlackMessages(
  query: string,
  maxResults: number = 20
): Promise<{ success: boolean; error?: string; results?: SlackMessage[]; total?: number }> {
  try {
    const response = await fetch(
      `/api/slack/search?query=${encodeURIComponent(query)}&count=${maxResults}`
    );
    const data = await response.json();
    
    if (data.success) {
      return { 
        success: true, 
        results: data.results,
        total: data.total
      };
    } else {
      return { 
        success: false, 
        error: data.error || 'Search failed' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

// Function to schedule a Slack message
export async function scheduleSlackMessage(
  channel: string,
  text: string,
  minutesFromNow: number,
  options?: { blocks?: any[] }
): Promise<{ success: boolean; error?: string; scheduledMessageId?: string }> {
  try {
    const postAt = Math.floor((Date.now() + (minutesFromNow * 60 * 1000)) / 1000);
    
    const response = await fetch('/api/slack/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel,
        text,
        post_at: postAt,
        ...options
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return { 
        success: true, 
        scheduledMessageId: data.scheduled_message?.id 
      };
    } else {
      return { 
        success: false, 
        error: data.error || 'Failed to schedule message' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

// Utility function to format ticket notification for Slack
export function formatTicketNotificationBlocks(ticket: any) {
  return [
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
}

// Utility function to format channel name
export function formatChannelName(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

// Utility function to check if a string is a channel reference
export function isChannelReference(text: string): boolean {
  return text.startsWith('#') || text.startsWith('@') || !!text.match(/^C[A-Z0-9]{8,}$/);
}

// Utility function to extract channel ID from different formats
export function extractChannelId(channel: string): string {
  if (channel.startsWith('#')) {
    return channel.slice(1);
  }
  if (channel.startsWith('@')) {
    return channel.slice(1);
  }
  return channel;
}