/**
 * Ticket Comments API Routes
 * Implements TICKET-003: Core Data Models API
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  MOCK_ENHANCED_TICKETS,
  MOCK_COMMENTS,
  getTicketById 
} from '@/lib/mock-data/tickets';
import { validateCommentCreation } from '@/lib/validation/ticket-schemas';
import { extractMentions } from '@/lib/utils/ticket-utils';
import { 
  CommentCreateRequest,
  ApiResponse,
  PaginatedResponse 
} from '@/app/types/api-endpoints';
import { Comment } from '@/app/types/ui-models';
import { getCurrentUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/tickets/[id]/comments - Get ticket comments
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getCurrentUser();
    if (!user) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Authentication required',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const { id: ticketId } = await params;
    const ticket = getTicketById(ticketId);

    if (!ticket) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Ticket not found',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get comments for this ticket
    const ticketComments = MOCK_COMMENTS.filter(comment => comment.ticketId === ticketId);
    
    // Sort by creation date (oldest first for comments)
    ticketComments.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = ticketComments.slice(startIndex, endIndex);

    const paginatedResponse: PaginatedResponse<Comment> = {
      items: paginatedComments,
      total: ticketComments.length,
      page,
      pageSize: limit,
      hasNext: endIndex < ticketComments.length,
      hasPrevious: page > 1,
    };

    const successResponse: ApiResponse<PaginatedResponse<Comment>> = {
      success: true,
      data: paginatedResponse,
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Comments GET API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/tickets/[id]/comments - Create new comment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getCurrentUser();
    if (!user) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Authentication required',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const { id: ticketId } = await params;
    const ticket = getTicketById(ticketId);

    if (!ticket) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Ticket not found',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const body: CommentCreateRequest = await request.json();
    
    // Validate comment data
    const commentData = {
      ...body,
      authorId: user.id,
      ticketId,
    };
    
    const validation = validateCommentCreation(commentData);
    if (!validation.isValid) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: validation.errors.join(', '),
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Extract mentions from content
    const mentions = body.mentions || extractMentions(body.content);

    // Create new comment
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newComment: Comment = {
      id: commentId,
      ticketId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff`,
      content: body.content.trim(),
      mentions,
      parentCommentId: body.parentCommentId,
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdViaVoice: !!body.voiceSessionId,
      voiceTranscript: body.voiceTranscript,
    };

    // Add comment to mock data
    MOCK_COMMENTS.push(newComment);

    // Update ticket's comment list
    const ticketIndex = MOCK_ENHANCED_TICKETS.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      MOCK_ENHANCED_TICKETS[ticketIndex].comments.push(newComment);
      MOCK_ENHANCED_TICKETS[ticketIndex].updatedAt = new Date();
    }

    const successResponse: ApiResponse<Comment> = {
      success: true,
      data: newComment,
      message: 'Comment created successfully',
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 201 });

  } catch (error) {
    console.error('Comments POST API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function PUT() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed - use /api/comments/[id] for comment updates',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function DELETE() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed - use /api/comments/[id] for comment deletion',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}