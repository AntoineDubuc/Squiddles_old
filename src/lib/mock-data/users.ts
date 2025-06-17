/**
 * Mock User Data for Squiddles
 * Implements TICKET-001: Mock user data for development
 */

import { User } from '@/app/types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_001',
    name: 'Jordan Kim',
    email: 'jordan@squiddles.dev',
    role: 'pm',
    company: 'Squiddles Inc',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jordan+Kim&background=3B82F6&color=fff&size=128&font-size=0.6&format=svg',
    preferences: {
      voiceSettings: {
        sensitivity: 75,
        pushToTalk: false,
        noiseCancellation: true,
        echoCancellation: true,
        audioQuality: 'high',
        voiceActivationEnabled: true,
      },
      theme: 'dark',
      notifications: {
        mentions: true,
        comments: true,
        ticketUpdates: true,
        systemAlerts: true,
        emailNotifications: false,
        browserNotifications: true,
      },
      panelStates: {
        leftPanelCollapsed: false,
        rightPanelCollapsed: false,
      },
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-17'),
  },
  {
    id: 'user_002',
    name: 'Antoine Dubuc',
    email: 'antoine@squiddles.dev',
    role: 'tpm',
    company: 'Squiddles Inc',
    avatarUrl: 'https://ui-avatars.com/api/?name=Antoine+Dubuc&background=8B5CF6&color=fff&size=128&font-size=0.6&format=svg',
    preferences: {
      voiceSettings: {
        sensitivity: 80,
        pushToTalk: false,
        noiseCancellation: true,
        echoCancellation: true,
        audioQuality: 'premium',
        voiceActivationEnabled: true,
      },
      theme: 'dark',
      notifications: {
        mentions: true,
        comments: true,
        ticketUpdates: true,
        systemAlerts: true,
        emailNotifications: true,
        browserNotifications: true,
      },
      panelStates: {
        leftPanelCollapsed: false,
        rightPanelCollapsed: false,
      },
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-17'),
  },
  {
    id: 'user_003',
    name: 'Sarah Chen',
    email: 'sarah@squiddles.dev',
    role: 'eng',
    company: 'Squiddles Inc',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=10B981&color=fff&size=128&font-size=0.6&format=svg',
    preferences: {
      voiceSettings: {
        sensitivity: 70,
        pushToTalk: true,
        noiseCancellation: true,
        echoCancellation: true,
        audioQuality: 'standard',
        voiceActivationEnabled: false,
      },
      theme: 'dark',
      notifications: {
        mentions: true,
        comments: true,
        ticketUpdates: false,
        systemAlerts: false,
        emailNotifications: false,
        browserNotifications: true,
      },
      panelStates: {
        leftPanelCollapsed: true,
        rightPanelCollapsed: false,
      },
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'user_004',
    name: 'Mike Rodriguez',
    email: 'mike@squiddles.dev',
    role: 'sm',
    company: 'Squiddles Inc',
    avatarUrl: 'https://ui-avatars.com/api/?name=Mike+Rodriguez&background=F59E0B&color=fff&size=128&font-size=0.6&format=svg',
    preferences: {
      voiceSettings: {
        sensitivity: 85,
        pushToTalk: false,
        noiseCancellation: true,
        echoCancellation: true,
        audioQuality: 'high',
        voiceActivationEnabled: true,
      },
      theme: 'dark',
      notifications: {
        mentions: true,
        comments: true,
        ticketUpdates: true,
        systemAlerts: true,
        emailNotifications: true,
        browserNotifications: true,
      },
      panelStates: {
        leftPanelCollapsed: false,
        rightPanelCollapsed: false,
      },
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-12-16'),
  },
  {
    id: 'user_005',
    name: 'Emily Johnson',
    email: 'emily@squiddles.dev',
    role: 'po',
    company: 'Squiddles Inc',
    avatarUrl: 'https://ui-avatars.com/api/?name=Emily+Johnson&background=EF4444&color=fff&size=128&font-size=0.6&format=svg',
    preferences: {
      voiceSettings: {
        sensitivity: 65,
        pushToTalk: false,
        noiseCancellation: true,
        echoCancellation: true,
        audioQuality: 'high',
        voiceActivationEnabled: true,
      },
      theme: 'dark',
      notifications: {
        mentions: true,
        comments: true,
        ticketUpdates: true,
        systemAlerts: false,
        emailNotifications: true,
        browserNotifications: false,
      },
      panelStates: {
        leftPanelCollapsed: false,
        rightPanelCollapsed: true,
      },
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-14'),
  },
];

/**
 * Get mock user by ID
 */
export function getMockUserById(userId: string): User | null {
  return MOCK_USERS.find(user => user.id === userId) || null;
}

/**
 * Get mock user by email
 */
export function getMockUserByEmail(email: string): User | null {
  return MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Search mock users by name or email
 */
export function searchMockUsers(query: string): User[] {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get users by role
 */
export function getMockUsersByRole(role: User['role']): User[] {
  return MOCK_USERS.filter(user => user.role === role);
}

/**
 * Get team members for a project (mock implementation)
 */
export function getMockTeamMembers(projectId?: string): User[] {
  // For now, return all users as potential team members
  // In a real app, this would filter by project membership
  return [...MOCK_USERS];
}

/**
 * Mock user credentials for testing
 */
export const MOCK_CREDENTIALS = {
  validLogins: [
    { email: 'jordan@squiddles.dev', password: 'password123' },
    { email: 'antoine@squiddles.dev', password: 'password123' },
    { email: 'sarah@squiddles.dev', password: 'password123' },
    { email: 'mike@squiddles.dev', password: 'password123' },
    { email: 'emily@squiddles.dev', password: 'password123' },
  ],
  defaultPassword: 'password123',
};

/**
 * Validate mock credentials (for development)
 */
export function validateMockCredentials(email: string, password: string): boolean {
  const user = getMockUserByEmail(email);
  if (!user) {
    return false;
  }
  
  // In development, accept the default password for any user
  return password === MOCK_CREDENTIALS.defaultPassword;
}