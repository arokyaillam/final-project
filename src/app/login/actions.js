'use server';

import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { signToken } from '@/lib/auth/jwt';

/**
 * Server action to handle login directly
 */
export async function loginAction(credentials) {
  try {
    const { email, password } = credentials;
    
    // Validate input
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Generate JWT token
    const token = signToken({ userId: user._id });

    // Set cookies
    cookies().set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      sameSite: 'lax',
    });

    // Also set a cookie with user info for client-side access
    cookies().set('user_info', JSON.stringify({
      id: user._id,
      email: user.email,
      lastLogin: new Date().toISOString()
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      sameSite: 'lax',
    });

    // Return success response
    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
      },
      token
    };
  } catch (error) {
    console.error('Login action error:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}
