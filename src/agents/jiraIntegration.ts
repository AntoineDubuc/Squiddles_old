/**
 * Jira Integration Agent - Voice-enabled Jira comment replies
 * Handles context-aware comment posting to selected mentions
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Tool for replying to selected Jira mentions
const replyToMentionTool = tool({
  name: 'replyToMention',
  description: 'Reply to the currently selected Jira mention or comment with a message',
  parameters: {
    type: 'object',
    properties: {
      message: { 
        type: 'string', 
        description: 'The reply message to post to the selected Jira ticket' 
      },
      includeMention: {
        type: 'boolean',
        description: 'Whether to include a mention of the original commenter (default: false)',
        default: false
      }
    },
    required: ['message'],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { message, includeMention = false } = input as { 
      message: string; 
      includeMention?: boolean; 
    };

    try {
      // Get context from voice interface
      const context = details?.context as any;
      const selectedMention = context?.selectedMention;

      if (!selectedMention) {
        return { 
          success: false, 
          error: 'No mention selected for reply. Please select a mention from the dashboard first.' 
        };
      }

      console.log('🎙️ Voice reply requested:', {
        ticketKey: selectedMention.ticketKey,
        messageLength: message.length,
        includeMention
      });

      // Prepare API request
      const requestBody: any = {
        ticketKey: selectedMention.ticketKey,
        message: message.trim()
      };

      // Add mention if requested
      if (includeMention && selectedMention.authorAccountId && selectedMention.authorName) {
        requestBody.mentions = [{
          accountId: selectedMention.authorAccountId,
          displayName: selectedMention.authorName
        }];
      }

      // Post comment via API
      const response = await fetch('/api/jira/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      // Update reply context if available
      if (context?.setLastPostedComment) {
        context.setLastPostedComment({
          id: result.comment.id,
          ticketKey: selectedMention.ticketKey,
          url: result.comment.url,
          timestamp: new Date().toISOString()
        });
      }

      // Trigger dashboard refresh if available
      if (context?.refreshDashboard) {
        context.refreshDashboard();
      }

      return {
        success: true,
        commentId: result.comment.id,
        ticketKey: selectedMention.ticketKey,
        ticketTitle: selectedMention.ticketTitle,
        url: result.comment.url,
        message: `Reply posted successfully to ${selectedMention.ticketKey}`
      };

    } catch (error) {
      console.error('❌ Failed to post reply:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Update reply context with error if available
      const context = details?.context as any;
      if (context?.setReplyStatus) {
        context.setReplyStatus('error', errorMessage);
      }

      return {
        success: false,
        error: `Failed to post reply: ${errorMessage}`
      };
    }
  }
});

// Tool for getting information about the selected mention
const getSelectedMentionInfoTool = tool({
  name: 'getSelectedMentionInfo',
  description: 'Get details about the currently selected mention or comment',
  parameters: {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const context = details?.context as any;
    const selectedMention = context?.selectedMention;

    if (!selectedMention) {
      return {
        success: false,
        message: 'No mention is currently selected'
      };
    }

    return {
      success: true,
      mention: {
        ticketKey: selectedMention.ticketKey,
        ticketTitle: selectedMention.ticketTitle,
        authorName: selectedMention.authorName,
        urgency: selectedMention.urgency,
        commentPreview: selectedMention.commentPreview,
        created: selectedMention.created
      },
      message: `Selected mention is from ${selectedMention.ticketKey}: "${selectedMention.ticketTitle}" by ${selectedMention.authorName} (${selectedMention.urgency} priority)`
    };
  }
});

// Tool for checking Jira system status
const checkJiraStatusTool = tool({
  name: 'checkJiraStatus',
  description: 'Check if Jira integration is working properly',
  parameters: {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    try {
      const response = await fetch('/api/jira/comment', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        status: result.status,
        authenticated: result.authenticated,
        user: result.user,
        message: `Jira integration is ${result.status}. Authenticated as ${result.user}.`
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Jira integration is not working properly. Please check your configuration.'
      };
    }
  }
});

export const jiraIntegrationAgent = new RealtimeAgent({
  name: 'jiraIntegration',
  voice: 'sage',
  instructions: `You are the PRIMARY Jira integration assistant. You handle ALL Jira-related actions including replies, comments, and ticket interactions.

# Priority Actions - You Handle These:
- ANY mention of "reply", "respond", "answer", "comment" on tickets/mentions
- "Post a comment", "Add a comment", "Leave a comment"
- "Reply to this", "Respond to that", "Answer this"
- References to selected mentions, tickets, or Jira items
- Jira status checks and diagnostics

# Your Tools:
- **replyToMention**: Post replies to selected Jira mentions or comments
- **getSelectedMentionInfo**: Get details about the currently selected mention  
- **checkJiraStatus**: Verify Jira integration is working

# Command Recognition:
When users say ANY variation of:
- "Reply to this saying [message]" → Use replyToMention with the message
- "Post a comment that [message]" → Use replyToMention with the message
- "Add a comment saying [message]" → Use replyToMention with the message
- "Respond with [message]" → Use replyToMention with the message

# Context Awareness:
- Always check if a mention is selected before replying
- Extract the user's message from their natural language
- Provide clear confirmations of actions taken

You take priority over other agents for ANY Jira or commenting actions.`,
  handoffs: [],
  tools: [replyToMentionTool, getSelectedMentionInfoTool, checkJiraStatusTool],
  handoffDescription: 'Jira integration agent for replying to mentions and managing tickets',
});

export const jiraIntegrationScenario = [jiraIntegrationAgent];