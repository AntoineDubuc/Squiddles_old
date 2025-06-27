/**
 * Gmail Messages API Endpoint - Fetch emails from Gmail
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Gmail scopes required for reading emails
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Initialize OAuth2 client
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
}

// Extract email headers
function getHeader(headers: any[], name: string): string {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
}

// Parse email message for display
function parseEmailMessage(message: any) {
  const headers = message.payload.headers;
  
  // Get email content
  let body = '';
  if (message.payload.body?.data) {
    body = Buffer.from(message.payload.body.data, 'base64').toString();
  } else if (message.payload.parts) {
    // Multi-part message, find text content
    const textPart = message.payload.parts.find((part: any) => 
      part.mimeType === 'text/plain' || part.mimeType === 'text/html'
    );
    if (textPart?.body?.data) {
      body = Buffer.from(textPart.body.data, 'base64').toString();
    }
  }

  return {
    id: message.id,
    threadId: message.threadId,
    from: getHeader(headers, 'from'),
    to: getHeader(headers, 'to'),
    subject: getHeader(headers, 'subject'),
    date: getHeader(headers, 'date'),
    body: body.substring(0, 500) + (body.length > 500 ? '...' : ''), // Truncate for list view
    snippet: message.snippet,
    unread: !message.labelIds?.includes('UNREAD') === false, // Check if message is unread
    labels: message.labelIds || []
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const query = searchParams.get('query') || '';
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    console.log('📬 Fetching emails:', { maxResults, query, unreadOnly });

    // Initialize OAuth2 client
    const oauth2Client = getOAuth2Client();

    // Check if we have stored credentials
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Gmail not configured. Please set up OAuth2 credentials.' },
        { status: 401 }
      );
    }

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Build search query
    let searchQuery = query;
    if (unreadOnly) {
      searchQuery = searchQuery ? `${searchQuery} is:unread` : 'is:unread';
    }

    // Get list of messages
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: searchQuery || undefined
    });

    const messages = listResponse.data.messages || [];

    // Fetch full message details for each message
    const emailPromises = messages.slice(0, maxResults).map(async (msg) => {
      const messageResponse = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!
      });
      return parseEmailMessage(messageResponse.data);
    });

    const emails = await Promise.all(emailPromises);

    console.log(`✅ Fetched ${emails.length} emails`);

    return NextResponse.json({
      success: true,
      emails,
      totalCount: listResponse.data.resultSizeEstimate || 0,
      nextPageToken: listResponse.data.nextPageToken
    });

  } catch (error) {
    console.error('❌ Gmail fetch error:', error);
    
    // Handle specific Gmail API errors
    if (error instanceof Error) {
      if (error.message.includes('insufficient authentication')) {
        return NextResponse.json(
          { error: 'Gmail authentication failed. Please check your credentials.' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Gmail API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}