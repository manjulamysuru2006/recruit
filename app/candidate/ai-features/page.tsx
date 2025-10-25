'use client';

import CandidateSidebar from '@/components/CandidateSidebar';
import { 
  Brain, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  MessageSquare, 
  Loader2,
  CheckCircle,
  ArrowRight,
  Award
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SalaryPrediction {
  predictedSalary: number;
  minRange: number;
  maxRange: number;
  confidence: number;
  basedOnJobs: number;
}

interface SkillRecommendation {
  skill: string;
  demand: number;
  appearsInJobs: number;
  priority: 'high' | 'medium' | 'low';
}

interface CareerPathJob {
  title: string;
  company: string;
  experienceLevel: string;
  requiredSkills: string[];
  salary: { min: number; max: number };
}

interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
}

export default function AIFeaturesPage() {
  const [loading, setLoading] = useState(true);
  const [salaryPrediction, setSalaryPrediction] = useState<SalaryPrediction | null>(null);
  const [skillRecommendations, setSkillRecommendations] = useState<SkillRecommendation[]>([]);
  const [careerPath, setCareerPath] = useState<CareerPathJob[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAIFeatures();
  }, []);

  const fetchAIFeatures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view AI features');
        setLoading(false);
        return;
      }

      // Fetch all AI features in parallel
      const [salaryRes, skillsRes, careerRes, interviewRes] = await Promise.all([
        fetch('/api/ml/salary-prediction', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/ml/skill-recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/ml/career-path', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/ml/interview-prep', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (salaryRes.ok) {
        const data = await salaryRes.json();
        setSalaryPrediction(data);
      }

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkillRecommendations(data.recommendations || []);
      }

      if (careerRes.ok) {
        const data = await careerRes.json();
        setCareerPath(data.careerPath || []);
      }

      if (interviewRes.ok) {
        const data = await interviewRes.json();
        setInterviewQuestions(data.questions || []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching AI features:', err);
      setError('Failed to load AI features');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <CandidateSidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading AI Features...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar />

      <div className="flex-1 ml-64">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <Brain className="w-12 h-12" />
              <div>
                <h1 className="text-4xl font-bold mb-2">AI-Powered Career Insights</h1>
                <p className="text-xl opacity-90">Real data-driven recommendations for your career</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-5xl mx-auto px-8 py-4">
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
          {/* Salary Prediction */}
          <div className="bg-white rounded-2xl border-2 border-green-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Salary Prediction</h2>
            </div>

            {salaryPrediction ? (
              <div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${salaryPrediction.predictedSalary.toLocaleString()}
                    </div>
                    <div className="text-gray-600">Predicted Annual Salary</div>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-700">
                    <div>
                      <span className="font-semibold">Range:</span> ${salaryPrediction.minRange.toLocaleString()} - ${salaryPrediction.maxRange.toLocaleString()}
                    </div>
                    <div>•</div>
                    <div>
                      <span className="font-semibold">Confidence:</span> {Math.round(salaryPrediction.confidence * 100)}%
                    </div>
                    <div>•</div>
                    <div>
                      <span className="font-semibold">Based on:</span> {salaryPrediction.basedOnJobs} jobs
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This prediction is based on {salaryPrediction.basedOnJobs} real jobs from our database that match your skills and experience level.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Upload your resume to get salary predictions based on your skills</p>
              </div>
            )}
          </div>

          {/* Skill Recommendations */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recommended Skills to Learn</h2>
            </div>

            {skillRecommendations.length > 0 ? (
              <div className="space-y-4">
                {skillRecommendations.map((skill, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          skill.priority === 'high' ? 'bg-red-500' :
                          skill.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <h3 className="text-lg font-bold text-gray-900">{skill.skill}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        skill.priority === 'high' ? 'bg-red-100 text-red-700' :
                        skill.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {skill.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Demand:</span> {skill.demand}%
                      </div>
                      <div>•</div>
                      <div>
                        <span className="font-semibold">Appears in:</span> {skill.appearsInJobs} jobs you viewed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Browse jobs to get personalized skill recommendations</p>
              </div>
            )}
          </div>

          {/* Career Path */}
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Career Path</h2>
            </div>

            {careerPath.length > 0 ? (
              <div className="space-y-4">
                {careerPath.map((job, index) => (
                  <div key={index} className="relative">
                    {index < careerPath.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-purple-300"></div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 relative z-10">
                        {index + 1}
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-purple-600">{job.experienceLevel}</div>
                            <div className="text-xs text-gray-600">
                              ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {job.requiredSkills.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{job.requiredSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Upload your resume to see personalized career progression paths</p>
              </div>
            )}
          </div>

          {/* Interview Preparation */}
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Interview Preparation</h2>
            </div>

            {interviewQuestions.length > 0 ? (
              <div className="space-y-4">
                {interviewQuestions.map((q, index) => (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
                            {q.category}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            q.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                            q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-900">{q.question}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Apply to jobs to get interview questions based on job requirements</p>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8" />
              <h2 className="text-2xl font-bold">How Our AI Works</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl mb-2">�</div>
                <h3 className="font-bold mb-2">Salary Prediction</h3>
                <p className="text-sm opacity-90">
                  Analyzes jobs in our database that match your skills, calculating average salaries with confidence scores based on sample size.
                </p>
              </div>

              <div>
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-bold mb-2">Skill Recommendations</h3>
                <p className="text-sm opacity-90">
                  Identifies skills you don't have that appear frequently in jobs you've viewed or applied to, prioritized by demand.
                </p>
              </div>

              <div>
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-bold mb-2">Career Path</h3>
                <p className="text-sm opacity-90">
                  Shows real job progressions from entry-level to senior positions in your field, based on actual job postings.
                </p>
              </div>

              <div>
                <div className="text-3xl mb-2">�</div>
                <h3 className="font-bold mb-2">Interview Prep</h3>
                <p className="text-sm opacity-90">
                  Generates interview questions based on the actual job descriptions and requirements of positions you've applied to.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
