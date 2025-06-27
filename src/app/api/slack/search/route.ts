/**
 * Slack Search API Route
 * Following Jira API route patterns
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSlackClient } from '../../../../lib/slack/slackClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const count = parseInt(searchParams.get('count') || '20');

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required parameter: query' },
        { status: 400 }
      );
    }

    const slackClient = getSlackClient();
    
    const results = await slackClient.searchMessages(query, count);
    
    return NextResponse.json({
      success: true,
      query,
      results: results.messages,
      total: results.total,
      searched_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Slack search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search Slack messages',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, text, post_at, blocks } = body;

    if (!channel || !text || !post_at) {
      return NextResponse.json(
        { error: 'Missing required fields: channel, text, post_at' },
        { status: 400 }
      );
    }

    const slackClient = getSlackClient();
    
    const result = await slackClient.scheduleMessage({
      channel,
      text,
      post_at,
      blocks
    });

    return NextResponse.json({
      success: true,
      scheduled_message: {
        id: result.scheduled_message_id,
        channel,
        post_at: new Date(post_at * 1000).toISOString(),
        text
      },
      scheduled_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Slack schedule message API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to schedule Slack message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}