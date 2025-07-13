/**
 * Jira Service - Client-side API wrapper for Jira integration
 * Uses API routes for server-side Jira access (no direct client instantiation)
 */

import React from 'react';
import {
  DashboardActivityFeed,
} from '../types/jira-models';

// React hook for dashboard integration with client-side pagination
export function useJiraActivityFeed() {
  const [fullActivityFeed, setFullActivityFeed] = React.useState<DashboardActivityFeed | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const pageSize = 5;
  
  // Request deduplication to prevent concurrent requests
  const requestInProgress = React.useRef(false);

  const loadAllActivityFeed = React.useCallback(async () => {
    // Prevent concurrent requests
    if (requestInProgress.current) {
      console.log('🔧 Request already in progress, skipping...');
      return;
    }
    
    try {
      requestInProgress.current = true;
      setIsLoading(true);
      setError(null);
      
      console.log('🔧 Fetching all Jira activity from API...');
      
      // Fetch ALL mentions at once (up to 100) with reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      console.log('🔧 Making request to /api/jira/activity...');
      const response = await fetch('/api/jira/activity?page=0&limit=5', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('🔧 Response received:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔧 API Error Response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      const feed = await response.json();
      console.log('✅ Full activity feed loaded:', feed.mentions.length, 'mentions');
      setFullActivityFeed(feed);
      setCurrentPage(0);
      
    } catch (err) {
      console.warn('⚠️ Jira activity feed failed (app will continue):', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Jira service timed out after 15s (continuing without Jira data)');
      } else if (err instanceof Error) {
        setError(`Jira error: ${err.message} (continuing without Jira data)`);
      } else {
        setError('Jira unavailable (continuing without Jira data)');
      }
      
      // Set empty feed to allow app to continue
      setFullActivityFeed({
        mentions: [],
        recentComments: [],
        ticketUpdates: [],
        unreadCount: 0,
        lastRefresh: new Date(),
        hasMore: false,
        totalCount: 0,
        currentPage: 0,
        totalPages: 0
      });
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  }, []);

  // Calculate paginated view from full data
  const activityFeed = React.useMemo(() => {
    if (!fullActivityFeed) return null;

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMentions = fullActivityFeed.mentions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(fullActivityFeed.mentions.length / pageSize);

    return {
      ...fullActivityFeed,
      mentions: paginatedMentions,
      hasMore: currentPage < totalPages - 1,
      totalPages,
      currentPage,
      totalMentions: fullActivityFeed.mentions.length
    };
  }, [fullActivityFeed, currentPage, pageSize]);

  const loadPage = React.useCallback((page: number) => {
    if (!fullActivityFeed) return;
    const totalPages = Math.ceil(fullActivityFeed.mentions.length / pageSize);
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [fullActivityFeed, pageSize]);

  const nextPage = React.useCallback(() => {
    if (activityFeed?.hasMore) {
      setCurrentPage(current => current + 1);
    }
  }, [activityFeed?.hasMore]);

  const prevPage = React.useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(current => current - 1);
    }
  }, [currentPage]);

  React.useEffect(() => {
    // Add error boundary to prevent hook from breaking app initialization
    try {
      loadAllActivityFeed();
    } catch (error) {
      console.error('❌ Failed to initialize Jira activity feed:', error);
      setError('Failed to initialize Jira connection');
      setIsLoading(false);
    }
  }, [loadAllActivityFeed]);

  return {
    activityFeed,
    isLoading,
    error,
    currentPage,
    refresh: loadAllActivityFeed,
    loadPage,
    nextPage,
    prevPage
  };
}