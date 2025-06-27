#!/bin/bash

# Simple Slack API Test using curl
# Tests authentication and basic functionality

echo "🧪 Testing Slack API Connection..."
echo ""

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep BOT_OAUTH_TOKEN | xargs)
fi

# Check if token exists
if [ -z "$BOT_OAUTH_TOKEN" ]; then
  echo "❌ BOT_OAUTH_TOKEN not found in environment"
  echo "Please check your .env file"
  exit 1
fi

echo "✅ Bot token found: ${BOT_OAUTH_TOKEN:0:12}..."
echo ""

# Test 1: Authentication
echo "📡 Testing authentication..."
AUTH_RESPONSE=$(curl -s -X POST https://slack.com/api/auth.test \
  -H "Authorization: Bearer $BOT_OAUTH_TOKEN" \
  -H "Content-Type: application/json")

echo "Response: $AUTH_RESPONSE"
echo ""

# Check if auth was successful
if echo "$AUTH_RESPONSE" | grep -q '"ok":true'; then
  echo "✅ Authentication successful!"
  
  # Extract team and user info
  TEAM=$(echo "$AUTH_RESPONSE" | grep -o '"team":"[^"]*"' | cut -d'"' -f4)
  USER=$(echo "$AUTH_RESPONSE" | grep -o '"user":"[^"]*"' | cut -d'"' -f4)
  USER_ID=$(echo "$AUTH_RESPONSE" | grep -o '"user_id":"[^"]*"' | cut -d'"' -f4)
  TEAM_ID=$(echo "$AUTH_RESPONSE" | grep -o '"team_id":"[^"]*"' | cut -d'"' -f4)
  
  echo "   Team: $TEAM"
  echo "   User: $USER"
  echo "   User ID: $USER_ID"
  echo "   Team ID: $TEAM_ID"
  echo ""
  
  # Test 2: List channels
  echo "📋 Testing channel access..."
  CHANNELS_RESPONSE=$(curl -s -X POST https://slack.com/api/conversations.list \
    -H "Authorization: Bearer $BOT_OAUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"types":"public_channel,private_channel","limit":10}')
  
  echo "Channels Response: $CHANNELS_RESPONSE"
  echo ""
  
  if echo "$CHANNELS_RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Channel access successful!"
    
    # Count channels
    CHANNEL_COUNT=$(echo "$CHANNELS_RESPONSE" | grep -o '"name":"[^"]*"' | wc -l)
    echo "   Found $CHANNEL_COUNT accessible channels"
    
    # List channel names
    echo "$CHANNELS_RESPONSE" | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | while read channel; do
      echo "   📺 #$channel"
    done
    echo ""
    
    # Test 3: Send a test message to general channel (if exists)
    GENERAL_CHANNEL=$(echo "$CHANNELS_RESPONSE" | grep -o '"id":"[^"]*","name":"general"' | cut -d'"' -f2)
    
    if [ -n "$GENERAL_CHANNEL" ]; then
      echo "💬 Testing message sending to #general..."
      
      MESSAGE_RESPONSE=$(curl -s -X POST https://slack.com/api/chat.postMessage \
        -H "Authorization: Bearer $BOT_OAUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
          \"channel\":\"$GENERAL_CHANNEL\",
          \"text\":\"🧪 Squiddles Slack Integration Test\",
          \"blocks\":[
            {
              \"type\":\"header\",
              \"text\":{
                \"type\":\"plain_text\",
                \"text\":\"🧪 Squiddles Slack Integration Test\"
              }
            },
            {
              \"type\":\"section\",
              \"text\":{
                \"type\":\"mrkdwn\",
                \"text\":\"✅ Successfully connected to Slack!\\n\\n*Test performed at:* $(date)\"
              }
            },
            {
              \"type\":\"context\",
              \"elements\":[
                {
                  \"type\":\"mrkdwn\",
                  \"text\":\"🦑 Powered by Squiddles AI • Voice-activated project management\"
                }
              ]
            }
          ]
        }")
      
      echo "Message Response: $MESSAGE_RESPONSE"
      echo ""
      
      if echo "$MESSAGE_RESPONSE" | grep -q '"ok":true'; then
        echo "✅ Test message sent successfully!"
        
        # Extract message info
        MESSAGE_TS=$(echo "$MESSAGE_RESPONSE" | grep -o '"ts":"[^"]*"' | cut -d'"' -f4)
        echo "   Message timestamp: $MESSAGE_TS"
        echo "   Channel: #general"
        
        # Generate permalink
        PERMALINK_TS=$(echo "$MESSAGE_TS" | tr -d '.')
        echo "   Permalink: https://app.slack.com/client/$TEAM_ID/$GENERAL_CHANNEL/thread/$PERMALINK_TS"
      else
        echo "❌ Failed to send test message"
        echo "Error: $(echo "$MESSAGE_RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
      fi
    else
      echo "⚠️ #general channel not found or not accessible"
    fi
    
  else
    echo "❌ Failed to access channels"
    echo "Error: $(echo "$CHANNELS_RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
  fi
  
else
  echo "❌ Authentication failed"
  ERROR=$(echo "$AUTH_RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Error: $ERROR"
  
  echo ""
  echo "💡 Common solutions:"
  echo "   • Check if bot token is valid and not expired"
  echo "   • Verify bot has necessary scopes (chat:write, channels:read)"
  echo "   • Ensure bot is added to the workspace"
  echo "   • Check if bot is added to channels you want to use"
fi

echo ""
echo "🎉 Slack Integration Test Complete!"