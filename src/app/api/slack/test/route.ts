/**
 * Slack Integration Test API Route
 * GET /api/slack/test - Tests Slack connectivity and returns status
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    token_configured: false,
    authentication: { success: false, error: null as string | null },
    channels: { success: false, count: 0, accessible: [] as string[], error: null as string | null },
    message_test: { success: false, error: null as string | null, permalink: null as string | null },
    overall_status: 'failed' as 'passed' | 'failed' | 'partial'
  };

  try {
    // Check if token is configured
    const token = process.env.BOT_OAUTH_TOKEN || process.env.SLACK_BOT_TOKEN;
    
    if (!token) {
      testResults.authentication.error = 'BOT_OAUTH_TOKEN or SLACK_BOT_TOKEN not found in environment';
      return NextResponse.json(testResults, { status: 500 });
    }
    
    testResults.token_configured = true;

    // Test 1: Authentication
    try {
      const authResponse = await fetch('https://slack.com/api/auth.test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const authData = await authResponse.json();
      
      if (authData.ok) {
        testResults.authentication = {
          success: true,
          error: null,
          user: authData.user,
          team: authData.team,
          user_id: authData.user_id,
          team_id: authData.team_id
        } as any;
      } else {
        testResults.authentication.error = authData.error || 'Authentication failed';
        return NextResponse.json(testResults, { status: 200 });
      }
    } catch (error) {
      testResults.authentication.error = `Auth request failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      return NextResponse.json(testResults, { status: 200 });
    }

    // Test 2: Channel access
    try {
      const channelsResponse = await fetch('https://slack.com/api/conversations.list', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          types: 'public_channel,private_channel',
          limit: 20
        })
      });

      const channelsData = await channelsResponse.json();
      
      if (channelsData.ok) {
        const memberChannels = (channelsData.channels || [])
          .filter((ch: any) => ch.is_member)
          .map((ch: any) => ({
            id: ch.id,
            name: ch.name,
            is_private: ch.is_private
          }));

        testResults.channels = {
          success: true,
          count: channelsData.channels?.length || 0,
          accessible: memberChannels,
          error: null
        };

        // Test 3: Send test message (if we have accessible channels)
        if (memberChannels.length > 0) {
          const testChannel = memberChannels.find((ch: any) => !ch.is_private) || memberChannels[0];
          
          try {
            const messageResponse = await fetch('https://slack.com/api/chat.postMessage', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                channel: testChannel.id,
                text: '🧪 Squiddles Slack Integration Test',
                blocks: [
                  {
                    type: 'header',
                    text: {
                      type: 'plain_text',
                      text: '🧪 Squiddles Slack Integration Test'
                    }
                  },
                  {
                    type: 'section',
                    text: {
                      type: 'mrkdwn',
                      text: `✅ Successfully connected to Slack!\n\n*Test performed at:* ${new Date().toLocaleString()}\n*Channel:* #${testChannel.name}`
                    }
                  },
                  {
                    type: 'context',
                    elements: [
                      {
                        type: 'mrkdwn',
                        text: '🦑 Powered by Squiddles AI • Voice-activated project management'
                      }
                    ]
                  }
                ]
              })
            });

            const messageData = await messageResponse.json();
            
            if (messageData.ok) {
              const permalinkTs = messageData.ts?.replace('.', '');
              const permalink = `https://app.slack.com/client/${(testResults.authentication as any).team_id}/${testChannel.id}/thread/${permalinkTs}`;
              
              testResults.message_test = {
                success: true,
                error: null,
                channel: testChannel.name,
                message_id: messageData.ts,
                permalink
              } as any;
            } else {
              testResults.message_test.error = messageData.error || 'Failed to send message';
            }
          } catch (error) {
            testResults.message_test.error = `Message send failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        } else {
          testResults.message_test.error = 'No accessible channels found for testing';
        }
        
      } else {
        testResults.channels.error = channelsData.error || 'Failed to list channels';
      }
    } catch (error) {
      testResults.channels.error = `Channels request failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Determine overall status
    if (testResults.authentication.success && testResults.channels.success) {
      if (testResults.message_test.success) {
        testResults.overall_status = 'passed';
      } else {
        testResults.overall_status = 'partial';
      }
    }

    return NextResponse.json(testResults, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return NextResponse.json({
      ...testResults,
      error: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}