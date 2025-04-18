import { NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth/jwt';

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
    
    // Get Upstox authorization URL
    const clientId = process.env.UPSTOX_CLIENT_ID;
    const redirectUri = process.env.UPSTOX_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      return NextResponse.json({ error: 'Upstox API credentials not configured' }, { status: 500 });
    }
    
    const authorizationUrl = `https://api.upstox.com/v2/login/authorization/dialog?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
    
    return NextResponse.json({ authorizationUrl });
  } catch (error) {
    console.error('Upstox auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
