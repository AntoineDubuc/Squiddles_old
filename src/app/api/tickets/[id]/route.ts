/**
 * Individual Ticket API Routes
 * Implements TICKET-003: Core Data Models API
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  MOCK_ENHANCED_TICKETS,
  getTicketById 
} from '@/lib/mock-data/tickets';
import { validateTicketUpdate, sanitizeTicketData } from '@/lib/validation/ticket-schemas';
import { findRelatedTickets } from '@/lib/utils/ticket-utils';
import { 
  TicketUpdateRequest,
  ApiResponse 
} from '@/app/types/api-endpoints';
import { EnhancedTicket } from '@/app/types/ui-models';
import { getCurrentUser, hasPermission } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/tickets/[id] - Get individual ticket with related tickets
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

    // Get related tickets
    const relatedTickets = findRelatedTickets(ticket, MOCK_ENHANCED_TICKETS, 3);

    const ticketWithRelated = {
      ...ticket,
      relatedTickets: relatedTickets.map(related => ({
        id: related.id,
        title: related.title,
        type: related.type,
        status: related.status,
        priority: related.priority,
        jiraKey: related.jiraKey,
      })),
    };

    const successResponse: ApiResponse<typeof ticketWithRelated> = {
      success: true,
      data: ticketWithRelated,
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Ticket GET API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/tickets/[id] - Update ticket
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const ticketIndex = MOCK_ENHANCED_TICKETS.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Ticket not found',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const existingTicket = MOCK_ENHANCED_TICKETS[ticketIndex];
    
    // Check permissions
    if (!hasPermission(user, 'edit_ticket')) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Insufficient permissions to edit tickets',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    const body: TicketUpdateRequest = await request.json();
    
    // Sanitize input data
    const sanitizedData = sanitizeTicketData(body);
    
    // Validate update data
    const validation = validateTicketUpdate(sanitizedData);
    if (!validation.isValid) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: validation.errors.join(', '),
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Update ticket fields
    const updatedTicket: EnhancedTicket = {
      ...existingTicket,
      title: sanitizedData.title ?? existingTicket.title,
      description: sanitizedData.description ?? existingTicket.description,
      status: sanitizedData.status ?? existingTicket.status,
      priority: sanitizedData.priority ?? existingTicket.priority,
      assigneeId: sanitizedData.assigneeId ?? existingTicket.assigneeId,
      assigneeName: sanitizedData.assigneeId ? 'Mock Assignee' : existingTicket.assigneeName,
      sprintId: sanitizedData.sprintId ?? existingTicket.sprintId,
      sprintName: sanitizedData.sprintId ? 'Mock Sprint' : existingTicket.sprintName,
      storyPoints: sanitizedData.storyPoints ?? existingTicket.storyPoints,
      acceptanceCriteria: sanitizedData.acceptanceCriteria ?? existingTicket.acceptanceCriteria,
      updatedAt: new Date(),
    };

    // Handle sections update
    if (sanitizedData.sections) {
      updatedTicket.sections = sanitizedData.sections.map((section: any, index: number) => ({
        id: section.id || `section_${Date.now()}_${index}`,
        name: section.name,
        content: section.content,
        type: section.type || 'text',
        order: index + 1,
      }));
    }

    // Update in mock data
    MOCK_ENHANCED_TICKETS[ticketIndex] = updatedTicket;

    const successResponse: ApiResponse<EnhancedTicket> = {
      success: true,
      data: updatedTicket,
      message: 'Ticket updated successfully',
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Ticket PUT API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/tickets/[id] - Delete ticket
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const ticketIndex = MOCK_ENHANCED_TICKETS.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Ticket not found',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const ticket = MOCK_ENHANCED_TICKETS[ticketIndex];
    
    // Check permissions
    if (!hasPermission(user, 'delete_ticket')) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Insufficient permissions to delete tickets',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    // Only allow deletion of tickets created by the user or if user is PM/TPM
    if (ticket.reporterId !== user.id && !['pm', 'tpm'].includes(user.role)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'You can only delete tickets you created',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    // Remove ticket from mock data
    MOCK_ENHANCED_TICKETS.splice(ticketIndex, 1);

    const successResponse: ApiResponse<null> = {
      success: true,
      message: 'Ticket deleted successfully',
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Ticket DELETE API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function POST() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed - use /api/tickets for ticket creation',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}