/**
 * API endpoint for bulk deleting documents from Pinecone
 * POST /api/pinecone/bulk-delete - Delete multiple documents by IDs or filter
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMultiSourcePineconeServiceV2 } from '@/lib/pinecone/multiSourceServiceV2';
import { SimpleSearchFilters } from '@/lib/pinecone/types/unifiedMetadata';

interface BulkDeleteRequest {
  ids?: string[];
  filter?: SimpleSearchFilters;
  dryRun?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkDeleteRequest = await request.json();
    
    // Validate request
    if (!body.ids && !body.filter) {
      return NextResponse.json(
        { error: 'Either ids or filter must be provided' },
        { status: 400 }
      );
    }
    
    if (body.ids && body.filter) {
      return NextResponse.json(
        { error: 'Cannot provide both ids and filter. Choose one method.' },
        { status: 400 }
      );
    }
    
    if (body.ids && body.ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array cannot be empty' },
        { status: 400 }
      );
    }
    
    const service = getMultiSourcePineconeServiceV2();
    
    // Dry run - show what would be deleted
    if (body.dryRun) {
      console.log(`🔍 Dry run - checking what would be deleted`);
      
      if (body.ids) {
        // Check which IDs exist
        const existingDocs = await Promise.all(
          body.ids.map(async (id) => {
            const doc = await service.getDocument(id);
            return doc ? { id, exists: true, metadata: doc.metadata } : { id, exists: false };
          })
        );
        
        const toDelete = existingDocs.filter(d => d.exists);
        
        return NextResponse.json({
          dryRun: true,
          method: 'ids',
          totalToDelete: toDelete.length,
          documentsToDelete: toDelete,
          notFound: existingDocs.filter(d => !d.exists).map(d => d.id),
          timestamp: new Date().toISOString()
        });
      } else if (body.filter) {
        // Search for documents matching filter
        const results = await service.search('*', body.filter, 100);
        
        return NextResponse.json({
          dryRun: true,
          method: 'filter',
          filter: body.filter,
          totalToDelete: results.length,
          sampleDocuments: results.slice(0, 10).map(r => ({
            id: r.id,
            source: r.metadata.source,
            type: r.metadata.type,
            title: r.metadata.title
          })),
          note: 'Showing first 10 documents that would be deleted',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Perform actual deletion
    console.log(`🗑️ Starting bulk delete operation`);
    
    if (body.ids) {
      console.log(`   Deleting ${body.ids.length} documents by ID`);
    } else if (body.filter) {
      console.log(`   Deleting documents matching filter:`, body.filter);
    }
    
    const deletedCount = await service.bulkDelete({
      ids: body.ids,
      filter: body.filter
    });
    
    return NextResponse.json({
      success: true,
      method: body.ids ? 'ids' : 'filter',
      deletedCount: body.ids ? body.ids.length : 'unknown (filter-based deletion)',
      filter: body.filter,
      ids: body.ids,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Bulk delete error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to bulk delete documents',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return API documentation
  return NextResponse.json({
    endpoint: 'POST /api/pinecone/bulk-delete',
    description: 'Bulk delete documents from Pinecone by IDs or filter criteria',
    requestBody: {
      ids: 'string[] (optional) - Array of document IDs to delete',
      filter: 'SimpleSearchFilters (optional) - Filter criteria for documents to delete',
      dryRun: 'boolean (optional) - If true, shows what would be deleted without actually deleting',
      note: 'Provide either ids OR filter, not both'
    },
    filterOptions: {
      sources: 'DataSource[] - Filter by source systems',
      types: 'string[] - Filter by document types',
      createdAfter: 'number - Unix timestamp',
      projectKeys: 'string[] - Filter by project keys',
      hasTickets: 'string[] - Documents mentioning these tickets',
      hasMentions: 'string[] - Documents mentioning these users/items',
      statuses: 'string[] - Filter by status values',
      priorities: 'string[] - Filter by priority values',
      authors: 'string[] - Filter by author names/emails'
    },
    examples: {
      deleteByIds: {
        ids: ['doc-123', 'doc-456', 'doc-789']
      },
      deleteOldEmails: {
        filter: {
          sources: ['gmail'],
          createdAfter: Date.now() - 90 * 24 * 60 * 60 * 1000 // 90 days ago
        }
      },
      deleteProjectDocuments: {
        filter: {
          projectKeys: ['OLD-PROJ'],
          sources: ['jira', 'confluence']
        }
      },
      deleteWithDryRun: {
        filter: {
          sources: ['slack'],
          types: ['message'],
          createdAfter: Date.now() - 30 * 24 * 60 * 60 * 1000
        },
        dryRun: true
      }
    },
    warnings: [
      'Deletion is permanent and cannot be undone',
      'Filter-based deletion may affect many documents',
      'Always use dryRun: true first to verify what will be deleted',
      'Large deletions may take time to complete'
    ]
  });
}