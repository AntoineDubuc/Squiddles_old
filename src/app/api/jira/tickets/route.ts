/**
 * API route for Jira tickets
 * GET /api/jira/tickets - Get tickets from Jira
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJiraClient } from '@/lib/jira/jiraClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey');
    const sprintId = searchParams.get('sprintId');
    const jql = searchParams.get('jql');

    const jiraClient = getJiraClient();

    let tickets;
    
    if (jql) {
      // Custom JQL search
      tickets = await jiraClient.searchTickets(jql);
    } else if (projectKey) {
      // Get sprint tickets for a project
      tickets = await jiraClient.getSprintTickets(
        projectKey,
        sprintId ? parseInt(sprintId) : undefined
      );
    } else {
      // Get all user's projects and their tickets
      const projects = await jiraClient.getUserProjects();
      const projectKeys = projects.map(p => p.key);
      
      if (projectKeys.length === 0) {
        return NextResponse.json({
          success: true,
          tickets: [],
          projects: [],
          message: 'No projects found for user',
        });
      }

      // Get tickets from active sprints across all projects
      const jql = `project in (${projectKeys.join(',')}) AND sprint in openSprints()`;
      tickets = await jiraClient.searchTickets(jql);
    }

    // Transform tickets to simpler format
    const simplifiedTickets = tickets.map(ticket => ({
      id: ticket.id,
      key: ticket.key,
      title: ticket.fields?.summary || '',
      description: ticket.fields?.description || '',
      type: ticket.fields?.issuetype?.name || 'Unknown',
      status: ticket.fields?.status?.name || 'Unknown',
      priority: ticket.fields?.priority?.name || 'None',
      assignee: ticket.fields?.assignee ? {
        id: ticket.fields.assignee.accountId,
        name: ticket.fields.assignee.displayName,
      } : null,
      reporter: ticket.fields?.reporter ? {
        id: ticket.fields.reporter.accountId,
        name: ticket.fields.reporter.displayName,
      } : null,
      project: ticket.fields?.project ? {
        key: ticket.fields.project.key,
        name: ticket.fields.project.name,
      } : null,
      sprint: ticket.fields?.sprint || null,
      created: ticket.fields?.created || '',
      updated: ticket.fields?.updated || '',
    }));

    return NextResponse.json({
      success: true,
      tickets: simplifiedTickets,
      count: simplifiedTickets.length,
    });
  } catch (error) {
    console.error('Error fetching Jira tickets:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Jira tickets',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}