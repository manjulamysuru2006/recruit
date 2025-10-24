import * as tf from '@tensorflow/tfjs';

export class JobMatchingModel {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Create a simple neural network for job matching
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [50], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });
  }

  async predictMatch(candidateFeatures: number[], jobFeatures: number[]): Promise<number> {
    if (!this.model) {
      await this.initialize();
    }

    // Combine features
    const features = [...candidateFeatures, ...jobFeatures];
    const tensor = tf.tensor2d([features]);
    const prediction = this.model!.predict(tensor) as tf.Tensor;
    const score = (await prediction.data())[0];
    
    tensor.dispose();
    prediction.dispose();

    return Math.round(score * 100);
  }

  extractCandidateFeatures(candidate: any): number[] {
    const features = new Array(25).fill(0);
    
    // Skills count
    features[0] = candidate.skills?.length || 0;
    
    // Experience years
    const totalExp = candidate.experience?.reduce((acc: number, exp: any) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    }, 0) || 0;
    features[1] = totalExp;
    
    // Education level
    features[2] = candidate.education?.length || 0;
    
    // Certifications
    features[3] = candidate.certifications?.length || 0;
    
    // Fill remaining with normalized values
    for (let i = 4; i < 25; i++) {
      features[i] = Math.random() * 0.1; // Placeholder for additional features
    }
    
    return features;
  }

  extractJobFeatures(job: any): number[] {
    const features = new Array(25).fill(0);
    
    // Required skills count
    features[0] = job.skills?.length || 0;
    
    // Experience level mapping
    const expLevelMap: any = { entry: 1, mid: 2, senior: 3, lead: 4, executive: 5 };
    features[1] = expLevelMap[job.experienceLevel] || 1;
    
    // Salary range (normalized)
    features[2] = (job.salary?.min || 0) / 100000;
    features[3] = (job.salary?.max || 0) / 100000;
    
    // Remote option
    features[4] = job.location?.remote ? 1 : 0;
    
    // Fill remaining
    for (let i = 5; i < 25; i++) {
      features[i] = Math.random() * 0.1;
    }
    
    return features;
  }
}

export class SalaryPredictionModel {
  async predictSalary(experience: number, skills: string[], location: string): Promise<number> {
    // Simple heuristic model (can be replaced with trained ML model)
    const baseAmount = 50000;
    const experienceMultiplier = 1 + (experience * 0.15);
    const skillsBonus = skills.length * 2000;
    const locationMultiplier = location.toLowerCase().includes('san francisco') ? 1.5 :
                               location.toLowerCase().includes('new york') ? 1.4 :
                               location.toLowerCase().includes('seattle') ? 1.3 : 1.0;
    
    return Math.round(baseAmount * experienceMultiplier * locationMultiplier + skillsBonus);
  }
}

export class SkillRecommendationModel {
  private skillDatabase = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'Machine Learning', 'Data Science', 'AWS', 'Azure', 'Docker', 'Kubernetes',
    'SQL', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST API', 'Git',
    'Agile', 'Scrum', 'CI/CD', 'Testing', 'DevOps', 'Cloud Computing',
  ];

  async recommendSkills(currentSkills: string[], targetJob: string): Promise<string[]> {
    // Filter out already known skills
    const unknownSkills = this.skillDatabase.filter(
      skill => !currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
    );
    
    // Return top 5 recommendations (can be enhanced with ML)
    return unknownSkills.slice(0, 5);
  }
}

export class ResumeAnalyzer {
  analyzeResume(resumeText: string): any {
    const analysis = {
      score: 0,
      strengths: [] as string[],
      improvements: [] as string[],
      keywords: [] as string[],
    };

    // Simple keyword extraction
    const keywords = resumeText.match(/\b[A-Z][a-z]+\b/g) || [];
    analysis.keywords = [...new Set(keywords)].slice(0, 20);

    // Calculate score based on content length and structure
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount > 200) analysis.strengths.push('Comprehensive content');
    if (wordCount < 100) analysis.improvements.push('Add more details');

    if (resumeText.toLowerCase().includes('education')) {
      analysis.strengths.push('Education section present');
    } else {
      analysis.improvements.push('Add education section');
    }

    if (resumeText.toLowerCase().includes('experience')) {
      analysis.strengths.push('Experience section present');
    } else {
      analysis.improvements.push('Add work experience');
    }

    // Calculate overall score
    analysis.score = Math.min(100, Math.round(
      (analysis.strengths.length * 20) + (wordCount / 10)
    ));

    return analysis;
  }
}

const jobMatchingModel = new JobMatchingModel();
const salaryPredictionModel = new SalaryPredictionModel();
const skillRecommendationModel = new SkillRecommendationModel();
const resumeAnalyzer = new ResumeAnalyzer();

export {
  jobMatchingModel,
  salaryPredictionModel,
  skillRecommendationModel,
  resumeAnalyzer,
};
