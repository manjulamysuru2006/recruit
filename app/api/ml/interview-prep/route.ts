import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Application from '@/models/Application';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to generate interview questions from job description
function generateQuestionsFromJobDescription(
  jobTitle: string,
  jobDescription: string,
  requirements: string[],
  skills: string[]
): any[] {
  const questions: any[] = [];

  // Technical questions based on required skills
  skills.slice(0, 3).forEach((skill, index) => {
    questions.push({
      question: `Can you explain your experience with ${skill} and how you've applied it in your previous projects?`,
      category: 'Technical',
      difficulty: index === 0 ? 'medium' : 'easy'
    });
  });

  // Role-specific questions
  if (jobTitle.toLowerCase().includes('senior') || jobTitle.toLowerCase().includes('lead')) {
    questions.push({
      question: `Tell me about a time when you had to lead a team through a challenging project. How did you handle it?`,
      category: 'Leadership',
      difficulty: 'hard'
    });
  }

  if (jobTitle.toLowerCase().includes('developer') || jobTitle.toLowerCase().includes('engineer')) {
    questions.push({
      question: `Describe your approach to debugging a complex issue in production. Walk me through your process.`,
      category: 'Problem Solving',
      difficulty: 'medium'
    });
  }

  // Behavioral questions based on requirements
  if (requirements.length > 0) {
    const firstReq = requirements[0];
    questions.push({
      question: `This role requires ${firstReq.toLowerCase()}. Can you give an example of how you've demonstrated this in your career?`,
      category: 'Behavioral',
      difficulty: 'medium'
    });
  }

  // General questions
  questions.push({
    question: `Why are you interested in the ${jobTitle} position, and what makes you a good fit for this role?`,
    category: 'Motivation',
    difficulty: 'easy'
  });

  questions.push({
    question: `Tell me about a project you're most proud of and the impact it had.`,
    category: 'Experience',
    difficulty: 'easy'
  });

  // Advanced technical question
  if (skills.length > 0) {
    questions.push({
      question: `If you had to architect a new system using ${skills.slice(0, 2).join(' and ')}, how would you approach it? What considerations would you make?`,
      category: 'System Design',
      difficulty: 'hard'
    });
  }

  return questions.slice(0, 8);
}

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    await connectDB();

    // Get user's applications with job details (REAL DATABASE QUERY)
    const applications = await Application.find({ 
      candidateId: decoded.userId 
    })
      .populate('jobId')
      .sort({ appliedAt: -1 })
      .limit(1);

    if (applications.length === 0) {
      return NextResponse.json({
        questions: [],
        message: 'Apply to jobs to get personalized interview questions'
      });
    }

    const latestJob = applications[0].jobId as any;
    
    if (!latestJob) {
      return NextResponse.json({
        questions: [],
        message: 'Job details not found'
      });
    }

    // Generate REAL questions based on ACTUAL job data
    const questions = generateQuestionsFromJobDescription(
      latestJob.title,
      latestJob.description || '',
      latestJob.requirements || [],
      latestJob.skills || []
    );

    return NextResponse.json({
      questions,
      basedOnJob: {
        title: latestJob.title,
        company: latestJob.company
      }
    });

  } catch (error: any) {
    console.error('Interview prep error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ 
      error: 'Failed to generate interview questions',
      details: error.message 
    }, { status: 500 });
  }
}
