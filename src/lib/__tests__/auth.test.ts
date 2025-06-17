/**
 * Authentication Tests
 * Implements TICKET-001: Testing requirements
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { 
  login, 
  logout, 
  getCurrentUser, 
  getCurrentSession, 
  isAuthenticated,
  updateUserPreferences,
  hasPermission,
  getUserDisplayName,
  getUserAvatarUrl,
} from '@/lib/auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Authentication System', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  describe('login function', () => {
    it('should authenticate valid user credentials', async () => {
      const session = await login({
        email: 'jordan@squiddles.dev',
        password: 'password123',
      });

      expect(session).not.toBeNull();
      expect(session?.user.email).toBe('jordan@squiddles.dev');
      expect(session?.user.name).toBe('Jordan Kim');
      expect(session?.user.role).toBe('pm');
      expect(session?.token).toContain('mock_token_');
      expect(session?.expiresAt).toBeInstanceOf(Date);
    });

    it('should reject invalid email', async () => {
      const session = await login({
        email: 'nonexistent@squiddles.dev',
        password: 'password123',
      });

      expect(session).toBeNull();
    });

    it('should handle case-insensitive email lookup', async () => {
      const session = await login({
        email: 'JORDAN@SQUIDDLES.DEV',
        password: 'password123',
      });

      expect(session).not.toBeNull();
      expect(session?.user.email).toBe('jordan@squiddles.dev');
    });

    it('should store session in localStorage', async () => {
      await login({
        email: 'antoine@squiddles.dev',
        password: 'password123',
      });

      const storedSession = localStorageMock.getItem('squiddles_session');
      const storedUser = localStorageMock.getItem('squiddles_user');

      expect(storedSession).not.toBeNull();
      expect(storedUser).not.toBeNull();

      const parsedSession = JSON.parse(storedSession!);
      expect(parsedSession.user.email).toBe('antoine@squiddles.dev');
    });
  });

  describe('getCurrentSession and getCurrentUser', () => {
    it('should return null when no session exists', () => {
      expect(getCurrentSession()).toBeNull();
      expect(getCurrentUser()).toBeNull();
      expect(isAuthenticated()).toBe(false);
    });

    it('should return current session after login', async () => {
      await login({
        email: 'sarah@squiddles.dev',
        password: 'password123',
      });

      const session = getCurrentSession();
      const user = getCurrentUser();

      expect(session).not.toBeNull();
      expect(user).not.toBeNull();
      expect(user?.email).toBe('sarah@squiddles.dev');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return null for expired session', () => {
      // Mock an expired session
      const expiredSession = {
        user: { id: 'test', email: 'test@example.com' },
        token: 'expired_token',
        expiresAt: new Date(Date.now() - 1000), // 1 second ago
      };

      localStorageMock.setItem('squiddles_session', JSON.stringify(expiredSession));

      expect(getCurrentSession()).toBeNull();
      expect(getCurrentUser()).toBeNull();
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('logout function', () => {
    it('should clear stored session', async () => {
      // First login
      await login({
        email: 'mike@squiddles.dev',
        password: 'password123',
      });

      expect(getCurrentUser()).not.toBeNull();

      // Then logout
      await logout();

      expect(localStorageMock.getItem('squiddles_session')).toBeNull();
      expect(localStorageMock.getItem('squiddles_user')).toBeNull();
      expect(getCurrentUser()).toBeNull();
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('updateUserPreferences', () => {
    it('should update user preferences', async () => {
      // Login first
      await login({
        email: 'emily@squiddles.dev',
        password: 'password123',
      });

      const updatedUser = await updateUserPreferences('user_005', {
        theme: 'light',
        voiceSettings: {
          sensitivity: 90,
          pushToTalk: true,
          noiseCancellation: false,
          echoCancellation: true,
          audioQuality: 'premium',
          voiceActivationEnabled: true,
        },
      });

      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.preferences.theme).toBe('light');
      expect(updatedUser?.preferences.voiceSettings.sensitivity).toBe(90);
      expect(updatedUser?.preferences.voiceSettings.pushToTalk).toBe(true);
      expect(updatedUser?.preferences.voiceSettings.noiseCancellation).toBe(false);
    });

    it('should return null for unauthorized user', async () => {
      // Login as Jordan
      await login({
        email: 'jordan@squiddles.dev',
        password: 'password123',
      });

      // Try to update Antoine's preferences
      const result = await updateUserPreferences('user_002', {
        theme: 'light',
      });

      expect(result).toBeNull();
    });
  });

  describe('permission system', () => {
    it('should check PM permissions correctly', async () => {
      await login({
        email: 'jordan@squiddles.dev',
        password: 'password123',
      });

      const user = getCurrentUser()!;

      expect(hasPermission(user, 'create_ticket')).toBe(true);
      expect(hasPermission(user, 'manage_sprints')).toBe(true);
      expect(hasPermission(user, 'view_analytics')).toBe(true);
      expect(hasPermission(user, 'manage_integrations')).toBe(false); // TPM only
    });

    it('should check TPM permissions correctly', async () => {
      await login({
        email: 'antoine@squiddles.dev',
        password: 'password123',
      });

      const user = getCurrentUser()!;

      expect(hasPermission(user, 'create_ticket')).toBe(true);
      expect(hasPermission(user, 'manage_sprints')).toBe(true);
      expect(hasPermission(user, 'manage_integrations')).toBe(true);
    });

    it('should check engineer permissions correctly', async () => {
      await login({
        email: 'sarah@squiddles.dev',
        password: 'password123',
      });

      const user = getCurrentUser()!;

      expect(hasPermission(user, 'create_ticket')).toBe(true);
      expect(hasPermission(user, 'edit_ticket')).toBe(true);
      expect(hasPermission(user, 'manage_sprints')).toBe(false);
      expect(hasPermission(user, 'delete_ticket')).toBe(false);
    });
  });

  describe('utility functions', () => {
    it('should format user display name correctly', async () => {
      await login({
        email: 'jordan@squiddles.dev',
        password: 'password123',
      });

      const user = getCurrentUser()!;
      const displayName = getUserDisplayName(user);

      expect(displayName).toBe('Jordan Kim (Product Manager)');
    });

    it('should generate avatar URL correctly', async () => {
      await login({
        email: 'jordan@squiddles.dev',
        password: 'password123',
      });

      const user = getCurrentUser()!;
      const avatarUrl = getUserAvatarUrl(user);

      // Should return the existing avatarUrl or generate one
      expect(avatarUrl).toBeTruthy();
      expect(typeof avatarUrl).toBe('string');
    });
  });
});