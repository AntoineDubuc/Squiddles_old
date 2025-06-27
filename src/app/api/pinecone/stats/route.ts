/**
 * API endpoint for Pinecone indexing statistics
 * GET /api/pinecone/stats - Get comprehensive stats across all data sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGmailIndexer } from '@/lib/pinecone/indexers/gmailIndexer';
import { getConfluenceIndexer } from '@/lib/pinecone/indexers/confluenceIndexer';
import { getJiraIndexer } from '@/lib/pinecone/indexers/jiraIndexer';
import { getMultiSourcePineconeService } from '@/lib/pinecone/multiSourceService';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Gathering Pinecone statistics...');

    const [
      pineconeHealth,
      gmailStats,
      confluenceStats,
      jiraStats
    ] = await Promise.allSettled([
      getMultiSourcePineconeService().getHealth(),
      getGmailIndexingStats(),
      getConfluenceIndexingStats(),
      getJiraIndexingStats()
    ]);

    const stats = {
      pinecone: {
        status: pineconeHealth.status === 'fulfilled' ? 'healthy' : 'error',
        details: pineconeHealth.status === 'fulfilled' ? pineconeHealth.value : {
          error: pineconeHealth.status === 'rejected' ? pineconeHealth.reason?.message : 'Unknown error'
        }
      },
      gmail: {
        status: gmailStats.status === 'fulfilled' ? 'connected' : 'error',
        stats: gmailStats.status === 'fulfilled' ? gmailStats.value : null,
        error: gmailStats.status === 'rejected' ? gmailStats.reason?.message : undefined
      },
      confluence: {
        status: confluenceStats.status === 'fulfilled' ? 'connected' : 'error',
        stats: confluenceStats.status === 'fulfilled' ? confluenceStats.value : null,
        error: confluenceStats.status === 'rejected' ? confluenceStats.reason?.message : undefined
      },
      jira: {
        status: jiraStats.status === 'fulfilled' ? 'connected' : 'error',
        stats: jiraStats.status === 'fulfilled' ? jiraStats.value : null,
        error: jiraStats.status === 'rejected' ? jiraStats.reason?.message : undefined
      },
      summary: generateSummary(gmailStats, confluenceStats, jiraStats),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('❌ Error gathering statistics:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to gather statistics',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function getGmailIndexingStats() {
  try {
    const gmailIndexer = getGmailIndexer();
    const stats = await gmailIndexer.getIndexingStats();
    
    return {
      totalEmails: stats.totalEmails,
      recentEmails: stats.recentEmails,
      indexable: stats.recentEmails, // Estimate indexable emails
      connection: 'authenticated',
      lastChecked: new Date().toISOString()
    };
  } catch (error: any) {
    throw new Error(`Gmail connection failed: ${error.message}`);
  }
}

async function getConfluenceIndexingStats() {
  try {
    const confluenceIndexer = getConfluenceIndexer();
    
    // Test connection first
    const connectionTest = await confluenceIndexer.testConnection();
    if (!connectionTest.success) {
      throw new Error(connectionTest.error || 'Confluence connection failed');
    }

    // Get spaces and stats
    const [spaces, stats] = await Promise.all([
      confluenceIndexer.getSpaces(),
      confluenceIndexer.getIndexingStats()
    ]);
    
    return {
      totalPages: stats.totalPages,
      recentPages: stats.recentPages,
      spaces: spaces.map(space => ({
        key: space.key,
        name: space.name,
        pageCount: space.pageCount
      })),
      connection: 'authenticated',
      lastChecked: new Date().toISOString()
    };
  } catch (error: any) {
    throw new Error(`Confluence connection failed: ${error.message}`);
  }
}

async function getJiraIndexingStats() {
  try {
    const jiraIndexer = getJiraIndexer();
    
    // Test connection first
    const connectionTest = await jiraIndexer.testConnection();
    if (!connectionTest.success) {
      throw new Error(connectionTest.error || 'Jira connection failed');
    }

    const stats = await jiraIndexer.getIndexingStats();
    
    return {
      totalTickets: stats.totalTickets,
      recentTickets: stats.recentTickets,
      totalComments: stats.totalComments,
      indexable: stats.recentTickets + Math.floor(stats.totalComments * 0.3), // Estimate indexable items
      connection: 'authenticated',
      lastChecked: new Date().toISOString()
    };
  } catch (error: any) {
    throw new Error(`Jira connection failed: ${error.message}`);
  }
}

function generateSummary(gmailStats: any, confluenceStats: any, jiraStats: any) {
  const summary = {
    totalIndexableItems: 0,
    recentItems: 0,
    connectedServices: 0,
    recommendations: [] as string[]
  };

  // Count connected services and indexable items
  if (gmailStats.status === 'fulfilled') {
    summary.connectedServices++;
    summary.totalIndexableItems += gmailStats.value.indexable || 0;
    summary.recentItems += gmailStats.value.recentEmails || 0;
  } else {
    summary.recommendations.push('Fix Gmail connection to index emails');
  }

  if (confluenceStats.status === 'fulfilled') {
    summary.connectedServices++;
    summary.totalIndexableItems += confluenceStats.value.totalPages || 0;
    summary.recentItems += confluenceStats.value.recentPages || 0;
  } else {
    summary.recommendations.push('Fix Confluence connection to index pages');
  }

  if (jiraStats.status === 'fulfilled') {
    summary.connectedServices++;
    summary.totalIndexableItems += jiraStats.value.indexable || 0;
    summary.recentItems += jiraStats.value.recentTickets || 0;
  } else {
    summary.recommendations.push('Fix Jira connection to index tickets');
  }

  // Generate recommendations based on data
  if (summary.recentItems > 100) {
    summary.recommendations.push('Consider indexing recent items first (last 30 days)');
  }

  if (summary.totalIndexableItems > 1000) {
    summary.recommendations.push('Large dataset detected - plan batch indexing strategy');
  }

  if (summary.connectedServices === 3 && summary.recommendations.length === 0) {
    summary.recommendations.push('All services connected! Ready to start indexing');
  }

  return summary;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'test_connections') {
      console.log('🔌 Testing all service connections...');

      const [gmailTest, confluenceTest, jiraTest] = await Promise.allSettled([
        testGmailConnection(),
        testConfluenceConnection(),
        testJiraConnection()
      ]);

      return NextResponse.json({
        gmail: gmailTest.status === 'fulfilled' ? gmailTest.value : { success: false, error: gmailTest.reason?.message },
        confluence: confluenceTest.status === 'fulfilled' ? confluenceTest.value : { success: false, error: confluenceTest.reason?.message },
        jira: jiraTest.status === 'fulfilled' ? jiraTest.value : { success: false, error: jiraTest.reason?.message },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

async function testGmailConnection() {
  const gmailIndexer = getGmailIndexer();
  const stats = await gmailIndexer.getIndexingStats();
  return { success: true, stats };
}

async function testConfluenceConnection() {
  const confluenceIndexer = getConfluenceIndexer();
  return await confluenceIndexer.testConnection();
}

async function testJiraConnection() {
  const jiraIndexer = getJiraIndexer();
  return await jiraIndexer.testConnection();
}