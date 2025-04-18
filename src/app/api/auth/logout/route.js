import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      message: 'Logout successful',
    });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Set expiration to the past
      path: '/',
      sameSite: 'strict',
    });

    // Clear the user info cookie
    response.cookies.set('user_info', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Set expiration to the past
      path: '/',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
