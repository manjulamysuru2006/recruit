'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, TrendingUp, Zap, Award, Target } from 'lucide-react';

export default function ATSScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Fetch available jobs
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Load jobs when component mounts
  useState(() => {
    fetchJobs();
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const analyzeResume = async () => {
    // MANDATORY VALIDATIONS
    if (!file && !resumeText.trim()) {
      alert('⚠️ Please upload a resume file or paste your resume text');
      return;
    }

    if (!jobDescription.trim()) {
      alert('⚠️ Job Description is REQUIRED! Please enter the job description to compare your resume against.');
      return;
    }

    if (!jobSkills.trim()) {
      alert('⚠️ Required Skills are REQUIRED! Please list the skills needed for this job (comma-separated).');
      return;
    }

    setAnalyzing(true);
    const formData = new FormData();
    
    if (inputMode === 'upload' && file) {
      formData.append('resume', file);
    } else if (inputMode === 'paste' && resumeText) {
      // Create a text file from the pasted content
      const textBlob = new Blob([resumeText], { type: 'text/plain' });
      const textFile = new File([textBlob], 'resume.txt', { type: 'text/plain' });
      formData.append('resume', textFile);
    }
    
    // Send job details for REAL comparison
    formData.append('jobDescription', jobDescription);
    formData.append('jobSkills', jobSkills);
    
    if (jobRequirements.trim()) {
      formData.append('jobRequirements', jobRequirements);
    }
    
    if (selectedJobId) {
      formData.append('jobId', selectedJobId);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.analysis);
      } else {
        alert('Failed to analyze resume: ' + data.error);
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI-Powered ATS Resume Scanner</h2>
            <p className="text-sm text-gray-600">Get instant feedback and improve your resume score</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Input Mode Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputMode('upload')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                inputMode === 'upload'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setInputMode('paste')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                inputMode === 'paste'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paste Text
            </button>
          </div>

          {/* File Upload */}
          {inputMode === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF, DOCX, or TXT)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Paste Text */}
          {inputMode === 'paste' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Your Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Paste your complete resume here..."
                rows={10}
              />
            </div>
          )}

          {/* File Upload (OLD - REMOVE THIS) */}
          <div style={{ display: 'none' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (PDF, DOCX, or TXT)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload-old"
              />
              <label
                htmlFor="resume-upload-old"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
              </label>
            </div>
          </div>

          {/* Job Description (REQUIRED) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-600">*</span> Job Description (REQUIRED for comparison)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Paste the FULL job description here. This is used to compare your resume against specific role requirements..."
              rows={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Include complete job description with responsibilities and qualifications
            </p>
          </div>

          {/* Required Skills (REQUIRED) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-600">*</span> Required Skills (REQUIRED)
            </label>
            <input
              type="text"
              value={jobSkills}
              onChange={(e) => setJobSkills(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., React, Node.js, MongoDB, AWS, Docker (comma-separated)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 List all technical skills required for the job, separated by commas
            </p>
          </div>

          {/* Job Requirements (Optional but recommended) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Requirements (Optional but recommended)
            </label>
            <textarea
              value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., 3+ years experience, Bachelor's degree, Strong communication skills..."
              rows={3}
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeResume}
            disabled={(!file && !resumeText.trim()) || analyzing || !jobDescription.trim() || !jobSkills.trim()}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing Resume vs Job...
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                {!jobDescription.trim() || !jobSkills.trim() 
                  ? 'Fill Required Fields to Analyze' 
                  : 'Compare Resume with Job Requirements'}
              </>
            )}
          </button>
          
          {(!jobDescription.trim() || !jobSkills.trim()) && (
            <p className="text-sm text-red-600 text-center">
              ⚠️ Job Description and Required Skills are mandatory for analysis
            </p>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* AI Processing Badge */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">⚡ AI Analysis Complete</h3>
                <p className="text-sm opacity-90">Powered by TensorFlow.js Neural Network + Advanced NLP</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">🧠</div>
                <div className="text-xs mt-1">Neural Network</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">📊</div>
                <div className="text-xs mt-1">50+ Features</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">🎯</div>
                <div className="text-xs mt-1">Real-time Processing</div>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Overall ATS Score</h3>
                </div>
                <p className="text-sm opacity-90">✨ AI Confidence: {result.atsCompatibility}</p>
                <p className="text-xs opacity-75 mt-1">Analyzed with Deep Learning Model</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold animate-pulse">{result.overallScore}</div>
                <div className="text-sm opacity-90">out of 100</div>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${result.overallScore}%` }}
              ></div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">📊 AI-Powered Score Breakdown</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(result.breakdown).map(([category, score]: [string, any]) => (
                <div key={category} className="relative text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:shadow-md transition-all">
                  <div className="absolute top-2 right-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">AI</div>
                  <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
                  <div className="text-xs text-gray-600 mt-1 capitalize font-semibold">{category}</div>
                  <div className="mt-2 bg-white rounded-full h-1.5">
                    <div className={`rounded-full h-1.5 transition-all ${getScoreBg(score)}`} style={{ width: `${score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match Score (if job description provided) */}
          {result.matchScore > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Job Match Score</h3>
                  <p className="text-sm text-gray-600">How well your resume matches the job description</p>
                </div>
                <div className={`text-5xl font-bold ${getScoreColor(result.matchScore)}`}>
                  {result.matchScore}%
                </div>
              </div>
            </div>
          )}

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {result.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2">
                {result.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Feedback */}
          {result.feedback.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Detailed Feedback & Suggestions</h3>
              </div>
              <div className="space-y-4">
                {result.feedback.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      item.severity === 'high' ? 'bg-red-50 border-red-500' :
                      item.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.severity === 'high' ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : item.severity === 'medium' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                      )}
                      <span className="font-semibold text-gray-900">{item.category}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{item.message}</p>
                    <p className="text-sm text-gray-600 bg-white/50 p-2 rounded">
                      💡 <strong>Suggestion:</strong> {item.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Found */}
          {result.foundSkills.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Skills Detected ({result.foundSkills.length})</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.foundSkills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resume Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resume Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{result.wordCount}</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{result.yearsOfExperience}+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
