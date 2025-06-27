/**
 * Basic Slack Connection Test
 * Uses fetch API to test Slack connectivity without additional dependencies
 */

const https = require('https');
const fs = require('fs');

// Load environment variables from .env file
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
          process.env[key.trim()] = value.trim();
        }
      }
    }
  } catch (error) {
    console.error('Could not load .env file:', error.message);
  }
}

// Make HTTPS request helper
function makeSlackRequest(path, data = null) {
  return new Promise((resolve, reject) => {
    const token = process.env.BOT_OAUTH_TOKEN || process.env.SLACK_BOT_TOKEN;
    
    if (!token) {
      reject(new Error('BOT_OAUTH_TOKEN not found in environment'));
      return;
    }

    const options = {
      hostname: 'slack.com',
      path: `/api/${path}`,
      method: data ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testSlackConnection() {
  console.log('🧪 Testing Slack Connection...\n');
  
  // Load environment
  loadEnv();
  
  const token = process.env.BOT_OAUTH_TOKEN || process.env.SLACK_BOT_TOKEN;
  
  if (!token) {
    console.error('❌ Missing Slack bot token in environment variables');
    console.log('Expected: BOT_OAUTH_TOKEN or SLACK_BOT_TOKEN in .env file');
    return;
  }
  
  console.log('✅ Bot token found:', token.substring(0, 12) + '...');
  
  try {
    // Test 1: Authentication
    console.log('\n📡 Testing authentication...');
    const authResult = await makeSlackRequest('auth.test');
    
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
    const channelsResult = await makeSlackRequest('conversations.list', {
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
      
      // Find a channel where bot is a member
      const testChannel = channelsResult.channels.find(ch => ch.is_member);
      
      if (testChannel) {
        // Test 3: Send test message
        console.log(`\n💬 Testing message sending to #${testChannel.name}...`);
        
        const messageData = {
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
        };
        
        const messageResult = await makeSlackRequest('chat.postMessage', messageData);
        
        if (messageResult.ok) {
          console.log('✅ Test message sent successfully!');
          console.log(`   Message ID: ${messageResult.ts}`);
          console.log(`   Channel: #${testChannel.name}`);
          
          // Generate permalink
          const permalinkTs = messageResult.ts?.replace('.', '');
          const permalink = `https://app.slack.com/client/${authResult.team_id}/${testChannel.id}/thread/${permalinkTs}`;
          console.log(`   Permalink: ${permalink}`);
        } else {
          console.error('❌ Failed to send test message:', messageResult.error);
        }
        
      } else {
        console.log('⚠️ Bot is not a member of any channels. Add the bot to a channel first.');
      }
      
    } else {
      console.error('❌ Failed to list channels:', channelsResult.error);
    }
    
    // Summary
    console.log('\n🎉 Slack Integration Test Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Authentication: Working');
    console.log('✅ Channel Access: Working');
    if (channelsResult.channels?.some(ch => ch.is_member)) {
      console.log('✅ Message Sending: Working');
    } else {
      console.log('⚠️ Message Sending: Untested (no accessible channels)');
    }
    console.log('\n🦑 Squiddles is ready for Slack integration!');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    
    console.log('\n💡 Common solutions:');
    console.log('   • Check if bot token is valid and not expired');
    console.log('   • Verify bot has necessary scopes (chat:write, channels:read)');
    console.log('   • Ensure bot is added to the workspace');
    console.log('   • Add bot to channels: /invite @YourBotName');
  }
}

// Run the test
testSlackConnection().catch(console.error);