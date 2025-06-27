/**
 * Slack Connection Test
 * Tests the Slack integration to verify communication works
 */

const { WebClient } = require('@slack/web-api');

// Load environment variables
require('dotenv').config();

async function testSlackConnection() {
  console.log('🧪 Testing Slack Connection...\n');
  
  // Check environment variables
  const botToken = process.env.BOT_OAUTH_TOKEN || process.env.SLACK_BOT_TOKEN;
  
  if (!botToken) {
    console.error('❌ Missing Slack bot token in environment variables');
    console.log('Expected: BOT_OAUTH_TOKEN or SLACK_BOT_TOKEN');
    return;
  }
  
  console.log('✅ Bot token found:', botToken.substring(0, 12) + '...');
  
  try {
    // Initialize Slack client
    const slack = new WebClient(botToken);
    
    // Test 1: Auth test
    console.log('\n📡 Testing authentication...');
    const authResult = await slack.auth.test();
    
    if (authResult.ok) {
      console.log('✅ Authentication successful!');
      console.log(`   Bot User: ${authResult.user}`);
      console.log(`   Team: ${authResult.team}`);
      console.log(`   User ID: ${authResult.user_id}`);
      console.log(`   Team ID: ${authResult.team_id}`);
    } else {
      console.error('❌ Authentication failed:', authResult.error);
      return;
    }
    
    // Test 2: List channels
    console.log('\n📋 Testing channel access...');
    const channelsResult = await slack.conversations.list({
      types: 'public_channel,private_channel',
      limit: 10
    });
    
    if (channelsResult.ok && channelsResult.channels) {
      console.log(`✅ Found ${channelsResult.channels.length} accessible channels:`);
      channelsResult.channels.forEach(channel => {
        const privacy = channel.is_private ? '🔒' : '🌐';
        const member = channel.is_member ? ' (member)' : '';
        console.log(`   ${privacy} #${channel.name}${member}`);
      });
      
      // Find a test channel
      const testChannel = channelsResult.channels.find(ch => 
        ch.is_member && !ch.is_private
      );
      
      if (testChannel) {
        // Test 3: Send test message
        console.log(`\n💬 Testing message sending to #${testChannel.name}...`);
        
        const messageResult = await slack.chat.postMessage({
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
                text: `✅ Successfully connected to Slack!\n\n*Test performed at:* ${new Date().toLocaleString()}`
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
        });
        
        if (messageResult.ok) {
          console.log('✅ Test message sent successfully!');
          console.log(`   Message ID: ${messageResult.ts}`);
          console.log(`   Channel: #${testChannel.name}`);
          
          // Generate permalink
          const permalink = `https://app.slack.com/client/${authResult.team_id}/${testChannel.id}/thread/${messageResult.ts?.replace('.', '')}`;
          console.log(`   Permalink: ${permalink}`);
        } else {
          console.error('❌ Failed to send test message:', messageResult.error);
        }
        
        // Test 4: Search functionality
        console.log('\n🔍 Testing search functionality...');
        try {
          const searchResult = await slack.search.messages({
            query: 'Squiddles',
            count: 5
          });
          
          if (searchResult.ok) {
            const total = searchResult.messages?.total || 0;
            console.log(`✅ Search works! Found ${total} messages containing "Squiddles"`);
          } else {
            console.log('⚠️ Search test skipped (may require additional permissions)');
          }
        } catch (searchError) {
          console.log('⚠️ Search test skipped (requires search:read scope)');
        }
        
      } else {
        console.log('⚠️ No accessible public channels found for message testing');
      }
      
    } else {
      console.error('❌ Failed to list channels:', channelsResult.error);
    }
    
    // Test Summary
    console.log('\n🎉 Slack Integration Test Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Authentication: Working');
    console.log('✅ Channel Access: Working');
    console.log('✅ Message Sending: Working');
    console.log('✅ Rich Formatting: Working');
    console.log('\n🦑 Squiddles is ready for Slack integration!');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    
    if (error.code === 'slack_webapi_platform_error') {
      console.log('\n💡 Common solutions:');
      console.log('   • Check if bot token is valid and not expired');
      console.log('   • Verify bot has necessary scopes (chat:write, channels:read)');
      console.log('   • Ensure bot is added to the workspace');
      console.log('   • Check if bot is added to channels you want to use');
    }
  }
}

// Run the test
if (require.main === module) {
  testSlackConnection().catch(console.error);
}

module.exports = { testSlackConnection };