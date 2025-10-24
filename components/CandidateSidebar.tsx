'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  Search,
  Brain,
} from 'lucide-react';

export default function CandidateSidebar() {
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
            href="/candidate/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/candidate/dashboard')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/candidate/jobs"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/candidate/jobs') || pathname?.startsWith('/candidate/jobs/')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Find Jobs</span>
          </Link>
          <Link
            href="/candidate/applications"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/candidate/applications')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>My Applications</span>
          </Link>
          <Link
            href="/candidate/ats-scanner"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/candidate/ats-scanner')
                ? 'bg-purple-50 text-purple-600 font-medium'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>AI Resume Scanner</span>
          </Link>
          <Link
            href="/candidate/ai-features"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg relative ${
              isActive('/candidate/ai-features')
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600 font-medium'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span>AI Features</span>
            <span className="absolute right-3 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-normal">NEW</span>
          </Link>
          <Link
            href="/candidate/messages"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/candidate/messages')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Link>
          <Link
            href="/candidate/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/candidate/profile')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link
            href="/candidate/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive('/candidate/settings')
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
