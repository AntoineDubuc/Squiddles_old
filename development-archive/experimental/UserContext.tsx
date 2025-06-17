/**
 * User Context Provider for Squiddles
 * Implements TICKET-001: User session management throughout the app
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserPreferences } from '@/app/types/ui-models';
import { 
  AuthSession, 
  LoginCredentials,
  getCurrentSession, 
  getCurrentUser, 
  login as authLogin, 
  logout as authLogout,
  updateUserPreferences,
  isAuthenticated 
} from '@/lib/auth';

interface UserContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const existingSession = getCurrentSession();
      if (existingSession) {
        setSession(existingSession);
        setUser(existingSession.user);
      }
    } catch (err) {
      console.error('Error initializing session:', err);
      setError('Failed to initialize user session');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const newSession = await authLogin(credentials);
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await authLogout();
      setSession(null);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    if (!user) {
      setError('No user logged in');
      return false;
    }

    try {
      setError(null);
      
      const updatedUser = await updateUserPreferences(user.id, preferences);
      if (updatedUser) {
        setUser(updatedUser);
        
        // Update session as well
        if (session) {
          setSession({
            ...session,
            user: updatedUser,
          });
        }
        
        return true;
      } else {
        setError('Failed to update preferences');
        return false;
      }
    } catch (err) {
      console.error('Update preferences error:', err);
      setError('Failed to update preferences');
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: UserContextType = {
    user,
    session,
    loading,
    error,
    isLoggedIn: isAuthenticated(),
    
    // Actions
    login,
    logout,
    updatePreferences,
    clearError,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to use user context
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

/**
 * Hook to get current user (convenience hook)
 */
export function useCurrentUser(): User | null {
  const { user } = useUser();
  return user;
}

/**
 * Hook to check if user is authenticated
 */
export function useAuth(): boolean {
  const { isLoggedIn } = useUser();
  return isLoggedIn;
}

/**
 * Higher-order component to require authentication
 */
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { user, loading } = useUser();
    
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      );
    }
    
    if (!user) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-400">Please log in to access this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

/**
 * Component to show user authentication status (for debugging)
 */
export function UserStatus() {
  const { user, loading, error, isLoggedIn } = useUser();
  
  if (loading) {
    return <div className="text-sm text-gray-400">Loading user...</div>;
  }
  
  if (error) {
    return <div className="text-sm text-red-400">Error: {error}</div>;
  }
  
  if (!isLoggedIn || !user) {
    return <div className="text-sm text-gray-400">Not logged in</div>;
  }
  
  return (
    <div className="text-sm text-green-400">
      Logged in as {user.name} ({user.role})
    </div>
  );
}