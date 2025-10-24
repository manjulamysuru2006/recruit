'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RecruiterSidebar from '@/components/RecruiterSidebar';
import {
  ArrowLeft,
  Plus,
  X,
} from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    skills: [''],
    location: {
      city: '',
      state: '',
      country: '',
      remote: false,
    },
    jobType: 'full-time',
    experienceLevel: 'mid',
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'yearly',
    },
    benefits: [''],
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate salary range
      const minSalary = parseInt(formData.salary.min) || 0;
      const maxSalary = parseInt(formData.salary.max) || 0;
      
      if (minSalary > maxSalary && maxSalary > 0) {
        alert('Minimum salary cannot be greater than maximum salary');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      // Decode token to get userId (in production, do this server-side)
      const payload = JSON.parse(atob(token!.split('.')[1]));
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          recruiterId: payload.userId,
          requirements: formData.requirements.filter(r => r.trim()),
          responsibilities: formData.responsibilities.filter(r => r.trim()),
          skills: formData.skills.filter(s => s.trim()),
          benefits: formData.benefits.filter(b => b.trim()),
          salary: {
            ...formData.salary,
            min: minSalary,
            max: maxSalary,
          },
        }),
      });

      if (response.ok) {
        alert('Job posted successfully!');
        router.push('/recruiter/jobs');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field: 'requirements' | 'responsibilities' | 'skills' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeItem = (field: 'requirements' | 'responsibilities' | 'skills' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateItem = (field: 'requirements' | 'responsibilities' | 'skills' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <RecruiterSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <Link href="/recruiter/jobs" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 max-w-4xl">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the role, team, and what you're looking for..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      location: { ...formData.location, city: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.location.country}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      location: { ...formData.location, country: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="United States"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.location.remote}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, remote: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Remote OK</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (Yearly)</label>
                  <input
                    type="number"
                    value={formData.salary.min}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary: { ...formData.salary, min: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary (Yearly)</label>
                  <input
                    type="number"
                    value={formData.salary.max}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary: { ...formData.salary, max: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="120000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateItem('skills', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. React, Node.js, Python"
                    />
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('skills', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem('skills')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
                <Link
                  href="/recruiter/jobs"
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

