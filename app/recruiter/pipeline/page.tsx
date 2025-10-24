'use client';

import { useEffect } from 'react';
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
  GitBranch,
} from 'lucide-react';
import InterviewPipelineManager from '@/components/InterviewPipelineManager';

export default function RecruiterPipelinePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth/login');
  }, [router]);

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
            <Link href="/recruiter/jobs" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Briefcase className="w-5 h-5" /><span>Jobs</span>
            </Link>
            <Link href="/recruiter/pipeline" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
              <GitBranch className="w-5 h-5" /><span>Interview Pipeline</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Interview Pipeline Manager</h1>
          <p className="text-gray-600">Track candidates through interview stages</p>
        </div>

        <div className="p-8">
          <InterviewPipelineManager />
        </div>
      </div>
    </div>
  );
}
