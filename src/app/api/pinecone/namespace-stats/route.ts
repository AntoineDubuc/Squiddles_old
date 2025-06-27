/**
 * API endpoint for getting Pinecone namespace statistics
 * GET /api/pinecone/namespace-stats - Get detailed statistics about the index
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMultiSourcePineconeServiceV2 } from '@/lib/pinecone/multiSourceServiceV2';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching Pinecone namespace statistics');
    
    const service = getMultiSourcePineconeServiceV2();
    const stats = await service.getStats();
    
    // Calculate additional statistics
    const sourceBreakdown = await getSourceBreakdown(service);
    const typeBreakdown = await getTypeBreakdown(service);
    const timeDistribution = await getTimeDistribution(service);
    
    return NextResponse.json({
      success: true,
      index: {
        totalVectors: stats.totalVectors || 0,
        dimensions: stats.dimensions || 1536,
        indexFullness: stats.indexFullness || 0,
        namespaces: stats.namespaces || {}
      },
      breakdown: {
        bySource: sourceBreakdown,
        byType: typeBreakdown,
        byTime: timeDistribution
      },
      recommendations: generateRecommendations(stats, sourceBreakdown),
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching namespace stats:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch namespace statistics',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function getSourceBreakdown(service: any): Promise<Record<string, number>> {
  const breakdown: Record<string, number> = {
    gmail: 0,
    jira: 0,
    confluence: 0,
    github: 0,
    slack: 0
  };
  
  try {
    // Query for each source
    for (const source of Object.keys(breakdown)) {
      const results = await service.search('*', { sources: [source] }, 1);
      // This is approximate - in production, you'd use a more accurate counting method
      breakdown[source] = results.length > 0 ? 100 : 0; // Placeholder
    }
  } catch (error) {
    console.error('Error getting source breakdown:', error);
  }
  
  return breakdown;
}

async function getTypeBreakdown(service: any): Promise<Record<string, number>> {
  const types = ['email', 'ticket', 'comment', 'page', 'pr', 'issue', 'message'];
  const breakdown: Record<string, number> = {};
  
  try {
    // Query for common types
    for (const type of types) {
      const results = await service.search('*', { types: [type] }, 1);
      // This is approximate - in production, you'd use a more accurate counting method
      if (results.length > 0) {
        breakdown[type] = 50; // Placeholder
      }
    }
  } catch (error) {
    console.error('Error getting type breakdown:', error);
  }
  
  return breakdown;
}

async function getTimeDistribution(service: any): Promise<any> {
  const now = Date.now();
  const distribution = {
    last24Hours: 0,
    last7Days: 0,
    last30Days: 0,
    last90Days: 0,
    older: 0
  };
  
  try {
    // Query for different time ranges
    const ranges = [
      { key: 'last24Hours', after: now - 24 * 60 * 60 * 1000 },
      { key: 'last7Days', after: now - 7 * 24 * 60 * 60 * 1000 },
      { key: 'last30Days', after: now - 30 * 24 * 60 * 60 * 1000 },
      { key: 'last90Days', after: now - 90 * 24 * 60 * 60 * 1000 }
    ];
    
    for (const range of ranges) {
      const results = await service.search('*', { createdAfter: range.after }, 1);
      // This is approximate - in production, you'd use a more accurate counting method
      distribution[range.key] = results.length > 0 ? 25 : 0; // Placeholder
    }
  } catch (error) {
    console.error('Error getting time distribution:', error);
  }
  
  return distribution;
}

function generateRecommendations(stats: any, sourceBreakdown: Record<string, number>): string[] {
  const recommendations: string[] = [];
  
  // Check if index is empty
  if (!stats.totalVectors || stats.totalVectors === 0) {
    recommendations.push('Index is empty. Start by indexing documents from your connected sources.');
  }
  
  // Check index fullness
  if (stats.indexFullness > 0.8) {
    recommendations.push('Index is approaching capacity. Consider upgrading your Pinecone plan.');
  }
  
  // Check source coverage
  const emptySources = Object.entries(sourceBreakdown)
    .filter(([_, count]) => count === 0)
    .map(([source]) => source);
  
  if (emptySources.length > 0) {
    recommendations.push(`No documents indexed from: ${emptySources.join(', ')}. Consider indexing these sources.`);
  }
  
  // General recommendations
  if (stats.totalVectors > 10000) {
    recommendations.push('Consider implementing pagination for search results with large datasets.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Index is healthy and well-distributed across sources.');
  }
  
  return recommendations;
}