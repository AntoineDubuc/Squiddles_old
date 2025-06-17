/**
 * Logout API Endpoint
 * Implements TICKET-001: Authentication API
 */

import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/auth';
import { ApiResponse } from '@/app/types/api-endpoints';

export async function POST(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Verify the auth token from headers
    // 2. Invalidate the token in the database
    // 3. Clear any server-side sessions
    
    // For now, we'll just call the logout function
    await logout();
    
    const successResponse: ApiResponse<null> = {
      success: true,
      message: 'Logout successful',
      timestamp: new Date(),
    };
    
    return NextResponse.json(successResponse, { status: 200 });
    
  } catch (error) {
    console.error('Logout API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function PUT() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function DELETE() {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Method not allowed',
    timestamp: new Date(),
  };
  return NextResponse.json(errorResponse, { status: 405 });
}