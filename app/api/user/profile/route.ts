import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    await dbConnect();

    // Check if requesting another user's profile (for recruiters viewing candidates)
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    let targetUserId = decoded.userId;
    
    // If recruiter is requesting another user's profile, allow it
    if (requestedUserId && decoded.role === 'recruiter') {
      targetUserId = requestedUserId;
    } else if (requestedUserId && requestedUserId !== decoded.userId) {
      // Non-recruiters can only view their own profile
      return NextResponse.json({ error: 'Unauthorized to view other profiles' }, { status: 403 });
    }

    const user = await User.findById(targetUserId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: user, user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();

    // Validate email format if email is being updated
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
    }

    // Validate phone format if phone is being updated
    if (body.phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(body.phone)) {
        return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
      }
    }

    // Remove duplicate skills
    if (body.skills && Array.isArray(body.skills)) {
      body.skills = [...new Set(body.skills.map((s: string) => s.trim()))].filter(Boolean);
    }

    // Don't allow changing sensitive fields through profile update
    delete body.password;
    delete body.role;

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: body },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

