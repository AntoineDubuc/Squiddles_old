#!/bin/bash

# Comprehensive server testing script
echo "🔍 Testing Squiddles application startup..."

# 1. Check if port 3002 is available
if lsof -Pi :3002 -sTCP:LISTEN -t > /dev/null; then
    echo "✅ Server is running on port 3002"
else
    echo "❌ No server detected on port 3002"
    exit 1
fi

# 2. Test HTTP response
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Homepage returns HTTP 200"
else
    echo "❌ Homepage returns HTTP $HTTP_CODE"
    exit 1
fi

# 3. Test content loading
if curl -s http://localhost:3002 | grep -q "Dashboard\|Squiddles"; then
    echo "✅ Page content loads correctly"
else
    echo "❌ Page content missing or malformed"
    exit 1
fi

# 4. Test API endpoints
SESSION_RESPONSE=$(curl -s http://localhost:3002/api/session)
if echo "$SESSION_RESPONSE" | grep -q "client_secret"; then
    echo "✅ Session API endpoint working"
else
    echo "❌ Session API endpoint failed"
    echo "Response: $SESSION_RESPONSE"
    exit 1
fi

# 5. Test Settings API
SETTINGS_RESPONSE=$(curl -s http://localhost:3002/api/settings/voice-provider)
if echo "$SETTINGS_RESPONSE" | grep -q "provider\|openaiAvailable"; then
    echo "✅ Settings API endpoint working"
else
    echo "❌ Settings API endpoint failed"
    echo "Response: $SETTINGS_RESPONSE"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Application is fully operational."
echo "🌐 Access at: http://localhost:3002"
echo ""