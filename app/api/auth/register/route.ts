import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Job from '@/models/Job';
import { calculateRealJobMatch } from '@/lib/real-matching';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const company = formData.get('company') as string;
    const position = formData.get('position') as string;
    const resumeFile = formData.get('resume') as File | null;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data
    const userData: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      name: `${firstName} ${lastName}`,
      profile: {
        firstName,
        lastName,
        phone,
      },
    };

    // Add role-specific data
    if (role === 'recruiter') {
      userData.recruiterProfile = {
        company,
        position,
        verified: false,
      };
    } else {
      // Initialize candidate profile
      userData.candidateProfile = {
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        preferences: {},
      };

      // Process resume if provided
      if (resumeFile) {
        try {
          const resumeText = await resumeFile.text();
          
          // Extract skills from resume (simple keyword extraction)
          const extractedSkills = extractSkillsFromResume(resumeText);
          userData.candidateProfile.skills = extractedSkills;
          
          // Store resume text for REAL matching
          userData.candidateProfile.resumeText = resumeText;
          
          console.log(`✅ Extracted ${extractedSkills.length} skills from resume`);
          
          // REAL JOB MATCHING: Compare with ALL active jobs
          const activeJobs = await Job.find({ status: 'active' }).limit(50);
          
          if (activeJobs.length > 0) {
            const jobMatches: any[] = [];
            
            for (const job of activeJobs) {
              // Use REAL matching function
              const matchResult = calculateRealJobMatch(resumeText, extractedSkills, job);
              
              // Only store jobs with some match
              if (matchResult.matchScore > 0) {
                jobMatches.push({
                  jobId: job._id,
                  jobTitle: job.title,
                  company: job.company,
                  matchScore: matchResult.matchScore,
                  matchedSkills: matchResult.matchedSkills,
                  missingSkills: matchResult.missingSkills,
                  experienceMatch: matchResult.experienceMatch,
                  calculatedAt: new Date()
                });
              }
            }
            
            // Sort by match score and take top 10
            const topMatches = jobMatches
              .sort((a, b) => b.matchScore - a.matchScore)
              .slice(0, 10);
            
            userData.candidateProfile.topMatchingJobs = topMatches;
            
            console.log(`✅ Found ${topMatches.length} matching jobs for candidate`);
            console.log(`Top match: ${topMatches[0]?.jobTitle} - ${topMatches[0]?.matchScore}%`);
          }
          
        } catch (resumeError) {
          console.error('❌ Resume processing error:', resumeError);
          // Continue registration even if resume processing fails
        }
      }
    }

    // Create user
    const user = await User.create(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        message: 'User created successfully',
        token,
        userId: user._id,
        skillsExtracted: userData.candidateProfile?.skills?.length || 0,
        matchingJobs: userData.candidateProfile?.topMatchingJobs?.length || 0,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

// Simple skill extraction function
function extractSkillsFromResume(text: string): string[] {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask', 'spring',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform',
    'git', 'github', 'gitlab', 'agile', 'scrum', 'rest api', 'graphql',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'data analysis',
  ];
  
  const lowerText = text.toLowerCase();
  const foundSkills: string[] = [];
  
  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }
  
  return [...new Set(foundSkills)]; // Remove duplicates
}

