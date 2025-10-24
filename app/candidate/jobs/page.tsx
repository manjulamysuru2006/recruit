'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CandidateSidebar from '@/components/CandidateSidebar';
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Filter,
  Bookmark,
  BookmarkCheck,
  Target,
  TrendingUp,
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
  const [userProfile, setUserProfile] = useState<any>(null); // Store user's resume data
  const [jobMatches, setJobMatches] = useState<Map<string, any>>(new Map()); // Store real match scores

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUserProfile(); // Fetch user's resume first
    fetchJobs();
    fetchApplications();
  }, [router, searchTerm, location, jobType]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.user) {
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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

  const calculateMatchScore = (job: any): number => {
    // If no user profile or resume, return 0
    if (!userProfile?.candidateProfile?.resumeText && !userProfile?.candidateProfile?.skills) {
      return 0;
    }

    const resumeText = (userProfile.candidateProfile.resumeText || '').toLowerCase();
    const candidateSkills = userProfile.candidateProfile.skills || [];
    const jobSkills = job.skills || [];
    
    if (jobSkills.length === 0) {
      return 50; // Default if no skills specified
    }

    // REAL COMPARISON: Count how many job skills are in candidate's resume
    let matchedCount = 0;
    
    for (const jobSkill of jobSkills) {
      const skillLower = jobSkill.toLowerCase();
      // Check if skill is in resume text OR in candidate's skills array
      const inResume = resumeText.includes(skillLower);
      const inSkills = candidateSkills.some((cs: string) => 
        cs.toLowerCase().includes(skillLower) || skillLower.includes(cs.toLowerCase())
      );
      
      if (inResume || inSkills) {
        matchedCount++;
      }
    }
    
    // Calculate percentage: (matched skills / total required skills) * 100
    const matchPercentage = Math.round((matchedCount / jobSkills.length) * 100);
    
    return matchPercentage;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Jobs</h1>
          
          {/* AI Features Promo Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">AI-Powered Job Matching</h3>
                <p className="text-sm text-purple-700">Each job shows an AI match score based on your profile. Try our <Link href="/candidate/ats-scanner" className="underline font-medium">AI Resume Scanner</Link> for personalized recommendations!</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
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
                const matchScore = calculateMatchScore(job);
                const matchColor = matchScore >= 80 ? 'bg-green-500' : matchScore >= 60 ? 'bg-yellow-500' : 'bg-gray-400';
                const matchTextColor = matchScore >= 80 ? 'text-green-700' : matchScore >= 60 ? 'text-yellow-700' : 'text-gray-700';
                
                // Check if job is new (posted within last 24 hours)
                const jobAge = job.createdAt ? (new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60) : null;
                const isNewJob = jobAge !== null && jobAge <= 24;
                const isVeryNewJob = jobAge !== null && jobAge <= 1; // Posted in last 1 hour
                
                return (
                  <Link
                    key={job._id}
                    href={`/candidate/jobs/${job._id}`}
                    className={`block bg-white rounded-xl border p-6 hover:shadow-lg transition-all relative ${
                      hasApplied ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {/* Early Apply Badge for new jobs */}
                    {isNewJob && !hasApplied && (
                      <div className="absolute top-4 left-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 ${
                          isVeryNewJob 
                            ? 'bg-red-500 animate-pulse' 
                            : 'bg-orange-500'
                        } text-white rounded-full text-sm font-bold shadow-lg`}>
                          <Clock className="w-4 h-4" />
                          {isVeryNewJob 
                            ? '🔥 Just Posted!' 
                            : '⚡ Early Apply'
                          }
                        </div>
                      </div>
                    )}

                    {/* AI Match Score Badge - Prominent */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-2 px-4 py-2 ${matchColor} bg-opacity-10 border-2 border-current rounded-full ${matchTextColor}`}>
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold text-lg">{matchScore}%</span>
                        <span className="text-sm font-medium">Match</span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between mb-4 pr-32 pl-32">
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

