/**
 * Gmail Drafts API Endpoint - Create email drafts
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Gmail scopes required for creating drafts
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

// Initialize OAuth2 client
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
}

// Create draft message in proper format for Gmail API
function createDraftMessage(to: string, subject: string, body: string, cc?: string, from?: string) {
  const message = [
    `From: ${from || process.env.GMAIL_FROM_EMAIL || 'noreply@squiddles.dev'}`,
    `To: ${to}`,
    cc ? `Cc: ${cc}` : '',
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    body
  ].filter(line => line !== '').join('\n');

  // Encode message in base64url format
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return { raw: encodedMessage };
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, cc } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body' },
        { status: 400 }
      );
    }

    console.log('📝 Creating email draft:', { to, subject, bodyLength: body.length });

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

    // Create the draft message
    const draftMessage = createDraftMessage(to, subject, body, cc);

    // Create the draft
    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: draftMessage
      }
    });

    console.log('✅ Draft created successfully:', response.data.id);

    return NextResponse.json({
      success: true,
      draftId: response.data.id,
      message: `Draft created for ${to}`
    });

  } catch (error) {
    console.error('❌ Gmail draft error:', error);
    
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
      { error: error instanceof Error ? error.message : 'Failed to create draft' },
      { status: 500 }
    );
  }
}