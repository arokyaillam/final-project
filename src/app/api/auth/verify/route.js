import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    // Get token from cookies - await the cookies() call
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    console.log('Verify API - Token from cookies:', token ? 'Found' : 'Not found');

    if (!token) {
      console.log('Verify API - No token found in cookies');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token - this is a synchronous operation and should be fast
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

    // For faster response, we could skip the database check and just return the user info from the token
    // This is a trade-off between security and performance
    // If you want maximum security, keep the database check
    // If you want maximum performance, you can return the user info directly from the token

    try {
      // Connect to database with a timeout
      const dbConnectPromise = connectToDatabase();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timeout')), 3000)
      );

      await Promise.race([dbConnectPromise, timeoutPromise]);

      // Find user with a timeout
      const findUserPromise = User.findById(decoded.userId);
      const userTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('User lookup timeout')), 3000)
      );

      const user = await Promise.race([findUserPromise, userTimeoutPromise]);
      console.log('Verify API - User found:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('Verify API - User not found for userId:', decoded.userId);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Return user data from database
      return NextResponse.json({
        message: 'Token verified',
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (dbError) {
      console.error('Verify API - Database error:', dbError.message);

      // Fallback: If database check fails, we can still return the user info from the token
      // This ensures the app keeps working even if the database is slow or down
      console.log('Verify API - Using fallback: returning user info from token');
      return NextResponse.json({
        message: 'Token verified (fallback)',
        user: {
          id: decoded.userId,
          email: decoded.email || 'unknown@example.com', // Fallback email if not in token
        },
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
