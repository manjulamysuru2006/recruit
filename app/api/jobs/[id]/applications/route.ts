import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import Job from '@/models/Job';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    await dbConnect();

    // CRITICAL FIX: Verify job ownership
    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // CRITICAL FIX: Only allow recruiter who owns the job to see applications
    if (decoded.role === 'recruiter' && job.recruiterId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view applications for your own jobs' },
        { status: 403 }
      );
    }

    // Fetch all applications for this job
    const applications = await Application.find({ jobId: params.id })
      .populate('candidateId', 'name email phone profile candidateProfile')
      .populate('jobId', 'title company')
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications });
  } catch (error: any) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: error.message },
      { status: 500 }
    );
  }
}
