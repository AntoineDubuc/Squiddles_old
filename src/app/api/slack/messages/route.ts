/**
 * Slack Messages API Route
 * Following Jira API route patterns
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSlackClient } from '../../../../lib/slack/slackClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, text, blocks, thread_ts, urgent } = body;

    if (!channel || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: channel and text' },
        { status: 400 }
      );
    }

    const slackClient = getSlackClient();
    
    const result = await slackClient.sendMessage({
      channel,
      text,
      blocks,
      thread_ts,
      urgent
    });

    // Format response similar to Jira API responses
    return NextResponse.json({
      success: true,
      message: {
        ts: result.ts,
        channel: result.channel,
        text,
        permalink: `https://app.slack.com/client/${process.env.SLACK_TEAM_ID}/${result.channel}/${result.ts?.replace('.', '')}`
      },
      sent_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Slack message API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send Slack message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const slackClient = getSlackClient();
    
    // Test bot connection
    const botInfo = await slackClient.getBotInfo();
    
    return NextResponse.json({
      success: botInfo.ok,
      bot: botInfo.user,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Slack bot info API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get bot info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}