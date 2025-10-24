'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Search,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function CandidateDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applied: 0,
    interviewed: 0,
    offers: 0,
    saved: 0,
  });

  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs
      const jobsResponse = await fetch('/api/jobs?limit=3');
      const jobsData = await jobsResponse.json();
      if (jobsResponse.ok && jobsData.jobs) {
        setRecommendedJobs(jobsData.jobs.map((job: any) => ({
          id: job._id,
          title: job.title,
          company: job.company,
          location: `${job.location?.city || 'Location'}, ${job.location?.country || ''}`,
          salary: job.salary?.min && job.salary?.max 
            ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
            : 'Salary not specified',
          matchScore: Math.floor(Math.random() * 20) + 80, // Random match score for now
          type: job.jobType || 'Full-time',
        })));
      }

      // Fetch applications
      const appsResponse = await fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const appsData = await appsResponse.json();
      if (appsResponse.ok && appsData.applications) {
        const apps = appsData.applications;
        setRecentApplications(apps.slice(0, 3).map((app: any) => ({
          id: app._id,
          job: app.jobId?.title || 'Job Title',
          company: app.jobId?.company || 'Company',
          status: app.status,
          appliedDate: new Date(app.createdAt).toISOString().split('T')[0],
        })));

        // Calculate stats
        setStats({
          applied: apps.length,
          interviewed: apps.filter((a: any) => a.status === 'interviewing').length,
          offers: apps.filter((a: any) => a.status === 'offered').length,
          saved: 0, // This would come from a saved jobs collection
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interviewing':
        return 'bg-blue-100 text-blue-700';
      case 'screening':
        return 'bg-yellow-100 text-yellow-700';
      case 'applied':
        return 'bg-gray-100 text-gray-700';
      case 'offered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interviewing':
        return <Calendar className="w-4 h-4" />;
      case 'screening':
        return <Clock className="w-4 h-4" />;
      case 'applied':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'offered':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Aayush</span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/candidate/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/candidate/jobs"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Search className="w-5 h-5" />
              <span>Find Jobs</span>
            </Link>
            <Link
              href="/candidate/applications"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <FileText className="w-5 h-5" />
              <span>Applications</span>
            </Link>
            <Link
              href="/candidate/ats-scanner"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg"
            >
              <Sparkles className="w-5 h-5" />
              <span>ATS Scanner</span>
            </Link>
            <Link
              href="/candidate/messages"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/candidate/profile"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              <span>Profile</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your job search overview</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.applied}</div>
              <div className="text-gray-600">Applications</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.interviewed}</div>
              <div className="text-gray-600">Interviews</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.offers}</div>
              <div className="text-gray-600">Offers</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.saved}</div>
              <div className="text-gray-600">Saved Jobs</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Recommended Jobs */}
            <div className="col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    AI-Recommended Jobs
                  </h2>
                  <Link href="/candidate/jobs" className="text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 text-sm">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                          <Sparkles className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700">
                            {job.matchScore}% Match
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          📍 {job.location}
                        </span>
                        <span>💰 {job.salary}</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Applications</h2>
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="pb-4 border-b border-gray-100 last:border-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{app.job}</h3>
                      <p className="text-gray-600 text-xs mb-2">{app.company}</p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status}
                        </span>
                        <span className="text-xs text-gray-500">{app.appliedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
