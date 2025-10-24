'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CandidateSidebar from '@/components/CandidateSidebar';
import ATSScanner from '@/components/ATSScanner';

export default function CandidateATSPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CandidateSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered ATS Resume Scanner</h1>
          <p className="text-gray-600">Analyze your resume and get real-time improvement suggestions</p>
        </div>

        <div className="p-8">
          <ATSScanner />
        </div>
      </div>
    </div>
  );
}

