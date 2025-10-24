'use client';

import { useState, useEffect } from 'react';
import { Users, ChevronRight, CheckCircle, Clock, XCircle, Star, MessageSquare, TrendingUp, Award } from 'lucide-react';

interface Pipeline {
  _id: string;
  candidateId: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
  };
  jobId: {
    title: string;
    company: string;
  };
  currentStage: string;
  stages: any[];
  resumeScore: number;
  status: string;
  notes: any[];
}

export default function InterviewPipelineManager() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/interview-pipeline', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.pipelines) {
        setPipelines(data.pipelines);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      setLoading(false);
    }
  };

  const moveToNext = async (pipelineId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/interview-pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pipelineId: pipelineId,
          action: 'move_to_next',
        })
      });

      if (response.ok) {
        alert('Candidate moved to next stage!');
        await fetchPipelines();
        // Refresh the selected pipeline
        const updatedPipeline = pipelines.find(p => p._id === pipelineId);
        if (updatedPipeline) {
          setSelectedPipeline(updatedPipeline);
        }
      }
    } catch (error) {
      console.error('Error moving candidate:', error);
    }
  };

  const rejectCandidate = async () => {
    if (!confirm('Are you sure you want to reject this candidate?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/interview-pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pipelineId: selectedPipeline?._id,
          action: 'reject',
        })
      });

      if (response.ok) {
        alert('Candidate rejected');
        await fetchPipelines();
        setSelectedPipeline(null);
      }
    } catch (error) {
      console.error('Error rejecting candidate:', error);
    }
  };

  const hireCandidate = async () => {
    if (!confirm('Confirm hiring this candidate?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/interview-pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pipelineId: selectedPipeline?._id,
          action: 'hire',
        })
      });

      if (response.ok) {
        alert('🎉 Candidate hired!');
        await fetchPipelines();
        setSelectedPipeline(null);
      }
    } catch (error) {
      console.error('Error hiring candidate:', error);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/interview-pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pipelineId: selectedPipeline?._id,
          action: 'add_note',
          note,
        })
      });

      if (response.ok) {
        setNote('');
        await fetchPipelines();
        // Refresh the selected pipeline
        if (selectedPipeline) {
          const updatedPipeline = pipelines.find(p => p._id === selectedPipeline._id);
          if (updatedPipeline) {
            setSelectedPipeline(updatedPipeline);
          }
        }
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading pipeline...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Candidates List */}
      <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Candidates in Pipeline ({pipelines.length})
        </h3>
        
        {pipelines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm">No candidates in pipeline</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pipelines.map((pipeline) => (
              <button
                key={pipeline._id}
                onClick={() => setSelectedPipeline(pipeline)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedPipeline?._id === pipeline._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{pipeline.candidateId.name}</div>
                <div className="text-sm text-gray-600 mb-2">{pipeline.jobId.title}</div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pipeline.status === 'active' ? 'bg-green-100 text-green-700' :
                    pipeline.status === 'hired' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {pipeline.currentStage.replace(/_/g, ' ')}
                  </span>
                  {pipeline.resumeScore > 0 && (
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <Award className="w-3 h-3" />
                      {pipeline.resumeScore}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pipeline Details */}
      <div className="col-span-2">
        {!selectedPipeline ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a candidate</h3>
            <p className="text-gray-600">Choose a candidate to view their interview pipeline</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Candidate Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedPipeline.candidateId.name}</h3>
                  <p className="text-gray-600">{selectedPipeline.jobId.title}</p>
                  <p className="text-sm text-gray-500">{selectedPipeline.candidateId.email}</p>
                </div>
                {selectedPipeline.resumeScore > 0 && (
                  <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-700">{selectedPipeline.resumeScore}</div>
                    <div className="text-xs text-yellow-600">ATS Score</div>
                  </div>
                )}
              </div>
              
              {selectedPipeline.candidateId.skills && selectedPipeline.candidateId.skills.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Skills:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPipeline.candidateId.skills.map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interview Stages */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Interview Stages</h3>
              
              <div className="space-y-3">
                {selectedPipeline.stages.map((stage: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getStageIcon(stage.status)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{stage.name}</div>
                      {stage.feedback && (
                        <div className="text-sm text-gray-600 mt-1">{stage.feedback}</div>
                      )}
                      {stage.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < stage.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">{stage.status}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                {selectedPipeline.status === 'active' && (
                  <>
                    <button
                      onClick={() => moveToNext(selectedPipeline._id)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <ChevronRight className="w-5 h-5" />
                      Move to Next Stage
                    </button>
                    <button
                      onClick={hireCandidate}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Hire
                    </button>
                    <button
                      onClick={rejectCandidate}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Notes
              </h3>
              
              <div className="space-y-3 mb-4">
                {selectedPipeline.notes.map((noteItem: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{noteItem.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(noteItem.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addNote()}
                />
                <button
                  onClick={addNote}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
