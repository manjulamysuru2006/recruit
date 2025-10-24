import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import InterviewPipeline from '@/models/InterviewPipeline';
import Application from '@/models/Application';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET - Fetch all candidates in interview pipeline
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    const query: any = { recruiterId: decoded.userId };
    if (jobId) query.jobId = jobId;

    const pipelines = await InterviewPipeline.find(query)
      .populate('candidateId', 'name email phone skills')
      .populate('jobId', 'title company')
      .sort({ createdAt: -1 });

    return NextResponse.json({ pipelines });
  } catch (error: any) {
    console.error('Error fetching pipelines:', error);
    return NextResponse.json({ error: 'Failed to fetch pipelines' }, { status: 500 });
  }
}

// POST - Create or move candidate to next stage
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await dbConnect();

    const body = await request.json();
    const { applicationId, action, stageData } = body;

    // Fetch application
    const application = await Application.findById(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check if pipeline already exists
    let pipeline = await InterviewPipeline.findOne({ applicationId });

    if (action === 'initiate') {
      // Create new pipeline
      if (pipeline) {
        return NextResponse.json({ error: 'Pipeline already exists' }, { status: 400 });
      }

      const stages = [
        { name: 'Resume Screening', status: 'completed' },
        { name: 'Phone Screen', status: 'pending' },
        { name: 'Technical Round 1', status: 'pending' },
        { name: 'Technical Round 2', status: 'pending' },
        { name: 'HR Round', status: 'pending' },
        { name: 'Final Round', status: 'pending' },
      ];

      pipeline = await InterviewPipeline.create({
        applicationId,
        jobId: application.jobId,
        candidateId: application.candidateId,
        recruiterId: decoded.userId,
        currentStage: 'phone_screen',
        stages,
        resumeScore: body.resumeScore || 0,
      });

      // Update application status
      await Application.findByIdAndUpdate(applicationId, {
        status: 'shortlisted',
      });

      return NextResponse.json({ pipeline, message: 'Candidate moved to interview pipeline' });
    }

    if (action === 'move_to_next') {
      if (!pipeline) {
        return NextResponse.json({ error: 'Pipeline not found' }, { status: 404 });
      }

      // Update current stage
      const stageIndex = pipeline.stages.findIndex((s: any) => s.status === 'pending' || s.status === 'scheduled');
      if (stageIndex !== -1) {
        pipeline.stages[stageIndex].status = 'passed';
        pipeline.stages[stageIndex].completedDate = new Date();
        if (stageData) {
          pipeline.stages[stageIndex].feedback = stageData.feedback;
          pipeline.stages[stageIndex].rating = stageData.rating;
        }

        // Move to next stage
        if (stageIndex + 1 < pipeline.stages.length) {
          pipeline.currentStage = pipeline.stages[stageIndex + 1].name.toLowerCase().replace(/\s+/g, '_');
        } else {
          pipeline.currentStage = 'final_round';
        }
      }

      await pipeline.save();
      await Application.findByIdAndUpdate(applicationId, {
        status: 'interview',
      });

      return NextResponse.json({ pipeline, message: 'Candidate moved to next stage' });
    }

    if (action === 'reject') {
      if (!pipeline) {
        return NextResponse.json({ error: 'Pipeline not found' }, { status: 404 });
      }

      pipeline.status = 'rejected';
      pipeline.currentStage = 'rejected';
      await pipeline.save();

      await Application.findByIdAndUpdate(applicationId, {
        status: 'rejected',
      });

      return NextResponse.json({ pipeline, message: 'Candidate rejected' });
    }

    if (action === 'hire') {
      if (!pipeline) {
        return NextResponse.json({ error: 'Pipeline not found' }, { status: 404 });
      }

      pipeline.status = 'hired';
      pipeline.currentStage = 'hired';
      await pipeline.save();

      await Application.findByIdAndUpdate(applicationId, {
        status: 'offered',
      });

      return NextResponse.json({ pipeline, message: 'Candidate hired!' });
    }

    if (action === 'add_note') {
      if (!pipeline) {
        return NextResponse.json({ error: 'Pipeline not found' }, { status: 404 });
      }

      pipeline.notes.push({
        author: decoded.userId,
        content: body.note,
        createdAt: new Date(),
      });

      await pipeline.save();
      return NextResponse.json({ pipeline, message: 'Note added' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error managing pipeline:', error);
    return NextResponse.json({ error: 'Failed to manage pipeline' }, { status: 500 });
  }
}
