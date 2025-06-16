/**
 * API route for Pinecone index statistics
 * GET /api/pinecone/stats - Get index statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPineconeService } from '@/lib/pinecone/index';

export async function GET(request: NextRequest) {
  try {
    const pineconeService = getPineconeService();
    
    // Get index stats
    const stats = await pineconeService.getIndexStats();
    
    // Get health status
    const health = await pineconeService.checkHealth();

    return NextResponse.json({
      success: true,
      health: health.healthy,
      stats: {
        indexName: health.details?.indexName || process.env.PINECONE_INDEX_NAME,
        totalVectors: stats.totalRecordCount || 0,
        dimension: stats.dimension || 1536,
        indexFullness: ((stats.indexFullness || 0) * 100).toFixed(2) + '%',
        namespaces: stats.namespaces || {},
      },
      details: health.details,
    });
  } catch (error) {
    console.error('Error getting index stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get index statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}