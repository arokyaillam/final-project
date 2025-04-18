import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { verifyToken } from '@/lib/auth/jwt';

// Create a model for Upstox credentials
import mongoose from 'mongoose';

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
UpstoxCredentialsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UpstoxCredentials = mongoose.models.UpstoxCredentials ||
  mongoose.model('UpstoxCredentials', UpstoxCredentialsSchema);

export async function POST(request) {
  try {
    // Get user from JWT token
    // In Next.js 14+, we need to use the cookies API differently
    const cookiesList = cookies();
    const authToken = cookiesList.get('token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get credentials from request body
    const { clientId, clientSecret, redirectUri } = await request.json();

    // Validate input
    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Save credentials to database
    let credentials = await UpstoxCredentials.findOne({ userId: user._id });

    if (credentials) {
      // Update existing credentials
      credentials.clientId = clientId;
      credentials.clientSecret = clientSecret;
      credentials.redirectUri = redirectUri;
      credentials.updatedAt = new Date();
      await credentials.save();
    } else {
      // Create new credentials
      credentials = await UpstoxCredentials.create({
        userId: user._id,
        clientId,
        clientSecret,
        redirectUri,
      });
    }

    // Update environment variables (in memory only, for the current request)
    process.env.UPSTOX_CLIENT_ID = clientId;
    process.env.UPSTOX_CLIENT_SECRET = clientSecret;
    process.env.UPSTOX_REDIRECT_URI = redirectUri;

    return NextResponse.json({
      message: 'Credentials saved successfully',
      credentials: {
        clientId,
        redirectUri,
      },
    });
  } catch (error) {
    console.error('Save Upstox credentials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    // Get user from JWT token
    // In Next.js 14+, we need to use the cookies API differently
    const cookiesList = cookies();
    const authToken = cookiesList.get('token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Find user's credentials
    const credentials = await UpstoxCredentials.findOne({ userId: decoded.userId });

    if (!credentials) {
      return NextResponse.json({
        hasCredentials: false,
        message: 'No credentials found'
      });
    }

    return NextResponse.json({
      hasCredentials: true,
      credentials: {
        clientId: credentials.clientId,
        redirectUri: credentials.redirectUri,
      },
    });
  } catch (error) {
    console.error('Get Upstox credentials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
