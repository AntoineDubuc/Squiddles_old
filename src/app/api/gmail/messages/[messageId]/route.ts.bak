/**
 * Gmail Message Detail API Endpoint - Fetch specific email content
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

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

// Parse full email message
function parseFullEmailMessage(message: any) {
  const headers = message.payload.headers;
  
  // Get email content
  let body = '';
  let htmlBody = '';
  
  if (message.payload.body?.data) {
    body = Buffer.from(message.payload.body.data, 'base64').toString();
  } else if (message.payload.parts) {
    // Multi-part message, extract both text and HTML
    for (const part of message.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        body = Buffer.from(part.body.data, 'base64').toString();
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        htmlBody = Buffer.from(part.body.data, 'base64').toString();
      }
    }
  }

  // Extract attachments info
  const attachments = [];
  if (message.payload.parts) {
    for (const part of message.payload.parts) {
      if (part.filename && part.filename.length > 0) {
        attachments.push({
          filename: part.filename,
          mimeType: part.mimeType,
          size: part.body?.size || 0,
          attachmentId: part.body?.attachmentId
        });
      }
    }
  }

  return {
    id: message.id,
    threadId: message.threadId,
    from: getHeader(headers, 'from'),
    to: getHeader(headers, 'to'),
    cc: getHeader(headers, 'cc'),
    bcc: getHeader(headers, 'bcc'),
    subject: getHeader(headers, 'subject'),
    date: getHeader(headers, 'date'),
    body,
    htmlBody,
    snippet: message.snippet,
    unread: message.labelIds?.includes('UNREAD') || false,
    labels: message.labelIds || [],
    attachments,
    internalDate: message.internalDate,
    sizeEstimate: message.sizeEstimate
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    console.log('📖 Fetching email:', messageId);

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

    // Fetch the specific message
    const messageResponse = await gmail.users.messages.get({
      userId: 'me',
      id: messageId
    });

    const email = parseFullEmailMessage(messageResponse.data);

    console.log(`✅ Fetched email: "${email.subject}"`);

    return NextResponse.json({
      success: true,
      email
    });

  } catch (error) {
    console.error('❌ Gmail message fetch error:', error);
    
    // Handle specific Gmail API errors
    if (error instanceof Error) {
      if (error.message.includes('insufficient authentication')) {
        return NextResponse.json(
          { error: 'Gmail authentication failed. Please check your credentials.' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('Not found')) {
        return NextResponse.json(
          { error: 'Email not found' },
          { status: 404 }
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
      { error: error instanceof Error ? error.message : 'Failed to fetch email' },
      { status: 500 }
    );
  }
}