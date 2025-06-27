/**
 * Confluence Search Test API Route
 * GET /api/confluence/test - Tests Confluence search for "Affinity Solutions"
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConfluenceClient } from '../../../../lib/confluence/confluenceClient';

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    search_term: 'Affinity Solutions',
    configuration: {
      host_configured: false,
      email_configured: false,
      token_configured: false
    },
    authentication: { success: false, error: null as string | null, user: null as any },
    spaces: { success: false, count: 0, spaces: [] as any[], error: null as string | null },
    search_results: {
      affinity_solutions: { success: false, count: 0, pages: [] as any[], error: null as string | null },
      affinity_only: { success: false, count: 0, pages: [] as any[], error: null as string | null },
      recent_pages: { success: false, count: 0, pages: [] as any[], error: null as string | null }
    },
    overall_status: 'failed' as 'passed' | 'failed' | 'partial'
  };

  try {
    // Check configuration
    const host = process.env.CONFLUENCE_BASE_URL || process.env.CONFLUENCE_HOST || process.env.JIRA_BASE_URL;
    const email = process.env.CONFLUENCE_EMAIL || process.env.JIRA_USER_EMAIL;
    const token = process.env.CONFLUENCE_API_TOKEN || process.env.JIRA_API_TOKEN;

    testResults.configuration = {
      host_configured: !!host,
      email_configured: !!email,
      token_configured: !!token
    };

    if (!host || !email || !token) {
      testResults.authentication.error = 'Missing Confluence configuration (host, email, or token)';
      return NextResponse.json(testResults, { status: 500 });
    }

    // Initialize Confluence client
    let confluenceClient;
    try {
      confluenceClient = getConfluenceClient();
    } catch (error) {
      testResults.authentication.error = `Failed to initialize Confluence client: ${error instanceof Error ? error.message : 'Unknown error'}`;
      return NextResponse.json(testResults, { status: 500 });
    }

    // Test 1: Authentication
    try {
      const user = await confluenceClient.getCurrentUser();
      testResults.authentication = {
        success: true,
        error: null,
        user: {
          displayName: user.displayName || user.username,
          email: user.email,
          userKey: user.userKey || user.accountId
        }
      };
    } catch (error) {
      testResults.authentication.error = `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      return NextResponse.json(testResults, { status: 200 });
    }

    // Test 2: Get spaces
    try {
      const spaces = await confluenceClient.getSpaces(20);
      testResults.spaces = {
        success: true,
        count: spaces.length,
        spaces: spaces.map(space => ({
          key: space.key,
          name: space.name,
          type: space.type
        })),
        error: null
      };
    } catch (error) {
      testResults.spaces.error = `Failed to get spaces: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Test 3: Search for "Affinity Solutions"
    try {
      const affinitySolutionsResults = await confluenceClient.searchContent('text ~ "Affinity Solutions" AND type = page', 10);
      
      testResults.search_results.affinity_solutions = {
        success: true,
        count: affinitySolutionsResults.length,
        pages: affinitySolutionsResults.map(page => ({
          id: page.id,
          title: page.title,
          space: {
            key: page.space.key,
            name: page.space.name
          },
          url: `${page._links.base}${page._links.webui}`,
          lastModified: page.version.when,
          contentPreview: page.body?.storage?.value ? 
            page.body.storage.value.replace(/<[^>]*>/g, '').substring(0, 200) : 
            'No content preview available'
        })),
        error: null
      };
    } catch (error) {
      testResults.search_results.affinity_solutions.error = `Affinity Solutions search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Test 4: Broader search for "Affinity" if specific search didn't find much
    if (testResults.search_results.affinity_solutions.count === 0) {
      try {
        const affinityResults = await confluenceClient.searchContent('text ~ "Affinity" AND type = page', 10);
        
        testResults.search_results.affinity_only = {
          success: true,
          count: affinityResults.length,
          pages: affinityResults.map(page => ({
            id: page.id,
            title: page.title,
            space: {
              key: page.space.key,
              name: page.space.name
            },
            url: `${page._links.base}${page._links.webui}`,
            lastModified: page.version.when,
            affinityMentions: (page.body?.storage?.value?.match(/affinity/gi) || []).length,
            contentPreview: page.body?.storage?.value ? 
              page.body.storage.value.replace(/<[^>]*>/g, '').substring(0, 200) : 
              'No content preview available'
          })),
          error: null
        };
      } catch (error) {
        testResults.search_results.affinity_only.error = `Affinity search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    // Test 5: Get recent pages to verify general access
    try {
      const recentPages = await confluenceClient.getRecentlyUpdated(undefined, 5);
      
      testResults.search_results.recent_pages = {
        success: true,
        count: recentPages.length,
        pages: recentPages.map(page => ({
          id: page.id,
          title: page.title,
          space: {
            key: page.space.key,
            name: page.space.name
          },
          lastModified: page.version.when
        })),
        error: null
      };
    } catch (error) {
      testResults.search_results.recent_pages.error = `Recent pages query failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Determine overall status
    const hasAffinityResults = testResults.search_results.affinity_solutions.count > 0 || 
                              testResults.search_results.affinity_only.count > 0;
    
    if (testResults.authentication.success && testResults.spaces.success) {
      if (hasAffinityResults) {
        testResults.overall_status = 'passed';
      } else if (testResults.search_results.recent_pages.success) {
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

// GET with search parameter support
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const searchTerm = body.searchTerm || 'Affinity Solutions';
    
    const confluenceClient = getConfluenceClient();
    
    // Custom search
    const results = await confluenceClient.searchContent(`text ~ "${searchTerm}" AND type = page`, 20);
    
    return NextResponse.json({
      success: true,
      searchTerm,
      results: results.map(page => ({
        id: page.id,
        title: page.title,
        space: page.space,
        url: `${page._links.base}${page._links.webui}`,
        lastModified: page.version.when,
        contentPreview: page.body?.storage?.value ? 
          page.body.storage.value.replace(/<[^>]*>/g, '').substring(0, 300) : 
          'No content available'
      })),
      total: results.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}