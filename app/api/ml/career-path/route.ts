import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Job from '@/models/Job';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    await connectDB();

    // Get user profile
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.candidateProfile) {
      return NextResponse.json({ 
        error: 'Profile not found' 
      }, { status: 404 });
    }

    const userSkills = user.candidateProfile.skills || [];

    // Find real jobs at different experience levels (REAL DATABASE QUERY)
    const [entryJobs, midJobs, seniorJobs] = await Promise.all([
      Job.find({ 
        status: 'active',
        experienceLevel: 'entry',
        skills: { $in: userSkills }
      }).limit(2).select('title company experienceLevel skills salary'),
      
      Job.find({ 
        status: 'active',
        experienceLevel: 'mid',
        skills: { $in: userSkills }
      }).limit(2).select('title company experienceLevel skills salary'),
      
      Job.find({ 
        status: 'active',
        experienceLevel: 'senior',
        skills: { $in: userSkills }
      }).limit(2).select('title company experienceLevel skills salary')
    ]);

    // Build career path from REAL jobs
    const careerPath = [
      ...entryJobs.map(job => ({
        title: job.title,
        company: job.company,
        experienceLevel: 'Entry Level',
        requiredSkills: job.skills || [],
        salary: job.salary || { min: 40000, max: 60000 }
      })),
      ...midJobs.map(job => ({
        title: job.title,
        company: job.company,
        experienceLevel: 'Mid Level',
        requiredSkills: job.skills || [],
        salary: job.salary || { min: 60000, max: 90000 }
      })),
      ...seniorJobs.map(job => ({
        title: job.title,
        company: job.company,
        experienceLevel: 'Senior Level',
        requiredSkills: job.skills || [],
        salary: job.salary || { min: 90000, max: 130000 }
      }))
    ];

    return NextResponse.json({
      careerPath,
      totalJobs: careerPath.length
    });

  } catch (error: any) {
    console.error('Career path error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ 
      error: 'Failed to get career path',
      details: error.message 
    }, { status: 500 });
  }
}
