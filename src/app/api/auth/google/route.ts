/**
 * Google OAuth initiation endpoint
 * GET /api/auth/google - Redirects to Google OAuth consent screen
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8888/api/auth/callback/google';
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID in environment variables.' },
      { status: 500 }
    );
  }

  // Google OAuth 2.0 authorization URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  // Set OAuth parameters
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  
  // Optional: Add state parameter for security
  const state = Buffer.from(JSON.stringify({
    timestamp: Date.now(),
    source: 'gmail-config'
  })).toString('base64');
  authUrl.searchParams.set('state', state);

  console.log('🔐 Redirecting to Google OAuth:', authUrl.origin);

  // Redirect to Google OAuth
  return NextResponse.redirect(authUrl.toString());
}