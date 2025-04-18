import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';

export async function GET() {
  try {
    // Test MongoDB connection
    await connectToDatabase();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'API is healthy. MongoDB connection successful.' 
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'API health check failed. MongoDB connection error.',
        error: error.message
      },
      { status: 500 }
    );
  }
}
