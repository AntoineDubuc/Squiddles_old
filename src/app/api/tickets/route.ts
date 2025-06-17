/**
 * Tickets API Routes
 * Implements TICKET-003: Core Data Models API
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  MOCK_ENHANCED_TICKETS, 
  getTicketsPaginated,
  searchTickets 
} from '@/lib/mock-data/tickets';
import { validateTicketCreation, sanitizeTicketData } from '@/lib/validation/ticket-schemas';
import { filterTickets, sortTickets, generateJiraKey } from '@/lib/utils/ticket-utils';
import { 
  TicketListQuery, 
  TicketCreateRequest, 
  ApiResponse, 
  PaginatedResponse 
} from '@/app/types/api-endpoints';
import { EnhancedTicket } from '@/app/types/ui-models';
import { getCurrentUser } from '@/lib/auth';

// GET /api/tickets - List tickets with filtering and pagination
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    
    const query: TicketListQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      assigneeId: searchParams.get('assigneeId') || undefined,
      reporterId: searchParams.get('reporterId') || undefined,
      sprintId: searchParams.get('sprintId') || undefined,
      projectId: searchParams.get('projectId') || undefined,
      status: searchParams.get('status')?.split(',') || undefined,
      type: searchParams.get('type')?.split(',') || undefined,
      priority: searchParams.get('priority')?.split(',') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    // Validate pagination parameters
    if (query.page! < 1) query.page = 1;
    if (query.limit! < 1 || query.limit! > 100) query.limit = 10;

    let tickets = [...MOCK_ENHANCED_TICKETS];

    // Apply search if provided
    if (query.search) {
      tickets = searchTickets(query.search);
    }

    // Apply filters
    tickets = filterTickets(tickets, {
      status: query.status,
      priority: query.priority,
      type: query.type,
      assigneeId: query.assigneeId,
      sprintId: query.sprintId,
    });

    // Apply sorting
    if (query.sortBy === 'priority') {
      tickets = sortTickets(tickets, 'priority', query.sortOrder);
    } else if (query.sortBy === 'createdAt') {
      tickets = sortTickets(tickets, 'created', query.sortOrder);
    } else if (query.sortBy === 'updatedAt') {
      tickets = sortTickets(tickets, 'updated', query.sortOrder);
    } else if (query.sortBy === 'title') {
      tickets = tickets.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return query.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    const startIndex = (query.page! - 1) * query.limit!;
    const endIndex = startIndex + query.limit!;
    const paginatedTickets = tickets.slice(startIndex, endIndex);

    const paginatedResponse: PaginatedResponse<EnhancedTicket> = {
      items: paginatedTickets,
      total: tickets.length,
      page: query.page!,
      pageSize: query.limit!,
      hasNext: endIndex < tickets.length,
      hasPrevious: query.page! > 1,
    };

    const successResponse: ApiResponse<PaginatedResponse<EnhancedTicket>> = {
      success: true,
      data: paginatedResponse,
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Tickets GET API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/tickets - Create new ticket
export async function POST(request: NextRequest) {
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

    const body: TicketCreateRequest = await request.json();
    
    // Sanitize input data
    const sanitizedData = sanitizeTicketData(body);
    
    // Validate ticket data
    const validation = validateTicketCreation(sanitizedData);
    if (!validation.isValid) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: validation.errors.join(', '),
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Generate unique ID and Jira key
    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const jiraKey = generateJiraKey('SQUID', MOCK_ENHANCED_TICKETS);

    // Create new ticket
    const newTicket: EnhancedTicket = {
      id: ticketId,
      jiraKey,
      title: sanitizedData.title,
      description: sanitizedData.description,
      type: sanitizedData.type,
      status: 'todo',
      priority: sanitizedData.priority,
      assigneeId: sanitizedData.assigneeId,
      assigneeName: sanitizedData.assigneeId ? 'Mock Assignee' : undefined,
      reporterId: user.id,
      reporterName: user.name,
      sprintId: sanitizedData.sprintId,
      sprintName: sanitizedData.sprintId ? 'Mock Sprint' : undefined,
      projectId: sanitizedData.projectId || 'project_001',
      projectName: 'Squiddles Core',
      storyPoints: sanitizedData.storyPoints,
      acceptanceCriteria: sanitizedData.acceptanceCriteria || [],
      sections: sanitizedData.sections?.map((section: any, index: number) => ({
        id: `section_${Date.now()}_${index}`,
        name: section.name,
        content: section.content,
        type: section.type || 'text',
        order: index + 1,
      })) || [],
      comments: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdViaVoice: !!body.voiceSessionId,
      voiceSessionId: body.voiceSessionId,
      lastVoiceUpdate: body.voiceSessionId ? new Date() : undefined,
    };

    // In a real app, this would save to database
    MOCK_ENHANCED_TICKETS.push(newTicket);

    const successResponse: ApiResponse<EnhancedTicket> = {
      success: true,
      data: newTicket,
      message: 'Ticket created successfully',
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 201 });

  } catch (error) {
    console.error('Tickets POST API error:', error);
    
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
    error: 'Method not allowed - use /api/tickets/[id] for updates',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function DELETE() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed - use /api/tickets/[id] for deletion',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}