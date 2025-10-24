'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Briefcase, FileText, MessageSquare, User, Settings, LogOut } from 'lucide-react';

export default function CandidateSettingsPage() {
  const router = useRouter();
  useEffect(() => { const token = localStorage.getItem('token'); if (!token) router.push('/auth/login'); }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8"><Briefcase className="w-8 h-8 text-blue-600" /><span className="text-xl font-bold">Loom</span></div>
          <nav className="space-y-2">
            <Link href="/candidate/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"><LayoutDashboard className="w-5 h-5" /><span>Dashboard</span></Link>
            <Link href="/candidate/jobs" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"><Briefcase className="w-5 h-5" /><span>Find Jobs</span></Link>
            <Link href="/candidate/applications" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"><FileText className="w-5 h-5" /><span>Applications</span></Link>
            <Link href="/candidate/messages" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"><MessageSquare className="w-5 h-5" /><span>Messages</span></Link>
            <Link href="/candidate/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"><User className="w-5 h-5" /><span>Profile</span></Link>
            <Link href="/candidate/settings" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"><Settings className="w-5 h-5" /><span>Settings</span></Link>
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button onClick={() => { localStorage.removeItem('token'); router.push('/'); }} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"><LogOut className="w-5 h-5" /><span>Logout</span></button>
        </div>
      </div>
      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-8 py-6"><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-gray-600">Manage your account preferences</p></div>
        <div className="p-8"><div className="bg-white rounded-xl border border-gray-200 p-8 max-w-3xl"><h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2><p className="text-gray-600">Settings page coming soon...</p></div></div>
      </div>
    </div>
  );
}

