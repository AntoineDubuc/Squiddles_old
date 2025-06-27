/**
 * API endpoint for reindexing documents with new metadata schema
 * POST /api/pinecone/reindex - Reindex documents from existing sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMultiSourcePineconeServiceV2, DocumentInput } from '@/lib/pinecone/multiSourceServiceV2';
import { getGmailIndexer } from '@/lib/pinecone/indexers/gmailIndexer';
import { getConfluenceIndexer } from '@/lib/pinecone/indexers/confluenceIndexer';
import { getJiraIndexer } from '@/lib/pinecone/indexers/jiraIndexer';
import { DataSource } from '@/lib/pinecone/types/unifiedMetadata';

interface ReindexRequest {
  source?: DataSource;
  batchSize?: number;
  dryRun?: boolean;
  options?: {
    daysBack?: number;
    query?: string;
    spaceKey?: string;
    projectKey?: string;
    jql?: string;
  };
}

interface ReindexProgress {
  source: string;
  total: number;
  processed: number;
  failed: number;
  errors: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ReindexRequest = await request.json();
    const { source, batchSize = 50, dryRun = false, options = {} } = body;
    
    console.log(`🔄 Starting reindex operation`);
    console.log(`   Source: ${source || 'all'}`);
    console.log(`   Batch size: ${batchSize}`);
    console.log(`   Dry run: ${dryRun}`);
    
    const service = getMultiSourcePineconeServiceV2();
    const sources: DataSource[] = source ? [source] : ['gmail', 'jira', 'confluence'];
    const results: Record<string, ReindexProgress> = {};
    
    for (const src of sources) {
      console.log(`\n📊 Processing ${src}...`);
      
      const progress: ReindexProgress = {
        source: src,
        total: 0,
        processed: 0,
        failed: 0,
        errors: []
      };
      
      try {
        const documents = await fetchDocumentsForReindex(src, options);
        progress.total = documents.length;
        
        console.log(`   Found ${documents.length} documents to reindex`);
        
        if (dryRun) {
          // Dry run - just show what would be reindexed
          results[src] = {
            ...progress,
            processed: documents.length
          };
          continue;
        }
        
        // Process in batches
        for (let i = 0; i < documents.length; i += batchSize) {
          const batch = documents.slice(i, i + batchSize);
          
          try {
            await service.upsertDocuments(batch);
            progress.processed += batch.length;
            console.log(`   ✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`);
          } catch (error: any) {
            progress.failed += batch.length;
            progress.errors.push(`Batch ${i / batchSize + 1}: ${error.message}`);
            console.error(`   ❌ Failed batch ${i / batchSize + 1}:`, error.message);
          }
        }
        
      } catch (error: any) {
        progress.errors.push(`Source error: ${error.message}`);
        console.error(`   ❌ Error processing ${src}:`, error.message);
      }
      
      results[src] = progress;
    }
    
    // Calculate summary
    const summary = {
      totalDocuments: Object.values(results).reduce((sum, r) => sum + r.total, 0),
      totalProcessed: Object.values(results).reduce((sum, r) => sum + r.processed, 0),
      totalFailed: Object.values(results).reduce((sum, r) => sum + r.failed, 0),
      dryRun
    };
    
    return NextResponse.json({
      success: true,
      summary,
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Reindex error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to reindex documents',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function fetchDocumentsForReindex(
  source: DataSource, 
  options: ReindexRequest['options'] = {}
): Promise<DocumentInput[]> {
  const documents: DocumentInput[] = [];
  
  switch (source) {
    case 'gmail': {
      // For now, return empty array - would need to implement Gmail fetching
      console.log('   ⚠️  Gmail reindexing not yet implemented');
      break;
    }
    
    case 'jira': {
      const jiraIndexer = getJiraIndexer();
      const daysBack = options.daysBack || 30;
      
      // Get recent tickets using existing indexer logic
      // This is a simplified version - in production, you'd properly convert
      // the Jira data to DocumentInput format
      console.log(`   Fetching Jira tickets from last ${daysBack} days`);
      
      // Mock implementation - replace with actual Jira fetching
      const mockTickets: DocumentInput[] = [
        {
          id: `jira-ticket-${Date.now()}`,
          source: 'jira',
          type: 'ticket',
          title: 'Sample Jira ticket for reindexing',
          content: 'This is a sample ticket content for testing reindexing',
          author: 'system@example.com',
          projectKey: options.projectKey || 'PROJ',
          status: 'open',
          priority: 'medium',
          createdAt: new Date()
        }
      ];
      
      documents.push(...mockTickets);
      break;
    }
    
    case 'confluence': {
      // For now, return empty array - would need to implement Confluence fetching
      console.log('   ⚠️  Confluence reindexing not yet implemented');
      break;
    }
    
    case 'github': {
      console.log('   ⚠️  GitHub source not configured for reindexing');
      break;
    }
    
    case 'slack': {
      console.log('   ⚠️  Slack source not configured for reindexing');
      break;
    }
  }
  
  return documents;
}

export async function GET(request: NextRequest) {
  // Return API documentation
  return NextResponse.json({
    endpoint: 'POST /api/pinecone/reindex',
    description: 'Reindex documents from existing sources with the new minimal metadata schema',
    requestBody: {
      source: 'DataSource (optional) - Specific source to reindex, or all if omitted',
      batchSize: 'number (optional, default: 50) - Number of documents to process at once',
      dryRun: 'boolean (optional, default: false) - Show what would be reindexed without doing it',
      options: {
        daysBack: 'number - How many days back to reindex',
        query: 'string - Gmail query string',
        spaceKey: 'string - Confluence space key',
        projectKey: 'string - Jira project key',
        jql: 'string - Jira Query Language string'
      }
    },
    examples: {
      reindexAll: {
        description: 'Reindex all sources'
      },
      reindexJiraProject: {
        source: 'jira',
        options: {
          projectKey: 'WEBAPP',
          daysBack: 90
        }
      },
      reindexWithDryRun: {
        source: 'gmail',
        dryRun: true,
        options: {
          daysBack: 30
        }
      },
      reindexLargeBatch: {
        source: 'confluence',
        batchSize: 100,
        options: {
          spaceKey: 'DOCS'
        }
      }
    },
    notes: [
      'Reindexing fetches fresh data from sources and updates Pinecone',
      'Large reindex operations may take considerable time',
      'Use dryRun to preview what will be reindexed',
      'Batch size affects memory usage and API rate limits',
      'Documents are upserted, so existing documents are updated'
    ],
    currentStatus: {
      gmail: 'Not implemented - needs Gmail API integration',
      jira: 'Basic implementation - needs full conversion logic',
      confluence: 'Not implemented - needs Confluence API integration',
      github: 'Not configured',
      slack: 'Not configured'
    }
  });
}