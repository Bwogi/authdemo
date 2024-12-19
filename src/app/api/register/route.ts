import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';

// Define the schema for registration data
const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  // Check if registration is enabled
  if (process.env.ENABLE_REGISTRATION !== 'true') {
    return NextResponse.json(
      { message: "Registration is currently disabled" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    
    // Validate the request body
    const validatedData = RegisterSchema.parse(body);
    
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
