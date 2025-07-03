/**
 * API endpoints for single document operations
 * GET /api/pinecone/documents/:id - Fetch document by ID
 * DELETE /api/pinecone/documents/:id - Delete document by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMultiSourcePineconeServiceV2 } from '@/lib/pinecone/multiSourceServiceV2';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`📄 Fetching document: ${id}`);
    
    const service = getMultiSourcePineconeServiceV2();
    const document = await service.getDocument(id);
    
    if (!document) {
      return NextResponse.json(
        { 
          error: 'Document not found',
          id,
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      document,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching document:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch document',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`🗑️ Deleting document: ${id}`);
    
    const service = getMultiSourcePineconeServiceV2();
    
    // Check if document exists first
    const existing = await service.getDocument(id);
    if (!existing) {
      return NextResponse.json(
        { 
          error: 'Document not found',
          id,
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }
    
    // Delete the document
    await service.deleteDocument(id);
    
    return NextResponse.json({
      success: true,
      message: `Document ${id} deleted successfully`,
      deletedDocument: {
        id,
        source: existing.metadata.source,
        type: existing.metadata.type,
        title: existing.metadata.title
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Error deleting document:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to delete document',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}