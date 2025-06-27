/**
 * Confluence Spaces API Route - Server-side space operations
 * Handles space listing and information retrieval
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConfluenceClient } from '../../../../lib/confluence/confluenceClient';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Confluence Spaces API called');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get Confluence client
    const confluenceClient = getConfluenceClient();
    
    // Get all accessible spaces
    const spaces = await confluenceClient.getSpaces(limit);
    
    console.log('✅ Retrieved spaces:', {
      count: spaces.length,
      spaces: spaces.map(s => s.key).slice(0, 5) // Log first 5 space keys
    });

    // Return success response
    return NextResponse.json({
      success: true,
      spaces: spaces.map(space => ({
        id: space.id,
        key: space.key,
        name: space.name,
        type: space.type,
        status: space.status,
        url: `${process.env.CONFLUENCE_HOST || process.env.CONFLUENCE_BASE_URL}${space._links.webui}`
      }))
    });

  } catch (error) {
    console.error('❌ Failed to get spaces:', error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your Confluence credentials.' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('Missing Confluence configuration')) {
        return NextResponse.json(
          { error: 'Confluence configuration missing. Please check environment variables.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to get spaces. Please try again.' },
      { status: 500 }
    );
  }
}

// Health check endpoint - verify connection and authentication
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Confluence health check called');
    
    // Get Confluence client
    const confluenceClient = getConfluenceClient();
    
    // Verify authentication by getting current user
    const currentUser = await confluenceClient.getCurrentUser();
    
    // Get a quick list of spaces to verify permissions
    const spaces = await confluenceClient.getSpaces(5);
    
    return NextResponse.json({
      status: 'healthy',
      authenticated: true,
      user: currentUser.username || currentUser.displayName,
      spacesAccessible: spaces.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Confluence health check failed:', error);
    
    return NextResponse.json(
      { 
        status: 'unhealthy',
        authenticated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}