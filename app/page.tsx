'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Brain, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Advanced machine learning algorithms match candidates with perfect job opportunities',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: 'Smart Recommendations',
      description: 'Get personalized job recommendations based on skills, experience, and preferences',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Instant notifications for application status, messages, and interview schedules',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Data-driven insights on salary trends, skill demands, and career growth opportunities',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { label: 'Active Jobs', value: '10,000+' },
    { label: 'Companies', value: '2,500+' },
    { label: 'Candidates', value: '50,000+' },
    { label: 'Success Rate', value: '92%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Loom Recruiting Platform
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-slate-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Recruitment Platform</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Find Your Dream Job
              <br />
              or Perfect Candidate
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto">
              Connect talent with opportunity using advanced machine learning. 
              Whether you're hiring or seeking, we make it intelligent, fast, and effective.
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link
                href="/auth/register?role=candidate"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-2xl transition-all flex items-center gap-2 text-lg font-semibold"
              >
                I'm Looking for a Job
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/register?role=recruiter"
                className="group px-8 py-4 bg-white text-slate-900 rounded-xl hover:shadow-xl transition-all flex items-center gap-2 text-lg font-semibold border-2 border-slate-200"
              >
                I'm Hiring Talent
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Powered by Intelligence
            </h2>
            <p className="text-xl text-slate-600">
              Advanced features that make recruitment smarter and faster
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(feature.title)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
                {hoveredCard === feature.title && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Recruitment?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of companies and candidates using AI to find perfect matches
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all text-lg font-semibold"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold">Loom Recruiting Platform</span>
          </div>
          <p className="text-slate-400">
            © 2024 Loom Recruiting Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

