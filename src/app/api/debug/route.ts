import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: 'admin@example.com' });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' });
    }
    
    return NextResponse.json({
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      status: user.status,
      _id: user._id.toString()
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
