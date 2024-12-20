import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updateData: { status?: string; isAdmin?: boolean } = {};
    
    // Validate status if provided
    if (body.status !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(body.status)) {
        return NextResponse.json(
          { message: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = body.status;
    }

    // Validate isAdmin if provided
    if (body.isAdmin !== undefined) {
      if (typeof body.isAdmin !== 'boolean') {
        return NextResponse.json(
          { message: 'Invalid admin status' },
          { status: 400 }
        );
      }
      updateData.isAdmin = body.isAdmin;
    }

    await connectToDatabase();
    
    // Prevent modifying your own admin status
    if (updateData.isAdmin !== undefined) {
      const targetUser = await User.findById(params.id);
      if (!targetUser) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      
      if (targetUser.email === session.user.email) {
        return NextResponse.json(
          { message: 'Cannot modify your own admin status' },
          { status: 403 }
        );
      }
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
