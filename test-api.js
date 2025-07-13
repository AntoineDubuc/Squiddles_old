#!/usr/bin/env node

// Simple test script to verify the Jira API is working
const fetch = require('node-fetch');

async function testJiraAPI() {
  console.log('🧪 Testing Jira API endpoint...');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('http://localhost:3002/api/jira/activity?page=0&limit=5', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', {
        status: response.status,
        mentionCount: data.mentions?.length || 0,
        hasError: !!data.error
      });
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏰ API request timed out');
    } else {
      console.log('❌ API Error:', error.message);
    }
  }
}

testJiraAPI();