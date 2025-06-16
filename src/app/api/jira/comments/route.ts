/**
 * API route for Jira comments
 * GET /api/jira/comments - Get comments from Jira tickets
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJiraClient } from '@/lib/jira/jiraClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketKey = searchParams.get('ticketKey');
    const projectKey = searchParams.get('projectKey');
    const sprintId = searchParams.get('sprintId');
    const withMentions = searchParams.get('withMentions') === 'true';

    const jiraClient = getJiraClient();

    // Get current user for mention detection
    let currentUser = null;
    if (withMentions) {
      currentUser = await jiraClient.getCurrentUser();
    }

    let comments: Array<{
      ticketKey: string;
      ticketTitle: string;
      comment: any;
    }> = [];

    if (ticketKey) {
      // Get comments for specific ticket
      const ticketComments = await jiraClient.getTicketComments(ticketKey);
      
      comments = ticketComments.map(comment => ({
        ticketKey,
        ticketTitle: '', // Would need to fetch ticket details
        comment,
      }));
    } else {
      // Get tickets first
      let tickets;
      if (projectKey) {
        tickets = await jiraClient.getSprintTickets(
          projectKey,
          sprintId ? parseInt(sprintId) : undefined
        );
      } else {
        // Get all user's projects
        const projects = await jiraClient.getUserProjects();
        const projectKeys = projects.map(p => p.key);
        
        if (projectKeys.length === 0) {
          return NextResponse.json({
            success: true,
            comments: [],
            message: 'No projects found for user',
          });
        }

        // Get tickets from active sprints
        const jql = `project in (${projectKeys.join(',')}) AND sprint in openSprints()`;
        tickets = await jiraClient.searchTickets(jql);
      }

      // Get comments for all tickets
      const ticketKeys = tickets.map(t => t.key);
      const commentMap = await jiraClient.getBatchComments(ticketKeys);

      // Flatten comments with ticket info
      tickets.forEach(ticket => {
        const ticketComments = commentMap.get(ticket.key) || [];
        ticketComments.forEach(comment => {
          comments.push({
            ticketKey: ticket.key,
            ticketTitle: ticket.fields.summary,
            comment,
          });
        });
      });
    }

    // Transform and filter comments
    const transformedComments = comments.map(({ ticketKey, ticketTitle, comment }) => {
      const mentions = jiraClient.parseMentions(comment.body);
      const isDirectMention = currentUser ? 
        jiraClient.isUserMentioned(comment, currentUser.accountId) : false;

      return {
        id: comment.id,
        ticketKey,
        ticketTitle,
        author: {
          id: comment.author.accountId,
          name: comment.author.displayName,
          avatar: comment.author.avatarUrls?.['48x48'],
        },
        body: comment.body,
        created: comment.created,
        updated: comment.updated,
        mentions,
        isDirectMention,
      };
    });

    // Sort with mentions first, then by date
    transformedComments.sort((a, b) => {
      if (a.isDirectMention && !b.isDirectMention) return -1;
      if (!a.isDirectMention && b.isDirectMention) return 1;
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    // Filter only mentions if requested
    const finalComments = withMentions && currentUser
      ? transformedComments.filter(c => c.isDirectMention)
      : transformedComments;

    return NextResponse.json({
      success: true,
      comments: finalComments,
      count: finalComments.length,
      currentUser: currentUser ? {
        id: currentUser.accountId,
        name: currentUser.displayName,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching Jira comments:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Jira comments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}