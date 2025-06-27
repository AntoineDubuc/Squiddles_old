/**
 * API endpoints for Pinecone indexing operations
 * POST /api/pinecone/index - Index documents from various sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGmailIndexer } from '@/lib/pinecone/indexers/gmailIndexer';
import { getConfluenceIndexer } from '@/lib/pinecone/indexers/confluenceIndexer';
import { getJiraIndexer } from '@/lib/pinecone/indexers/jiraIndexer';
import { getMultiSourcePineconeService } from '@/lib/pinecone/multiSourceService';

interface IndexRequest {
  source: 'gmail' | 'confluence' | 'jira';
  options?: {
    // Gmail options
    daysBack?: number;
    query?: string;
    messageId?: string;
    
    // Confluence options
    spaceKey?: string;
    pageId?: string;
    cql?: string;
    
    // Jira options
    ticketKey?: string;
    jql?: string;
    userAccountId?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: IndexRequest = await request.json();
    const { source, options = {} } = body;

    console.log(`🔄 Starting indexing for source: ${source}`);
    console.log(`📋 Options:`, options);

    let result: any = {};

    switch (source) {
      case 'gmail':
        result = await indexGmail(options);
        break;
        
      case 'confluence':
        result = await indexConfluence(options);
        break;
        
      case 'jira':
        result = await indexJira(options);
        break;
        
      default:
        return NextResponse.json(
          { error: `Unsupported source: ${source}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      source,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Indexing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to index documents',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function indexGmail(options: IndexRequest['options'] = {}): Promise<any> {
  const gmailIndexer = getGmailIndexer();
  
  if (options.messageId) {
    // Index specific email
    await gmailIndexer.indexEmailById(options.messageId);
    return { action: 'index_single_email', messageId: options.messageId };
    
  } else if (options.query) {
    // Index emails matching query
    await gmailIndexer.indexEmailsByQuery(options.query);
    return { action: 'index_by_query', query: options.query };
    
  } else {
    // Index recent emails
    const daysBack = options.daysBack || 30;
    await gmailIndexer.indexRecentEmails(daysBack);
    return { action: 'index_recent', daysBack };
  }
}

async function indexConfluence(options: IndexRequest['options'] = {}): Promise<any> {
  const confluenceIndexer = getConfluenceIndexer();
  
  if (options.pageId) {
    // Index specific page
    await confluenceIndexer.indexPageById(options.pageId);
    return { action: 'index_single_page', pageId: options.pageId };
    
  } else if (options.cql) {
    // Index pages matching CQL
    await confluenceIndexer.indexPagesByCQL(options.cql);
    return { action: 'index_by_cql', cql: options.cql };
    
  } else if (options.spaceKey) {
    // Index entire space
    await confluenceIndexer.indexSpace(options.spaceKey);
    return { action: 'index_space', spaceKey: options.spaceKey };
    
  } else {
    // Index recent pages
    const daysBack = options.daysBack || 30;
    await confluenceIndexer.indexRecentPages(daysBack);
    return { action: 'index_recent', daysBack };
  }
}

async function indexJira(options: IndexRequest['options'] = {}): Promise<any> {
  const jiraIndexer = getJiraIndexer();
  
  if (options.ticketKey) {
    // Index specific ticket
    await jiraIndexer.indexTicketByKey(options.ticketKey);
    return { action: 'index_single_ticket', ticketKey: options.ticketKey };
    
  } else if (options.jql) {
    // Index tickets matching JQL
    await jiraIndexer.indexTicketsByJQL(options.jql);
    return { action: 'index_by_jql', jql: options.jql };
    
  } else if (options.userAccountId) {
    // Index tickets with user mentions
    const daysBack = options.daysBack || 90;
    await jiraIndexer.indexTicketsWithMentions(options.userAccountId, daysBack);
    return { action: 'index_user_mentions', userAccountId: options.userAccountId, daysBack };
    
  } else {
    // Index recent tickets
    const daysBack = options.daysBack || 30;
    await jiraIndexer.indexRecentTickets(daysBack);
    return { action: 'index_recent', daysBack };
  }
}

export async function GET(request: NextRequest) {
  try {
    const pineconeService = getMultiSourcePineconeService();
    const health = await pineconeService.getHealth();
    
    return NextResponse.json({
      ...health,
      endpoints: {
        index: 'POST /api/pinecone/index',
        search: 'POST /api/pinecone/search',
        health: 'GET /api/pinecone/index'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to get Pinecone status',
        details: error.message 
      },
      { status: 500 }
    );
  }
}