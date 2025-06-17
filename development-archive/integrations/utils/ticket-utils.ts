/**
 * Ticket Utility Functions
 * Implements TICKET-002: Enhanced Ticket Data Models
 */

import { EnhancedTicket, Comment, TicketSection, Sprint } from '@/app/types/ui-models';

/**
 * Generate next Jira key for a project
 */
export function generateJiraKey(projectKey: string, existingTickets: EnhancedTicket[]): string {
  const projectTickets = existingTickets.filter(ticket => 
    ticket.jiraKey?.startsWith(`${projectKey}-`)
  );
  
  const highestNumber = projectTickets.reduce((max, ticket) => {
    if (!ticket.jiraKey) return max;
    const match = ticket.jiraKey.match(/\d+$/);
    if (!match) return max;
    return Math.max(max, parseInt(match[0], 10));
  }, 0);
  
  return `${projectKey}-${highestNumber + 1}`;
}

/**
 * Calculate ticket completion score based on sections and acceptance criteria
 */
export function calculateTicketCompletionScore(ticket: EnhancedTicket): number {
  let score = 0;
  let maxScore = 0;

  // Base completion factors
  if (ticket.title) { score += 10; maxScore += 10; }
  if (ticket.description) { score += 15; maxScore += 15; }
  if (ticket.assigneeId) { score += 10; maxScore += 10; }
  if (ticket.priority) { score += 5; maxScore += 5; }
  if (ticket.storyPoints) { score += 10; maxScore += 10; }

  // Sections completion
  maxScore += 25;
  if (ticket.sections.length > 0) {
    const sectionScore = ticket.sections.reduce((sum, section) => {
      if (section.content && section.content.length > 10) return sum + 1;
      return sum;
    }, 0);
    score += Math.min(25, (sectionScore / ticket.sections.length) * 25);
  }

  // Acceptance criteria completion
  maxScore += 25;
  if (ticket.acceptanceCriteria && ticket.acceptanceCriteria.length > 0) {
    const criteriaScore = ticket.acceptanceCriteria.filter(criteria => 
      criteria && criteria.length > 10
    ).length;
    score += Math.min(25, (criteriaScore / ticket.acceptanceCriteria.length) * 25);
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

/**
 * Get ticket status color and icon
 */
export function getTicketStatusDisplay(status: string): { color: string; icon: string; label: string } {
  const statusMap = {
    todo: { color: 'bg-gray-100 text-gray-800', icon: '⏳', label: 'To Do' },
    in_progress: { color: 'bg-blue-100 text-blue-800', icon: '🔄', label: 'In Progress' },
    in_review: { color: 'bg-yellow-100 text-yellow-800', icon: '👀', label: 'In Review' },
    done: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Done' },
  };
  
  return statusMap[status as keyof typeof statusMap] || statusMap.todo;
}

/**
 * Get ticket priority color and icon
 */
export function getTicketPriorityDisplay(priority: string): { color: string; icon: string; label: string } {
  const priorityMap = {
    low: { color: 'bg-gray-100 text-gray-600', icon: '⬇️', label: 'Low' },
    medium: { color: 'bg-yellow-100 text-yellow-600', icon: '➡️', label: 'Medium' },
    high: { color: 'bg-orange-100 text-orange-600', icon: '⬆️', label: 'High' },
    critical: { color: 'bg-red-100 text-red-600', icon: '🚨', label: 'Critical' },
  };
  
  return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
}

/**
 * Get ticket type color and icon
 */
export function getTicketTypeDisplay(type: string): { color: string; icon: string; label: string } {
  const typeMap = {
    story: { color: 'bg-green-100 text-green-700', icon: '📖', label: 'User Story' },
    task: { color: 'bg-blue-100 text-blue-700', icon: '✏️', label: 'Task' },
    bug: { color: 'bg-red-100 text-red-700', icon: '🐛', label: 'Bug' },
    spike: { color: 'bg-purple-100 text-purple-700', icon: '⚡', label: 'Spike' },
    epic: { color: 'bg-indigo-100 text-indigo-700', icon: '🎯', label: 'Epic' },
  };
  
  return typeMap[type as keyof typeof typeMap] || typeMap.task;
}

/**
 * Format ticket duration (time since creation/update)
 */
export function formatTicketDuration(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  
  return date.toLocaleDateString();
}

/**
 * Calculate estimated completion time based on story points and team velocity
 */
export function estimateCompletionTime(
  storyPoints: number,
  teamVelocity: number,
  sprintDuration: number = 14
): { sprints: number; days: number; confidence: 'low' | 'medium' | 'high' } {
  if (teamVelocity === 0) {
    return { sprints: 0, days: 0, confidence: 'low' };
  }

  const sprintsNeeded = Math.ceil(storyPoints / teamVelocity);
  const daysNeeded = sprintsNeeded * sprintDuration;
  
  // Confidence based on historical data and complexity
  let confidence: 'low' | 'medium' | 'high' = 'medium';
  if (storyPoints > teamVelocity * 2) confidence = 'low';
  if (storyPoints <= teamVelocity / 2) confidence = 'high';
  
  return { sprints: sprintsNeeded, days: daysNeeded, confidence };
}

/**
 * Get related tickets based on content similarity
 */
export function findRelatedTickets(
  targetTicket: EnhancedTicket,
  allTickets: EnhancedTicket[],
  maxResults: number = 5
): EnhancedTicket[] {
  // Simple text similarity based on common words
  const getKeywords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'will', 'would', 'could', 'should'].includes(word));
  };

  const targetKeywords = [
    ...getKeywords(targetTicket.title),
    ...getKeywords(targetTicket.description),
    ...targetTicket.sections.flatMap(section => getKeywords(section.content))
  ];

  const relatedTickets = allTickets
    .filter(ticket => ticket.id !== targetTicket.id)
    .map(ticket => {
      const ticketKeywords = [
        ...getKeywords(ticket.title),
        ...getKeywords(ticket.description),
        ...ticket.sections.flatMap(section => getKeywords(section.content))
      ];

      const commonKeywords = targetKeywords.filter(keyword => 
        ticketKeywords.includes(keyword)
      );

      const similarity = commonKeywords.length / Math.max(targetKeywords.length, ticketKeywords.length);
      
      return { ticket, similarity };
    })
    .filter(item => item.similarity > 0.1)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults)
    .map(item => item.ticket);

  return relatedTickets;
}

/**
 * Extract mentions from comment content
 */
export function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }

  return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Generate ticket summary for voice responses
 */
export function generateTicketSummary(ticket: EnhancedTicket): string {
  const status = getTicketStatusDisplay(ticket.status);
  const priority = getTicketPriorityDisplay(ticket.priority);
  const type = getTicketTypeDisplay(ticket.type);
  
  let summary = `${type.label} "${ticket.title}" is currently ${status.label}`;
  
  if (ticket.assigneeName) {
    summary += ` and assigned to ${ticket.assigneeName}`;
  }
  
  if (ticket.priority !== 'medium') {
    summary += ` with ${priority.label} priority`;
  }
  
  if (ticket.storyPoints) {
    summary += ` (${ticket.storyPoints} story points)`;
  }
  
  const completionScore = calculateTicketCompletionScore(ticket);
  if (completionScore < 50) {
    summary += '. This ticket needs more details to be ready for development.';
  } else if (completionScore < 80) {
    summary += '. This ticket has good detail but could use some refinement.';
  } else {
    summary += '. This ticket is well-defined and ready for development.';
  }
  
  return summary;
}

/**
 * Sort tickets by various criteria
 */
export function sortTickets(
  tickets: EnhancedTicket[],
  sortBy: 'priority' | 'status' | 'created' | 'updated' | 'assignee' | 'points',
  order: 'asc' | 'desc' = 'desc'
): EnhancedTicket[] {
  const sorted = [...tickets].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                    priorityOrder[b.priority as keyof typeof priorityOrder];
        break;
      
      case 'status':
        const statusOrder = { todo: 1, in_progress: 2, in_review: 3, done: 4 };
        comparison = statusOrder[a.status as keyof typeof statusOrder] - 
                    statusOrder[b.status as keyof typeof statusOrder];
        break;
      
      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      
      case 'updated':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      
      case 'assignee':
        const aAssignee = a.assigneeName || '';
        const bAssignee = b.assigneeName || '';
        comparison = aAssignee.localeCompare(bAssignee);
        break;
      
      case 'points':
        comparison = (a.storyPoints || 0) - (b.storyPoints || 0);
        break;
      
      default:
        comparison = 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

/**
 * Filter tickets by multiple criteria
 */
export function filterTickets(
  tickets: EnhancedTicket[],
  filters: {
    status?: string[];
    priority?: string[];
    type?: string[];
    assigneeId?: string;
    sprintId?: string;
    createdViaVoice?: boolean;
    search?: string;
  }
): EnhancedTicket[] {
  return tickets.filter(ticket => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(ticket.status)) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(ticket.priority)) return false;
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(ticket.type)) return false;
    }

    // Assignee filter
    if (filters.assigneeId) {
      if (ticket.assigneeId !== filters.assigneeId) return false;
    }

    // Sprint filter
    if (filters.sprintId) {
      if (ticket.sprintId !== filters.sprintId) return false;
    }

    // Voice creation filter
    if (filters.createdViaVoice !== undefined) {
      if (ticket.createdViaVoice !== filters.createdViaVoice) return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = [
        ticket.title,
        ticket.description,
        ticket.jiraKey || '',
        ...ticket.sections.map(s => s.content),
        ...ticket.comments.map(c => c.content)
      ].join(' ').toLowerCase();

      if (!searchableText.includes(searchLower)) return false;
    }

    return true;
  });
}

/**
 * Generate ticket analytics
 */
export function generateTicketAnalytics(tickets: EnhancedTicket[]) {
  const total = tickets.length;
  
  const byStatus = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byPriority = tickets.reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byType = tickets.reduce((acc, ticket) => {
    acc[ticket.type] = (acc[ticket.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPoints = tickets.reduce((sum, ticket) => sum + (ticket.storyPoints || 0), 0);
  const completedPoints = tickets
    .filter(ticket => ticket.status === 'done')
    .reduce((sum, ticket) => sum + (ticket.storyPoints || 0), 0);

  const voiceCreated = tickets.filter(ticket => ticket.createdViaVoice).length;
  const avgCompletionScore = tickets.reduce((sum, ticket) => 
    sum + calculateTicketCompletionScore(ticket), 0) / total;

  return {
    total,
    byStatus,
    byPriority,
    byType,
    totalPoints,
    completedPoints,
    completionRate: total > 0 ? Math.round((byStatus.done || 0) / total * 100) : 0,
    pointsCompletionRate: totalPoints > 0 ? Math.round(completedPoints / totalPoints * 100) : 0,
    voiceCreated,
    voiceCreatedPercentage: total > 0 ? Math.round(voiceCreated / total * 100) : 0,
    avgCompletionScore: Math.round(avgCompletionScore),
    avgStoryPoints: totalPoints > 0 ? Math.round(totalPoints / total * 10) / 10 : 0,
  };
}