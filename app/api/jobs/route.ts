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
    
    // Validate required fields
    if (!body.title || !body.company || !body.description) {
      return NextResponse.json(
        { error: 'Title, company, and description are required' },
        { status: 400 }
      );
    }

    // Validate salary range
    if (body.salary) {
      const minSalary = parseInt(body.salary.min) || 0;
      const maxSalary = parseInt(body.salary.max) || 0;
      
      if (minSalary < 0 || maxSalary < 0) {
        return NextResponse.json(
          { error: 'Salary values cannot be negative' },
          { status: 400 }
        );
      }
      
      if (maxSalary > 0 && minSalary > maxSalary) {
        return NextResponse.json(
          { error: 'Minimum salary cannot be greater than maximum salary' },
          { status: 400 }
        );
      }
    }

    // Remove duplicate skills
    if (body.skills && Array.isArray(body.skills)) {
      body.skills = [...new Set(body.skills.map((s: string) => s.trim()))].filter(Boolean);
    }

    // Remove duplicate requirements
    if (body.requirements && Array.isArray(body.requirements)) {
      body.requirements = [...new Set(body.requirements.map((r: string) => r.trim()))].filter(Boolean);
    }

    // Remove duplicate responsibilities
    if (body.responsibilities && Array.isArray(body.responsibilities)) {
      body.responsibilities = [...new Set(body.responsibilities.map((r: string) => r.trim()))].filter(Boolean);
    }

    // Validate deadline is in the future
    if (body.deadline && new Date(body.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Application deadline must be in the future' },
        { status: 400 }
      );
    }
    
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

