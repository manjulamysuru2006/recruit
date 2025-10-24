'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  User,
  Settings,
  LogOut,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [hasApplied, setHasApplied] = useState(false);

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
          // Calculate match score based on skills
          if (data.job.requiredSkills && data.job.requiredSkills.length > 0) {
            // Fetch user profile to get their skills
            fetch('/api/user/profile', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(userData => {
                if (userData.user && userData.user.skills) {
                  const userSkills = userData.user.skills.map((s: string) => s.toLowerCase());
                  const jobSkills = data.job.requiredSkills.map((s: string) => s.toLowerCase());
                  const matchingSkills = jobSkills.filter((skill: string) => 
                    userSkills.some((userSkill: string) => userSkill.includes(skill) || skill.includes(userSkill))
                  );
                  const score = Math.round((matchingSkills.length / jobSkills.length) * 100);
                  setMatchScore(score);
                }
              })
              .catch(err => console.error('Error fetching user profile:', err));
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching job:', err);
        setLoading(false);
      });

    // Check if user has already applied
    fetch('/api/applications', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.applications) {
          const applied = data.applications.some((app: any) => 
            app.jobId._id === params.id || app.jobId === params.id
          );
          setHasApplied(applied);
        }
      })
      .catch(err => console.error('Error checking applications:', err));
  }, [params.id, router]);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setApplying(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: params.id,
          coverLetter: 'Applied through the platform'
        })
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        router.push('/candidate/applications');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error applying:', err);
      alert('Failed to submit application');
    } finally {
      setApplying(false);
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
            <Link href="/candidate/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <LayoutDashboard className="w-5 h-5" /><span>Dashboard</span>
            </Link>
            <Link href="/candidate/jobs" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
              <Briefcase className="w-5 h-5" /><span>Find Jobs</span>
            </Link>
            <Link href="/candidate/applications" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5" /><span>Applications</span>
            </Link>
            <Link href="/candidate/messages" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5" /><span>Messages</span>
            </Link>
            <Link href="/candidate/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <User className="w-5 h-5" /><span>Profile</span>
            </Link>
            <Link href="/candidate/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
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
          <Link href="/candidate/jobs" className="flex items-center gap-2 text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading job details...</div>
            </div>
          ) : !job ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Job not found</div>
            </div>
          ) : (
            <div className="max-w-4xl">
              <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {typeof job.location === 'string' 
                          ? job.location 
                          : job.location?.city 
                            ? `${job.location.city}${job.location.state ? ', ' + job.location.state : ''}${job.location.country ? ', ' + job.location.country : ''}${job.location.remote ? ' (Remote)' : ''}`
                            : 'Not specified'
                        }
                      </span>
                    </div>
                  </div>
                  {matchScore > 0 && (
                    <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">{matchScore}% Match</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-xs text-gray-500">Salary</div>
                      <div className="font-semibold">${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="font-semibold capitalize">{job.jobType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">Experience</div>
                      <div className="font-semibold">{job.experienceLevel}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  disabled={applying || hasApplied}
                  className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    hasApplied 
                      ? 'bg-green-600 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  {hasApplied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now'}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
