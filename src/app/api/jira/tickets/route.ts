import { NextRequest, NextResponse } from 'next/server';
import { validateJiraConfig } from '@/lib/jira/config';
import { jiraClient } from '@/lib/jira';
import type { JiraTicket } from '@/app/types/jira';

export async function POST(request: NextRequest) {
  try {
    const config = validateJiraConfig();
    const body = await request.json();
    
    const { 
      summary, 
      description, 
      projectKey = 'DE', 
      issueType = 'Story',
      priority,
      assignee
    } = body;

    if (!summary || !description) {
      return NextResponse.json(
        { error: 'Summary and description are required' },
        { status: 400 }
      );
    }

    // Create the issue payload
    const issueData = {
      fields: {
        project: {
          key: projectKey
        },
        summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: description
                }
              ]
            }
          ]
        },
        issuetype: {
          name: issueType
        }
      }
    };

    // Add optional fields if provided
    if (priority) {
      issueData.fields.priority = { name: priority };
    }
    
    if (assignee) {
      // First try to find the user
      try {
        const userSearch = await jiraClient.get(`/rest/api/3/user/search`, {
          params: { query: assignee }
        });
        
        if (userSearch.data && userSearch.data.length > 0) {
          issueData.fields.assignee = { accountId: userSearch.data[0].accountId };
        }
      } catch (userError) {
        console.warn('Could not find assignee:', assignee);
      }
    }

    // Create the ticket
    const response = await jiraClient.post('/rest/api/3/issue', issueData);
    
    // Fetch the created ticket details
    const ticketResponse = await jiraClient.get(`/rest/api/3/issue/${response.data.key}`, {
      params: {
        fields: 'summary,description,status,priority,assignee,reporter,created,updated,issuetype,project'
      }
    });

    const ticket: JiraTicket = {
      key: ticketResponse.data.key,
      summary: ticketResponse.data.fields.summary,
      description: ticketResponse.data.fields.description,
      status: ticketResponse.data.fields.status?.name || 'Unknown',
      priority: ticketResponse.data.fields.priority?.name || 'Medium',
      assignee: ticketResponse.data.fields.assignee?.displayName || null,
      reporter: ticketResponse.data.fields.reporter?.displayName || 'Unknown',
      created: ticketResponse.data.fields.created,
      updated: ticketResponse.data.fields.updated,
      type: ticketResponse.data.fields.issuetype?.name || 'Story',
      project: ticketResponse.data.fields.project?.key || projectKey,
      url: `${config.host}/browse/${ticketResponse.data.key}`
    };

    return NextResponse.json({
      success: true,
      ticket,
      message: `Ticket ${ticket.key} created successfully`
    });

  } catch (error: any) {
    console.error('Failed to create Jira ticket:', error);
    return NextResponse.json(
      { error: error.response?.data?.errorMessages?.join(', ') || error.message || 'Failed to create ticket' },
      { status: error.response?.status || 500 }
    );
  }
}