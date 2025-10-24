import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // CRITICAL FIX: Verify user is authenticated
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    if (user.role !== 'recruiter') {
      return NextResponse.json(
        { error: 'Forbidden - Only recruiters can edit jobs' },
        { status: 403 }
      );
    }

    // CRITICAL FIX: Check job ownership
    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.recruiterId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      { ...body, recruiterId: user.userId }, // Prevent changing ownership
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // CRITICAL FIX: Verify user is authenticated
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    if (user.role !== 'recruiter') {
      return NextResponse.json(
        { error: 'Forbidden - Only recruiters can delete jobs' },
        { status: 403 }
      );
    }

    // CRITICAL FIX: Check job ownership
    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.recruiterId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden - You can only delete your own jobs' },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
