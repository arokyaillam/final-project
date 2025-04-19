import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Logout Direct API - Processing logout request');
    }
    
    // Create response
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true
    });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });
    
    // Also try to delete the cookie
    response.cookies.delete('token');

    // Clear the user info cookie
    response.cookies.set('user_info', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    });
    
    // Also try to delete the cookie
    response.cookies.delete('user_info');
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Logout Direct API - Cookies cleared successfully');
    }

    return response;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Logout Direct API - Error:', error);
    }
    
    // Even if there's an error, return success
    return NextResponse.json({ 
      message: 'Logout attempted',
      success: true
    });
  }
}
