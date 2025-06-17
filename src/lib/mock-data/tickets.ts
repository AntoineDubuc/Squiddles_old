/**
 * Mock Ticket Data for Squiddles
 * Implements TICKET-002: Enhanced Ticket Data Models
 */

import { EnhancedTicket, Comment, TicketSection, Attachment } from '@/app/types/ui-models';

// Mock ticket sections
export const MOCK_TICKET_SECTIONS: TicketSection[] = [
  {
    id: 'section_001',
    name: 'User Story',
    content: 'As a product manager, I want to create user stories via voice commands so that I can quickly capture requirements during meetings.',
    type: 'text',
    order: 1,
  },
  {
    id: 'section_002',
    name: 'Technical Requirements',
    content: '- Voice-to-text transcription with 95% accuracy\n- Real-time processing with <2s latency\n- Integration with existing ticket system\n- Support for multiple languages',
    type: 'list',
    order: 2,
  },
  {
    id: 'section_003',
    name: 'Implementation Notes',
    content: 'Consider using OpenAI Whisper for transcription. Need to handle background noise and multiple speakers.',
    type: 'text',
    order: 3,
  },
];

// Mock comments
export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment_001',
    ticketId: 'ticket_001',
    authorId: 'user_001',
    authorName: 'Jordan Kim',
    authorAvatar: 'https://ui-avatars.com/api/?name=Jordan+Kim&background=3B82F6&color=fff',
    content: 'I think we should also consider offline functionality for voice input. What happens when the user is in a low-connectivity environment?',
    mentions: ['user_002'],
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    createdViaVoice: false,
  },
  {
    id: 'comment_002',
    ticketId: 'ticket_001',
    authorId: 'user_002',
    authorName: 'Alex Chen',
    authorAvatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=10B981&color=fff',
    content: '@Jordan Kim Good point! We could implement a queue system that stores voice commands locally and syncs when connectivity is restored.',
    mentions: ['user_001'],
    parentCommentId: 'comment_001',
    createdAt: new Date('2024-01-15T14:20:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z'),
    createdViaVoice: true,
    voiceTranscript: 'Good point! We could implement a queue system that stores voice commands locally and syncs when connectivity is restored.',
  },
  {
    id: 'comment_003',
    ticketId: 'ticket_002',
    authorId: 'user_003',
    authorName: 'Maya Patel',
    authorAvatar: 'https://ui-avatars.com/api/?name=Maya+Patel&background=F59E0B&color=fff',
    content: 'The current implementation is missing error handling for invalid voice commands. We need to provide clear feedback to users.',
    mentions: [],
    createdAt: new Date('2024-01-16T09:15:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z'),
    createdViaVoice: false,
  },
];

// Mock attachments
export const MOCK_ATTACHMENTS: Attachment[] = [
  {
    id: 'attachment_001',
    filename: 'voice-flow-diagram.png',
    url: '/attachments/voice-flow-diagram.png',
    mimeType: 'image/png',
    size: 245760,
    uploadedBy: 'user_001',
    uploadedAt: new Date('2024-01-15T09:00:00Z'),
  },
  {
    id: 'attachment_002',
    filename: 'api-specification.pdf',
    url: '/attachments/api-specification.pdf',
    mimeType: 'application/pdf',
    size: 1024000,
    uploadedBy: 'user_002',
    uploadedAt: new Date('2024-01-15T11:30:00Z'),
  },
];

// Mock enhanced tickets
export const MOCK_ENHANCED_TICKETS: EnhancedTicket[] = [
  {
    id: 'ticket_001',
    jiraKey: 'SQUID-123',
    title: 'Implement Voice-to-Text Ticket Creation',
    description: 'Enable users to create tickets using voice commands with natural language processing.',
    type: 'story',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user_002',
    assigneeName: 'Alex Chen',
    reporterId: 'user_001',
    reporterName: 'Jordan Kim',
    sprintId: 'sprint_001',
    sprintName: 'Voice Features Sprint',
    projectId: 'project_001',
    projectName: 'Squiddles Core',
    storyPoints: 8,
    acceptanceCriteria: [
      'User can activate voice input with keyboard shortcut or button click',
      'Voice commands are transcribed with 95% accuracy',
      'Processed commands create valid tickets in under 3 seconds',
      'Error handling provides clear feedback for unrecognized commands',
      'Voice sessions are logged for debugging and analytics',
    ],
    sections: [
      {
        id: 'section_001',
        name: 'User Story',
        content: 'As a product manager, I want to create user stories via voice commands so that I can quickly capture requirements during meetings.',
        type: 'text',
        order: 1,
      },
      {
        id: 'section_002',
        name: 'Technical Requirements',
        content: '- Voice-to-text transcription with 95% accuracy\n- Real-time processing with <2s latency\n- Integration with existing ticket system\n- Support for multiple languages',
        type: 'list',
        order: 2,
      },
    ],
    comments: MOCK_COMMENTS.filter(c => c.ticketId === 'ticket_001'),
    attachments: [MOCK_ATTACHMENTS[0], MOCK_ATTACHMENTS[1]],
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    createdViaVoice: true,
    voiceSessionId: 'voice_session_001',
    lastVoiceUpdate: new Date('2024-01-16T14:30:00Z'),
  },
  {
    id: 'ticket_002',
    jiraKey: 'SQUID-124',
    title: 'Dashboard Voice Integration',
    description: 'Add voice controls to the main dashboard for quick navigation and status updates.',
    type: 'story',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'user_003',
    assigneeName: 'Maya Patel',
    reporterId: 'user_001',
    reporterName: 'Jordan Kim',
    sprintId: 'sprint_001',
    sprintName: 'Voice Features Sprint',
    projectId: 'project_001',
    projectName: 'Squiddles Core',
    storyPoints: 5,
    acceptanceCriteria: [
      'Voice activation button is prominently displayed on dashboard',
      'Users can navigate to different sections using voice commands',
      'Status updates can be made via voice input',
      'Voice feedback confirms successful actions',
    ],
    sections: [
      {
        id: 'section_004',
        name: 'Scope',
        content: 'Integration points:\n- Dashboard navigation\n- Quick actions menu\n- Status updates\n- Search functionality',
        type: 'list',
        order: 1,
      },
    ],
    comments: MOCK_COMMENTS.filter(c => c.ticketId === 'ticket_002'),
    attachments: [],
    createdAt: new Date('2024-01-14T10:00:00Z'),
    updatedAt: new Date('2024-01-15T16:45:00Z'),
    createdViaVoice: false,
  },
  {
    id: 'ticket_003',
    jiraKey: 'SQUID-125',
    title: 'Fix Voice Command Parsing Error',
    description: 'Voice commands containing technical terms are not being parsed correctly, causing failed ticket creation.',
    type: 'bug',
    status: 'in_review',
    priority: 'high',
    assigneeId: 'user_004',
    assigneeName: 'Sam Rodriguez',
    reporterId: 'user_003',
    reporterName: 'Maya Patel',
    sprintId: 'sprint_001',
    sprintName: 'Voice Features Sprint',
    projectId: 'project_001',
    projectName: 'Squiddles Core',
    storyPoints: 3,
    acceptanceCriteria: [
      'Technical terms are correctly identified in voice input',
      'Parsing accuracy improves to 98% for domain-specific vocabulary',
      'Error logs provide detailed parsing failure information',
      'Regression tests cover technical vocabulary scenarios',
    ],
    sections: [
      {
        id: 'section_005',
        name: 'Problem Description',
        content: 'Users report that technical terms like "API", "microservice", "authentication" are being transcribed incorrectly, leading to malformed tickets.',
        type: 'text',
        order: 1,
      },
      {
        id: 'section_006',
        name: 'Reproduction Steps',
        content: '1. Activate voice input\n2. Say "Create a story for API authentication"\n3. Observe incorrect transcription\n4. Note ticket creation failure',
        type: 'list',
        order: 2,
      },
    ],
    comments: [],
    attachments: [],
    createdAt: new Date('2024-01-13T14:20:00Z'),
    updatedAt: new Date('2024-01-16T11:15:00Z'),
    createdViaVoice: true,
    voiceSessionId: 'voice_session_002',
  },
  {
    id: 'ticket_004',
    jiraKey: 'SQUID-126',
    title: 'Voice Settings Configuration Panel',
    description: 'Create a comprehensive settings panel for voice input configuration and calibration.',
    type: 'task',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user_005',
    assigneeName: 'Chris Taylor',
    reporterId: 'user_001',
    reporterName: 'Jordan Kim',
    sprintId: 'sprint_002',
    sprintName: 'Configuration Sprint',
    projectId: 'project_001',
    projectName: 'Squiddles Core',
    storyPoints: 4,
    acceptanceCriteria: [
      'Microphone sensitivity can be adjusted',
      'Push-to-talk mode is available',
      'Voice test functionality works correctly',
      'Settings persist across sessions',
      'Audio device selection is available',
    ],
    sections: [
      {
        id: 'section_007',
        name: 'Settings Categories',
        content: '- Audio Input/Output\n- Voice Recognition\n- Accessibility Options\n- Advanced Configuration',
        type: 'list',
        order: 1,
      },
    ],
    comments: [],
    attachments: [],
    createdAt: new Date('2024-01-10T09:30:00Z'),
    updatedAt: new Date('2024-01-14T17:00:00Z'),
    createdViaVoice: false,
  },
  {
    id: 'ticket_005',
    jiraKey: 'SQUID-127',
    title: 'Performance Optimization for Voice Processing',
    description: 'Optimize voice processing pipeline to reduce latency and improve real-time performance.',
    type: 'task',
    status: 'todo',
    priority: 'low',
    assigneeId: 'user_002',
    assigneeName: 'Alex Chen',
    reporterId: 'user_004',
    reporterName: 'Sam Rodriguez',
    sprintId: 'sprint_003',
    sprintName: 'Performance Sprint',
    projectId: 'project_001',
    projectName: 'Squiddles Core',
    storyPoints: 6,
    acceptanceCriteria: [
      'Voice processing latency reduced to under 1 second',
      'Memory usage optimized for concurrent sessions',
      'CPU utilization stays below 50% during voice processing',
      'Performance metrics are tracked and monitored',
    ],
    sections: [
      {
        id: 'section_008',
        name: 'Optimization Areas',
        content: '- Audio preprocessing\n- Model inference speed\n- Memory management\n- Network optimization',
        type: 'list',
        order: 1,
      },
    ],
    comments: [],
    attachments: [],
    createdAt: new Date('2024-01-12T13:45:00Z'),
    updatedAt: new Date('2024-01-12T13:45:00Z'),
    createdViaVoice: false,
  },
];

/**
 * Get tickets filtered by various criteria
 */
export function getTicketsByStatus(status: string): EnhancedTicket[] {
  return MOCK_ENHANCED_TICKETS.filter(ticket => ticket.status === status);
}

export function getTicketsByAssignee(assigneeId: string): EnhancedTicket[] {
  return MOCK_ENHANCED_TICKETS.filter(ticket => ticket.assigneeId === assigneeId);
}

export function getTicketsBySprint(sprintId: string): EnhancedTicket[] {
  return MOCK_ENHANCED_TICKETS.filter(ticket => ticket.sprintId === sprintId);
}

export function getTicketsByPriority(priority: string): EnhancedTicket[] {
  return MOCK_ENHANCED_TICKETS.filter(ticket => ticket.priority === priority);
}

export function getTicketsCreatedViaVoice(): EnhancedTicket[] {
  return MOCK_ENHANCED_TICKETS.filter(ticket => ticket.createdViaVoice === true);
}

/**
 * Search tickets by title, description, or content
 */
export function searchTickets(query: string): EnhancedTicket[] {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_ENHANCED_TICKETS.filter(ticket =>
    ticket.title.toLowerCase().includes(lowercaseQuery) ||
    ticket.description.toLowerCase().includes(lowercaseQuery) ||
    ticket.sections.some(section => 
      section.content.toLowerCase().includes(lowercaseQuery)
    ) ||
    ticket.comments.some(comment =>
      comment.content.toLowerCase().includes(lowercaseQuery)
    )
  );
}

/**
 * Get tickets with pagination
 */
export function getTicketsPaginated(
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: string[];
    priority?: string[];
    assigneeId?: string;
    sprintId?: string;
  }
): { tickets: EnhancedTicket[]; total: number; hasNext: boolean } {
  let filteredTickets = [...MOCK_ENHANCED_TICKETS];

  // Apply filters
  if (filters?.status?.length) {
    filteredTickets = filteredTickets.filter(ticket => 
      filters.status!.includes(ticket.status)
    );
  }

  if (filters?.priority?.length) {
    filteredTickets = filteredTickets.filter(ticket => 
      filters.priority!.includes(ticket.priority)
    );
  }

  if (filters?.assigneeId) {
    filteredTickets = filteredTickets.filter(ticket => 
      ticket.assigneeId === filters.assigneeId
    );
  }

  if (filters?.sprintId) {
    filteredTickets = filteredTickets.filter(ticket => 
      ticket.sprintId === filters.sprintId
    );
  }

  // Sort by updated date (most recent first)
  filteredTickets.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  return {
    tickets: paginatedTickets,
    total: filteredTickets.length,
    hasNext: endIndex < filteredTickets.length,
  };
}

/**
 * Get ticket by ID
 */
export function getTicketById(ticketId: string): EnhancedTicket | null {
  return MOCK_ENHANCED_TICKETS.find(ticket => ticket.id === ticketId) || null;
}

/**
 * Get ticket by Jira key
 */
export function getTicketByJiraKey(jiraKey: string): EnhancedTicket | null {
  return MOCK_ENHANCED_TICKETS.find(ticket => ticket.jiraKey === jiraKey) || null;
}

/**
 * Get recent activity for tickets
 */
export function getRecentTicketActivity(limit: number = 10): EnhancedTicket[] {
  return [...MOCK_ENHANCED_TICKETS]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

/**
 * Get tickets that mention a specific user
 */
export function getTicketsWithUserMentions(userId: string): EnhancedTicket[] {
  return MOCK_ENHANCED_TICKETS.filter(ticket =>
    ticket.comments.some(comment => comment.mentions.includes(userId))
  );
}

/**
 * Get voice-related statistics
 */
export function getVoiceTicketStats() {
  const voiceTickets = getTicketsCreatedViaVoice();
  const totalTickets = MOCK_ENHANCED_TICKETS.length;
  
  return {
    totalVoiceTickets: voiceTickets.length,
    voiceTicketPercentage: Math.round((voiceTickets.length / totalTickets) * 100),
    avgVoiceTicketPoints: voiceTickets.reduce((sum, ticket) => 
      sum + (ticket.storyPoints || 0), 0) / voiceTickets.length || 0,
    lastVoiceTicket: voiceTickets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0],
  };
}