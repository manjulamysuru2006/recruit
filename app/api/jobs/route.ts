import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT and get user
function getUserFromToken(request: NextRequest): { userId: string; role: string } | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const user = getUserFromToken(request);
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = { status: 'active' };

    // CRITICAL FIX: If user is a recruiter, only show THEIR jobs
    if (user && user.role === 'recruiter') {
      query.recruiterId = user.userId;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query['location.city'] = new RegExp(location, 'i');
    }

    if (type) {
      query.jobType = type;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('recruiterId', 'profile recruiterProfile');

    const total = await Job.countDocuments(query);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // CRITICAL FIX: Verify user is authenticated and is a recruiter
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    if (user.role !== 'recruiter') {
      return NextResponse.json(
        { error: 'Forbidden - Only recruiters can post jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // CRITICAL FIX: Always use the authenticated user's ID as recruiterId
    const job = await Job.create({
      ...body,
      recruiterId: user.userId, // Force use of authenticated user's ID
      status: 'active',
      applicationsCount: 0,
      viewsCount: 0,
    });

    return NextResponse.json({
      message: 'Job created successfully',
      job,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create job', details: error.message },
      { status: 500 }
    );
  }
}

