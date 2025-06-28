/**
 * Jira Search API Endpoint
 * Handles JQL queries and ticket searches
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jql = searchParams.get('jql');
    const maxResults = parseInt(searchParams.get('maxResults') || '20');

    if (!jql) {
      return NextResponse.json(
        { error: 'JQL query parameter is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Jira search API called:', { jql, maxResults });

    // Build Jira API request
    const jiraResponse = await fetch(
      `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jql,
          maxResults,
          fields: [
            'summary',
            'description', 
            'issuetype',
            'status',
            'priority',
            'assignee',
            'reporter',
            'created',
            'updated',
            'labels',
            'components',
            'project'
          ]
        })
      }
    );

    if (!jiraResponse.ok) {
      const errorText = await jiraResponse.text();
      console.error('❌ Jira API error:', jiraResponse.status, errorText);
      return NextResponse.json(
        { error: `Jira API error: ${jiraResponse.status}` },
        { status: jiraResponse.status }
      );
    }

    const data = await jiraResponse.json();
    
    console.log(`✅ Found ${data.total} tickets matching: ${jql}`);

    // Format the response for better readability
    const formattedIssues = data.issues?.map((issue: any) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name,
      priority: issue.fields.priority?.name,
      assignee: issue.fields.assignee?.displayName || 'Unassigned',
      reporter: issue.fields.reporter?.displayName,
      created: issue.fields.created,
      updated: issue.fields.updated,
      url: `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/browse/${issue.key}`,
      issueType: issue.fields.issuetype?.name,
      project: issue.fields.project?.key,
      labels: issue.fields.labels || []
    })) || [];

    return NextResponse.json({
      success: true,
      total: data.total,
      issues: formattedIssues,
      query: jql
    });

  } catch (error) {
    console.error('❌ Jira search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}