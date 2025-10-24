import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Advanced ATS scoring algorithm
function analyzeResume(resumeText: string, jobDescription?: string) {
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

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let resumeText = '';

    // Extract text based on file type
    if (file.type === 'text/plain') {
      resumeText = await file.text();
    } else {
      // For PDF and DOCX, read as text (user can paste content or we can add libraries later)
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      resumeText = decoder.decode(buffer);
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Could not extract text from file. Please upload a TXT file or paste your resume text.',
        suggestion: 'For PDF/DOCX support, please convert to TXT format first.'
      }, { status: 400 });
    }

    const analysis = analyzeResume(resumeText, jobDescription);

    return NextResponse.json({
      success: true,
      analysis,
      filename: file.name,
    });
  } catch (error: any) {
    console.error('Resume analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze resume', details: error.message }, { status: 500 });
  }
}
