#!/bin/bash

# API Flow Test Script
# Tests the complete authentication and API flow

BASE_URL="http://localhost:8888"

echo "🚀 Testing API Flow"
echo "==================="

# Step 1: Login and get token
echo "📝 Step 1: Authentication"
LOGIN_RESPONSE=$(curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"jordan@squiddles.dev","password":"password123"}' \
  -s)

SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.success')
if [ "$SUCCESS" = "true" ]; then
  echo "✅ Login successful"
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
  USER_NAME=$(echo "$LOGIN_RESPONSE" | jq -r '.data.user.name')
  echo "   User: $USER_NAME"
  echo "   Token: ${TOKEN:0:20}..."
else
  echo "❌ Login failed"
  echo "$LOGIN_RESPONSE" | jq '.error'
  exit 1
fi

# Step 2: Test tickets API with auth
echo ""
echo "📋 Step 2: Testing Tickets API"
TICKETS_RESPONSE=$(curl -X GET "$BASE_URL/api/tickets?limit=2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -s)

TICKETS_SUCCESS=$(echo "$TICKETS_RESPONSE" | jq -r '.success')
if [ "$TICKETS_SUCCESS" = "true" ]; then
  echo "✅ Tickets API working"
  TOTAL_TICKETS=$(echo "$TICKETS_RESPONSE" | jq -r '.data.total')
  echo "   Found $TOTAL_TICKETS tickets"
else
  echo "❌ Tickets API failed"
  echo "$TICKETS_RESPONSE" | jq '.error'
fi

# Step 3: Test dashboard API
echo ""
echo "📊 Step 3: Testing Dashboard API"
DASHBOARD_RESPONSE=$(curl -X GET "$BASE_URL/api/dashboard/data?period=week" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -s)

DASHBOARD_SUCCESS=$(echo "$DASHBOARD_RESPONSE" | jq -r '.success')
if [ "$DASHBOARD_SUCCESS" = "true" ]; then
  echo "✅ Dashboard API working"
  ACTIVE_TICKETS=$(echo "$DASHBOARD_RESPONSE" | jq -r '.data.metrics.user.activeTickets')
  echo "   Active tickets: $ACTIVE_TICKETS"
else
  echo "❌ Dashboard API failed"
  echo "$DASHBOARD_RESPONSE" | jq '.error'
fi

# Step 4: Test search API
echo ""
echo "🔍 Step 4: Testing Search API"
SEARCH_RESPONSE=$(curl -X GET "$BASE_URL/api/search?query=voice&limit=2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -s)

SEARCH_SUCCESS=$(echo "$SEARCH_RESPONSE" | jq -r '.success')
if [ "$SEARCH_SUCCESS" = "true" ]; then
  echo "✅ Search API working"
  SEARCH_RESULTS=$(echo "$SEARCH_RESPONSE" | jq -r '.data.total')
  echo "   Found $SEARCH_RESULTS results for 'voice'"
else
  echo "❌ Search API failed"
  echo "$SEARCH_RESPONSE" | jq '.error'
fi

echo ""
echo "🎉 API Flow Test Complete!"
echo "=========================="