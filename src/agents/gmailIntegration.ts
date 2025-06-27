/**
 * Gmail Integration Agent - Voice-enabled Gmail operations
 * Handles email sending, reading, and management
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig, generateStyleInstructions } from '../config/voices';

// Tool for sending emails
const sendEmailTool = tool({
  name: 'sendEmail',
  description: 'Send an email with optional attachments',
  parameters: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        description: 'Recipient email address'
      },
      subject: {
        type: 'string',
        description: 'Email subject line'
      },
      body: {
        type: 'string',
        description: 'Email body content'
      },
      cc: {
        type: 'string',
        description: 'CC recipients (comma-separated)'
      },
      bcc: {
        type: 'string',
        description: 'BCC recipients (comma-separated)'
      },
      priority: {
        type: 'string',
        enum: ['low', 'normal', 'high'],
        description: 'Email priority level',
        default: 'normal'
      }
    },
    required: ['to', 'subject', 'body'],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { to, subject, body, cc, bcc, priority = 'normal' } = input as {
      to: string;
      subject: string;
      body: string;
      cc?: string;
      bcc?: string;
      priority?: string;
    };

    try {
      console.log('📧 Sending email:', { to, subject, bodyLength: body.length, priority });

      // Send email via API
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          cc,
          bcc,
          priority
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        messageId: result.messageId,
        message: `Email sent successfully to ${to}`
      };

    } catch (error) {
      console.error('❌ Failed to send email:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to send email: ${errorMessage}`
      };
    }
  }
});

// Tool for reading recent emails
const getRecentEmailsTool = tool({
  name: 'getRecentEmails',
  description: 'Get recent emails from inbox',
  parameters: {
    type: 'object',
    properties: {
      maxResults: {
        type: 'number',
        description: 'Maximum number of emails to retrieve (default: 10)',
        default: 10
      },
      query: {
        type: 'string',
        description: 'Search query to filter emails (optional)'
      },
      unreadOnly: {
        type: 'boolean',
        description: 'Only fetch unread emails',
        default: false
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { maxResults = 10, query, unreadOnly = false } = input as {
      maxResults?: number;
      query?: string;
      unreadOnly?: boolean;
    };

    try {
      console.log('📬 Fetching recent emails:', { maxResults, query, unreadOnly });

      // Build search parameters
      const searchParams = new URLSearchParams();
      searchParams.append('maxResults', maxResults.toString());
      if (query) searchParams.append('query', query);
      if (unreadOnly) searchParams.append('unreadOnly', 'true');

      // Fetch emails via API
      const response = await fetch(`/api/gmail/messages?${searchParams.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        emails: result.emails,
        totalCount: result.totalCount,
        message: `Found ${result.emails.length} emails${query ? ` matching "${query}"` : ''}${unreadOnly ? ' (unread only)' : ''}`
      };

    } catch (error) {
      console.error('❌ Failed to fetch emails:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to fetch emails: ${errorMessage}`
      };
    }
  }
});

// Tool for reading a specific email
const readEmailTool = tool({
  name: 'readEmail',
  description: 'Read the content of a specific email',
  parameters: {
    type: 'object',
    properties: {
      messageId: {
        type: 'string',
        description: 'The ID of the email message to read'
      }
    },
    required: ['messageId'],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { messageId } = input as { messageId: string };

    try {
      console.log('📖 Reading email:', messageId);

      // Fetch email content via API
      const response = await fetch(`/api/gmail/messages/${messageId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        email: result.email,
        message: `Retrieved email: "${result.email.subject}"`
      };

    } catch (error) {
      console.error('❌ Failed to read email:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to read email: ${errorMessage}`
      };
    }
  }
});

// Tool for drafting emails (save for later)
const draftEmailTool = tool({
  name: 'draftEmail',
  description: 'Create a draft email to be sent later',
  parameters: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        description: 'Recipient email address'
      },
      subject: {
        type: 'string',
        description: 'Email subject line'
      },
      body: {
        type: 'string',
        description: 'Email body content'
      },
      cc: {
        type: 'string',
        description: 'CC recipients (comma-separated)'
      }
    },
    required: ['to', 'subject', 'body'],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { to, subject, body, cc } = input as {
      to: string;
      subject: string;
      body: string;
      cc?: string;
    };

    try {
      console.log('📝 Creating email draft:', { to, subject, bodyLength: body.length });

      // Create draft via API
      const response = await fetch('/api/gmail/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          cc
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        draftId: result.draftId,
        message: `Draft created successfully for ${to}`
      };

    } catch (error) {
      console.error('❌ Failed to create draft:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to create draft: ${errorMessage}`
      };
    }
  }
});

const voiceConfig = getAgentVoiceConfig('gmailIntegration');

export const gmailIntegrationAgent = new RealtimeAgent({
  name: 'gmailIntegration',
  voice: voiceConfig.voice,
  instructions: `You are Antoine's Gmail assistant. You help manage email communications, send messages, and organize inbox.

${generateStyleInstructions('gmailIntegration')}

# Priority Actions - You Handle These IMMEDIATELY:
- ANY mention of "email", "mail", "send", "inbox", "gmail", "message"
- "Send an email to [person]", "Email [person] about [topic]"
- "Check my emails", "Any new messages?", "Read my emails"
- "Draft an email", "Compose email", "Write email to [person]"
- Email composition and management tasks

# Your Tools:
- **sendEmail**: Send emails with subject, body, and recipients
- **getRecentEmails**: Fetch recent emails from inbox with optional filtering
- **readEmail**: Read the full content of a specific email
- **draftEmail**: Create draft emails to be sent later

# Command Recognition - RESPOND IMMEDIATELY TO:
When users say ANY variation of:
- "Send an email to [email] about [topic]" → Use sendEmail with generated content
- "Email [person] saying [message]" → Use sendEmail to compose and send
- "Check my recent emails" → Use getRecentEmails to fetch latest messages
- "Any unread emails?" → Use getRecentEmails with unreadOnly=true
- "Read email [ID]" → Use readEmail to get full content
- "Search for emails about [topic]" → Use getRecentEmails with query filter
- "Draft an email to [person]" → Use draftEmail to create draft
- "Compose email about [topic]" → Use either sendEmail or draftEmail based on context

# Response Formatting - CRITICAL:
When using email tools:
1. NEVER show raw JSON or tool output to the user
2. Always provide a human-friendly summary first
3. For email lists: show sender, subject, date in readable format
4. For email content: summarize key points unless full content requested
5. Example: "I found 5 unread emails:
   • From: john@company.com - Project Update (2 hours ago)
   • From: sarah@team.com - Meeting Notes (1 day ago)
   • From: alerts@system.com - System Maintenance (3 days ago)"
6. DO NOT include raw message IDs or technical details unless specifically asked

# Email Composition Guidelines:
- Always ask for clarification if recipient, subject, or purpose is unclear
- Suggest professional email templates for business communications
- Offer to create drafts for important emails before sending
- Include appropriate greetings and sign-offs
- Maintain Antoine's professional tone and style

# Context Awareness:
- Remember email preferences and frequently contacted people
- Suggest follow-up actions (reply, forward, archive)
- Offer to schedule emails or create reminders
- Integrate with calendar for meeting-related emails

You take priority over other agents for ANY email or messaging-related questions.`,
  handoffs: [],
  tools: [sendEmailTool, getRecentEmailsTool, readEmailTool, draftEmailTool],
  handoffDescription: 'Gmail integration agent for email management and communication',
});

export const gmailIntegrationScenario = [gmailIntegrationAgent];