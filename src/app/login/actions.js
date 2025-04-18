'use server';

import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { signToken } from '@/lib/auth/jwt';
import { NextResponse } from 'next/server';

/**
 * Server action to handle login directly
 */
export async function loginAction(credentials) {
  try {
    console.log('Server Action - Login attempt started');
    const { email, password } = credentials;

    // Validate input
    if (!email || !password) {
      console.log('Server Action - Missing email or password');
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    console.log('Server Action - Connecting to database');
    // Connect to database
    await connectToDatabase();

    console.log('Server Action - Finding user:', email);
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Server Action - User not found');
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    console.log('Server Action - Verifying password');
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Server Action - Invalid password');
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    console.log('Server Action - Password verified successfully');

    console.log('Server Action - Generating JWT token');
    // Generate JWT token
    const token = signToken({ userId: user._id });

    console.log('Server Action - Setting cookies');
    // Convert MongoDB ObjectId to string
    const userId = user._id.toString();

    console.log('Server Action - Login successful');

    // Return success response with plain objects only
    return {
      success: true,
      user: {
        id: userId,
        email: user.email,
      },
      token
    };
  } catch (error) {
    console.error('Server Action - Login error:', error);
    // Return a more detailed error message
    return {
      success: false,
      error: 'Internal server error',
      details: error.message
    };
  }
}
