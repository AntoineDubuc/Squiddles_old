/**
 * Dashboard Data API Route
 * Implements TICKET-003: Core Data Models API
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  MOCK_ENHANCED_TICKETS,
  getTicketsByAssignee,
  getRecentTicketActivity,
  getTicketsWithUserMentions,
  getVoiceTicketStats 
} from '@/lib/mock-data/tickets';
import { 
  MOCK_SPRINTS,
  getActiveSprint,
  getSprintMetrics 
} from '@/lib/mock-data/sprints';
import { generateTicketAnalytics } from '@/lib/utils/ticket-utils';
import { 
  DashboardDataQuery,
  DashboardDataResponse,
  ApiResponse 
} from '@/app/types/api-endpoints';
import { 
  DashboardMetrics,
  ActivityFeedItem,
  Notification 
} from '@/app/types/ui-models';
import { getCurrentUser } from '@/lib/auth';

// GET /api/dashboard/data - Get comprehensive dashboard data
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
    
    const query: DashboardDataQuery = {
      period: (searchParams.get('period') as any) || 'week',
      includeMetrics: searchParams.get('includeMetrics') !== 'false',
      includeActivity: searchParams.get('includeActivity') !== 'false',
      includeNotifications: searchParams.get('includeNotifications') !== 'false',
    };

    // Get user-specific tickets
    const userTickets = getTicketsByAssignee(user.id);
    const userCreatedTickets = MOCK_ENHANCED_TICKETS.filter(ticket => ticket.reporterId === user.id);
    const allUserTickets = [...userTickets, ...userCreatedTickets];
    
    // Remove duplicates
    const uniqueUserTickets = allUserTickets.filter((ticket, index, array) => 
      array.findIndex(t => t.id === ticket.id) === index
    );

    // Generate analytics for user tickets
    const userAnalytics = generateTicketAnalytics(uniqueUserTickets);
    
    // Get active sprint
    const activeSprint = getActiveSprint();
    const sprintMetrics = activeSprint ? getSprintMetrics(activeSprint.id) : null;

    // Calculate date ranges for period filtering
    const now = new Date();
    const periodStart = new Date();
    
    switch (query.period) {
      case 'today':
        periodStart.setHours(0, 0, 0, 0);
        break;
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setDate(now.getDate() - 30);
        break;
      case 'quarter':
        periodStart.setDate(now.getDate() - 90);
        break;
    }

    // Get tickets completed in period
    const completedInPeriod = uniqueUserTickets.filter(ticket => 
      ticket.status === 'done' && 
      new Date(ticket.updatedAt) >= periodStart
    );

    // Get voice statistics
    const voiceStats = getVoiceTicketStats();

    // Build dashboard metrics
    const metrics: DashboardMetrics = {
      user: {
        totalTickets: uniqueUserTickets.length,
        activeTickets: uniqueUserTickets.filter(t => ['todo', 'in_progress', 'in_review'].includes(t.status)).length,
        completedThisWeek: completedInPeriod.length,
        mentions: getTicketsWithUserMentions(user.id).length,
        newComments: uniqueUserTickets.reduce((count, ticket) => 
          count + ticket.comments.filter(comment => 
            comment.authorId !== user.id && 
            new Date(comment.createdAt) >= periodStart
          ).length, 0
        ),
      },
      sprint: activeSprint && sprintMetrics ? {
        name: activeSprint.name,
        capacity: sprintMetrics.capacity,
        completed: sprintMetrics.completedPoints,
        remaining: sprintMetrics.remainingPoints,
        daysLeft: sprintMetrics.daysRemaining,
      } : {
        name: 'No Active Sprint',
        capacity: 0,
        completed: 0,
        remaining: 0,
        daysLeft: 0,
      },
      team: {
        velocity: sprintMetrics?.velocity || 0,
        burndownRate: sprintMetrics?.burndownRate || 0,
        blockedTickets: MOCK_ENHANCED_TICKETS.filter(ticket => 
          ticket.status === 'in_progress' && 
          ticket.comments.some(comment => 
            comment.content.toLowerCase().includes('blocked') ||
            comment.content.toLowerCase().includes('waiting')
          )
        ).length,
        overdueTasks: activeSprint ? activeSprint.tickets.filter(ticket => 
          ticket.status !== 'done' && 
          new Date() > new Date(activeSprint.endDate)
        ).length : 0,
      },
      voice: {
        sessionsToday: voiceStats.totalVoiceTickets, // Simplified for mock
        avgSessionLength: 120, // Mock: 2 minutes average
        commandSuccessRate: 95, // Mock: 95% success rate
        lastUsed: voiceStats.lastVoiceTicket?.lastVoiceUpdate || new Date(),
      },
    };

    // Generate recent activity feed
    const recentActivity: ActivityFeedItem[] = getRecentTicketActivity(10).map(ticket => ({
      id: `activity_${ticket.id}`,
      type: 'ticket_update' as const,
      actorId: ticket.reporterId,
      actorName: ticket.reporterName,
      actorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.reporterName)}&background=3B82F6&color=fff`,
      targetType: 'ticket' as const,
      targetId: ticket.id,
      targetTitle: ticket.title,
      action: ticket.status === 'done' ? 'completed' : 'updated',
      data: {
        status: ticket.status,
        priority: ticket.priority,
        type: ticket.type,
      },
      timestamp: ticket.updatedAt,
      read: Math.random() > 0.3, // Mock: 70% read rate
    }));

    // Generate mock notifications
    const notifications: Notification[] = [
      {
        id: 'notif_001',
        userId: user.id,
        type: 'mention',
        title: 'You were mentioned in a comment',
        message: 'Alex Chen mentioned you in SQUID-123: Voice-to-Text Implementation',
        data: {
          ticketId: 'ticket_001',
          commentId: 'comment_002',
        },
        read: false,
        actionUrl: '/tickets/ticket_001',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 'notif_002',
        userId: user.id,
        type: 'ticket_update',
        title: 'Ticket assigned to you',
        message: 'SQUID-124: Dashboard Voice Integration has been assigned to you',
        data: {
          ticketId: 'ticket_002',
          assignerId: 'user_001',
        },
        read: false,
        actionUrl: '/tickets/ticket_002',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: 'notif_003',
        userId: user.id,
        type: 'system',
        title: 'Sprint ending soon',
        message: `${activeSprint?.name || 'Current sprint'} ends in ${sprintMetrics?.daysRemaining || 0} days`,
        data: {
          sprintId: activeSprint?.id,
        },
        read: true,
        actionUrl: '/sprints',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    // Get mentions for user
    const mentions = recentActivity.filter(activity => 
      activity.type === 'mention' || 
      (activity.data && activity.data.mentions && activity.data.mentions.includes(user.id))
    );

    // Get team activity (tickets from other team members)
    const teamActivity = recentActivity.filter(activity => 
      activity.actorId !== user.id
    ).slice(0, 5);

    // Build response data
    const dashboardData: DashboardDataResponse = {
      user,
      metrics,
      recentActivity: recentActivity.slice(0, 10),
      notifications: query.includeNotifications ? notifications : [],
      activeSprint: activeSprint || undefined,
      recentTickets: getRecentTicketActivity(5),
      mentions,
      teamActivity,
    };

    const successResponse: ApiResponse<DashboardDataResponse> = {
      success: true,
      data: dashboardData,
      timestamp: new Date(),
    };

    return NextResponse.json(successResponse, { status: 200 });

  } catch (error) {
    console.error('Dashboard API error:', error);
    
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