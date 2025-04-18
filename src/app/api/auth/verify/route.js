import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get('token')?.value;
    console.log('Verify API - Token from cookies:', token ? 'Found' : 'Not found');

    if (!token) {
      console.log('Verify API - No token found in cookies');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    console.log('Verify API - Token verification result:', decoded ? 'Valid' : 'Invalid');

    if (!decoded || !decoded.userId) {
      console.log('Verify API - Invalid token or missing userId');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('Verify API - Decoded token userId:', decoded.userId);

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findById(decoded.userId);
    console.log('Verify API - User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Verify API - User not found for userId:', decoded.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json({
      message: 'Token verified',
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
