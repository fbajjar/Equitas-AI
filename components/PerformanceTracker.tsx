import React from 'react';
import { Users, Trophy, Clock, Calendar } from 'lucide-react';

// Mock Data for the Scoring System
const engagementScores = [
  { id: 'EMP-9921', name: 'Dev Team A', attendance: 95, perfRank: 'Top 10%', decay: 0, score: 98, events: 12 },
  { id: 'EMP-3321', name: 'Design Lead', attendance: 92, perfRank: 'Top 20%', decay: 2, score: 90, events: 10 },
  { id: 'EMP-1102', name: 'Backend Eng', attendance: 88, perfRank: 'Average', decay: 5, score: 83, events: 8 },
  { id: 'EMP-4402', name: 'QA Specialist', attendance: 70, perfRank: 'Bottom 30%', decay: 15, score: 55, events: 4 },
  { id: 'EMP-5511', name: 'Product Mgr', attendance: 98, perfRank: 'Top 5%', decay: 0, score: 99, events: 14 },
];

const PerformanceTracker: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Trophy className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Top Performer</p>
                <h3 className="text-xl font-bold text-slate-800">Dev Team A</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <Calendar className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Avg Event Attendance</p>
                <h3 className="text-xl font-bold text-slate-800">88.4%</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <Clock className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Inactivity Alerts</p>
                <h3 className="text-xl font-bold text-slate-800">3 Employees</h3>
            </div>
        </div>
      </div>

      {/* Main Scoring Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                  <h3 className="text-lg font-bold text-slate-800">Engagement & Performance Scoring</h3>
                  <p className="text-xs text-slate-500">Live tracking of event participation, performance ranking, and inactivity decay.</p>
              </div>
              <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-4">Employee ID</th>
                          <th className="px-6 py-4">Role / Team</th>
                          <th className="px-6 py-4">Event Attendance</th>
                          <th className="px-6 py-4">Perf. Rank</th>
                          <th className="px-6 py-4 text-red-500">Inactivity Decay</th>
                          <th className="px-6 py-4 text-right">Net Score</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {engagementScores.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="px-6 py-4 font-mono text-slate-600 font-medium">{emp.id}</td>
                              <td className="px-6 py-4 text-slate-700">{emp.name}</td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full ${emp.attendance > 90 ? 'bg-green-500' : emp.attendance > 75 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{width: `${emp.attendance}%`}}></div>
                                      </div>
                                      <span className="text-xs font-medium text-slate-600">{emp.attendance}%</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-slate-700">
                                  <span className="px-2 py-1 bg-slate-100 rounded text-xs border border-slate-200">{emp.perfRank}</span>
                              </td>
                              <td className="px-6 py-4 text-red-500 font-medium">-{emp.decay} pts</td>
                              <td className="px-6 py-4 text-right">
                                  <span className={`inline-block w-16 text-center py-1 rounded-md text-xs font-bold border 
                                      ${emp.score > 90 ? 'bg-green-50 text-green-700 border-green-200' : 
                                        emp.score < 60 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                      {emp.score}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400">
              Scoring algorithm updates daily at 00:00 UTC based on logged activities and peer reviews.
          </div>
      </div>
    </div>
  );
};

export default PerformanceTracker;