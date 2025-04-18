import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import UpstoxToken from '@/lib/db/models/UpstoxToken';
import { verifyToken } from '@/lib/auth/jwt';
import axios from 'axios';
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

// Function to refresh access token
async function refreshAccessToken(refreshToken, credentials) {
  try {
    const url = 'https://api.upstox.com/v2/login/authorization/token';
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = {
      'refresh_token': refreshToken,
      'client_id': credentials.clientId,
      'client_secret': credentials.clientSecret,
      'grant_type': 'refresh_token',
    };

    const response = await axios.post(url, new URLSearchParams(data), { headers });
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    throw error;
  }
}

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

    // Find user to check if they're connected to Upstox
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is connected to Upstox
    if (!user.upstoxConnected) {
      // Return a 200 response with isConnected: false
      return NextResponse.json({
        isConnected: false,
        message: 'Not connected to Upstox. Please connect to Upstox first.'
      });
    }

    // Get user's Upstox credentials
    const credentials = await UpstoxCredentials.findOne({ userId: decoded.userId });
    if (!credentials) {
      return NextResponse.json({ error: 'Upstox credentials not found' }, { status: 404 });
    }

    // Since we don't store tokens, we'll just return a success response
    // indicating that the user is connected to Upstox
    return NextResponse.json({
      isConnected: true,
      connectedAt: user.upstoxConnectedAt,
      message: 'Connected to Upstox',
    });
  } catch (error) {
    console.error('Get Upstox token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
