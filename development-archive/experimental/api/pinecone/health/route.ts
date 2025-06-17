/**
 * API route for Pinecone health check
 * GET /api/pinecone/health - Check Pinecone service health
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPineconeService } from '@/lib/pinecone/index';

export async function GET(request: NextRequest) {
  try {
    const pineconeService = getPineconeService();
    const health = await pineconeService.checkHealth();

    if (health.healthy) {
      return NextResponse.json({
        status: 'healthy',
        message: 'Pinecone service is operational',
        details: health.details,
      });
    } else {
      return NextResponse.json(
        {
          status: 'unhealthy',
          message: 'Pinecone service is not operational',
          error: health.error,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error checking health:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to check service health',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}