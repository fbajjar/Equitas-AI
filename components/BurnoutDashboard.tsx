import React, { useState } from 'react';
import { generateSpecialistReport, BurnoutReport } from '../services/geminiService';
import { Activity, AlertTriangle, FileText, X, TrendingDown, Clock, Heart, Watch, Eye, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock Data for Workload Distribution
const workloadData = [
  { name: 'Eng Team A', assigned: 45, completed: 42, stress: 30 },
  { name: 'Eng Team B', assigned: 55, completed: 30, stress: 85 }, // High stress, low completion
  { name: 'Design', assigned: 30, completed: 28, stress: 20 },
  { name: 'QA', assigned: 40, completed: 35, stress: 45 },
  { name: 'Marketing', assigned: 25, completed: 25, stress: 15 },
];

const BurnoutDashboard: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [report, setReport] = useState<BurnoutReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const handleFlaggedClick = async () => {
    setSelectedEmployee('EMP-8842-FLAGGED');
    setLoadingReport(true);
    setReport(null);
    try {
        const metrics = { overtime: "14h/week", decay: 22 };
        const data = await generateSpecialistReport('EMP-8842', metrics);
        setReport(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingReport(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Warning Banner for Flagged Employee */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-red-900">Critical Burnout Alert Detected</h3>
                <p className="text-sm text-red-700">
                    Employee <span className="font-mono font-bold">ID: EMP-8842</span> flagged by AI Monitor.
                    <br/><span className="text-xs opacity-75">Triggers: High Workload + Negative Sentiment + Sleep Deprivation (IoT).</span>
                </p>
            </div>
        </div>
        <button 
            onClick={handleFlaggedClick}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow hover:shadow-lg transition-all text-sm flex items-center gap-2 whitespace-nowrap"
        >
            <FileText className="w-4 h-4" />
            Generate Specialist Report
        </button>
      </div>

      {/* IoT Integration Section */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Live Biometric & IoT Feeds
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
                    <Heart className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs text-slate-500">Avg Heart Rate</div>
                    <div className="font-bold text-slate-800">72 BPM</div>
                    <div className="text-[10px] text-green-500 font-medium">Within Normal Range</div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Watch className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs text-slate-500">SmartBand Data</div>
                    <div className="font-bold text-slate-800">High Stress</div>
                    <div className="text-[10px] text-red-500 font-medium">3 employees > 80%</div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Eye className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs text-slate-500">Computer Vision</div>
                    <div className="font-bold text-slate-800">Fatigue Signs</div>
                    <div className="text-[10px] text-orange-500 font-medium">Detected in Team B</div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs text-slate-500">Sleep Tracking</div>
                    <div className="font-bold text-slate-800">6.2 hrs avg</div>
                    <div className="text-[10px] text-slate-400 font-medium">Syncs daily at 9am</div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Workload Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Workload Distribution</h3>
                    <p className="text-xs text-slate-500">Assigned Tasks vs. Completion Rate (Stress correlated)</p>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workloadData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" />
                        <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            cursor={{fill: '#f1f5f9'}}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                        <Bar name="Tasks Assigned" dataKey="assigned" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar name="Tasks Completed" dataKey="completed" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Global Wellness Stats */}
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" /> Overall Health
                </h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                            <span>Work-Life Balance</span>
                            <span className="text-yellow-400 font-bold">Strained</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                             <div className="bg-yellow-400 h-full w-[60%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                            <span>Avg. Stress Level</span>
                            <span className="text-white font-bold">Moderate</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                             <div className="bg-indigo-400 h-full w-[45%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                            <span>Burnout Risk</span>
                            <span className="text-red-400 font-bold">High (Team B)</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                             <div className="bg-red-400 h-full w-[85%]"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-400 leading-relaxed">
                    AI Monitor is active. Data aggregated from 3 data points: Jira logs, Slack sentiment, and Volunteer Biometrics.
                </p>
            </div>
        </div>
      </div>

      {/* Specialist Report Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Confidential Specialist Report</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Generated by Gemini 2.5 • ID: {selectedEmployee}</p>
                    </div>
                    <button onClick={() => setSelectedEmployee(null)} className="p-2 hover:bg-slate-200 rounded-full">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-8">
                    {loadingReport ? (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                            <Activity className="w-10 h-10 animate-bounce mb-4 text-indigo-500" />
                            <p>Compiling cross-modal data (Performance, Bio, Sentiment)...</p>
                        </div>
                    ) : report ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                                <div className="text-red-600 font-bold text-xl">{report.riskSeverity} Risk</div>
                                <div className="h-8 w-px bg-red-200"></div>
                                <div className="text-sm text-red-800">
                                    Immediate intervention recommended. IoT data confirms elevated stress markers during non-working hours.
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-2">Workload & Context Analysis</h4>
                                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded border border-slate-100">
                                    {report.workloadAnalysis}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Trigger Events</h4>
                                    <ul className="space-y-1">
                                        {report.burnoutIndicators.map((ind, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                                <TrendingDown className="w-4 h-4 text-red-500" />
                                                {ind}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Biometrics (Avg)</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-700 mb-1">
                                        <Clock className="w-4 h-4 text-indigo-500" />
                                        Sleep: <span className="font-mono text-red-500">4.5 hrs</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-700 mb-1">
                                        <Heart className="w-4 h-4 text-rose-500" />
                                        Resting HR: <span className="font-mono text-red-500">85 BPM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                                <h4 className="text-sm font-bold text-indigo-900 mb-2">Specialist Recommendation</h4>
                                <p className="text-indigo-800 text-sm">
                                    {report.recommendationForSpecialist}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={() => setSelectedEmployee(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium">Close</button>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg">Export Report</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BurnoutDashboard;