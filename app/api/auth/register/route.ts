import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { resumeAnalyzer } from '@/lib/ml-models';

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
          
          // Use AI Resume Analyzer to extract skills
          const analysis = resumeAnalyzer.analyzeResume(resumeText);
          
          // Extract skills from the analysis
          if (analysis.technicalSkills && analysis.technicalSkills.length > 0) {
            userData.candidateProfile.skills = [...new Set([
              ...analysis.technicalSkills,
              ...analysis.softSkills || []
            ])];
          }

          // Store resume text for later use
          userData.candidateProfile.resumeText = resumeText.substring(0, 10000); // Store first 10k chars
          userData.candidateProfile.resumeAnalysis = {
            score: analysis.score,
            technicalSkills: analysis.technicalSkills,
            softSkills: analysis.softSkills,
            strengths: analysis.strengths,
            keywords: analysis.keywords,
          };
        } catch (resumeError) {
          console.error('Resume processing error:', resumeError);
          // Continue registration even if resume processing fails
        }
      }
    }

    // Create user
    const user = await User.create(userData);

    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: user._id,
        skillsExtracted: userData.candidateProfile?.skills?.length || 0,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

