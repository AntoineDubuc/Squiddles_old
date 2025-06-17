/**
 * API route for Jira user information
 * GET /api/jira/user - Get current user info
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJiraClient } from '@/lib/jira/jiraClient';

export async function GET(request: NextRequest) {
  try {
    const jiraClient = getJiraClient();
    
    // Get current user
    const user = await jiraClient.getCurrentUser();
    
    // Get user's projects
    const projects = await jiraClient.getUserProjects();

    return NextResponse.json({
      success: true,
      user: {
        id: user.accountId,
        name: user.displayName,
        email: user.emailAddress,
      },
      projects: projects.map(p => ({
        key: p.key,
        name: p.name,
      })),
    });
  } catch (error) {
    console.error('Error fetching Jira user info:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Jira user info',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}