/**
 * API endpoint for updating document metadata in Pinecone
 * POST /api/pinecone/update-metadata - Update metadata for a specific document
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMultiSourcePineconeServiceV2 } from '@/lib/pinecone/multiSourceServiceV2';
import { MinimalMetadata } from '@/lib/pinecone/types/unifiedMetadata';

interface UpdateMetadataRequest {
  id: string;
  metadata: Partial<Omit<MinimalMetadata, 'id' | 'source' | 'type' | 'createdAt'>>;
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateMetadataRequest = await request.json();
    
    // Validate request
    if (!body.id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    if (!body.metadata || Object.keys(body.metadata).length === 0) {
      return NextResponse.json(
        { error: 'Metadata object with at least one field is required' },
        { status: 400 }
      );
    }
    
    // Prevent updating immutable fields
    const immutableFields = ['id', 'source', 'type', 'createdAt'];
    const attemptedImmutable = Object.keys(body.metadata).filter(key => 
      immutableFields.includes(key)
    );
    
    if (attemptedImmutable.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot update immutable fields: ${attemptedImmutable.join(', ')}`,
          immutableFields
        },
        { status: 400 }
      );
    }
    
    console.log(`📝 Updating metadata for document: ${body.id}`);
    console.log(`   Fields to update:`, Object.keys(body.metadata));
    
    const service = getMultiSourcePineconeServiceV2();
    
    // Check if document exists
    const existing = await service.getDocument(body.id);
    if (!existing) {
      return NextResponse.json(
        { 
          error: 'Document not found',
          id: body.id,
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }
    
    // Update metadata
    await service.updateMetadata(body.id, body.metadata);
    
    // Fetch updated document
    const updated = await service.getDocument(body.id);
    
    return NextResponse.json({
      success: true,
      message: `Metadata updated for document ${body.id}`,
      updatedFields: Object.keys(body.metadata),
      document: updated,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Error updating metadata:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update metadata',
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
    endpoint: 'POST /api/pinecone/update-metadata',
    description: 'Update metadata for an existing document in Pinecone',
    requestBody: {
      id: 'string (required) - Document ID to update',
      metadata: 'object (required) - Metadata fields to update',
      updatableFields: [
        'title',
        'author',
        'projectKey',
        'ticketKeys',
        'status',
        'priority',
        'mentions'
      ],
      immutableFields: [
        'id',
        'source',
        'type',
        'createdAt'
      ]
    },
    examples: {
      updateStatus: {
        id: 'ticket-123',
        metadata: {
          status: 'resolved',
          priority: 'low'
        }
      },
      updateReferences: {
        id: 'email-456',
        metadata: {
          ticketKeys: ['PROJ-123', 'PROJ-456'],
          mentions: ['@john.doe', '@jane.smith', '#dev-team']
        }
      },
      updateProject: {
        id: 'pr-789',
        metadata: {
          projectKey: 'NEWPROJ',
          title: '[NEWPROJ] Updated PR title'
        }
      }
    },
    notes: [
      'Only specified fields will be updated, others remain unchanged',
      'Cannot update id, source, type, or createdAt fields',
      'Document must exist before updating metadata',
      'Arrays (ticketKeys, mentions) will be completely replaced, not merged'
    ]
  });
}