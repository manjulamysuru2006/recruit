'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Target,
} from 'lucide-react';

export default function RecruiterSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Briefcase className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold">Loom Recruiting Platform</span>
        </div>

        <nav className="space-y-2">
          <Link
            href="/recruiter/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/recruiter/dashboard')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/recruiter/jobs"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/recruiter/jobs') || pathname?.startsWith('/recruiter/jobs/')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Jobs</span>
          </Link>
          <Link
            href="/recruiter/candidates"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/recruiter/candidates')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Candidates</span>
          </Link>
          <Link
            href="/recruiter/pipeline"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/recruiter/pipeline')
                ? 'bg-purple-50 text-purple-600 font-medium'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Interview Pipeline</span>
          </Link>
          <Link
            href="/recruiter/analytics"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/recruiter/analytics')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/recruiter/messages"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/recruiter/messages')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Link>
          <Link
            href="/recruiter/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/recruiter/settings')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
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
  );
}
