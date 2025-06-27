/**
 * API endpoint for upserting documents to Pinecone
 * POST /api/pinecone/upsert - Upsert single or multiple documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMultiSourcePineconeServiceV2, DocumentInput } from '@/lib/pinecone/multiSourceServiceV2';
import { DataSource } from '@/lib/pinecone/types/unifiedMetadata';

interface UpsertRequest {
  documents: DocumentInput | DocumentInput[];
}

export async function POST(request: NextRequest) {
  try {
    const body: UpsertRequest = await request.json();
    const service = getMultiSourcePineconeServiceV2();
    
    // Validate request
    if (!body.documents) {
      return NextResponse.json(
        { error: 'documents field is required' },
        { status: 400 }
      );
    }
    
    // Handle single document or array
    const documents = Array.isArray(body.documents) ? body.documents : [body.documents];
    
    // Validate documents
    for (const doc of documents) {
      if (!doc.id || !doc.source || !doc.type || !doc.title || !doc.content || !doc.author) {
        return NextResponse.json(
          { 
            error: 'Invalid document format. Required fields: id, source, type, title, content, author',
            invalidDocument: doc
          },
          { status: 400 }
        );
      }
      
      // Validate source
      const validSources: DataSource[] = ['gmail', 'jira', 'confluence', 'github', 'slack'];
      if (!validSources.includes(doc.source)) {
        return NextResponse.json(
          { 
            error: `Invalid source: ${doc.source}. Valid sources: ${validSources.join(', ')}`
          },
          { status: 400 }
        );
      }
    }
    
    console.log(`📤 Upserting ${documents.length} document(s)`);
    
    // Perform upsert
    if (documents.length === 1) {
      await service.upsertDocument(documents[0]);
    } else {
      await service.upsertDocuments(documents);
    }
    
    return NextResponse.json({
      success: true,
      documentsUpserted: documents.length,
      documentIds: documents.map(d => d.id),
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Upsert error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to upsert documents',
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
    endpoint: 'POST /api/pinecone/upsert',
    description: 'Upsert one or more documents to Pinecone with minimal metadata',
    requestBody: {
      documents: 'DocumentInput | DocumentInput[] (required)',
      documentInput: {
        id: 'string (required) - Unique document ID',
        source: 'DataSource (required) - One of: gmail, jira, confluence, github, slack',
        type: 'string (required) - Document type (e.g., email, ticket, pr, message, page)',
        title: 'string (required) - Document title or summary',
        content: 'string (required) - Full document content',
        author: 'string (required) - Author name or email',
        createdAt: 'Date (optional) - Creation timestamp',
        projectKey: 'string (optional) - Project identifier',
        ticketKeys: 'string[] (optional) - Related ticket IDs',
        status: 'string (optional) - Current status',
        priority: 'string (optional) - Priority level',
        mentions: 'string[] (optional) - Mentioned users/channels'
      }
    },
    examples: {
      singleDocument: {
        documents: {
          id: 'email-123',
          source: 'gmail',
          type: 'email',
          title: 'Re: Project Update',
          content: 'The latest changes to PROJ-123 have been deployed...',
          author: 'john.doe@company.com',
          projectKey: 'PROJ',
          ticketKeys: ['PROJ-123'],
          mentions: ['@jane.smith', '#dev-team']
        }
      },
      multipleDocuments: {
        documents: [
          {
            id: 'ticket-456',
            source: 'jira',
            type: 'ticket',
            title: 'Fix authentication bug',
            content: 'Users are unable to login with SSO...',
            author: 'jane.smith@company.com',
            projectKey: 'AUTH',
            status: 'open',
            priority: 'high'
          },
          {
            id: 'pr-789',
            source: 'github',
            type: 'pr',
            title: 'Add user authentication',
            content: 'This PR implements the SSO authentication flow...',
            author: 'developer@company.com',
            projectKey: 'AUTH',
            ticketKeys: ['AUTH-456'],
            status: 'open'
          }
        ]
      }
    }
  });
}