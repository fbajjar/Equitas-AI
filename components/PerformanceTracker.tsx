import React, { useState, useMemo } from 'react';
import { Users, ChevronDown, ChevronUp, CheckCircle, XCircle, Gem, Shield, Hexagon, Triangle, AlertTriangle, Octagon, AlertCircle, Settings, Sliders, Calculator, Edit3, Target, Plus, Trash2, Save, X } from 'lucide-react';

// --- Types & Data Models ---

interface EventLog {
  name: string;
  date: string;
  attended: boolean;
  defaultPoints: number; // Legacy ref, strictly we use the eventScores map now
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

const initialEmployeesData: EmployeeStats[] = [
  { 
    id: 'EMP-9921', 
    name: 'Dev Team A', 
    role: 'Lead Engineer',
    pastScore: 85,
    inactivityPenalty: 0,
    events: [
      { name: 'Q3 Hackathon', date: '2023-10-15', attended: true, defaultPoints: 10 },
      { name: 'Security Training', date: '2023-10-20', attended: true, defaultPoints: 3 },
      { name: 'Mentorship Session', date: '2023-11-01', attended: false, defaultPoints: 5 },
    ]
  },
  { 
    id: 'EMP-5511', 
    name: 'Sarah J.', 
    role: 'Product Manager',
    pastScore: 88,
    inactivityPenalty: 0,
    events: [
      { name: 'Product Roadmap All-Hands', date: '2023-10-10', attended: true, defaultPoints: 5 },
      { name: 'Client Workshop', date: '2023-10-22', attended: true, defaultPoints: 5 },
    ]
  },
  { 
    id: 'EMP-3321', 
    name: 'Mike R.', 
    role: 'UX Designer',
    pastScore: 78,
    inactivityPenalty: 2, 
    events: [
      { name: 'Design Crit', date: '2023-10-05', attended: true, defaultPoints: 4 },
      { name: 'Accessibility Workshop', date: '2023-10-12', attended: false, defaultPoints: 4 },
    ]
  },
  { 
    id: 'EMP-1102', 
    name: 'James L.', 
    role: 'Backend Dev',
    pastScore: 65,
    inactivityPenalty: 5,
    events: [
      { name: 'Code Review Sprint', date: '2023-10-01', attended: true, defaultPoints: 5 },
    ]
  },
  { 
    id: 'EMP-4402', 
    name: 'Alex T.', 
    role: 'QA Tester',
    pastScore: 60,
    inactivityPenalty: 15, 
    events: [
      { name: 'Auto-Test Training', date: '2023-10-05', attended: false, defaultPoints: 5 },
      { name: 'Release Night', date: '2023-10-30', attended: true, defaultPoints: 5 },
    ]
  },
  { 
    id: 'EMP-0012', 
    name: 'Robert D.', 
    role: 'Intern',
    pastScore: 45,
    inactivityPenalty: 10,
    events: [
        { name: 'Onboarding', date: '2023-11-01', attended: true, defaultPoints: 5 }
    ]
  }
];

// --- Helper Functions ---

const calculateTotal = (emp: EmployeeStats, config: ScoringConfig, eventScores: Record<string, number>) => {
  const rawEventPoints = emp.events.reduce((acc, curr) => {
    const points = eventScores[curr.name] || 0;
    return acc + (curr.attended ? points : 0);
  }, 0);
  
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
    color: 'text-slate-500',
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

const EmployeeRow: React.FC<{ emp: EmployeeStats; config: ScoringConfig; eventScores: Record<string, number> }> = ({ emp, config, eventScores }) => {
  const [expanded, setExpanded] = useState(false);
  const finalScore = calculateTotal(emp, config, eventScores);
  const rank = getRankDetails(finalScore);
  const RankIcon = rank.icon;

  const rawEventPoints = emp.events.reduce((acc, curr) => {
      const points = eventScores[curr.name] || 0;
      return acc + (curr.attended ? points : 0);
  }, 0);

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
                             <Calculator className="w-4 h-4" /> Score Calculation Audit
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
                                            <th className="px-4 py-2 text-right">Value</th>
                                            <th className="px-4 py-2 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {emp.events.map((ev, i) => {
                                            const currentPoints = eventScores[ev.name] || 0;
                                            return (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 font-medium text-slate-700">{ev.name}</td>
                                                    <td className="px-4 py-2 text-slate-500">{ev.date}</td>
                                                    <td className="px-4 py-2 text-right font-mono text-slate-600">
                                                        {ev.attended ? `+${currentPoints}` : '0'}
                                                    </td>
                                                    <td className="px-4 py-2 flex justify-center">
                                                        {ev.attended ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-400" />
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
  
  // State for global configuration
  const [config, setConfig] = useState<ScoringConfig>({
    eventWeight: 1.0,
    penaltyWeight: 1.0
  });

  // State for employees
  const [employees, setEmployees] = useState<EmployeeStats[]>(initialEmployeesData);

  // State for individual event scores (initialized from mock data)
  const [eventScores, setEventScores] = useState<Record<string, number>>(() => {
      const scores: Record<string, number> = {};
      initialEmployeesData.forEach(emp => {
          emp.events.forEach(ev => {
              if (scores[ev.name] === undefined) {
                  scores[ev.name] = ev.defaultPoints;
              }
          });
      });
      return scores;
  });

  const [newEventName, setNewEventName] = useState('');
  const [newEventPoints, setNewEventPoints] = useState(5);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [editNameBuffer, setEditNameBuffer] = useState('');

  // Extract unique event names for the settings list
  const uniqueEventNames = useMemo(() => Object.keys(eventScores), [eventScores]);

  const updateEventScore = (eventName: string, newPoints: number) => {
      setEventScores(prev => ({
          ...prev,
          [eventName]: isNaN(newPoints) ? 0 : newPoints
      }));
  };

  const handleAddEvent = () => {
    if (!newEventName.trim()) return;
    if (eventScores[newEventName]) {
        alert("Event already exists!");
        return;
    }
    setEventScores(prev => ({
        ...prev,
        [newEventName]: newEventPoints
    }));
    setNewEventName('');
    setNewEventPoints(5);
  };

  const handleDeleteEvent = (name: string) => {
    if(window.confirm(`Delete event "${name}"? This will remove it from all employee logs.`)) {
        // Remove from eventScores
        const newScores = { ...eventScores };
        delete newScores[name];
        setEventScores(newScores);

        // Remove from all employees
        setEmployees(prev => prev.map(emp => ({
            ...emp,
            events: emp.events.filter(e => e.name !== name)
        })));
    }
  };

  const startEditEvent = (name: string) => {
      setEditingEvent(name);
      setEditNameBuffer(name);
  };

  const saveEditEvent = (oldName: string) => {
      if (!editNameBuffer.trim() || editNameBuffer === oldName) {
          setEditingEvent(null);
          return;
      }
      
      const points = eventScores[oldName];
      
      // Update Scores Map
      const newScores = { ...eventScores };
      delete newScores[oldName];
      newScores[editNameBuffer] = points;
      setEventScores(newScores);

      // Update Employee Logs
      setEmployees(prev => prev.map(emp => ({
          ...emp,
          events: emp.events.map(ev => 
              ev.name === oldName ? { ...ev, name: editNameBuffer } : ev
          )
      })));

      setEditingEvent(null);
  };

  return (
    <div className="space-y-8">
        
        {/* Settings Toggle */}
        <div className="flex justify-end">
             <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border shadow-sm
                ${showSettings ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
                {showSettings ? <Settings className="w-4 h-4 animate-spin-slow" /> : <Settings className="w-4 h-4" />}
                {showSettings ? "Close Configuration" : "Configure Scoring Algorithm"}
             </button>
        </div>

        {/* Algorithm Settings Panel */}
        {showSettings && (
            <div className="bg-slate-900 rounded-xl p-8 text-white shadow-2xl animate-fade-in border border-slate-700">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                    <Sliders className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-lg font-bold">Scoring Equation Parameters</h3>
                </div>
                
                <div className="grid lg:grid-cols-12 gap-12">
                    
                    {/* Left Col: Global Weights */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Global Multipliers</h4>
                            {/* Event Weight Control */}
                            <div className="space-y-4 mb-8">
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
                                    Multiplies all event points. Increase to boost reward for participation globally.
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
                                    Multiplies penalties. Increase to strictly punish inactivity.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Event Manager */}
                    <div className="lg:col-span-8 border-l border-slate-700 pl-8 md:pl-12">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Event Catalog Manager</h4>
                            <div className="text-xs text-indigo-400 flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                <span>Modify event values & definitions</span>
                            </div>
                        </div>
                        
                        <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-slate-500 uppercase font-bold bg-slate-800 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Event Name</th>
                                        <th className="px-4 py-3 text-right">Base Points</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {uniqueEventNames.map(eventName => (
                                        <tr key={eventName} className="group hover:bg-slate-700/50 transition-colors">
                                            <td className="px-4 py-2 font-medium text-slate-300 group-hover:text-white">
                                                {editingEvent === eventName ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            autoFocus
                                                            type="text" 
                                                            value={editNameBuffer}
                                                            onChange={e => setEditNameBuffer(e.target.value)}
                                                            className="bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-white outline-none w-full"
                                                        />
                                                        <button onClick={() => saveEditEvent(eventName)}><Save className="w-4 h-4 text-green-400"/></button>
                                                        <button onClick={() => setEditingEvent(null)}><X className="w-4 h-4 text-slate-400"/></button>
                                                    </div>
                                                ) : (
                                                    <span onClick={() => startEditEvent(eventName)} className="cursor-pointer border-b border-dashed border-transparent hover:border-slate-500">
                                                        {eventName}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <input 
                                                        type="number" 
                                                        value={eventScores[eventName]}
                                                        onChange={(e) => updateEventScore(eventName, parseInt(e.target.value))}
                                                        className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-right text-indigo-300 font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                                                    />
                                                    <span className="text-xs text-slate-600">pts</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button 
                                                    onClick={() => handleDeleteEvent(eventName)}
                                                    className="p-1.5 hover:bg-red-900/30 rounded text-slate-500 hover:text-red-400 transition-colors"
                                                    title="Delete Event"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add New Event Form */}
                        <div className="flex gap-2 p-2 bg-slate-800 rounded-lg border border-slate-700">
                            <input 
                                type="text"
                                placeholder="New Event Name (e.g. Community Service)"
                                value={newEventName}
                                onChange={e => setNewEventName(e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <input 
                                type="number"
                                placeholder="Pts"
                                value={newEventPoints}
                                onChange={e => setNewEventPoints(parseInt(e.target.value))}
                                className="w-20 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button 
                                onClick={handleAddEvent}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
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

            {/* Silver Tier explicitly added */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <Hexagon className="w-5 h-5 text-slate-400" fill="currentColor" />
                    <span className="font-bold text-slate-700">Silver Tier</span>
                </div>
                <div className="text-sm text-slate-500">Score 70-79</div>
                <div className="text-xs font-bold text-slate-600 mt-2">Good Standing</div>
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
                            <EmployeeRow key={emp.id} emp={emp} config={config} eventScores={eventScores} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default PerformanceTracker;