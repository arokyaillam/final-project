import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('Logout Redirect API - Processing logout request');
    
    // Get the cookie store
    const cookieStore = await cookies();
    
    // Create response with redirect
    const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));

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
    
    console.log('Logout Redirect API - Cookies cleared successfully');

    return response;
  } catch (error) {
    console.error('Logout Redirect API - Error:', error);
    
    // Even if there's an error, redirect to login
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
}
