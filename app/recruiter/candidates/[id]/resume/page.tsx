'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
} from 'lucide-react';

export default function CandidateResumePage() {
  const router = useRouter();
  const params = useParams();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch candidate profile
    fetch(`/api/user/profile?userId=${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setCandidate(data.profile);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching candidate:', err);
        setLoading(false);
      });
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <RecruiterSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading candidate resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <RecruiterSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Candidate not found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <RecruiterSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {candidate.name || candidate.email}
              </h1>
              <p className="text-gray-600">Candidate Resume</p>
            </div>
          </div>
          
          {candidate.resume && (
            <button
              onClick={() => {
                // Download resume
                const link = document.createElement('a');
                link.href = candidate.resume;
                link.download = `${candidate.name || 'candidate'}_resume.pdf`;
                link.click();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </button>
          )}
        </div>

        {/* Resume Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl">
          {/* Contact Information */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {candidate.name || 'Candidate Name'}
            </h2>
            <div className="flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              {candidate.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{candidate.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {candidate.summary && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Professional Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {candidate.experience && candidate.experience.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Work Experience
              </h3>
              <div className="space-y-6">
                {candidate.experience.map((exp: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Education
              </h3>
              <div className="space-y-6">
                {candidate.education.map((edu: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.year}
                      </div>
                    </div>
                    {edu.gpa && (
                      <p className="text-gray-700 mt-2">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume Text (if no structured data) */}
          {candidate.resumeText && !candidate.experience && !candidate.education && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Resume Content</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                  {candidate.resumeText}
                </pre>
              </div>
            </div>
          )}

          {/* No Resume Message */}
          {!candidate.resume && !candidate.resumeText && !candidate.experience && !candidate.education && (
            <div className="text-center py-12">
              <p className="text-gray-500">No resume available for this candidate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
