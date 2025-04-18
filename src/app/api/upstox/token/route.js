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
    // In Next.js 14+, we need to use the cookies API differently
    // We'll use a workaround to avoid the warning
    const token = request.cookies.get('token')?.value;

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

    // Check if token is expired
    const now = new Date();
    const isExpired = now >= upstoxToken.expiresAt;

    // If token is expired, refresh it
    if (isExpired) {
      try {
        // Use the config format for refreshing token
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://api.upstox.com/v2/login/authorization/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: new URLSearchParams({
            'refresh_token': upstoxToken.refreshToken,
            'client_id': credentials.clientId,
            'client_secret': credentials.clientSecret,
            'grant_type': 'refresh_token'
          }).toString()
        };

        const response = await axios(config);
        const refreshedToken = response.data;

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

        // Return refreshed token
        return NextResponse.json({
          isConnected: true,
          accessToken: refreshedToken.access_token,
          tokenType: refreshedToken.token_type,
          expiresIn: refreshedToken.expires_in,
          expiresAt: expiresAt.toISOString(),
          connectedAt: upstoxToken.createdAt,
        });
      } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
      }
    }

    // Return current token
    return NextResponse.json({
      isConnected: true,
      accessToken: upstoxToken.accessToken,
      tokenType: upstoxToken.tokenType,
      expiresIn: upstoxToken.expiresIn,
      expiresAt: upstoxToken.expiresAt.toISOString(),
      connectedAt: upstoxToken.createdAt,
    });
  } catch (error) {
    console.error('Get Upstox token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
