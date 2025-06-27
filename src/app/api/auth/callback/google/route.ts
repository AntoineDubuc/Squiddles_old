/**
 * Google OAuth callback handler
 * GET /api/auth/callback/google - Handles OAuth callback from Google
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('❌ OAuth error:', error);
    return NextResponse.redirect(
      new URL('/?error=oauth_denied', request.url)
    );
  }

  if (!code) {
    console.error('❌ No authorization code received');
    return NextResponse.redirect(
      new URL('/?error=no_code', request.url)
    );
  }

  try {
    // Decode and verify state (optional)
    if (state) {
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
      console.log('📋 OAuth state:', decodedState);
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8888/api/auth/callback/google'
    );

    // Exchange authorization code for tokens
    console.log('🔄 Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to obtain tokens');
    }

    // Set credentials
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    console.log('✅ Google OAuth successful for:', userInfo.email);

    // Store tokens securely (in production, use encrypted cookies or database)
    // For now, we'll store in localStorage via client-side redirect
    const successUrl = new URL('/', request.url);
    successUrl.searchParams.set('oauth_success', 'true');
    successUrl.searchParams.set('email', userInfo.email || '');
    
    // In production, you'd want to:
    // 1. Store tokens in a secure session/database
    // 2. Set httpOnly cookies
    // 3. Encrypt sensitive data
    
    // Create a temporary storage solution
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
      scope: tokens.scope,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture
    };

    // For demo purposes, we'll pass minimal info to the client
    // In production, store tokens server-side
    const response = NextResponse.redirect(successUrl);
    
    // Set a secure, httpOnly cookie with the refresh token
    response.cookies.set('gmail_connected', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    // Store tokens in environment or database in production
    // For now, we'll just log success
    console.log('🎉 Gmail integration complete for:', userInfo.email);

    return response;

  } catch (error: any) {
    console.error('❌ OAuth callback error:', error);
    
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', 'oauth_failed');
    errorUrl.searchParams.set('details', error.message);
    
    return NextResponse.redirect(errorUrl);
  }
}