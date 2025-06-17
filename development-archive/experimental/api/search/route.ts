/**
 * Search API Route
 * Implements TICKET-003: Core Data Models API
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  MOCK_ENHANCED_TICKETS,
  MOCK_COMMENTS,
  searchTickets 
} from '@/lib/mock-data/tickets';
import { MOCK_USERS } from '@/lib/mock-data/users';
import { validateSearchQuery } from '@/lib/validation/ticket-schemas';
import { 
  SearchQuery,
  SearchResponse,
  SearchResult,
  ApiResponse 
} from '@/app/types/api-endpoints';
import { getCurrentUser } from '@/lib/auth';

// GET /api/search - Global search across tickets, comments, and users
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
    
    const searchQuery: SearchQuery = {
      query: searchParams.get('query') || '',
      types: searchParams.get('types')?.split(',') as any[] || ['tickets', 'comments', 'users'],
      limit: parseInt(searchParams.get('limit') || '20'),
      includeContent: searchParams.get('includeContent') === 'true',
      filters: {
        projectId: searchParams.get('projectId') || undefined,
        assigneeId: searchParams.get('assigneeId') || undefined,
        status: searchParams.get('status')?.split(',') || undefined,
        dateRange: searchParams.get('dateStart') && searchParams.get('dateEnd') ? {
          start: new Date(searchParams.get('dateStart')!),
          end: new Date(searchParams.get('dateEnd')!),
        } : undefined,
      },
    };

    // Validate search query
    const validation = validateSearchQuery(searchQuery);
    if (!validation.isValid) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Invalid search query',
        message: validation.errors.join(', '),
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!searchQuery.query || searchQuery.query.length < 2) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Search query must be at least 2 characters long',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const startTime = Date.now();
    const results: SearchResult[] = [];
    const queryLower = searchQuery.query.toLowerCase();

    // Search tickets if requested
    if (searchQuery.types!.includes('tickets')) {
      const matchingTickets = searchTickets(searchQuery.query);
      
      // Apply additional filters
      let filteredTickets = matchingTickets;
      
      if (searchQuery.filters?.projectId) {
        filteredTickets = filteredTickets.filter(ticket => 
          ticket.projectId === searchQuery.filters!.projectId
        );
      }
      
      if (searchQuery.filters?.assigneeId) {
        filteredTickets = filteredTickets.filter(ticket => 
          ticket.assigneeId === searchQuery.filters!.assigneeId
        );
      }
      
      if (searchQuery.filters?.status?.length) {
        filteredTickets = filteredTickets.filter(ticket => 
          searchQuery.filters!.status!.includes(ticket.status)
        );
      }
      
      if (searchQuery.filters?.dateRange) {
        filteredTickets = filteredTickets.filter(ticket => {
          const ticketDate = new Date(ticket.createdAt);
          return ticketDate >= searchQuery.filters!.dateRange!.start && 
                 ticketDate <= searchQuery.filters!.dateRange!.end;
        });
      }

      // Convert to search results with scoring
      for (const ticket of filteredTickets) {
        const titleMatch = ticket.title.toLowerCase().includes(queryLower);
        const descMatch = ticket.description.toLowerCase().includes(queryLower);
        const jiraMatch = ticket.jiraKey?.toLowerCase().includes(queryLower);
        const sectionMatch = ticket.sections.some(section => 
          section.content.toLowerCase().includes(queryLower)
        );

        // Simple scoring based on match location
        let score = 0;
        if (titleMatch) score += 10;
        if (jiraMatch) score += 8;
        if (descMatch) score += 5;
        if (sectionMatch) score += 3;

        // Boost score for exact matches
        if (ticket.title.toLowerCase() === queryLower) score += 20;
        if (ticket.jiraKey?.toLowerCase() === queryLower) score += 15;

        const highlights: string[] = [];
        if (titleMatch) highlights.push(`Title: ${ticket.title}`);
        if (jiraMatch) highlights.push(`Key: ${ticket.jiraKey}`);
        if (descMatch) {
          const snippet = ticket.description.substring(0, 150);
          highlights.push(`Description: ${snippet}...`);
        }

        results.push({
          type: 'ticket',
          id: ticket.id,
          title: ticket.title,
          description: searchQuery.includeContent ? ticket.description : 
                      `${ticket.type} - ${ticket.status} - ${ticket.priority}`,
          score,
          highlights,
          metadata: {
            jiraKey: ticket.jiraKey,
            type: ticket.type,
            status: ticket.status,
            priority: ticket.priority,
            assigneeName: ticket.assigneeName,
            createdAt: ticket.createdAt,
          },
        });
      }
    }

    // Search comments if requested
    if (searchQuery.types!.includes('comments')) {
      const matchingComments = MOCK_COMMENTS.filter(comment => 
        comment.content.toLowerCase().includes(queryLower)
      );

      for (const comment of matchingComments) {
        const ticket = MOCK_ENHANCED_TICKETS.find(t => t.id === comment.ticketId);
        if (!ticket) continue;

        // Apply ticket-level filters
        if (searchQuery.filters?.projectId && ticket.projectId !== searchQuery.filters.projectId) {
          continue;
        }

        const score = 3; // Comments get lower base score
        const snippet = comment.content.substring(0, 150);

        results.push({
          type: 'comment',
          id: comment.id,
          title: `Comment on ${ticket.title}`,
          description: searchQuery.includeContent ? comment.content : 
                      `${snippet}...`,
          score,
          highlights: [`Comment: ${snippet}...`],
          metadata: {
            ticketId: comment.ticketId,
            ticketTitle: ticket.title,
            authorName: comment.authorName,
            createdAt: comment.createdAt,
            createdViaVoice: comment.createdViaVoice,
          },
        });
      }
    }

    // Search users if requested
    if (searchQuery.types!.includes('users')) {
      const matchingUsers = MOCK_USERS.filter(user => 
        user.name.toLowerCase().includes(queryLower) ||
        user.email.toLowerCase().includes(queryLower) ||
        user.company?.toLowerCase().includes(queryLower)
      );

      for (const matchedUser of matchingUsers) {
        const nameMatch = matchedUser.name.toLowerCase().includes(queryLower);
        const emailMatch = matchedUser.email.toLowerCase().includes(queryLower);
        
        let score = 2; // Users get lowest base score
        if (nameMatch) score += 5;
        if (emailMatch) score += 3;

        const highlights: string[] = [];
        if (nameMatch) highlights.push(`Name: ${matchedUser.name}`);
        if (emailMatch) highlights.push(`Email: ${matchedUser.email}`);

        results.push({
          type: 'user',
          id: matchedUser.id,
          title: matchedUser.name,
          description: searchQuery.includeContent ? 
                      `${matchedUser.email} - ${matchedUser.role}` : matchedUser.email,
          score,
          highlights,
          metadata: {
            email: matchedUser.email,
            role: matchedUser.role,
            company: matchedUser.company,
          },
        });
      }
    }

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);

    // Apply limit
    const limitedResults = results.slice(0, searchQuery.limit);

    // Generate search suggestions based on partial matches
    const suggestions: string[] = [];
    if (results.length === 0) {
      // Suggest ticket types, statuses, priorities
      const possibleSuggestions = [
        'story', 'task', 'bug', 'spike', 'epic',
        'todo', 'in_progress', 'in_review', 'done',
        'low', 'medium', 'high', 'critical',
        'voice', 'dashboard', 'api', 'integration'
      ];
      
      suggestions.push(...possibleSuggestions
        .filter(suggestion => suggestion.includes(queryLower))
        .slice(0, 3)
      );
    }

    const processingTime = Date.now() - startTime;

    const searchResponse: SearchResponse = {
      results: limitedResults,
      total: results.length,
      query: searchQuery.query,
      processingTime,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };

    const successResponse: ApiResponse<SearchResponse> = {
      success: true,
      data: searchResponse,
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Search API error:', error);
    
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
    error: 'Method not allowed',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function PUT() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function DELETE() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}