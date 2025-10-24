import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = { status: 'active' };

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

    const body = await request.json();
    
    // In production, extract userId from JWT token
    // For now, assuming userId is passed in body
    const job = await Job.create({
      ...body,
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
