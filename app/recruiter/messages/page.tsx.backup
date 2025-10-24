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
  Send,
  Target,
} from 'lucide-react';

export default function RecruiterMessagesPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchApplications();
  }, [router]);

  const fetchMessages = async () => {
    if (!selectedApplication?._id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${selectedApplication._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (selectedApplication?._id) {
      fetchMessages();
      const interval = setInterval(() => {
        fetchMessages();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedApplication]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get all recruiter's jobs
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
        if (allApplications.length > 0 && !selectedApplication) {
          setSelectedApplication(allApplications[0]);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedApplication || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${selectedApplication._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: message })
      });

      if (response.ok) {
        setMessage('');
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            <Link href="/recruiter/candidates" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Users className="w-5 h-5" /><span>Applications</span>
            </Link>
            <Link href="/recruiter/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <BarChart3 className="w-5 h-5" /><span>Analytics</span>
            </Link>
            <Link href="/recruiter/messages" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
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
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Chat with candidates</p>
        </div>

        <div className="h-[calc(100vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading conversations...</div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 m-8">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Once candidates apply to your jobs, you can message them here</p>
              <Link
                href="/recruiter/jobs/new"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="flex h-full">
              {/* Candidates List */}
              <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Candidates ({applications.length})</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {applications.map((application: any) => (
                    <button
                      key={application._id}
                      onClick={() => setSelectedApplication(application)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedApplication?._id === application._id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {application.candidateId?.profile?.firstName || 'Candidate'} {application.candidateId?.profile?.lastName || ''}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'offered' ? 'bg-green-100 text-green-700' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          application.status === 'interviewing' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {application.jobInfo?.title || application.jobId?.title || 'Position'}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {application.candidateId?.email || 'No email'}
                        </p>
                        {application.matchScore && (
                          <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full">
                            <Target className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-semibold text-green-700">
                              {application.matchScore}%
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-gray-50">
                {selectedApplication ? (
                  <>
                    {/* Chat Header */}
                    <div className="bg-white border-b border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedApplication.candidateId?.profile?.firstName || 'Candidate'} {selectedApplication.candidateId?.profile?.lastName || ''}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Applied for: {selectedApplication.jobInfo?.title || selectedApplication.jobId?.title || 'Position'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedApplication.candidateId?.email} • Applied {new Date(selectedApplication.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((msg: any, index: number) => {
                          const token = localStorage.getItem('token');
                          let decoded: any = null;
                          if (token) {
                            try {
                              decoded = JSON.parse(atob(token.split('.')[1]));
                            } catch (e) {}
                          }
                          const isOwnMessage = decoded && msg.sender === decoded.userId;
                          
                          return (
                            <div
                              key={msg._id || index}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-md px-4 py-3 rounded-lg ${
                                  isOwnMessage
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                              >
                                <p>{msg.content}</p>
                                <p className={`text-xs mt-1 ${
                                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          disabled={!message.trim() || sending}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          {sending ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select a candidate to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
