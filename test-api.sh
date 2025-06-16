#!/bin/bash

echo "Testing Pinecone API endpoints on port 8888..."
echo ""

# Test health endpoint
echo "1. Testing /api/pinecone/health"
curl -s http://localhost:8888/api/pinecone/health | python3 -m json.tool || echo "Failed"
echo ""

# Test stats endpoint
echo "2. Testing /api/pinecone/stats"
curl -s http://localhost:8888/api/pinecone/stats | python3 -m json.tool || echo "Failed"
echo ""

# Test Jira user endpoint
echo "3. Testing /api/jira/user"
curl -s http://localhost:8888/api/jira/user | python3 -m json.tool || echo "Failed"
echo ""

echo "Note: Start the server with 'npm run dev' in another terminal"