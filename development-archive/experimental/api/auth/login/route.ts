/**
 * Login API Endpoint
 * Implements TICKET-001: Authentication API
 */

import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';
import { LoginRequest, LoginResponse, ApiResponse } from '@/app/types/api-endpoints';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Validate request body
    if (!body.email || !body.password) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Email and password are required',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Invalid email format',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Attempt login
    const session = await login({
      email: body.email,
      password: body.password,
    });
    
    if (!session) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Invalid credentials',
        timestamp: new Date(),
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }
    
    // Return successful login response
    const loginResponse: LoginResponse = {
      user: session.user,
      token: session.token,
      refreshToken: `refresh_${session.token}`, // Mock refresh token
      expiresAt: session.expiresAt,
    };
    
    const successResponse: ApiResponse<LoginResponse> = {
      success: true,
      data: loginResponse,
      message: 'Login successful',
      timestamp: new Date(),
    };
    
    return NextResponse.json(successResponse, { status: 200 });
    
  } catch (error) {
    console.error('Login API error:', error);
    
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