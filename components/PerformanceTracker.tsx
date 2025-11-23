import React, { useState } from 'react';
import { Users, Trophy, ChevronDown, ChevronUp, CheckCircle, XCircle, Gem, Shield, Hexagon, Triangle, AlertTriangle, Octagon, AlertCircle, Settings, Sliders, Calculator } from 'lucide-react';

// --- Types & Data Models ---

interface EventLog {
  name: string;
  date: string;
  attended: boolean;
  points: number;
}

interface EmployeeStats {
  id: string;
  name: string;
  role: string;
  pastScore: number;
  inactivityPenalty: number;
  events: EventLog[];
}

interface ScoringConfig {
  eventWeight: number;
  penaltyWeight: number;
}

// --- Mock Data ---

const employees: EmployeeStats[] = [
  { 
    id: 'EMP-9921', 
    name: 'Dev Team A', 
    role: 'Lead Engineer',
    pastScore: 85,
    inactivityPenalty: 0,
    events: [
      { name: 'Q3 Hackathon', date: '2023-10-15', attended: true, points: 10 },
      { name: 'Security Training', date: '2023-10-20', attended: true, points: 3 },
      { name: 'Mentorship Session', date: '2023-11-01', attended: false, points: 0 }, // Missed
    ]
  },
  { 
    id: 'EMP-5511', 
    name: 'Sarah J.', 
    role: 'Product Manager',
    pastScore: 88,
    inactivityPenalty: 0,
    events: [
      { name: 'Product Roadmap All-Hands', date: '2023-10-10', attended: true, points: 5 },
      { name: 'Client Workshop', date: '2023-10-22', attended: true, points: 5 },
    ]
  },
  { 
    id: 'EMP-3321', 
    name: 'Mike R.', 
    role: 'UX Designer',
    pastScore: 78,
    inactivityPenalty: 2, // Minor decay
    events: [
      { name: 'Design Crit', date: '2023-10-05', attended: true, points: 4 },
      { name: 'Accessibility Workshop', date: '2023-10-12', attended: false, points: 0 },
    ]
  },
  { 
    id: 'EMP-1102', 
    name: 'James L.', 
    role: 'Backend Dev',
    pastScore: 65,
    inactivityPenalty: 5,
    events: [
      { name: 'Code Review Sprint', date: '2023-10-01', attended: true, points: 5 },
    ]
  },
  { 
    id: 'EMP-4402', 
    name: 'Alex T.', 
    role: 'QA Tester',
    pastScore: 60,
    inactivityPenalty: 15, // High decay
    events: [
      { name: 'Auto-Test Training', date: '2023-10-05', attended: false, points: 0 },
      { name: 'Release Night', date: '2023-10-30', attended: true, points: 5 },
    ]
  },
  { 
    id: 'EMP-0012', 
    name: 'Robert D.', 
    role: 'Intern',
    pastScore: 45,
    inactivityPenalty: 10,
    events: [
        { name: 'Onboarding', date: '2023-11-01', attended: true, points: 5 }
    ]
  }
];

// --- Helper Functions ---

const calculateTotal = (emp: EmployeeStats, config: ScoringConfig) => {
  const rawEventPoints = emp.events.reduce((acc, curr) => acc + (curr.attended ? curr.points : 0), 0);
  
  // Apply Dynamic Weights
  const weightedEvents = rawEventPoints * config.eventWeight;
  const weightedPenalty = emp.inactivityPenalty * config.penaltyWeight;
  
  const total = emp.pastScore + weightedEvents - weightedPenalty;
  
  // Clamp between 0 and 100 and round to 1 decimal place
  return Math.max(0, Math.min(100, Math.round(total * 10) / 10));
};

const getRankDetails = (score: number) => {
  if (score >= 90) return {
    label: 'Diamond',
    icon: Gem,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    action: 'Promotion + bonus'
  };
  if (score >= 80) return {
    label: 'Gold',
    icon: Shield,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    action: 'Raise'
  };
  if (score >= 70) return {
    label: 'Silver',
    icon: Hexagon,
    color: 'text-slate-400',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    action: 'No salary change (good performance)'
  };
  if (score >= 60) return {
    label: 'Bronze',
    icon: Triangle,
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    action: 'No change but improvement required'
  };
  if (score >= 50) return {
    label: 'Warning',
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    action: 'Small penalty (e.g. reduce vacation)'
  };
  return {
    label: 'Red Zone',
    icon: Octagon,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    action: 'Big penalty (reduce sessions)'
  };
};

// --- Components ---

const EmployeeRow: React.FC<{ emp: EmployeeStats; config: ScoringConfig }> = ({ emp, config }) => {
  const [expanded, setExpanded] = useState(false);
  const finalScore = calculateTotal(emp, config);
  const rank = getRankDetails(finalScore);
  const RankIcon = rank.icon;

  const rawEventPoints = emp.events.reduce((acc, curr) => acc + (curr.attended ? curr.points : 0), 0);
  const weightedEvents = Math.round(rawEventPoints * config.eventWeight * 10) / 10;
  
  const rawPenalty = emp.inactivityPenalty;
  const weightedPenalty = Math.round(rawPenalty * config.penaltyWeight * 10) / 10;
  
  const attendanceRate = Math.round((emp.events.filter(e => e.attended).length / emp.events.length) * 100) || 0;

  return (
    <>
      <tr 
        onClick={() => setExpanded(!expanded)} 
        className={`cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${expanded ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
      >
        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{emp.id}</td>
        <td className="px-6 py-4">
            <div className="font-medium text-slate-900">{emp.name}</div>
            <div className="text-xs text-slate-500">{emp.role}</div>
        </td>
        <td className="px-6 py-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit border ${rank.bg} ${rank.border}`}>
                <RankIcon className={`w-4 h-4 ${rank.color}`} fill={rank.label === 'Gold' || rank.label === 'Bronze' ? 'currentColor' : 'none'} />
                <span className={`text-xs font-bold ${rank.color}`}>{rank.label}</span>
            </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
            {rank.action}
        </td>
        <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-3">
                <span className="text-xl font-bold text-slate-800">{finalScore}</span>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
        </td>
      </tr>
      
      {/* Expanded Detail View */}
      {expanded && (
        <tr className="bg-slate-50/50">
            <td colSpan={5} className="p-0">
                <div className="p-6 grid md:grid-cols-2 gap-8 border-b border-slate-100 animate-fade-in">
                    
                    {/* Score Calculation Logic */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                             <Calculator className="w-4 h-4" /> Custom Scoring Equation Audit
                        </h4>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Previous Cycle Score</span>
                                <span className="font-mono font-bold text-slate-700">{emp.pastScore}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm group relative">
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-500">Events Impact</span>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded">
                                        (Raw: {rawEventPoints}) × {config.eventWeight}
                                    </span>
                                </div>
                                <span className="font-mono font-bold text-green-600">+{weightedEvents}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-500">Inactivity Decay</span>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded">
                                        (Raw: {rawPenalty}) × {config.penaltyWeight}
                                    </span>
                                </div>
                                <span className="font-mono font-bold text-red-500">-{weightedPenalty}</span>
                            </div>
                            
                            <div className="h-px bg-slate-100 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">Final Cumulative Score</span>
                                <span className={`text-lg font-bold ${rank.color}`}>{finalScore}</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Event Log */}
                    <div className="space-y-4">
                         <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                             <Users className="w-4 h-4" /> Event Participation Log ({attendanceRate}%)
                        </h4>
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {emp.events.length > 0 ? (
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Event Name</th>
                                            <th className="px-4 py-2 text-left">Date</th>
                                            <th className="px-4 py-2 text-right">Raw Pts</th>
                                            <th className="px-4 py-2 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {emp.events.map((ev, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 font-medium text-slate-700">{ev.name}</td>
                                                <td className="px-4 py-2 text-slate-500">{ev.date}</td>
                                                <td className="px-4 py-2 text-right font-mono text-slate-600">
                                                    {ev.attended ? `+${ev.points}` : '0'}
                                                </td>
                                                <td className="px-4 py-2 flex justify-center">
                                                    {ev.attended ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-400" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-4 text-center text-slate-400 italic">No events logged this cycle.</div>
                            )}
                        </div>
                        {emp.inactivityPenalty > 0 && (
                            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                <AlertCircle className="w-3 h-3" />
                                <span>Raw Penalty: {emp.inactivityPenalty} (Adjusted: {weightedPenalty})</span>
                            </div>
                        )}
                    </div>

                </div>
            </td>
        </tr>
      )}
    </>
  );
};

const PerformanceTracker: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<ScoringConfig>({
    eventWeight: 1.0,
    penaltyWeight: 1.0
  });

  return (
    <div className="space-y-8">
        
        {/* Settings Toggle */}
        <div className="flex justify-end">
             <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border
                ${showSettings ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
                <Settings className="w-4 h-4" />
                Configure Algorithm Weights
             </button>
        </div>

        {/* Algorithm Settings Panel */}
        {showSettings && (
            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl animate-fade-in border border-slate-700">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold">Scoring Equation Parameters</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Event Weight Control */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300">Event Impact Factor</label>
                            <span className="text-sm font-bold text-indigo-400 font-mono">{config.eventWeight}x</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="2.5" 
                            step="0.1" 
                            value={config.eventWeight}
                            onChange={(e) => setConfig({...config, eventWeight: parseFloat(e.target.value)})}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <p className="text-xs text-slate-500">
                            Multiplies points earned from events. Higher values incentivize participation.
                        </p>
                    </div>

                    {/* Penalty Weight Control */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300">Inactivity Severity</label>
                            <span className="text-sm font-bold text-red-400 font-mono">{config.penaltyWeight}x</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="3.0" 
                            step="0.1" 
                            value={config.penaltyWeight}
                            onChange={(e) => setConfig({...config, penaltyWeight: parseFloat(e.target.value)})}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                         <p className="text-xs text-slate-500">
                            Multiplies decay penalties. Higher values strictly punish inactivity.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Header Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <Gem className="w-6 h-6 text-white/80" />
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Target</span>
                </div>
                <div className="text-2xl font-bold">90+ Score</div>
                <p className="text-xs text-blue-100 mt-1">Required for Promotion & Bonus</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-amber-500" fill="currentColor" />
                    <span className="font-bold text-slate-700">Gold Tier</span>
                </div>
                <div className="text-sm text-slate-500">Score 80-89</div>
                <div className="text-xs font-bold text-green-600 mt-2">Eligible for Raise</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <Triangle className="w-5 h-5 text-orange-600" fill="currentColor" />
                    <span className="font-bold text-slate-700">Bronze Tier</span>
                </div>
                <div className="text-sm text-slate-500">Score 60-69</div>
                <div className="text-xs font-bold text-orange-600 mt-2">Improvement Required</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <Octagon className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-slate-700">Red Zone</span>
                </div>
                <div className="text-sm text-slate-500">Score &lt; 50</div>
                <div className="text-xs font-bold text-red-600 mt-2">Major Penalty Active</div>
            </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Employee Ranking & Score Breakdown</h3>
                <p className="text-sm text-slate-500">Click on any row to view the full audit trail of how the score was calculated.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 w-24">ID</th>
                            <th className="px-6 py-4">Employee Details</th>
                            <th className="px-6 py-4">Rank Tier</th>
                            <th className="px-6 py-4">Projected Action</th>
                            <th className="px-6 py-4 text-right">Total Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {employees.map(emp => (
                            <EmployeeRow key={emp.id} emp={emp} config={config} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default PerformanceTracker;