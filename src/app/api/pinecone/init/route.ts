/**
 * API endpoint for initializing Pinecone index
 * POST /api/pinecone/init - Create and configure Pinecone index
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMultiSourcePineconeServiceV2 } from '@/lib/pinecone/multiSourceServiceV2';

interface InitRequest {
  force?: boolean; // Force recreation if index exists
}

export async function POST(request: NextRequest) {
  try {
    const body: InitRequest = await request.json();
    const { force = false } = body;
    
    console.log(`🚀 Initializing Pinecone index`);
    console.log(`   Force recreation: ${force}`);
    
    const service = getMultiSourcePineconeServiceV2();
    
    // Get current health status
    const healthBefore = await service.getHealth();
    
    if (healthBefore.healthy && !force) {
      return NextResponse.json({
        success: true,
        message: 'Index already exists and is healthy',
        indexName: healthBefore.indexName,
        stats: healthBefore.stats,
        timestamp: new Date().toISOString()
      });
    }
    
    // Initialize the index
    await service.initializeIndex();
    
    // Wait a bit for index to be fully ready
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Get health status after initialization
    const healthAfter = await service.getHealth();
    
    return NextResponse.json({
      success: true,
      message: force ? 'Index recreated successfully' : 'Index created successfully',
      indexName: healthAfter.indexName,
      stats: healthAfter.stats,
      healthy: healthAfter.healthy,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Index initialization error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize Pinecone index',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const service = getMultiSourcePineconeServiceV2();
    const health = await service.getHealth();
    
    return NextResponse.json({
      endpoint: 'POST /api/pinecone/init',
      description: 'Initialize Pinecone index with proper configuration',
      currentStatus: {
        healthy: health.healthy,
        indexName: health.indexName,
        stats: health.stats,
        error: health.error
      },
      requestBody: {
        force: 'boolean (optional) - Force recreation of index if it exists'
      },
      indexConfiguration: {
        dimension: 1536,
        metric: 'cosine',
        cloud: 'aws',
        region: 'us-east-1'
      },
      examples: {
        createNew: {
          description: 'Create index if it doesn\'t exist'
        },
        forceRecreate: {
          force: true,
          description: 'Delete existing index and create new one'
        }
      },
      warnings: [
        'Force recreation will delete all existing data',
        'Index creation can take up to 60 seconds',
        'Ensure PINECONE_API_KEY is set in environment',
        'Index name is taken from PINECONE_INDEX_NAME env var'
      ]
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to get index status',
        details: error.message 
      },
      { status: 500 }
    );
  }
}