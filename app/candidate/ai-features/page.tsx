'use client';

import CandidateSidebar from '@/components/CandidateSidebar';
import { 
  Brain, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap, 
  Network, 
  Eye,
  Layers,
  Activity,
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AIFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar />

      <div className="flex-1 ml-64">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Brain className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">🤖 AI-Powered Recruiting</h1>
                <p className="text-xl opacity-90">Advanced Machine Learning & Neural Networks at Your Service</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">4</div>
                <div className="text-sm opacity-90">AI Models</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">50+</div>
                <div className="text-sm opacity-90">Features Analyzed</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">128</div>
                <div className="text-sm opacity-90">Neural Network Nodes</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">Real-time</div>
                <div className="text-sm opacity-90">Processing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
          {/* AI Models Section */}
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Our AI Models</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Job Matching Model */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Job Matching Neural Network</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Deep learning model with 128→64→32 architecture, batch normalization, and dropout layers.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>50+ features</strong> from candidate & job data</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Sigmoid activation</strong> for probability scoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Real-time inference</strong> on every job</span>
                  </div>
                </div>
              </div>

              {/* Salary Prediction Model */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Salary Prediction Engine</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Regression neural network trained on 30 features with dropout regularization.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Market-adjusted</strong> salary predictions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Location-aware</strong> cost of living adjustment</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Confidence scores</strong> for transparency</span>
                  </div>
                </div>
              </div>

              {/* Resume Analyzer */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Advanced Resume Analyzer</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  NLP-powered resume scanner with technical skill extraction and sentiment analysis.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>100+ technical skills</strong> detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Action verbs</strong> and power words analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Section detection</strong> & structure scoring</span>
                  </div>
                </div>
              </div>

              {/* Skill Recommendation */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Network className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Skill Recommendation Graph</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Graph-based recommendation system analyzing skill relationships and job requirements.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Knowledge graph</strong> of related skills</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Job-aware</strong> personalized suggestions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Trending skills</strong> prioritization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Technical Architecture</h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="font-bold mb-2 text-lg">TensorFlow.js</h3>
                <p className="text-sm opacity-90">
                  Browser-based neural networks for real-time inference with zero latency
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold mb-2 text-lg">Real-time Processing</h3>
                <p className="text-sm opacity-90">
                  Instant AI predictions as you browse, no waiting for server responses
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold mb-2 text-lg">Multi-Feature Analysis</h3>
                <p className="text-sm opacity-90">
                  Analyzes skills, experience, education, location, salary, and 45+ more factors
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="font-bold mb-4 text-lg">Neural Network Architecture</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">50</span>
                  </div>
                  <div className="text-xs opacity-90">Input Features</div>
                </div>
                <ArrowRight className="w-6 h-6" />
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">128</span>
                  </div>
                  <div className="text-xs opacity-90">Hidden Layer 1</div>
                </div>
                <ArrowRight className="w-6 h-6" />
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">64</span>
                  </div>
                  <div className="text-xs opacity-90">Hidden Layer 2</div>
                </div>
                <ArrowRight className="w-6 h-6" />
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">32</span>
                  </div>
                  <div className="text-xs opacity-90">Hidden Layer 3</div>
                </div>
                <ArrowRight className="w-6 h-6" />
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <div className="text-xs opacity-90">Match Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features in Action */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">See AI in Action</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Link href="/candidate/jobs" className="group bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Target className="w-10 h-10 text-purple-600" />
                  <ArrowRight className="w-6 h-6 text-purple-600 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Job Matching</h3>
                <p className="text-gray-700 text-sm">
                  Browse jobs with real-time AI match scores. Each job shows how well it matches your profile using our neural network.
                </p>
                <div className="mt-4 inline-block px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                  🧠 Neural Network Powered
                </div>
              </Link>

              <Link href="/candidate/ats-scanner" className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Eye className="w-10 h-10 text-orange-600" />
                  <ArrowRight className="w-6 h-6 text-orange-600 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Resume Scanner</h3>
                <p className="text-gray-700 text-sm">
                  Analyze your resume with advanced NLP. Get instant feedback, ATS compatibility score, and improvement suggestions.
                </p>
                <div className="mt-4 inline-block px-3 py-1 bg-orange-600 text-white text-sm rounded-full">
                  📊 NLP Analysis + 50+ Metrics
                </div>
              </Link>
            </div>
          </div>

          {/* Why Our AI is Different */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Why Our AI is Different</h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-bold mb-2">Real Neural Networks</h3>
                <p className="text-sm opacity-90">
                  Not simple calculations - actual TensorFlow.js models with trained weights and layers
                </p>
              </div>

              <div>
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold mb-2">Multi-Dimensional Analysis</h3>
                <p className="text-sm opacity-90">
                  50+ features analyzed including skills, experience, education, location, and more
                </p>
              </div>

              <div>
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold mb-2">Instant Predictions</h3>
                <p className="text-sm opacity-90">
                  Browser-based inference means zero latency - see results as you browse
                </p>
              </div>

              <div>
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold mb-2">Personalized Results</h3>
                <p className="text-sm opacity-90">
                  Every score is calculated specifically for your profile and preferences
                </p>
              </div>

              <div>
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold mb-2">Transparent Scoring</h3>
                <p className="text-sm opacity-90">
                  See exactly why each job scored the way it did with detailed breakdowns
                </p>
              </div>

              <div>
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="font-bold mb-2">Continuous Learning</h3>
                <p className="text-sm opacity-90">
                  Models improve with usage, learning from successful matches
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
