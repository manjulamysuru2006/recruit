'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Filter,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';

export default function CandidateJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchJobs();
    fetchApplications();
  }, [router, searchTerm, location, jobType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (location) params.append('location', location);
      if (jobType) params.append('type', jobType);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.applications) {
        const appliedIds = data.applications.map((app: any) => 
          app.jobId._id || app.jobId
        );
        setAppliedJobIds(appliedIds);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
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
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/candidate/jobs"
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
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
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Jobs</h1>
          
          {/* Search Filters */}
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search filters or check back later</p>
              <Link
                href="/candidate/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job: any) => {
                const hasApplied = appliedJobIds.includes(job._id);
                return (
                  <Link
                    key={job._id}
                    href={`/candidate/jobs/${job._id}`}
                    className={`block bg-white rounded-xl border p-6 hover:shadow-lg transition-all ${
                      hasApplied ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          {hasApplied && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                              Applied
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{job.company}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {typeof job.location === 'string' 
                            ? job.location 
                            : job.location?.city 
                              ? `${job.location.city}${job.location.state ? ', ' + job.location.state : ''}${job.location.country ? ', ' + job.location.country : ''}${job.location.remote ? ' (Remote)' : ''}`
                              : 'Not specified'
                          }
                        </span>
                        {job.salary?.min && job.salary?.max && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requiredSkills.slice(0, 5).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 5 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          +{job.requiredSkills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
