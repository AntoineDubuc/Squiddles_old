/**
 * Slack Channels API Route
 * Following Jira API route patterns
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSlackClient } from '../../../../lib/slack/slackClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, purpose, is_private } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const slackClient = getSlackClient();
    
    const result = await slackClient.createChannel({
      name,
      purpose,
      is_private
    });

    return NextResponse.json({
      success: true,
      channel: {
        id: result.channel?.id,
        name: result.channel?.name,
        is_private: result.channel?.is_private,
        purpose,
        created: new Date().toISOString(),
        url: `https://app.slack.com/client/${process.env.SLACK_TEAM_ID}/${result.channel?.id}`
      }
    });

  } catch (error) {
    console.error('Slack channel creation API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create Slack channel',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const slackClient = getSlackClient();
    
    const channels = await slackClient.listChannels();
    
    return NextResponse.json({
      success: true,
      channels,
      total: channels.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Slack channels list API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to list Slack channels',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}