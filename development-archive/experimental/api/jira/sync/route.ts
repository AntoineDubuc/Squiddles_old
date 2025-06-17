/**
 * API route for syncing Jira data to Pinecone
 * POST /api/jira/sync - Sync tickets and comments to Pinecone
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJiraClient } from '@/lib/jira/jiraClient';
import { getPineconeService, PineconeDocument, PineconeDocType } from '@/lib/pinecone/index';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectKey, sprintId, syncComments = true } = body;

    const jiraClient = getJiraClient();
    const pineconeService = getPineconeService();

    // Get current user for context
    const currentUser = await jiraClient.getCurrentUser();

    // Get tickets
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
          success: false,
          message: 'No projects found for user',
        });
      }

      // Get tickets from active sprints
      const jql = `project in (${projectKeys.join(',')}) AND sprint in openSprints()`;
      tickets = await jiraClient.searchTickets(jql);
    }

    // Prepare ticket documents for Pinecone
    const ticketDocuments: PineconeDocument[] = tickets.map(ticket => ({
      id: ticket.key,
      type: PineconeDocType.TICKET,
      embedding: [], // Will be generated
      metadata: {
        type: 'TICKET',
        teamId: ticket.fields.project.key,
        userId: ticket.fields.reporter.accountId,
        status: ticket.fields.status.name,
        priority: ticket.fields.priority?.name || 'None',
        createdAt: new Date(ticket.fields.created).getTime(),
        ticketType: ticket.fields.issuetype.name,
        assigneeId: ticket.fields.assignee?.accountId,
        projectKey: ticket.fields.project.key,
        projectName: ticket.fields.project.name,
      },
      content: {
        title: ticket.fields.summary,
        description: ticket.fields.description || '',
        fullText: `${ticket.fields.summary}\n${ticket.fields.description || ''}\nType: ${ticket.fields.issuetype.name}\nStatus: ${ticket.fields.status.name}\nPriority: ${ticket.fields.priority?.name || 'None'}`,
      },
    }));

    // Sync tickets to Pinecone
    await pineconeService.upsertBatch(ticketDocuments);

    let commentCount = 0;
    
    if (syncComments) {
      // Get comments for all tickets
      const ticketKeys = tickets.map(t => t.key);
      const commentMap = await jiraClient.getBatchComments(ticketKeys);

      // Prepare comment documents
      const commentDocuments: PineconeDocument[] = [];
      
      tickets.forEach(ticket => {
        const comments = commentMap.get(ticket.key) || [];
        
        comments.forEach(comment => {
          const mentions = jiraClient.parseMentions(comment.body);
          const isDirectMention = jiraClient.isUserMentioned(comment, currentUser.accountId);
          
          commentDocuments.push({
            id: `${ticket.key}-comment-${comment.id}`,
            type: PineconeDocType.COMMENT,
            embedding: [],
            metadata: {
              type: 'COMMENT',
              teamId: ticket.fields.project.key,
              userId: comment.author.accountId,
              createdAt: new Date(comment.created).getTime(),
              ticketId: ticket.id,
              ticketKey: ticket.key,
              authorId: comment.author.accountId,
              authorName: comment.author.displayName,
              hasMention: mentions.length > 0,
              isDirectMention,
              mentions,
            },
            content: {
              title: `Comment on ${ticket.key}: ${ticket.fields.summary}`,
              description: comment.body.substring(0, 200),
              fullText: comment.body,
            },
          });
        });
      });

      // Sync comments to Pinecone
      if (commentDocuments.length > 0) {
        await pineconeService.upsertBatch(commentDocuments);
      }
      
      commentCount = commentDocuments.length;
    }

    return NextResponse.json({
      success: true,
      message: 'Jira data synced to Pinecone',
      stats: {
        ticketsSynced: ticketDocuments.length,
        commentsSynced: commentCount,
        projects: [...new Set(tickets.map(t => t.fields.project.key))],
      },
    });
  } catch (error) {
    console.error('Error syncing Jira data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to sync Jira data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}