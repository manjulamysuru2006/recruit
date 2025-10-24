import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// REAL ATS analysis comparing resume with ACTUAL job requirements
async function analyzeResumeForJob(resumeText: string, jobId?: string) {
  const text = resumeText.toLowerCase();
  const words = text.split(/\s+/);
  const wordCount = words.length;

  // Enhanced Technical Skills Detection with word boundaries
  const technicalSkills = {
    programming: [
      'javascript', 'python', 'java', 'c\\+\\+', 'c\\#', 'typescript', 'ruby', 'php', 
      'swift', 'kotlin', 'go', 'rust', 'scala', 'perl', 'r\\b', 'matlab', 'c\\b'
    ],
    frameworks: [
      'react', 'reactjs', 'react.js', 'angular', 'vue', 'vuejs', 'vue.js', 
      'node.js', 'nodejs', 'express', 'expressjs', 'django', 'flask', 'spring', 
      'springboot', 'laravel', '\\.net', 'next.js', 'nextjs', 'nuxt'
    ],
    databases: [
      'sql', 'mongodb', 'postgresql', 'postgres', 'mysql', 'redis', 'oracle', 
      'dynamodb', 'cassandra', 'elasticsearch', 'firebase', 'sqlite', 'mariadb'
    ],
    cloud: [
      'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud', 
      'docker', 'kubernetes', 'k8s', 'terraform', 'jenkins', 'ci/cd', 'heroku', 'vercel'
    ],
    tools: [
      'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'agile', 'scrum', 
      'rest api', 'restful', 'graphql', 'microservices', 'webpack', 'babel', 'npm', 'yarn'
    ],
    aiml: [
      'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 
      'scikit-learn', 'nlp', 'natural language processing', 'computer vision', 
      'artificial intelligence', 'neural networks', 'cnn', 'rnn', 'lstm'
    ],
    data: [
      'data science', 'data analysis', 'data analytics', 'pandas', 'numpy', 
      'matplotlib', 'tableau', 'power bi', 'excel', 'statistics', 'big data', 
      'hadoop', 'spark', 'jupyter'
    ],
    mobile: [
      'ios', 'android', 'react native', 'flutter', 'xamarin', 'mobile development'
    ],
    web: [
      'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'tailwind', 
      'bootstrap', 'jquery', 'ajax', 'responsive design'
    ]
  };

  // More precise skill detection using word boundaries
  const foundSkills: string[] = [];
  const foundSkillsSet = new Set<string>();
  
  Object.values(technicalSkills).flat().forEach(skillPattern => {
    // Create regex with word boundaries for more accurate matching
    const regex = new RegExp(`\\b${skillPattern}\\b`, 'gi');
    if (regex.test(text)) {
      // Normalize the skill name for display
      let skillName = skillPattern.replace(/\\b|\\+/g, '').trim();
      
      // Capitalize properly
      if (skillName === 'c++') skillName = 'C++';
      else if (skillName === 'c#') skillName = 'C#';
      else if (skillName === 'c') skillName = 'C';
      else if (skillName === 'r') skillName = 'R';
      else if (skillName.includes('.')) {
        // Handle .NET, node.js, etc.
        skillName = skillName.split('.').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join('.');
      } else if (skillName.includes(' ')) {
        // Capitalize each word
        skillName = skillName.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      } else {
        skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
      }
      
      // Avoid duplicates
      if (!foundSkillsSet.has(skillName.toLowerCase())) {
        foundSkills.push(skillName);
        foundSkillsSet.add(skillName.toLowerCase());
      }
    }
  });

  // Experience Detection
  const experiencePatterns = [
    /(\d+)\+?\s*years?/gi,
    /(\d+)\+?\s*yrs?/gi,
    /(\d{4})\s*-\s*(\d{4}|present)/gi
  ];
  
  let totalYearsExperience = 0;
  experiencePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const years = match.match(/\d+/);
        if (years) totalYearsExperience = Math.max(totalYearsExperience, parseInt(years[0]));
      });
    }
  });

  // Education Detection
  const educationKeywords = ['bachelor', 'master', 'phd', 'mba', 'b.tech', 'm.tech', 'b.s', 'm.s', 'degree', 'university', 'college'];
  const hasEducation = educationKeywords.some(keyword => text.includes(keyword));

  // Contact Information
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /(\+\d{1,3}[- ]?)?\d{10}|\(\d{3}\)\s*\d{3}[- ]?\d{4}/i.test(text);

  // Action Verbs (Strong vs Weak)
  const strongVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'designed', 'architected', 'optimized', 'improved', 'achieved', 'increased', 'reduced'];
  const weakVerbs = ['responsible for', 'worked on', 'helped with', 'assisted', 'participated'];
  
  const strongVerbCount = strongVerbs.filter(verb => text.includes(verb)).length;
  const weakVerbCount = weakVerbs.filter(verb => text.includes(verb)).length;

  // Quantifiable Achievements
  const hasMetrics = /\d+%|\$\d+|increased by|reduced by|improved by/gi.test(text);

  // Calculate Scores
  let score = 0;
  const feedback: any[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Skills Score (30%)
  const skillScore = Math.min((foundSkills.length / 10) * 30, 30);
  score += skillScore;
  if (foundSkills.length >= 8) {
    strengths.push(`Excellent technical skills coverage (${foundSkills.length} skills found)`);
  } else if (foundSkills.length < 5) {
    improvements.push('Add more relevant technical skills to your resume');
    feedback.push({
      category: 'Skills',
      severity: 'high',
      message: 'Add more technical skills relevant to your field',
      suggestion: 'Include programming languages, frameworks, tools, and technologies you have worked with'
    });
  }

  // Experience Score (25%)
  let experienceScore = 0;
  if (totalYearsExperience >= 5) experienceScore = 25;
  else if (totalYearsExperience >= 3) experienceScore = 20;
  else if (totalYearsExperience >= 1) experienceScore = 15;
  else experienceScore = 10;
  score += experienceScore;

  if (totalYearsExperience >= 3) {
    strengths.push(`Strong work experience (${totalYearsExperience}+ years)`);
  }

  // Education Score (15%)
  const educationScore = hasEducation ? 15 : 5;
  score += educationScore;
  if (!hasEducation) {
    improvements.push('Add your educational qualifications');
    feedback.push({
      category: 'Education',
      severity: 'medium',
      message: 'Education section is missing or unclear',
      suggestion: 'Add your degree, major, university, and graduation year'
    });
  }

  // Contact Score (10%)
  const contactScore = (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0);
  score += contactScore;
  if (!hasEmail || !hasPhone) {
    improvements.push('Ensure contact information is complete');
    feedback.push({
      category: 'Contact Info',
      severity: 'high',
      message: 'Missing contact information',
      suggestion: 'Add both email and phone number at the top of your resume'
    });
  }

  // Action Verbs Score (10%)
  const verbScore = Math.min(strongVerbCount * 2, 10);
  score += verbScore;
  if (weakVerbCount > strongVerbCount) {
    improvements.push('Replace weak phrases with strong action verbs');
    feedback.push({
      category: 'Language',
      severity: 'medium',
      message: 'Use stronger action verbs',
      suggestion: 'Replace phrases like "responsible for" with strong verbs like "Led", "Developed", "Implemented"'
    });
  } else {
    strengths.push('Good use of action verbs');
  }

  // Metrics Score (10%)
  const metricsScore = hasMetrics ? 10 : 0;
  score += metricsScore;
  if (!hasMetrics) {
    improvements.push('Add quantifiable achievements and metrics');
    feedback.push({
      category: 'Achievements',
      severity: 'high',
      message: 'Lack of quantifiable achievements',
      suggestion: 'Add specific numbers, percentages, or metrics to demonstrate impact (e.g., "Increased performance by 40%")'
    });
  } else {
    strengths.push('Includes quantifiable achievements');
  }

  // Additional checks
  if (wordCount < 200) {
    improvements.push('Resume is too short - aim for 400-800 words');
    feedback.push({
      category: 'Length',
      severity: 'medium',
      message: 'Resume is too brief',
      suggestion: 'Expand on your experiences and achievements. Aim for a 1-2 page resume.'
    });
    score -= 5;
  } else if (wordCount > 1500) {
    improvements.push('Resume is too long - be more concise');
    feedback.push({
      category: 'Length',
      severity: 'low',
      message: 'Resume might be too lengthy',
      suggestion: 'Keep your resume concise. Focus on most relevant and recent experiences.'
    });
  } else {
    strengths.push('Good resume length');
  }

  // Check for common mistakes
  if (text.includes('i ') || text.includes(' i ')) {
    feedback.push({
      category: 'Style',
      severity: 'low',
      message: 'Avoid first-person pronouns',
      suggestion: 'Remove "I", "me", "my" from your resume. Use action verbs directly.'
    });
  }

  // Job matching (if job description provided)
  let matchScore = 0;
  if (jobDescription) {
    const jobText = jobDescription.toLowerCase();
    const jobKeywords = jobText.split(/\s+/).filter((word: string) => word.length > 4);
    const matchingKeywords = jobKeywords.filter((keyword: string) => text.includes(keyword));
    matchScore = Math.round((matchingKeywords.length / jobKeywords.length) * 100);
  }

  return {
    overallScore: Math.min(Math.round(score), 100),
    breakdown: {
      skills: Math.round(skillScore),
      experience: experienceScore,
      education: educationScore,
      contact: contactScore,
      language: verbScore,
      achievements: metricsScore,
    },
    foundSkills,
    yearsOfExperience: totalYearsExperience,
    strengths,
    improvements,
    feedback,
    wordCount,
    matchScore,
    atsCompatibility: score > 70 ? 'Excellent' : score > 50 ? 'Good' : score > 30 ? 'Fair' : 'Needs Improvement',
  };
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    jwt.verify(token, JWT_SECRET);
    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;
    const jobSkills = formData.get('jobSkills') as string;
    const jobRequirements = formData.get('jobRequirements') as string;
    const jobId = formData.get('jobId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }

    // MANDATORY: Job description and skills are required!
    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Job Description is REQUIRED and must be at least 50 characters. We need it to compare your resume accurately.' 
      }, { status: 400 });
    }

    if (!jobSkills || jobSkills.trim().length < 5) {
      return NextResponse.json({ 
        error: 'Required Skills are REQUIRED. Please list the skills needed for this job (comma-separated).' 
      }, { status: 400 });
    }

    // Extract resume text
    let resumeText = '';
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      resumeText = await file.text();
    } else {
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      resumeText = decoder.decode(buffer);
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Could not extract text from resume or resume is too short. Please upload a TXT file or paste resume text.',
      }, { status: 400 });
    }

    // Parse job skills from comma-separated string
    const requiredSkills = jobSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const requirements = jobRequirements ? jobRequirements.split('\n').map(r => r.trim()).filter(r => r.length > 0) : [];

    // REAL COMPLEX ANALYSIS: Compare resume with THIS specific job
    const analysis = performDeepJobComparison(resumeText, jobDescription, requiredSkills, requirements);

    return NextResponse.json({
      success: true,
      analysis,
      message: `Deep analysis complete! Compared your resume against the specific job requirements.`,
    });

  } catch (error: any) {
    console.error('❌ ATS analysis error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze resume', 
      details: error.message 
    }, { status: 500 });
  }
}

// REAL COMPLEX COMPARISON FUNCTION
function performDeepJobComparison(
  resumeText: string,
  jobDescription: string,
  requiredSkills: string[],
  requirements: string[]
) {
  const resumeLower = resumeText.toLowerCase();
  const jobDescLower = jobDescription.toLowerCase();
  
  // 1. SKILLS ANALYSIS (40 points)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  
  for (const skill of requiredSkills) {
    const skillLower = skill.toLowerCase();
    if (resumeLower.includes(skillLower)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }
  
  const skillsScore = requiredSkills.length > 0 
    ? (matchedSkills.length / requiredSkills.length) * 40 
    : 0;
  
  // 2. KEYWORDS FROM JOB DESCRIPTION (25 points)
  const jobKeywords = extractImportantKeywords(jobDescription);
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  
  for (const keyword of jobKeywords) {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }
  
  const keywordScore = jobKeywords.length > 0
    ? (matchedKeywords.length / jobKeywords.length) * 25
    : 0;
  
  // 3. REQUIREMENTS MATCH (20 points)
  const matchedRequirements: string[] = [];
  const missingRequirements: string[] = [];
  
  for (const req of requirements) {
    const reqLower = req.toLowerCase();
    // Check if requirement keywords are in resume
    const reqWords = reqLower.split(' ').filter(w => w.length > 3);
    const matchCount = reqWords.filter(w => resumeLower.includes(w)).length;
    
    if (matchCount > reqWords.length / 2) {
      matchedRequirements.push(req);
    } else {
      missingRequirements.push(req);
    }
  }
  
  const requirementScore = requirements.length > 0
    ? (matchedRequirements.length / requirements.length) * 20
    : 10;
  
  // 4. EXPERIENCE INDICATORS (10 points)
  let experienceScore = 0;
  const yearsMatch = resumeText.match(/(\d+)\+?\s*(years?|yrs?)/gi);
  if (yearsMatch) {
    const maxYears = Math.max(...yearsMatch.map(m => parseInt(m.match(/\d+/)?.[0] || '0')));
    if (maxYears >= 5) experienceScore = 10;
    else if (maxYears >= 3) experienceScore = 7;
    else if (maxYears >= 1) experienceScore = 5;
    else experienceScore = 3;
  }
  
  // 5. RESUME QUALITY (5 points)
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText);
  const hasPhone = /(\+\d{1,3}[- ]?)?\d{10}|\(\d{3}\)\s*\d{3}[- ]?\d{4}/i.test(resumeText);
  const qualityScore = (hasEmail ? 2.5 : 0) + (hasPhone ? 2.5 : 0);
  
  // Calculate total score
  const totalScore = Math.round(skillsScore + keywordScore + requirementScore + experienceScore + qualityScore);
  
  // Generate SPECIFIC suggestions
  const suggestions: string[] = [];
  
  if (missingSkills.length > 0) {
    suggestions.push(`🔴 CRITICAL: Add these required skills to your resume: ${missingSkills.slice(0, 5).join(', ')}`);
  }
  
  if (missingSkills.length > 5) {
    suggestions.push(`⚠️ You're missing ${missingSkills.length} out of ${requiredSkills.length} required skills`);
  }
  
  if (missingKeywords.length > 0) {
    suggestions.push(`📝 Include these keywords from job description: ${missingKeywords.slice(0, 3).join(', ')}`);
  }
  
  if (missingRequirements.length > 0 && missingRequirements.length <= 3) {
    suggestions.push(`📋 Address these requirements: ${missingRequirements.join('; ')}`);
  }
  
  if (matchedSkills.length > 0) {
    suggestions.push(`✅ GOOD: You have ${matchedSkills.length}/${requiredSkills.length} required skills: ${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? '...' : ''}`);
  }
  
  if (totalScore < 50) {
    suggestions.push(`⚠️ LOW MATCH: Your resume doesn't align well with this specific job. Consider targeting roles that match your current skills better.`);
  } else if (totalScore < 70) {
    suggestions.push(`📈 MODERATE MATCH: You have some relevant skills. Highlight your ${matchedSkills.slice(0, 2).join(' and ')} experience more prominently.`);
  } else {
    suggestions.push(`🎯 STRONG MATCH: Your profile aligns well! Make sure to emphasize your ${matchedSkills.slice(0, 3).join(', ')} experience.`);
  }
  
  return {
    overallScore: Math.min(totalScore, 100),
    breakdown: {
      skills: Math.round(skillsScore),
      keywords: Math.round(keywordScore),
      requirements: Math.round(requirementScore),
      experience: experienceScore,
      quality: qualityScore,
    },
    matchedSkills,
    missingSkills,
    matchedKeywords: matchedKeywords.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 10),
    matchedRequirements,
    missingRequirements,
    suggestions,
    strengths: matchedSkills.length > requiredSkills.length / 2 
      ? [`Strong skill match (${matchedSkills.length}/${requiredSkills.length})`]
      : [],
    improvements: missingSkills.length > 0 
      ? [`Add ${missingSkills.length} missing skills`]
      : [],
  };
}

// Extract important keywords from job description
function extractImportantKeywords(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase();
  const keywords: string[] = [];
  
  // Look for action verbs and responsibilities
  const actionVerbs = ['develop', 'design', 'implement', 'manage', 'lead', 'create', 'build', 'maintain', 'collaborate', 'analyze'];
  actionVerbs.forEach(verb => {
    if (text.includes(verb)) keywords.push(verb);
  });
  
  // Look for qualifications
  const qualifications = ['degree', 'bachelor', 'master', 'certification', 'experience', 'knowledge'];
  qualifications.forEach(qual => {
    if (text.includes(qual)) keywords.push(qual);
  });
  
  // Look for tools and technologies (beyond listed skills)
  const tools = ['api', 'database', 'cloud', 'testing', 'deployment', 'architecture', 'framework'];
  tools.forEach(tool => {
    if (text.includes(tool)) keywords.push(tool);
  });
  
  return [...new Set(keywords)]; // Remove duplicates
}

