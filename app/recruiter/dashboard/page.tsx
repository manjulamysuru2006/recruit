'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Eye,
  UserCheck,
  Clock,
  Target,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewed: 0,
    hired: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch recruiter's jobs
    fetch('/api/jobs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.jobs) {
          setRecentJobs(data.jobs.slice(0, 3));
          setStats(prev => ({ ...prev, activeJobs: data.jobs.length }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching jobs:', err);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Loom</span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/recruiter/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/recruiter/jobs"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Briefcase className="w-5 h-5" />
              <span>Jobs</span>
            </Link>
            <Link
              href="/recruiter/candidates"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Users className="w-5 h-5" />
              <span>Candidates</span>
            </Link>
            <Link
              href="/recruiter/pipeline"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
            >
              <Target className="w-5 h-5" />
              <span>Interview Pipeline</span>
            </Link>
            <Link
              href="/recruiter/analytics"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/recruiter/messages"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/recruiter/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-600">Manage your recruitment pipeline</p>
          </div>
          <Link
            href="/recruiter/jobs/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Post New Job</span>
          </Link>
        </div>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeJobs}</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalApplications}</div>
              <div className="text-gray-600">Total Applications</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.interviewed}</div>
              <div className="text-gray-600">Interviewed</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.hired}</div>
              <div className="text-gray-600">Hired</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Recent Jobs */}
            <div className="col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
                  <Link href="/recruiter/jobs" className="text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading jobs...</div>
                  ) : recentJobs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No jobs posted yet</div>
                  ) : (
                    recentJobs.map((job: any) => (
                      <div
                        key={job._id}
                        className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{job.title}</h3>
                            <p className="text-gray-600 text-sm">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            active
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">0</div>
                              <div className="text-xs text-gray-600">Applicants</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Eye className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">0</div>
                              <div className="text-xs text-gray-600">Reviewed</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">0</div>
                              <div className="text-xs text-gray-600">Interviewed</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Top Candidates */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Top Matches
                </h2>
                <div className="space-y-4">
                  {topCandidates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No candidates yet. Post jobs to start receiving applications!
                    </div>
                  ) : (
                    topCandidates.map((candidate: any) => (
                      <div key={candidate.id} className="pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {candidate.name}
                            </h3>
                            <p className="text-gray-600 text-xs mb-1">{candidate.position}</p>
                            <p className="text-gray-500 text-xs">
                              {candidate.experience} • {candidate.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full w-fit">
                          <Target className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-semibold text-green-700">
                            {candidate.matchScore}% Match
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-3 gap-6">
            <Link
              href="/recruiter/jobs/new"
              className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl text-white hover:shadow-2xl transition-all group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Post a Job</h3>
              <p className="text-sm opacity-90">Create a new job listing</p>
            </Link>

            <Link
              href="/recruiter/candidates"
              className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white hover:shadow-2xl transition-all group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Browse Candidates</h3>
              <p className="text-sm opacity-90">Search candidate database</p>
            </Link>

            <Link
              href="/recruiter/analytics"
              className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl text-white hover:shadow-2xl transition-all group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">View Analytics</h3>
              <p className="text-sm opacity-90">Recruitment insights & metrics</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

