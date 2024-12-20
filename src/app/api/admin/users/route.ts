import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

// Get all users (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    try {
      await connectToDatabase();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    try {
      // Get all users except the current admin
      const users = await User.find({ 
        email: { $ne: session.user.email } 
      }).sort({ createdAt: -1 });

      // Ensure users is an array
      if (!Array.isArray(users)) {
        console.error('Users query returned non-array:', users);
        return NextResponse.json(
          { message: 'Invalid data format from database' },
          { status: 500 }
        );
      }

      return NextResponse.json({ users });
    } catch (error) {
      console.error('MongoDB query error:', error);
      return NextResponse.json(
        { message: 'Failed to fetch users from database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error in users API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
