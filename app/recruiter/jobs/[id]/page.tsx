'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  MapPin,
  DollarSign,
  Clock,
  ArrowLeft,
  User,
  Mail,
  Phone,
} from 'lucide-react';

export default function RecruiterJobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch job details
    fetch(`/api/jobs/${params.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.job) {
          setJob(data.job);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching job:', err);
        setLoading(false);
      });

    // Fetch applications for this job
    fetch(`/api/jobs/${params.id}/applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.applications) {
          setApplications(data.applications);
        }
      })
      .catch(err => console.error('Error fetching applications:', err));
  }, [params.id, router]);

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
            <Link href="/recruiter/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <LayoutDashboard className="w-5 h-5" /><span>Dashboard</span>
            </Link>
            <Link href="/recruiter/jobs" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
              <Briefcase className="w-5 h-5" /><span>Jobs</span>
            </Link>
            <Link href="/recruiter/candidates" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Users className="w-5 h-5" /><span>Candidates</span>
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

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <Link href="/recruiter/jobs" className="flex items-center gap-2 text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Job Details & Applications</h1>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : !job ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Job not found</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {/* Job Details */}
              <div className="col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{job.title}</h2>
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {typeof job.location === 'string' 
                        ? job.location 
                        : job.location?.city 
                          ? `${job.location.city}${job.location.state ? ', ' + job.location.state : ''}${job.location.country ? ', ' + job.location.country : ''}${job.location.remote ? ' (Remote)' : ''}`
                          : 'Not specified'
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {job.jobType}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{applications.length}</div>
                    <div className="text-sm text-gray-600">Total Applications</div>
                  </div>
                </div>
              </div>

              {/* Applications List */}
              <div className="col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Applications</h3>
                  
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No applications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app: any) => (
                        <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{app.candidateId?.name || 'Candidate'}</h4>
                                <p className="text-sm text-gray-600">{app.candidateId?.email}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                              app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-700' :
                              app.status === 'shortlisted' ? 'bg-purple-100 text-purple-700' :
                              app.status === 'interview' ? 'bg-green-100 text-green-700' :
                              app.status === 'offered' ? 'bg-green-200 text-green-800' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          
                          {app.coverLetter && (
                            <p className="text-sm text-gray-700 mb-3">{app.coverLetter}</p>
                          )}
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                              {app.candidateId?.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {app.candidateId.phone}
                                </span>
                              )}
                            </div>
                            {app.status === 'applied' && (
                              <button
                                onClick={async () => {
                                  const token = localStorage.getItem('token');
                                  const response = await fetch('/api/interview-pipeline', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                      applicationId: app._id,
                                      action: 'initiate',
                                    })
                                  });
                                  if (response.ok) {
                                    alert('Candidate added to interview pipeline!');
                                    window.location.reload();
                                  }
                                }}
                                className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                              >
                                Select for Interview
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
          )}
        </div>
      </div>
    </div>
  );
}
