import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import { verifyToken } from '@/lib/auth/jwt';
import mongoose from 'mongoose';

// Get Upstox credentials model
const UpstoxCredentialsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  redirectUri: {
    type: String,
    required: true,
  },
});

const UpstoxCredentials = mongoose.models.UpstoxCredentials ||
  mongoose.model('UpstoxCredentials', UpstoxCredentialsSchema);

export async function GET(request) {
  try {
    // Get JWT token from cookies
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('token');
    const token = tokenCookie?.value;

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

    // Get user's Upstox credentials from database
    const credentials = await UpstoxCredentials.findOne({ userId: decoded.userId });

    if (!credentials) {
      return NextResponse.json({ error: 'Upstox API credentials not found' }, { status: 404 });
    }

    const { clientId, redirectUri } = credentials;

    // Get Upstox authorization URL
    const authorizationUrl = `https://api.upstox.com/v2/login/authorization/dialog?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

    return NextResponse.json({ authorizationUrl });
  } catch (error) {
    console.error('Upstox auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
