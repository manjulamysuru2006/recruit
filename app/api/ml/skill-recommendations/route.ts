import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Job from '@/models/Job';
import Application from '@/models/Application';

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

    // Get user's current skills
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.candidateProfile) {
      return NextResponse.json({ 
        error: 'Profile not found' 
      }, { status: 404 });
    }

    const userSkills = (user.candidateProfile.skills || []).map((s: string) => s.toLowerCase());

    // Find jobs user has applied to or viewed (REAL DATABASE QUERY)
    const applications = await Application.find({ 
      candidateId: decoded.userId 
    }).populate('jobId');

    // Extract skills from these jobs
    const skillCounts = new Map<string, { count: number, jobIds: Set<string> }>();

    applications.forEach((app: any) => {
      if (app.jobId && app.jobId.skills) {
        app.jobId.skills.forEach((skill: string) => {
          const skillLower = skill.toLowerCase();
          
          // Only recommend skills user doesn't have
          if (!userSkills.includes(skillLower)) {
            if (!skillCounts.has(skill)) {
              skillCounts.set(skill, { count: 0, jobIds: new Set() });
            }
            const data = skillCounts.get(skill)!;
            data.count++;
            data.jobIds.add(app.jobId._id.toString());
          }
        });
      }
    });

    // Convert to array and calculate demand
    const recommendations = Array.from(skillCounts.entries())
      .map(([skill, data]) => ({
        skill,
        appearsInJobs: data.jobIds.size,
        demand: Math.round((data.count / applications.length) * 100),
        priority: data.jobIds.size >= 3 ? 'high' as const : 
                  data.jobIds.size >= 2 ? 'medium' as const : 'low' as const
      }))
      .sort((a, b) => b.appearsInJobs - a.appearsInJobs)
      .slice(0, 10);

    return NextResponse.json({
      recommendations,
      basedOnApplications: applications.length
    });

  } catch (error: any) {
    console.error('Skill recommendations error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ 
      error: 'Failed to get skill recommendations',
      details: error.message 
    }, { status: 500 });
  }
}
