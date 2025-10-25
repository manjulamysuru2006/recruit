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

    // Get user profile with skills
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.candidateProfile) {
      return NextResponse.json({ 
        error: 'Candidate profile not found. Please complete your profile first.' 
      }, { status: 404 });
    }

    const userSkills = user.candidateProfile.skills || [];
    
    if (userSkills.length === 0) {
      return NextResponse.json({
        error: 'No skills found in your profile. Upload your resume to extract skills.'
      }, { status: 400 });
    }

    // Query jobs that match user's skills (REAL DATABASE QUERY)
    const matchingJobs = await Job.find({
      status: 'active',
      skills: { $in: userSkills }
    }).select('salary title company skills');

    if (matchingJobs.length === 0) {
      return NextResponse.json({
        predictedSalary: 50000,
        minRange: 40000,
        maxRange: 60000,
        confidence: 0.3,
        basedOnJobs: 0,
        message: 'No matching jobs found. Showing estimated range.'
      });
    }

    // Calculate REAL salary prediction
    let totalMin = 0;
    let totalMax = 0;
    let count = 0;

    matchingJobs.forEach(job => {
      if (job.salary && job.salary.min && job.salary.max) {
        totalMin += job.salary.min;
        totalMax += job.salary.max;
        count++;
      }
    });

    if (count === 0) {
      return NextResponse.json({
        predictedSalary: 55000,
        minRange: 45000,
        maxRange: 65000,
        confidence: 0.4,
        basedOnJobs: matchingJobs.length,
        message: 'Jobs found but no salary data available.'
      });
    }

    const avgMin = Math.round(totalMin / count);
    const avgMax = Math.round(totalMax / count);
    const predictedSalary = Math.round((avgMin + avgMax) / 2);

    // Confidence score based on sample size
    const confidence = Math.min(0.9, 0.5 + (count / 100));

    return NextResponse.json({
      predictedSalary,
      minRange: avgMin,
      maxRange: avgMax,
      confidence: Math.round(confidence * 100) / 100,
      basedOnJobs: count
    });

  } catch (error: any) {
    console.error('Salary prediction error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ 
      error: 'Failed to predict salary',
      details: error.message 
    }, { status: 500 });
  }
}
