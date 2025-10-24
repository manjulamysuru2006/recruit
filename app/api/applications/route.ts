import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch applications for this user
    const applications = await Application.find({ 
      candidateId: decoded.userId 
    })
      .populate('jobId', 'title company location salary jobType')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      applications,
    });
  } catch (error: any) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobId, resume, coverLetter } = body;

    // Check if user has already applied to this job
    const existingApplication = await Application.findOne({
      jobId,
      candidateId: decoded.userId
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Get job details to find recruiter
    const Job = (await import('@/models/Job')).default;
    const job = await Job.findById(jobId);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Create application
    const application = await Application.create({
      jobId,
      candidateId: decoded.userId,
      recruiterId: job.recruiterId,
      status: 'applied',
      resume,
      coverLetter,
      timeline: [{
        status: 'applied',
        date: new Date(),
        note: 'Application submitted',
      }],
    });

    // Update job application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    return NextResponse.json({
      message: 'Application submitted successfully',
      application,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Application creation error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}
