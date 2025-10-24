'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Send,
} from 'lucide-react';

export default function CandidateMessagesPage() {
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

  useEffect(() => {
    if (selectedApplication) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedApplication]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.applications) {
        setApplications(data.applications);
        if (data.applications.length > 0 && !selectedApplication) {
          setSelectedApplication(data.applications[0]);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedApplication) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${selectedApplication._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
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
        body: JSON.stringify({ content: message.trim() })
      });

      if (response.ok) {
        setMessage('');
        await fetchMessages(); // Refresh messages
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Loom</span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/candidate/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/candidate/jobs"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Search className="w-5 h-5" />
              <span>Find Jobs</span>
            </Link>
            <Link
              href="/candidate/applications"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <FileText className="w-5 h-5" />
              <span>Applications</span>
            </Link>
            <Link
              href="/candidate/messages"
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/candidate/profile"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              <span>Profile</span>
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

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Chat with recruiters</p>
        </div>

        <div className="h-[calc(100vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 m-8">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Once you apply to jobs, you can chat with recruiters here</p>
              <Link 
                href="/candidate/jobs"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="flex h-full">
              {/* Conversation List */}
              <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Conversations</h3>
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
                          {application.jobId?.company || 'Company'}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'hired' ? 'bg-green-100 text-green-700' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          application.status === 'interviewing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {application.jobId?.title || 'Job Title'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </p>
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
                        {selectedApplication.jobId?.company || 'Company'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedApplication.jobId?.title || 'Job Title'}
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
                      <p className="text-gray-600">Select a conversation to start messaging</p>
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

