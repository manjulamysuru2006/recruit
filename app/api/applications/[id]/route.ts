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

    const application = await Application.findById(params.id)
      .populate('candidateId', 'email profile candidateProfile')
      .populate('jobId', 'title company location salary')
      .populate('recruiterId', 'profile recruiterProfile');

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error: any) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await dbConnect();

    const body = await request.json();
    const { status, notes } = body;

    const application = await Application.findById(params.id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Update status
    if (status) {
      application.status = status;
      application.timeline.push({
        status,
        date: new Date(),
        note: `Status changed to ${status}`,
      });
    }

    // Add notes if provided
    if (notes) {
      application.notes.push({
        author: decoded.userId,
        content: notes,
        createdAt: new Date(),
      });
    }

    application.updatedAt = new Date();
    await application.save();

    return NextResponse.json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error: any) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application', details: error.message },
      { status: 500 }
    );
  }
}
