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

// Function to get access token
async function getAccessToken(code, credentials) {
  try {
    const url = 'https://api.upstox.com/v2/login/authorization/token';
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = {
      'code': code,
      'client_id': credentials.clientId,
      'client_secret': credentials.clientSecret,
      'redirect_uri': credentials.redirectUri,
      'grant_type': 'authorization_code',
    };

    const response = await axios.post(url, new URLSearchParams(data), { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
}

export async function GET(request) {
  try {
    // Get authorization code from query parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url));
    }

    // Get user from JWT token
    const cookieStore = cookies();
    // Use the cookies API asynchronously
    const tokenCookie = await cookieStore.get('token');
    const authToken = tokenCookie?.value;

    if (!authToken) {
      return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url));
    }

    const decoded = verifyToken(authToken);
    if (!decoded || !decoded.userId) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user_not_found', request.url));
    }

    // Get user's Upstox credentials
    const credentials = await UpstoxCredentials.findOne({ userId: user._id });
    if (!credentials) {
      return NextResponse.redirect(new URL('/dashboard?error=credentials_not_found', request.url));
    }

    // Exchange code for access token
    const tokenData = await getAccessToken(code, credentials);

    if (!tokenData || !tokenData.access_token) {
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url));
    }

    // Instead of storing the token in the database, we'll just update the user's status
    // to indicate they've connected to Upstox

    // Update user with Upstox connection status
    user.upstoxConnected = true;
    user.upstoxConnectedAt = new Date();

    await user.save();

    // Store connection status in session cookie
    const cookieStore = cookies();
    // Use the cookies API asynchronously
    await cookieStore.set('upstox_connected', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      sameSite: 'strict',
    });

    // Redirect to dashboard with success message
    return NextResponse.redirect(new URL('/dashboard?success=upstox_connected', request.url));
  } catch (error) {
    console.error('Upstox callback error:', error);
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(error.message || 'unknown_error')}`, request.url));
  }
}
