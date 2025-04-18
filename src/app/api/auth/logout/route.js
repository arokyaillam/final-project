import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    console.log('Logout API - Processing logout request');

    // Get the cookie store
    const cookieStore = await cookies();

    // Log current cookies for debugging
    const tokenCookie = cookieStore.get('token');
    const userInfoCookie = cookieStore.get('user_info');
    console.log('Logout API - Current cookies:', {
      token: tokenCookie ? 'exists' : 'not found',
      userInfo: userInfoCookie ? 'exists' : 'not found'
    });

    // Create response
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true
    });

    // Clear the token cookie - try multiple approaches
    // Approach 1: Standard way
    response.cookies.set('token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });

    // Approach 2: Alternative way
    response.cookies.delete('token');

    // Clear the user info cookie - try multiple approaches
    // Approach 1: Standard way
    response.cookies.set('user_info', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });

    // Approach 2: Alternative way
    response.cookies.delete('user_info');

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
