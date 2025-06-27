/**
 * API endpoints for Pinecone cross-reference search
 * POST /api/pinecone/search - Search across all indexed documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCrossReferenceSearchService, CrossReferenceQuery } from '@/lib/pinecone/searchService';
import { DocumentType, SearchFilters } from '@/lib/pinecone/multiSourceService';

interface SearchRequest {
  query: string;
  context?: {
    ticketKey?: string;
    emailId?: string;
    pageId?: string;
    userAccountId?: string;
  };
  filters?: {
    types?: DocumentType[];
    dateRange?: {
      start: string; // ISO date string
      end: string;   // ISO date string
    };
    authors?: string[];
    projects?: string[];
    spaces?: string[];
    priority?: string[];
    mentions?: string[];
  };
  includeRelated?: boolean;
  maxResults?: number;
}

interface SpecialSearchRequest {
  type: 'email_threads' | 'pages_for_ticket' | 'user_mentions' | 'urgent_items' | 'project_documents' | 'semantic';
  params: {
    ticketKey?: string;
    userAccountId?: string;
    projectKey?: string;
    concept?: string;
    daysBack?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const searchService = getCrossReferenceSearchService();

    // Check if this is a special search request
    if (body.type) {
      return await handleSpecialSearch(body as SpecialSearchRequest, searchService);
    }

    // Handle regular cross-reference search
    const searchRequest: SearchRequest = body;
    const { query, context, filters, includeRelated = true, maxResults = 20 } = searchRequest;

    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Search request: "${query}"`);
    console.log(`📄 Context:`, context);
    console.log(`🔧 Filters:`, filters);

    // Convert filters to internal format
    const internalFilters: SearchFilters = {};
    
    if (filters?.types) internalFilters.types = filters.types;
    if (filters?.authors) internalFilters.authors = filters.authors;
    if (filters?.projects) internalFilters.projects = filters.projects;
    if (filters?.spaces) internalFilters.spaces = filters.spaces;
    if (filters?.priority) internalFilters.priority = filters.priority;
    if (filters?.mentions) internalFilters.mentions = filters.mentions;
    
    if (filters?.dateRange) {
      internalFilters.dateRange = {
        start: new Date(filters.dateRange.start),
        end: new Date(filters.dateRange.end)
      };
    }

    // Perform cross-reference search
    const crossRefQuery: CrossReferenceQuery = {
      query,
      context,
      filters: internalFilters,
      includeRelated,
      maxResults
    };

    const searchResult = await searchService.search(crossRefQuery);

    return NextResponse.json({
      success: true,
      query,
      context,
      results: searchResult.results,
      summary: searchResult.summary,
      suggestions: searchResult.suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Search error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to search documents',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function handleSpecialSearch(request: SpecialSearchRequest, searchService: any) {
  const { type, params } = request;

  try {
    let result: any;

    switch (type) {
      case 'email_threads':
        if (!params.ticketKey) {
          return NextResponse.json(
            { error: 'ticketKey is required for email_threads search' },
            { status: 400 }
          );
        }
        result = await searchService.findEmailThreadsForTicket(params.ticketKey);
        break;

      case 'pages_for_ticket':
        if (!params.ticketKey) {
          return NextResponse.json(
            { error: 'ticketKey is required for pages_for_ticket search' },
            { status: 400 }
          );
        }
        result = await searchService.findPagesForTicket(params.ticketKey);
        break;

      case 'user_mentions':
        if (!params.userAccountId) {
          return NextResponse.json(
            { error: 'userAccountId is required for user_mentions search' },
            { status: 400 }
          );
        }
        result = await searchService.findUserMentions(
          params.userAccountId, 
          params.daysBack || 30
        );
        break;

      case 'urgent_items':
        result = await searchService.findUrgentItems(params.userAccountId);
        break;

      case 'project_documents':
        if (!params.projectKey) {
          return NextResponse.json(
            { error: 'projectKey is required for project_documents search' },
            { status: 400 }
          );
        }
        result = await searchService.findProjectDocuments(params.projectKey);
        break;

      case 'semantic':
        if (!params.concept) {
          return NextResponse.json(
            { error: 'concept is required for semantic search' },
            { status: 400 }
          );
        }
        result = await searchService.semanticSearch(params.concept);
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported search type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      params,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error(`❌ Special search error (${type}):`, error);
    
    return NextResponse.json(
      { 
        error: `Failed to perform ${type} search`,
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (!type) {
      // Return API documentation
      return NextResponse.json({
        endpoints: {
          search: {
            method: 'POST',
            path: '/api/pinecone/search',
            description: 'Cross-reference search across all document types',
            body: {
              query: 'string (required)',
              context: 'object (optional)',
              filters: 'object (optional)',
              includeRelated: 'boolean (default: true)',
              maxResults: 'number (default: 20)'
            }
          },
          specialSearch: {
            method: 'POST',
            path: '/api/pinecone/search',
            description: 'Specialized search operations',
            types: [
              'email_threads',
              'pages_for_ticket', 
              'user_mentions',
              'urgent_items',
              'project_documents',
              'semantic'
            ]
          }
        },
        examples: {
          basicSearch: {
            query: 'authentication issues',
            filters: { types: ['email', 'jira_ticket'] },
            maxResults: 10
          },
          contextualSearch: {
            query: 'deployment process',
            context: { ticketKey: 'PROD-123' },
            includeRelated: true
          },
          specialSearch: {
            type: 'email_threads',
            params: { ticketKey: 'PROD-123' }
          }
        },
        timestamp: new Date().toISOString()
      });
    }

    // Handle specific search type documentation
    const searchService = getCrossReferenceSearchService();
    
    switch (type) {
      case 'health':
        // Return search service health
        return NextResponse.json({
          healthy: true,
          service: 'CrossReferenceSearchService',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown search type: ${type}` },
          { status: 400 }
        );
    }

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to get search service info',
        details: error.message 
      },
      { status: 500 }
    );
  }
}