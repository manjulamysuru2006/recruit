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
  Mail,
  Phone,
  Calendar,
  Target,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  GitBranch,
} from 'lucide-react';

export default function RecruiterCandidatesPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchApplications();
    fetchJobs();
  }, [router]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // First get all jobs by this recruiter
      const jobsResponse = await fetch('/api/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const jobsData = await jobsResponse.json();
      
      if (jobsData.jobs && jobsData.jobs.length > 0) {
        // Get all applications for these jobs
        const allApplications: any[] = [];
        
        for (const job of jobsData.jobs) {
          const appsResponse = await fetch(`/api/jobs/${job._id}/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (appsResponse.ok) {
            const appsData = await appsResponse.json();
            if (appsData.applications) {
              allApplications.push(...appsData.applications.map((app: any) => ({
                ...app,
                jobInfo: job
              })));
            }
          }
        }
        
        setApplications(allApplications);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        alert(`Application ${status}`);
        fetchApplications();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      applied: 'bg-blue-100 text-blue-700',
      screening: 'bg-yellow-100 text-yellow-700',
      interviewing: 'bg-purple-100 text-purple-700',
      offered: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      accepted: 'bg-green-100 text-green-700',
      withdrawn: 'bg-gray-100 text-gray-700'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const filteredApplications = selectedJob === 'all' 
    ? applications 
    : applications.filter(app => app.jobId === selectedJob || app.jobInfo?._id === selectedJob);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Loom</span>
          </div>
          <nav className="space-y-2">
            <Link href="/recruiter/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <LayoutDashboard className="w-5 h-5" /><span>Dashboard</span>
            </Link>
            <Link href="/recruiter/jobs" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Briefcase className="w-5 h-5" /><span>Jobs</span>
            </Link>
            <Link href="/recruiter/candidates" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
              <Users className="w-5 h-5" /><span>Applications</span>
            </Link>
            <Link href="/recruiter/pipeline" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg">
              <GitBranch className="w-5 h-5" /><span>Pipeline</span>
            </Link>
            <Link href="/recruiter/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <BarChart3 className="w-5 h-5" /><span>Analytics</span>
            </Link>
            <Link href="/recruiter/messages" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5" /><span>Messages</span>
            </Link>
            <Link href="/recruiter/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5" /><span>Settings</span>
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button onClick={() => { localStorage.removeItem('token'); router.push('/'); }} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full">
            <LogOut className="w-5 h-5" /><span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Applications ({filteredApplications.length})</h1>
          <p className="text-gray-600">Review and manage candidate applications</p>
        </div>

        <div className="p-8">
          {/* Filter */}
          <div className="mb-6">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Jobs ({applications.length})</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({applications.filter(app => app.jobId === job._id || app.jobInfo?._id === job._id).length})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">Once candidates apply to your jobs, you'll see them here</p>
              <Link
                href="/recruiter/jobs/new"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {application.candidateId?.profile?.firstName || 'Candidate'} {application.candidateId?.profile?.lastName || ''}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(application.status)}`}>
                          {application.status}
                        </span>
                        {application.matchScore && (
                          <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                            <Target className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">{application.matchScore}% Match</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">Applied for: <span className="font-semibold">{application.jobInfo?.title || application.jobId?.title || 'Position'}</span></p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {application.candidateId?.email || 'No email'}
                        </span>
                        {application.candidateId?.profile?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {application.candidateId.profile.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {application.candidateId?.candidateProfile?.skills && application.candidateId.candidateProfile.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Skills:</div>
                      <div className="flex flex-wrap gap-2">
                        {application.candidateId.candidateProfile.skills.slice(0, 8).map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                        {application.candidateId.candidateProfile.skills.length > 8 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                            +{application.candidateId.candidateProfile.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {application.coverLetter && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 mb-1">Cover Letter:</div>
                      <p className="text-sm text-gray-600">{application.coverLetter}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {application.status === 'applied' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'screening')}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4" />
                          Move to Screening
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'interviewing')}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Schedule Interview
                        </button>
                      </>
                    )}
                    {application.status === 'screening' && (
                      <button
                        onClick={() => updateApplicationStatus(application._id, 'interviewing')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Move to Interview
                      </button>
                    )}
                    {application.status === 'interviewing' && (
                      <button
                        onClick={() => updateApplicationStatus(application._id, 'offered')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Make Offer
                      </button>
                    )}
                    {application.status !== 'rejected' && application.status !== 'withdrawn' && (
                      <button
                        onClick={() => updateApplicationStatus(application._id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

