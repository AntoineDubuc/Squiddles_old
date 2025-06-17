/**
 * Mock Sprint and Project Data for Squiddles
 * Implements TICKET-002: Enhanced Ticket Data Models
 */

import { Sprint, Project } from '@/app/types/ui-models';
import { MOCK_USERS } from './users';
import { MOCK_ENHANCED_TICKETS } from './tickets';

// Mock sprints
export const MOCK_SPRINTS: Sprint[] = [
  {
    id: 'sprint_001',
    name: 'Voice Features Sprint',
    goal: 'Implement core voice interaction capabilities for ticket creation and navigation',
    startDate: new Date('2024-01-15T00:00:00Z'),
    endDate: new Date('2024-01-29T23:59:59Z'),
    capacity: 32,
    velocity: 28,
    status: 'active',
    tickets: MOCK_ENHANCED_TICKETS.filter(ticket => ticket.sprintId === 'sprint_001'),
    completedPoints: 12,
    totalPoints: 24,
    completionPercentage: 50,
    burndownRate: 1.2,
  },
  {
    id: 'sprint_002',
    name: 'Configuration Sprint',
    goal: 'Build comprehensive configuration and settings management system',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-14T23:59:59Z'),
    capacity: 28,
    velocity: 26,
    status: 'completed',
    tickets: MOCK_ENHANCED_TICKETS.filter(ticket => ticket.sprintId === 'sprint_002'),
    completedPoints: 26,
    totalPoints: 26,
    completionPercentage: 100,
    burndownRate: 1.86,
  },
  {
    id: 'sprint_003',
    name: 'Performance Sprint',
    goal: 'Optimize system performance and scalability for production deployment',
    startDate: new Date('2024-01-30T00:00:00Z'),
    endDate: new Date('2024-02-13T23:59:59Z'),
    capacity: 30,
    velocity: 0,
    status: 'future',
    tickets: MOCK_ENHANCED_TICKETS.filter(ticket => ticket.sprintId === 'sprint_003'),
    completedPoints: 0,
    totalPoints: 18,
    completionPercentage: 0,
    burndownRate: 0,
  },
  {
    id: 'sprint_004',
    name: 'Integration Sprint',
    goal: 'Enhance third-party integrations and API connectivity',
    startDate: new Date('2024-02-14T00:00:00Z'),
    endDate: new Date('2024-02-28T23:59:59Z'),
    capacity: 35,
    velocity: 0,
    status: 'future',
    tickets: [],
    completedPoints: 0,
    totalPoints: 0,
    completionPercentage: 0,
    burndownRate: 0,
  },
];

// Mock projects
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'project_001',
    name: 'Squiddles Core',
    key: 'SQUID',
    description: 'Core voice-activated project management platform with multi-agent capabilities',
    lead: MOCK_USERS[0], // Jordan Kim
    members: MOCK_USERS,
    sprints: MOCK_SPRINTS,
    createdAt: new Date('2023-12-01T00:00:00Z'),
  },
  {
    id: 'project_002',
    name: 'Mobile App',
    key: 'MOBILE',
    description: 'Mobile companion app for Squiddles with offline voice capabilities',
    lead: MOCK_USERS[2], // Maya Patel
    members: [MOCK_USERS[0], MOCK_USERS[2], MOCK_USERS[3]],
    sprints: [],
    createdAt: new Date('2024-01-10T00:00:00Z'),
  },
  {
    id: 'project_003',
    name: 'Analytics Dashboard',
    key: 'DASH',
    description: 'Advanced analytics and reporting dashboard for team insights',
    lead: MOCK_USERS[4], // Chris Taylor
    members: [MOCK_USERS[1], MOCK_USERS[4]],
    sprints: [],
    createdAt: new Date('2024-01-05T00:00:00Z'),
  },
];

/**
 * Get active sprint
 */
export function getActiveSprint(): Sprint | null {
  return MOCK_SPRINTS.find(sprint => sprint.status === 'active') || null;
}

/**
 * Get sprints by status
 */
export function getSprintsByStatus(status: 'future' | 'active' | 'completed'): Sprint[] {
  return MOCK_SPRINTS.filter(sprint => sprint.status === status);
}

/**
 * Get sprint by ID
 */
export function getSprintById(sprintId: string): Sprint | null {
  return MOCK_SPRINTS.find(sprint => sprint.id === sprintId) || null;
}

/**
 * Get project by ID
 */
export function getProjectById(projectId: string): Project | null {
  return MOCK_PROJECTS.find(project => project.id === projectId) || null;
}

/**
 * Get project by key
 */
export function getProjectByKey(key: string): Project | null {
  return MOCK_PROJECTS.find(project => project.key === key) || null;
}

/**
 * Get sprint progress metrics
 */
export function getSprintMetrics(sprintId: string) {
  const sprint = getSprintById(sprintId);
  if (!sprint) return null;

  const now = new Date();
  const sprintDuration = sprint.endDate.getTime() - sprint.startDate.getTime();
  const elapsed = Math.max(0, now.getTime() - sprint.startDate.getTime());
  const remaining = Math.max(0, sprint.endDate.getTime() - now.getTime());
  
  const timeProgress = Math.min(100, (elapsed / sprintDuration) * 100);
  const daysTotal = Math.ceil(sprintDuration / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil(elapsed / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));

  return {
    timeProgress,
    daysTotal,
    daysElapsed,
    daysRemaining,
    pointsProgress: sprint.completionPercentage,
    velocity: sprint.velocity,
    capacity: sprint.capacity,
    completedPoints: sprint.completedPoints,
    totalPoints: sprint.totalPoints,
    remainingPoints: sprint.totalPoints - sprint.completedPoints,
    burndownRate: sprint.completedPoints / Math.max(1, daysElapsed),
    projectedCompletion: daysRemaining > 0 ? 
      (sprint.totalPoints - sprint.completedPoints) / Math.max(1, sprint.burndownRate) : 0,
  };
}

/**
 * Get team velocity over time
 */
export function getTeamVelocityHistory(): Array<{ sprint: string; velocity: number; capacity: number }> {
  return MOCK_SPRINTS
    .filter(sprint => sprint.status === 'completed')
    .map(sprint => ({
      sprint: sprint.name,
      velocity: sprint.velocity,
      capacity: sprint.capacity,
    }));
}

/**
 * Get all user projects
 */
export function getUserProjects(userId: string): Project[] {
  return MOCK_PROJECTS.filter(project => 
    project.members.some(member => member.id === userId)
  );
}

/**
 * Get project statistics
 */
export function getProjectStats(projectId: string) {
  const project = getProjectById(projectId);
  if (!project) return null;

  const projectTickets = MOCK_ENHANCED_TICKETS.filter(ticket => 
    ticket.projectId === projectId
  );

  const completedTickets = projectTickets.filter(ticket => 
    ticket.status === 'done'
  );

  const totalPoints = projectTickets.reduce((sum, ticket) => 
    sum + (ticket.storyPoints || 0), 0
  );

  const completedPoints = completedTickets.reduce((sum, ticket) => 
    sum + (ticket.storyPoints || 0), 0
  );

  return {
    totalTickets: projectTickets.length,
    completedTickets: completedTickets.length,
    totalPoints,
    completedPoints,
    completionRate: projectTickets.length > 0 ? 
      Math.round((completedTickets.length / projectTickets.length) * 100) : 0,
    pointsCompletionRate: totalPoints > 0 ? 
      Math.round((completedPoints / totalPoints) * 100) : 0,
    activeSprints: project.sprints.filter(sprint => sprint.status === 'active').length,
    teamSize: project.members.length,
  };
}