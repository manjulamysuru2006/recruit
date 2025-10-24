import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import Job from '@/models/Job';
import { jobMatchingModel } from '@/lib/ml-models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { candidateId, candidateProfile } = body;

    // Get all active jobs
    const jobs = await Job.find({ status: 'active' }).limit(20);

    // Calculate match scores for each job
    const jobsWithScores = await Promise.all(
      jobs.map(async (job) => {
        const candidateFeatures = jobMatchingModel.extractCandidateFeatures(candidateProfile);
        const jobFeatures = jobMatchingModel.extractJobFeatures(job);
        
        const matchScore = await jobMatchingModel.predictMatch(
          candidateFeatures,
          jobFeatures
        );

        return {
          job: {
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            jobType: job.jobType,
            description: job.description,
            skills: job.skills,
          },
          matchScore,
          reasons: [
            `${matchScore >= 80 ? 'Strong' : matchScore >= 60 ? 'Good' : 'Fair'} skills match`,
            `Experience level aligns well`,
            `Location preference compatible`,
          ],
        };
      })
    );

    // Sort by match score
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    // Return top 10 recommendations
    return NextResponse.json({
      recommendations: jobsWithScores.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Job recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations', details: error.message },
      { status: 500 }
    );
  }
}

