import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, role, firstName, lastName, phone, company, position } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data
    const userData: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      profile: {
        firstName,
        lastName,
        phone,
      },
    };

    // Add role-specific data
    if (role === 'recruiter') {
      userData.recruiterProfile = {
        company,
        position,
        verified: false,
      };
    } else {
      userData.candidateProfile = {
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        preferences: {},
      };
    }

    // Create user
    const user = await User.create(userData);

    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

