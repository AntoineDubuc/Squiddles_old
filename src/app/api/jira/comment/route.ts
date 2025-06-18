/**
 * Jira Comment API Route - Server-side comment posting
 * Handles comment creation securely with server-side authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJiraClient } from '../../../../../development-archive/integrations/jira/jiraClient';
import type { AdfDocument } from '../../../../../development-archive/integrations/jira/jiraClient';

interface CommentRequestBody {
  ticketKey: string;
  message: string;
  mentions?: Array<{
    accountId: string;
    displayName: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Jira Comment API called');
    
    // Parse request body
    const body: CommentRequestBody = await request.json();
    const { ticketKey, message, mentions } = body;

    // Validate required fields
    if (!ticketKey || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: ticketKey and message are required' },
        { status: 400 }
      );
    }

    // Validate ticket key format (basic check)
    if (!/^[A-Z]+-\d+$/.test(ticketKey)) {
      return NextResponse.json(
        { error: 'Invalid ticket key format. Expected format: ABC-123' },
        { status: 400 }
      );
    }

    console.log('📝 Posting comment:', {
      ticketKey,
      messageLength: message.length,
      mentionsCount: mentions?.length || 0
    });

    // Get Jira client
    const jiraClient = getJiraClient();
    
    // Create comment content
    let commentContent: string | AdfDocument = message;
    
    // If mentions are provided, create a rich comment with mentions
    if (mentions && mentions.length > 0) {
      // For now, we'll use the first mention and create a rich comment
      const primaryMention = mentions[0];
      commentContent = jiraClient.createMentionComment(
        message,
        primaryMention.accountId,
        primaryMention.displayName
      );
      
      console.log('💬 Created comment with mention for:', primaryMention.displayName);
    }

    // Post the comment
    const result = await jiraClient.addComment(ticketKey, commentContent);
    
    console.log('✅ Comment posted successfully:', {
      commentId: result.id,
      ticketKey,
      author: result.author.displayName,
      created: result.created
    });

    // Return success response
    return NextResponse.json({
      success: true,
      comment: {
        id: result.id,
        ticketKey,
        author: result.author.displayName,
        created: result.created,
        url: `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/browse/${ticketKey}?focusedCommentId=${result.id}`
      }
    });

  } catch (error) {
    console.error('❌ Failed to post comment:', error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your Jira credentials.' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Ticket not found. Please check the ticket key.' },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Missing Jira configuration')) {
        return NextResponse.json(
          { error: 'Jira configuration missing. Please check environment variables.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to post comment. Please try again.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET(request: NextRequest) {
  try {
    // Simple health check - verify Jira client can be created
    const jiraClient = getJiraClient();
    
    // Verify authentication by getting current user
    const currentUser = await jiraClient.getCurrentUser();
    
    return NextResponse.json({
      status: 'healthy',
      authenticated: true,
      user: currentUser.displayName,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Jira Comment API health check failed:', error);
    
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