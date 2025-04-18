import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import UpstoxToken from '@/lib/db/models/UpstoxToken';
import { getTokenFromHeader, verifyToken } from '@/lib/auth/jwt';
import { refreshAccessToken } from '@/services/upstox';

export async function GET(request) {
  try {
    // Get JWT token from header
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify JWT token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Find user's Upstox token
    const upstoxToken = await UpstoxToken.findOne({ userId: decoded.userId });
    
    if (!upstoxToken) {
      return NextResponse.json({ error: 'Upstox token not found' }, { status: 404 });
    }
    
    // Check if token is expired
    const now = new Date();
    const isExpired = now >= upstoxToken.expiresAt;
    
    // If token is expired, refresh it
    if (isExpired) {
      try {
        const refreshedToken = await refreshAccessToken(upstoxToken.refreshToken);
        
        // Calculate new expiration date
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + refreshedToken.expires_in);
        
        // Update token in database
        upstoxToken.accessToken = refreshedToken.access_token;
        upstoxToken.refreshToken = refreshedToken.refresh_token;
        upstoxToken.expiresIn = refreshedToken.expires_in;
        upstoxToken.expiresAt = expiresAt;
        upstoxToken.updatedAt = now;
        
        await upstoxToken.save();
        
        // Update user with token info
        const user = await User.findById(decoded.userId);
        if (user) {
          user.upstoxToken = {
            accessToken: refreshedToken.access_token,
            refreshToken: refreshedToken.refresh_token,
            expiresIn: refreshedToken.expires_in,
            tokenType: refreshedToken.token_type,
            expiresAt,
          };
          
          await user.save();
        }
        
        // Return refreshed token
        return NextResponse.json({
          accessToken: refreshedToken.access_token,
          tokenType: refreshedToken.token_type,
          expiresIn: refreshedToken.expires_in,
          expiresAt: expiresAt.toISOString(),
        });
      } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
      }
    }
    
    // Return current token
    return NextResponse.json({
      accessToken: upstoxToken.accessToken,
      tokenType: upstoxToken.tokenType,
      expiresIn: upstoxToken.expiresIn,
      expiresAt: upstoxToken.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Get Upstox token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
