import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { signToken } from '@/lib/auth/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({ userId: user._id });

    // Create response with token
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });

    // Set token in cookie using the response object
    // Set to expire in 24 hours (24 * 60 * 60 = 86400 seconds)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      sameSite: 'strict',
    });

    // Also set a non-httpOnly cookie with user info for client-side access
    // This doesn't contain sensitive data, just basic user info
    response.cookies.set('user_info', JSON.stringify({
      id: user._id,
      email: user.email,
      lastLogin: new Date().toISOString()
    }), {
      httpOnly: false, // Accessible from JavaScript
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      sameSite: 'strict',
    });

    // Return the response with the cookie
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
