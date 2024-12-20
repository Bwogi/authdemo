import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';

// Define the schema for user registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  adminKey: z.string(),
});

if (!process.env.ADMIN_EMAIL) {
  throw new Error('ADMIN_EMAIL environment variable is not set');
}

if (!process.env.ADMIN_KEY) {
  throw new Error('ADMIN_KEY environment variable is not set');
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_KEY = process.env.ADMIN_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = registerSchema.parse(body);

    // Check admin key
    if (validatedData.adminKey !== ADMIN_KEY) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid admin key' },
        { status: 401 }
      );
    }

    // Check if the email is the admin email
    if (validatedData.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { message: 'Unauthorized: Only admin can register' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create new user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      isAdmin: true, // Set admin flag
    });

    // Return success response without password
    const { password, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred while registering the user' },
      { status: 500 }
    );
  }
}
