/**
 * Confluence Pages API Route - Server-side page operations
 * Handles page creation, updates, and search securely with server-side authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConfluenceClient } from '../../../../lib/confluence/confluenceClient';
import type { CreatePageInput, UpdatePageInput } from '../../../../lib/confluence/confluenceClient';

interface CreatePageRequestBody {
  title: string;
  content: string;
  spaceKey: string;
  parentId?: string;
  type?: 'page' | 'blogpost';
}

interface UpdatePageRequestBody {
  pageId: string;
  title: string;
  content: string;
  versionNumber: number;
  type?: 'page' | 'blogpost';
}

interface SearchPagesRequestBody {
  query: string;
  spaceKey?: string;
  limit?: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Confluence Pages API called');
    
    // Parse request body
    const body: CreatePageRequestBody = await request.json();
    const { title, content, spaceKey, parentId, type = 'page' } = body;

    // Validate required fields
    if (!title || !content || !spaceKey) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, and spaceKey are required' },
        { status: 400 }
      );
    }

    console.log('📄 Creating page:', {
      title,
      spaceKey,
      contentLength: content.length,
      type,
      hasParent: !!parentId
    });

    // Get Confluence client
    const confluenceClient = getConfluenceClient();
    
    // Create page input
    const pageInput: CreatePageInput = {
      type,
      title,
      spaceKey,
      body: {
        storage: {
          value: confluenceClient.createStorageFormat(content),
          representation: 'storage'
        }
      },
      ...(parentId && { parentId })
    };

    // Create the page
    const result = await confluenceClient.createPage(pageInput);
    
    console.log('✅ Page created successfully:', {
      pageId: result.id,
      title: result.title,
      spaceKey: result.space.key
    });

    // Return success response
    return NextResponse.json({
      success: true,
      page: {
        id: result.id,
        title: result.title,
        spaceKey: result.space.key,
        url: `${process.env.CONFLUENCE_HOST || process.env.CONFLUENCE_BASE_URL}/browse/${result.id}`,
        version: result.version.number
      }
    });

  } catch (error) {
    console.error('❌ Failed to create page:', error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your Confluence credentials.' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Space not found. Please check the space key.' },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Missing Confluence configuration')) {
        return NextResponse.json(
          { error: 'Confluence configuration missing. Please check environment variables.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create page. Please try again.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 Confluence Pages API - Update called');
    
    // Parse request body
    const body: UpdatePageRequestBody = await request.json();
    const { pageId, title, content, versionNumber, type = 'page' } = body;

    // Validate required fields
    if (!pageId || !title || !content || !versionNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: pageId, title, content, and versionNumber are required' },
        { status: 400 }
      );
    }

    console.log('📝 Updating page:', {
      pageId,
      title,
      contentLength: content.length,
      versionNumber
    });

    // Get Confluence client
    const confluenceClient = getConfluenceClient();
    
    // Create update input
    const updateInput: UpdatePageInput = {
      id: pageId,
      type,
      title,
      body: {
        storage: {
          value: confluenceClient.createStorageFormat(content),
          representation: 'storage'
        }
      },
      version: {
        number: versionNumber
      }
    };

    // Update the page
    const result = await confluenceClient.updatePage(updateInput);
    
    console.log('✅ Page updated successfully:', {
      pageId: result.id,
      title: result.title,
      newVersion: result.version.number
    });

    // Return success response
    return NextResponse.json({
      success: true,
      page: {
        id: result.id,
        title: result.title,
        url: `${process.env.CONFLUENCE_HOST || process.env.CONFLUENCE_BASE_URL}/browse/${result.id}`,
        version: result.version.number
      }
    });

  } catch (error) {
    console.error('❌ Failed to update page:', error);
    
    return NextResponse.json(
      { error: 'Failed to update page. Please try again.' },
      { status: 500 }
    );
  }
}

// Search pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const spaceKey = searchParams.get('spaceKey');
    const limit = parseInt(searchParams.get('limit') || '25');

    // If no query, get recent pages
    const confluenceClient = getConfluenceClient();
    
    let results;
    if (query) {
      console.log('🔍 Searching pages:', { query, spaceKey, limit });
      results = await confluenceClient.searchPagesByTitle(query, spaceKey || undefined);
    } else {
      console.log('📋 Getting recent pages:', { spaceKey, limit });
      results = await confluenceClient.getRecentlyUpdated(spaceKey || undefined, limit);
    }

    // Helper function to extract and truncate page content for preview
    const extractExcerpt = (page: any): string => {
      try {
        // Try to get content from different possible fields
        let content = '';
        
        if (page.body?.storage?.value) {
          content = page.body.storage.value;
        } else if (page.body?.view?.value) {
          content = page.body.view.value;
        } else if (page.excerpt) {
          content = page.excerpt;
        }
        
        if (!content) return 'No content preview available';
        
        // Strip HTML tags and clean up content
        const textContent = content
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&[^;]+;/g, ' ') // Remove HTML entities
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        // Truncate at word boundary for clean display
        if (textContent.length > 200) {
          const truncated = textContent.substring(0, 200);
          const lastSpace = truncated.lastIndexOf(' ');
          return (lastSpace > 150 ? truncated.substring(0, lastSpace) : truncated) + '...';
        }
        
        return textContent || 'No content preview available';
      } catch (e) {
        console.warn('Failed to extract page excerpt:', e);
        return 'Content preview unavailable';
      }
    };

    return NextResponse.json({
      success: true,
      pages: results.map(page => ({
        id: page.id,
        title: page.title,
        excerpt: extractExcerpt(page),
        spaceKey: page.space.key,
        spaceName: page.space.name,
        url: `${process.env.CONFLUENCE_HOST || process.env.CONFLUENCE_BASE_URL}/browse/${page.id}`,
        lastModified: page.version.when,
        createdDate: page.history?.createdDate || page.version.when,
        author: page.history?.createdBy ? {
          displayName: page.history.createdBy.displayName,
          userKey: page.history.createdBy.userKey,
          avatarUrl: page.history.createdBy.profilePicture?.path
        } : page.version.by ? {
          displayName: page.version.by.displayName,
          userKey: page.version.by.userKey,
          avatarUrl: page.version.by.profilePicture?.path
        } : null,
        lastUpdatedBy: page.version.by ? {
          displayName: page.version.by.displayName,
          userKey: page.version.by.userKey,
          avatarUrl: page.version.by.profilePicture?.path
        } : null
      }))
    });

  } catch (error) {
    console.error('❌ Failed to search pages:', error);
    
    return NextResponse.json(
      { error: 'Failed to search pages. Please try again.' },
      { status: 500 }
    );
  }
}