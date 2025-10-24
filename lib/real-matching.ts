// REAL job matching - compares actual resume with actual job requirements
// No ML models, no mock data - just direct comparison!

interface JobMatchResult {
  matchScore: number; // 0-100 percentage
  matchedSkills: string[];
  missingSkills: string[];
  matchedRequirements: string[];
  missingRequirements: string[];
  experienceMatch: boolean;
  suggestions: string[];
}

/**
 * Calculate REAL match between candidate's resume and a specific job
 * @param resumeText - The actual resume text from candidate
 * @param candidateSkills - Skills extracted from resume
 * @param job - The actual job document from database
 * @returns Real match analysis with specific missing skills
 */
export function calculateRealJobMatch(
  resumeText: string,
  candidateSkills: string[],
  job: any
): JobMatchResult {
  const resumeLower = resumeText.toLowerCase();
  const jobSkills = job.skills || [];
  const jobRequirements = job.requirements || [];
  
  // 1. Compare SKILLS (60% weight)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  
  for (const skill of jobSkills) {
    const skillLower = skill.toLowerCase();
    // Check if skill is in resume text OR in extracted skills
    const inResume = resumeLower.includes(skillLower);
    const inSkills = candidateSkills.some(cs => cs.toLowerCase().includes(skillLower) || skillLower.includes(cs.toLowerCase()));
    
    if (inResume || inSkills) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }
  
  const skillsScore = jobSkills.length > 0 
    ? (matchedSkills.length / jobSkills.length) * 60 
    : 0;
  
  // 2. Compare REQUIREMENTS (30% weight)
  const matchedRequirements: string[] = [];
  const missingRequirements: string[] = [];
  
  for (const req of jobRequirements) {
    if (resumeLower.includes(req.toLowerCase())) {
      matchedRequirements.push(req);
    } else {
      missingRequirements.push(req);
    }
  }
  
  const requirementsScore = jobRequirements.length > 0
    ? (matchedRequirements.length / jobRequirements.length) * 30
    : 0;
  
  // 3. Compare EXPERIENCE LEVEL (10% weight)
  let experienceScore = 0;
  let experienceMatch = false;
  
  const experienceLevel = job.experienceLevel?.toLowerCase() || '';
  
  // Extract years of experience from resume
  const yearsMatch = resumeText.match(/(\d+)\+?\s*(years?|yrs?)/gi);
  let maxYears = 0;
  if (yearsMatch) {
    yearsMatch.forEach(match => {
      const num = parseInt(match.match(/\d+/)?.[0] || '0');
      maxYears = Math.max(maxYears, num);
    });
  }
  
  if (experienceLevel.includes('entry') || experienceLevel.includes('junior')) {
    experienceMatch = maxYears >= 0;
    experienceScore = 10;
  } else if (experienceLevel.includes('mid') || experienceLevel.includes('intermediate')) {
    experienceMatch = maxYears >= 2;
    experienceScore = maxYears >= 2 ? 10 : 5;
  } else if (experienceLevel.includes('senior')) {
    experienceMatch = maxYears >= 5;
    experienceScore = maxYears >= 5 ? 10 : maxYears >= 3 ? 7 : 3;
  } else if (experienceLevel.includes('lead') || experienceLevel.includes('principal')) {
    experienceMatch = maxYears >= 8;
    experienceScore = maxYears >= 8 ? 10 : maxYears >= 5 ? 5 : 2;
  } else {
    experienceScore = 5; // Default if no level specified
    experienceMatch = true;
  }
  
  // Calculate total score
  const totalScore = Math.round(skillsScore + requirementsScore + experienceScore);
  
  // Generate SPECIFIC suggestions based on what's missing
  const suggestions: string[] = [];
  
  if (missingSkills.length > 0) {
    suggestions.push(`Add these skills to your resume: ${missingSkills.slice(0, 5).join(', ')}`);
  }
  
  if (missingSkills.length > 5) {
    suggestions.push(`Learn ${missingSkills.length - 5} more required skills for better match`);
  }
  
  if (!experienceMatch) {
    if (experienceLevel.includes('senior')) {
      suggestions.push(`This role requires 5+ years of experience. Highlight your experience more prominently.`);
    } else if (experienceLevel.includes('mid')) {
      suggestions.push(`This role requires 2-5 years of experience. Emphasize your relevant projects.`);
    }
  }
  
  if (missingRequirements.length > 0 && missingRequirements.length <= 3) {
    suggestions.push(`Include keywords: ${missingRequirements.join(', ')}`);
  }
  
  if (matchedSkills.length > 0 && totalScore < 50) {
    suggestions.push(`You have ${matchedSkills.length} matching skills - highlight them more prominently in your resume.`);
  }
  
  if (totalScore >= 70) {
    suggestions.push(`Great match! Your profile aligns well with this role.`);
  } else if (totalScore >= 50) {
    suggestions.push(`Good match. Consider adding the missing skills to strengthen your application.`);
  } else if (totalScore >= 30) {
    suggestions.push(`Partial match. Focus on developing the missing skills for better chances.`);
  } else {
    suggestions.push(`Low match. This role may require skills outside your current expertise.`);
  }
  
  return {
    matchScore: Math.min(totalScore, 100),
    matchedSkills,
    missingSkills,
    matchedRequirements,
    missingRequirements,
    experienceMatch,
    suggestions,
  };
}

/**
 * Compare resume with job description (for ATS scanner)
 * @param resumeText - Candidate's resume text
 * @param jobDescription - Job description text
 * @param jobSkills - Required skills for the job
 * @param jobRequirements - Job requirements
 * @returns Match analysis
 */
export function compareResumeWithJobDescription(
  resumeText: string,
  jobDescription: string,
  jobSkills: string[],
  jobRequirements: string[]
): JobMatchResult {
  // Create a fake job object for the existing function
  const fakeJob = {
    skills: jobSkills,
    requirements: jobRequirements,
    description: jobDescription,
    experienceLevel: '', // Extract from description if possible
  };
  
  // Extract candidate skills from resume (simple keyword extraction)
  const candidateSkills = extractSkillsFromResume(resumeText);
  
  return calculateRealJobMatch(resumeText, candidateSkills, fakeJob);
}

/**
 * Simple skill extraction from resume text
 */
function extractSkillsFromResume(text: string): string[] {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'react', 'node.js', 'angular', 'vue',
    'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes',
    'html', 'css', 'git', 'agile', 'scrum', 'rest api', 'graphql',
  ];
  
  const lowerText = text.toLowerCase();
  return commonSkills.filter(skill => lowerText.includes(skill));
}
