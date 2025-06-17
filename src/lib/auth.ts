/**
 * Authentication and Session Management for Squiddles
 * Implements TICKET-001: Enhanced User Types and Authentication
 */

import { User, UserPreferences } from '@/app/types';
import { MOCK_USERS, validateMockCredentials } from '@/lib/mock-data/users';


export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authenticate user with email and password
 * In production, this would call a real authentication API
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find user by email (case insensitive)
  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === credentials.email.toLowerCase()
  );
  
  if (!user) {
    return null;
  }
  
  // Validate password using mock credentials
  if (!validateMockCredentials(user.email, credentials.password)) {
    return null;
  }
  
  const session: AuthSession = {
    user,
    token: generateMockToken(user.id),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
  
  // Store session in localStorage for persistence
  storeSession(session);
  
  return session;
}

/**
 * Log out current user
 */
export async function logout(): Promise<void> {
  // Clear stored session
  if (typeof window !== 'undefined') {
    localStorage.removeItem('squiddles_session');
    localStorage.removeItem('squiddles_user');
  }
}

/**
 * Get current authenticated user session
 */
export function getCurrentSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const sessionData = localStorage.getItem('squiddles_session');
    if (!sessionData) {
      return null;
    }
    
    const session: AuthSession = JSON.parse(sessionData);
    
    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      logout();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error reading session:', error);
    return null;
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  const session = getCurrentSession();
  return session?.user || null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<User | null> {
  const session = getCurrentSession();
  if (!session || session.user.id !== userId) {
    return null;
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Merge preferences
  const updatedUser: User = {
    ...session.user,
    preferences: {
      ...session.user.preferences,
      ...preferences,
    },
    updatedAt: new Date(),
  };
  
  // Update stored session
  const updatedSession: AuthSession = {
    ...session,
    user: updatedUser,
  };
  
  storeSession(updatedSession);
  
  return updatedUser;
}

/**
 * Get user by ID (for mentions, assignments, etc.)
 */
export function getUserById(userId: string): User | null {
  return MOCK_USERS.find(user => user.id === userId) || null;
}

/**
 * Search users by name or email
 */
export function searchUsers(query: string): User[] {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get all users for team displays
 */
export function getAllUsers(): User[] {
  return [...MOCK_USERS];
}

// Helper functions

function generateMockToken(userId: string): string {
  // In production, this would be a proper JWT or session token
  return `mock_token_${userId}_${Date.now()}`;
}

function storeSession(session: AuthSession): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('squiddles_session', JSON.stringify(session));
      localStorage.setItem('squiddles_user', JSON.stringify(session.user));
    } catch (error) {
      console.error('Error storing session:', error);
    }
  }
}

/**
 * Validate user role permissions
 */
export function hasPermission(user: User, permission: string): boolean {
  // Simple role-based permissions
  const rolePermissions = {
    pm: ['create_ticket', 'edit_ticket', 'delete_ticket', 'manage_sprints', 'view_analytics'],
    tpm: ['create_ticket', 'edit_ticket', 'delete_ticket', 'manage_sprints', 'view_analytics', 'manage_integrations'],
    po: ['create_ticket', 'edit_ticket', 'manage_sprints', 'view_analytics'],
    eng: ['create_ticket', 'edit_ticket', 'view_analytics'],
    sm: ['create_ticket', 'edit_ticket', 'manage_sprints', 'view_analytics'],
    other: ['create_ticket', 'edit_ticket'],
  };
  
  return rolePermissions[user.role]?.includes(permission) || false;
}

/**
 * Get user display name with role
 */
export function getUserDisplayName(user: User): string {
  const roleNames = {
    pm: 'Product Manager',
    tpm: 'Technical Product Manager',
    po: 'Product Owner',
    eng: 'Engineer',
    sm: 'Scrum Master',
    other: 'Team Member',
  };
  
  return `${user.name} (${roleNames[user.role]})`;
}

/**
 * Get user avatar URL with fallback
 */
export function getUserAvatarUrl(user: User): string {
  if (user.avatarUrl) {
    return user.avatarUrl;
  }
  
  // Generate initials-based avatar URL
  const initials = user.name
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff&size=128&font-size=0.6&format=svg`;
}