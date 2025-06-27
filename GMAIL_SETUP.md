# Gmail Integration Setup Guide

## Current Status
The Gmail OAuth endpoints have been created at:
- `/api/auth/google` - Initiates OAuth flow
- `/api/auth/callback/google` - Handles OAuth callback

## Required Environment Variables

Add these to your `.env` or `.env.local` file:

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8888/api/auth/callback/google
```

## Setup Steps

1. **Create a Google Cloud Project**
   - Go to https://console.cloud.google.com
   - Create a new project or select an existing one
   - Note the project ID

2. **Enable Gmail API**
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click on it and press "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" user type
     - Fill in the app information
     - Add your email to test users
   - For Application type, choose "Web application"
   - Add authorized redirect URI: `http://localhost:8888/api/auth/callback/google`
   - Copy the Client ID and Client Secret

4. **Configure Environment Variables**
   - Add the credentials to your `.env` file
   - Restart the Next.js development server

5. **Test the Integration**
   - Go to Settings > Integration Settings > Gmail > Configure
   - Click "Connect Gmail Account"
   - Complete the OAuth flow
   - You should be redirected back to the app with Gmail connected

## Troubleshooting

### 404 Error on Connect
- Make sure the development server is running
- Check that the routes are created in `/src/app/api/auth/`

### OAuth Error
- Verify the redirect URI matches exactly
- Ensure Gmail API is enabled in Google Cloud Console
- Check that your Google account is added as a test user

### Missing Credentials Error
- Ensure all three environment variables are set
- Restart the development server after adding them

## Security Notes

In production:
- Use HTTPS for redirect URIs
- Store tokens securely (encrypted database)
- Implement proper session management
- Use httpOnly cookies for sensitive data
- Add CSRF protection