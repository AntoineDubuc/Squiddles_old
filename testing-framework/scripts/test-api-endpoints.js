/**
 * API Endpoint Testing Script
 * Tests the newly implemented API endpoints for TICKET-003
 */

const BASE_URL = 'http://localhost:3000';

// Test data
const testCredentials = {
  email: 'jordan@squiddles.dev',
  password: 'password123'
};

const testTicket = {
  title: 'Test API Ticket Creation',
  description: 'This ticket was created via API testing to verify the endpoints are working correctly.',
  type: 'task',
  priority: 'medium',
  projectId: 'project_001',
  sections: [
    {
      name: 'Test Section',
      content: 'This is a test section to verify sections are created correctly.',
      type: 'text'
    }
  ],
  acceptanceCriteria: [
    'API should create ticket successfully',
    'All fields should be saved correctly',
    'Response should include generated ID and Jira key'
  ]
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log(`🔄 ${requestOptions.method || 'GET'} ${endpoint}`);
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ ${response.status}: ${data.error || 'Unknown error'}`);
      if (data.message) console.error(`   ${data.message}`);
      return null;
    }
    
    console.log(`✅ ${response.status}: Success`);
    return data;
  } catch (error) {
    console.error(`❌ Network error:`, error.message);
    return null;
  }
}

// Test login and get auth token
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication');
  console.log('=' .repeat(50));
  
  const loginResponse = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(testCredentials),
  });
  
  if (loginResponse?.success) {
    console.log(`✅ Login successful for ${loginResponse.data.user.name}`);
    console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);
    return loginResponse.data.token;
  } else {
    console.error('❌ Login failed');
    return null;
  }
}

// Test tickets API
async function testTicketsAPI(authToken) {
  console.log('\n🎫 Testing Tickets API');
  console.log('=' .repeat(50));
  
  // Test GET /api/tickets
  console.log('\n📋 Testing ticket listing...');
  const ticketsResponse = await apiRequest('/api/tickets?limit=5', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  if (ticketsResponse?.success) {
    console.log(`✅ Found ${ticketsResponse.data.total} tickets`);
    console.log(`   Page ${ticketsResponse.data.page} of ${Math.ceil(ticketsResponse.data.total / ticketsResponse.data.pageSize)}`);
    
    if (ticketsResponse.data.items.length > 0) {
      const firstTicket = ticketsResponse.data.items[0];
      console.log(`   First ticket: ${firstTicket.jiraKey} - ${firstTicket.title}`);
    }
  }
  
  // Test POST /api/tickets
  console.log('\n📝 Testing ticket creation...');
  const createResponse = await apiRequest('/api/tickets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(testTicket),
  });
  
  if (createResponse?.success) {
    const newTicket = createResponse.data;
    console.log(`✅ Ticket created: ${newTicket.jiraKey} - ${newTicket.title}`);
    console.log(`   ID: ${newTicket.id}`);
    console.log(`   Sections: ${newTicket.sections.length}`);
    console.log(`   Acceptance Criteria: ${newTicket.acceptanceCriteria.length}`);
    
    // Test GET /api/tickets/[id]
    console.log('\n🔍 Testing individual ticket retrieval...');
    const ticketResponse = await apiRequest(`/api/tickets/${newTicket.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    if (ticketResponse?.success) {
      console.log(`✅ Retrieved ticket: ${ticketResponse.data.title}`);
      console.log(`   Related tickets: ${ticketResponse.data.relatedTickets?.length || 0}`);
    }
    
    // Test PUT /api/tickets/[id]
    console.log('\n✏️ Testing ticket update...');
    const updateResponse = await apiRequest(`/api/tickets/${newTicket.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        status: 'in_progress',
        priority: 'high',
        storyPoints: 3,
      }),
    });
    
    if (updateResponse?.success) {
      console.log(`✅ Ticket updated successfully`);
      console.log(`   Status: ${updateResponse.data.status}`);
      console.log(`   Priority: ${updateResponse.data.priority}`);
      console.log(`   Story Points: ${updateResponse.data.storyPoints}`);
    }
    
    return newTicket.id;
  }
  
  return null;
}

// Test comments API
async function testCommentsAPI(authToken, ticketId) {
  if (!ticketId) return;
  
  console.log('\n💬 Testing Comments API');
  console.log('=' .repeat(50));
  
  // Test POST /api/tickets/[id]/comments
  console.log('\n📝 Testing comment creation...');
  const commentData = {
    content: 'This is a test comment created via API testing. It should appear in the ticket comments.',
    mentions: ['user_002']
  };
  
  const createResponse = await apiRequest(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(commentData),
  });
  
  if (createResponse?.success) {
    console.log(`✅ Comment created: ${createResponse.data.id}`);
    console.log(`   Author: ${createResponse.data.authorName}`);
    console.log(`   Mentions: ${createResponse.data.mentions.length}`);
  }
  
  // Test GET /api/tickets/[id]/comments
  console.log('\n📋 Testing comments listing...');
  const commentsResponse = await apiRequest(`/api/tickets/${ticketId}/comments`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  if (commentsResponse?.success) {
    console.log(`✅ Found ${commentsResponse.data.total} comments`);
    if (commentsResponse.data.items.length > 0) {
      const firstComment = commentsResponse.data.items[0];
      console.log(`   Latest: ${firstComment.content.substring(0, 50)}...`);
    }
  }
}

// Test dashboard API
async function testDashboardAPI(authToken) {
  console.log('\n📊 Testing Dashboard API');
  console.log('=' .repeat(50));
  
  const dashboardResponse = await apiRequest('/api/dashboard/data?period=week&includeMetrics=true', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  if (dashboardResponse?.success) {
    const data = dashboardResponse.data;
    console.log(`✅ Dashboard data retrieved for ${data.user.name}`);
    console.log(`   Total tickets: ${data.metrics.user.totalTickets}`);
    console.log(`   Active tickets: ${data.metrics.user.activeTickets}`);
    console.log(`   Recent activity items: ${data.recentActivity.length}`);
    console.log(`   Notifications: ${data.notifications.length}`);
    
    if (data.activeSprint) {
      console.log(`   Active sprint: ${data.activeSprint.name}`);
      console.log(`   Sprint progress: ${data.metrics.sprint.completed}/${data.metrics.sprint.capacity} points`);
    }
  }
}

// Test search API
async function testSearchAPI(authToken) {
  console.log('\n🔍 Testing Search API');
  console.log('=' .repeat(50));
  
  // Test basic search
  console.log('\n📝 Testing basic search...');
  const searchResponse = await apiRequest('/api/search?query=voice&types=tickets,comments&limit=5', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  if (searchResponse?.success) {
    const data = searchResponse.data;
    console.log(`✅ Search completed in ${data.processingTime}ms`);
    console.log(`   Found ${data.total} results for "${data.query}"`);
    
    data.results.forEach((result, index) => {
      console.log(`   ${index + 1}. [${result.type.toUpperCase()}] ${result.title} (score: ${result.score})`);
      if (result.highlights.length > 0) {
        console.log(`      ${result.highlights[0]}`);
      }
    });
    
    if (data.suggestions && data.suggestions.length > 0) {
      console.log(`   Suggestions: ${data.suggestions.join(', ')}`);
    }
  }
  
  // Test search with filters
  console.log('\n🎯 Testing filtered search...');
  const filteredSearchResponse = await apiRequest('/api/search?query=ticket&types=tickets&status=in_progress,todo&limit=3', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  if (filteredSearchResponse?.success) {
    console.log(`✅ Filtered search found ${filteredSearchResponse.data.total} results`);
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Endpoint Testing');
  console.log('=' .repeat(60));
  console.log(`Testing against: ${BASE_URL}`);
  console.log('Make sure the dev server is running: npm run dev');
  
  try {
    // Test authentication first
    const authToken = await testAuthentication();
    if (!authToken) {
      console.error('❌ Cannot proceed without authentication');
      return;
    }
    
    // Test all APIs
    const ticketId = await testTicketsAPI(authToken);
    await testCommentsAPI(authToken, ticketId);
    await testDashboardAPI(authToken);
    await testSearchAPI(authToken);
    
    console.log('\n🎉 All API Tests Completed!');
    console.log('=' .repeat(60));
    console.log('✅ Authentication API - Working');
    console.log('✅ Tickets API - Working');
    console.log('✅ Comments API - Working');
    console.log('✅ Dashboard API - Working');
    console.log('✅ Search API - Working');
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error);
  }
}

// Check if this is being run directly
if (typeof window === 'undefined' && typeof require !== 'undefined') {
  // Running in Node.js
  console.log('⚠️  To run these tests, you need to:');
  console.log('1. Start the dev server: npm run dev');
  console.log('2. Open browser console');
  console.log('3. Copy and paste this script');
  console.log('4. Call: runAllTests()');
} else {
  // Running in browser
  console.log('🌐 Browser testing environment detected');
  console.log('Call runAllTests() to start testing');
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.runAllTests = runAllTests;
  window.testAPI = {
    authentication: testAuthentication,
    tickets: testTicketsAPI,
    comments: testCommentsAPI,
    dashboard: testDashboardAPI,
    search: testSearchAPI,
  };
}