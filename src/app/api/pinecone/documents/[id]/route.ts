/**
 * API route for specific document operations
 * DELETE /api/pinecone/documents/[id] - Delete a document
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPineconeService } from '@/lib/pinecone/index';
import { z } from 'zod';

// Validation schema for delete request
const DeleteSchema = z.object({
  type: z.enum(['TICKET', 'COMMENT', 'TEMPLATE', 'VOICE_COMMAND', 'DOCUMENTATION']),
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get type from query parameter or body
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Validate type
    const validated = DeleteSchema.parse({ type });
    
    const pineconeService = getPineconeService();
    await pineconeService.deleteDocument(id, validated.type as any);

    return NextResponse.json({
      success: true,
      message: `Document ${id} deleted successfully`,
      id,
      type: validated.type,
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to delete document',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}