import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
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

    jwt.verify(token, JWT_SECRET);
    await dbConnect();

    // Fetch all applications for this job
    const applications = await Application.find({ jobId: params.id })
      .populate('candidateId', 'email profile candidateProfile')
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
