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
    const token = cookieStore.get('token')?.value;

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
      // Return a 200 response with isConnected: false instead of a 404 error
      return NextResponse.json({
        isConnected: false,
        message: 'Upstox token not found. Please connect to Upstox first.'
      });
    }

    // Check if token is expired
    const now = new Date();
    const isExpired = now >= upstoxToken.expiresAt;

    // Get user's Upstox credentials
    const credentials = await UpstoxCredentials.findOne({ userId: decoded.userId });
    if (!credentials) {
      return NextResponse.json({ error: 'Upstox credentials not found' }, { status: 404 });
    }

    // If token is expired, refresh it
    if (isExpired) {
      try {
        const refreshedToken = await refreshAccessToken(upstoxToken.refreshToken, credentials);

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
