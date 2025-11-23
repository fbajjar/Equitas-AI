import React, { useState } from 'react';
import { Lightbulb, GraduationCap, ArrowRight, AlertTriangle, MessageSquare, Plus, Check, ThumbsUp, Users, TrendingUp } from 'lucide-react';

interface SkillGap {
  id: number;
  taskCategory: string;
  missedCount: number;
  primaryTeam: string;
  missingSkill: string;
  urgency: 'High' | 'Medium' | 'Low';
  recommendation: string;
  source: 'AI-Detected' | 'User-Requested';
}

interface UserRequest {
  id: number;
  skill: string;
  reason: string;
  votes: number;
}

const TrainingRecommendations: React.FC = () => {
  // Initial Mock Data derived from AI analysis of missed tasks
  const [recommendations, setRecommendations] = useState<SkillGap[]>([
    {
      id: 1,
      taskCategory: "Backend API Integration",
      missedCount: 18,
      primaryTeam: "Eng Team B",
      missingSkill: "GraphQL Optimization",
      urgency: "High",
      recommendation: "Advanced GraphQL Performance Workshop",
      source: 'AI-Detected'
    },
    {
      id: 2,
      taskCategory: "Automated Testing",
      missedCount: 12,
      primaryTeam: "QA Team",
      missingSkill: "Cypress / E2E Scripting",
      urgency: "Medium",
      recommendation: "Modern E2E Testing Certification Course",
      source: 'AI-Detected'
    },
    {
      id: 3,
      taskCategory: "Cloud Infrastructure",
      missedCount: 7,
      primaryTeam: "Eng Team A",
      missingSkill: "Kubernetes Debugging",
      urgency: "Low",
      recommendation: "Cloud Native Essentials Training",
      source: 'AI-Detected'
    }
  ]);

  const [requests, setRequests] = useState<UserRequest[]>([
    { id: 101, skill: "Rust Programming", reason: "Upcoming project requirement", votes: 3 },
    { id: 102, skill: "Public Speaking", reason: "Team leads want better presentation skills", votes: 5 }
  ]);

  const [newRequest, setNewRequest] = useState({ skill: '', reason: '' });
  const [showForm, setShowForm] = useState(false);

  // Simulate AI processing user feedback into a formal recommendation
  const handleAddRequest = () => {
    if (!newRequest.skill) return;
    
    // Add to requests list
    const request: UserRequest = {
        id: Date.now(),
        skill: newRequest.skill,
        reason: newRequest.reason,
        votes: 1
    };
    setRequests([...requests, request]);
    
    // Simulate AI "Thinking" and promoting high-vote items to main recommendations
    if (newRequest.reason.toLowerCase().includes("urgent") || requests.length > 0) {
        setTimeout(() => {
            const newRec: SkillGap = {
                id: Date.now() + 1,
                taskCategory: "Employee Requested",
                missedCount: 0,
                primaryTeam: "Cross-Functional",
                missingSkill: newRequest.skill,
                urgency: "Medium",
                recommendation: `${newRequest.skill} Intensive Bootcamp`,
                source: 'User-Requested'
            };
            setRecommendations(prev => [newRec, ...prev]);
        }, 1500);
    }

    setNewRequest({ skill: '', reason: '' });
    setShowForm(false);
  };

  const handleVote = (id: number) => {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r));
  };

  return (
    <div className="space-y-8 animate-fade-in">
        
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800">14%</h3>
                  <p className="text-xs text-slate-500">Productivity Boost Potential</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800">{recommendations.filter(r => r.urgency === 'High').length}</h3>
                  <p className="text-xs text-slate-500">Critical Skill Gaps Detected</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-teal-100 text-teal-600 rounded-lg">
                  <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-slate-800">{requests.length}</h3>
                  <p className="text-xs text-slate-500">Employee Training Requests</p>
              </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main AI Recommendations List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">AI Training Recommendations</h3>
                        <p className="text-xs text-slate-500">Correlated from incomplete tasks & employee feedback.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {recommendations.map((gap) => (
                    <div key={gap.id} className={`border rounded-xl p-5 transition-all hover:shadow-md
                        ${gap.source === 'User-Requested' ? 'bg-teal-50/50 border-teal-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{gap.taskCategory}</span>
                                {gap.source === 'User-Requested' && (
                                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Requested
                                    </span>
                                )}
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                ${gap.urgency === 'High' ? 'bg-red-100 text-red-600' : 
                                gap.urgency === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                {gap.urgency} Priority
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    {gap.recommendation}
                                </div>
                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                    To address: <span className="font-medium text-slate-700">{gap.missingSkill}</span>
                                    {gap.source === 'AI-Detected' && 
                                        <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 ml-2">
                                            {gap.missedCount} related tasks stalled
                                        </span>
                                    }
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap">
                                Assign Training
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Feedback & Requests Panel */}
          <div className="space-y-6">
              
              {/* Request Form */}
              <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-bold">Request Training</h3>
                  </div>
                  {!showForm ? (
                      <button 
                        onClick={() => setShowForm(true)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                          <Plus className="w-4 h-4" /> Submit Request
                      </button>
                  ) : (
                      <div className="space-y-3 animate-fade-in">
                          <input 
                            type="text" 
                            placeholder="Skill needed (e.g. Advanced SQL)"
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-500"
                            value={newRequest.skill}
                            onChange={e => setNewRequest({...newRequest, skill: e.target.value})}
                          />
                          <input 
                            type="text" 
                            placeholder="Reason / Context"
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-500"
                            value={newRequest.reason}
                            onChange={e => setNewRequest({...newRequest, reason: e.target.value})}
                          />
                          <div className="flex gap-2">
                              <button 
                                onClick={handleAddRequest}
                                className="flex-1 py-2 bg-indigo-600 rounded text-sm font-medium hover:bg-indigo-500"
                              >
                                  Submit
                              </button>
                              <button 
                                onClick={() => setShowForm(false)}
                                className="px-3 py-2 bg-slate-700 rounded text-sm hover:bg-slate-600"
                              >
                                  Cancel
                              </button>
                          </div>
                      </div>
                  )}
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      "AI analyzes these requests. High-demand topics are automatically promoted to the main recommendation engine."
                  </p>
              </div>

              {/* Voting List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Pending Requests</h4>
                  <div className="space-y-3">
                      {requests.map(req => (
                          <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
                              <div>
                                  <div className="text-sm font-bold text-slate-700">{req.skill}</div>
                                  <div className="text-xs text-slate-500">{req.reason}</div>
                              </div>
                              <button 
                                onClick={() => handleVote(req.id)}
                                className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                              >
                                  <ThumbsUp className="w-3 h-3" /> {req.votes}
                              </button>
                          </div>
                      ))}
                      {requests.length === 0 && <p className="text-sm text-slate-400 italic">No pending requests.</p>}
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default TrainingRecommendations;