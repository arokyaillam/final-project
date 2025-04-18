import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      message: 'Logout successful',
    });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: false, // Changed to false to match login settings
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Set expiration to the past
      path: '/',
      sameSite: 'lax', // Changed to lax to match login settings
      maxAge: 0, // Explicitly set maxAge to 0
    });

    // Clear the user info cookie
    response.cookies.set('user_info', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Set expiration to the past
      path: '/',
      sameSite: 'lax', // Changed to lax to match login settings
      maxAge: 0, // Explicitly set maxAge to 0
    });

    console.log('Logout API - Cookies cleared successfully');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
