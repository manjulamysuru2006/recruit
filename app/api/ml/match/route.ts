import { NextRequest, NextResponse } from 'next/server';
import { jobMatchingModel } from '@/lib/ml-models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateProfile, job } = body;

    if (!candidateProfile || !job) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract features
    const candidateFeatures = jobMatchingModel.extractCandidateFeatures(candidateProfile);
    const jobFeatures = jobMatchingModel.extractJobFeatures(job);

    // Calculate match score
    const matchScore = await jobMatchingModel.predictMatch(
      candidateFeatures,
      jobFeatures
    );

    // Analyze skill matching
    const candidateSkills = candidateProfile.skills || [];
    const requiredSkills = job.skills || [];
    
    const skillsMatch = requiredSkills.map((skill: string) => {
      const hasSkill = candidateSkills.some(
        (cs: string) => cs.toLowerCase() === skill.toLowerCase()
      );
      return {
        skill,
        score: hasSkill ? 100 : 0,
      };
    });

    const matchedSkillsCount = skillsMatch.filter((s: any) => s.score > 0).length;
    const skillMatchPercentage = requiredSkills.length > 0
      ? Math.round((matchedSkillsCount / requiredSkills.length) * 100)
      : 0;

    // Generate recommendations
    const recommendedActions = [];
    if (matchScore < 70) {
      recommendedActions.push('Consider acquiring additional required skills');
    }
    if (skillMatchPercentage < 50) {
      recommendedActions.push('Focus on developing key technical skills');
    }
    if (matchScore >= 80) {
      recommendedActions.push('Strong match! Consider applying immediately');
    }

    return NextResponse.json({
      matchScore,
      skillMatchPercentage,
      skillsMatch,
      recommendedActions,
      fitScore: matchScore,
      strengthScore: skillMatchPercentage,
    });
  } catch (error: any) {
    console.error('Match calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate match', details: error.message },
      { status: 500 }
    );
  }
}

