import React, { useState } from 'react';
import HiringPortal from './components/HiringPortal';
import BurnoutDashboard from './components/BurnoutDashboard';
import PerformanceTracker from './components/PerformanceTracker';
import SoftSkillsCoach from './components/SoftSkillsCoach';
import TechnicalReport from './components/TechnicalReport';
import { Layout, Users, Activity, MessageSquare, Menu, X, FileCode, BarChart2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hiring' | 'burnout' | 'performance' | 'coach' | 'tech'>('hiring');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'hiring': return <HiringPortal />;
      case 'performance': return <PerformanceTracker />;
      case 'burnout': return <BurnoutDashboard />;
      case 'coach': return <SoftSkillsCoach />;
      case 'tech': return <TechnicalReport />;
      default: return <HiringPortal />;
    }
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200
        ${activeTab === id 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Equitas AI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem id="hiring" label="Merit Evaluator" icon={Users} />
          <NavItem id="performance" label="Performance" icon={BarChart2} />
          <NavItem id="burnout" label="Wellness Tracker" icon={Activity} />
          <NavItem id="coach" label="Soft Skills Coach" icon={MessageSquare} />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
           <NavItem id="tech" label="Tech Architecture" icon={FileCode} />
           
           <div className="bg-slate-50 rounded-lg p-3 mt-4">
             <p className="text-xs text-slate-400 font-medium uppercase mb-1">System Status</p>
             <div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Gemini 2.5 Active
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800">Equitas AI</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-white pt-20 px-4 space-y-2">
          <NavItem id="hiring" label="Merit Evaluator" icon={Users} />
          <NavItem id="performance" label="Performance" icon={BarChart2} />
          <NavItem id="burnout" label="Wellness Tracker" icon={Activity} />
          <NavItem id="coach" label="Soft Skills Coach" icon={MessageSquare} />
          <NavItem id="tech" label="Tech Architecture" icon={FileCode} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {activeTab === 'hiring' && "Merit-Based Evaluation Engine"}
            {activeTab === 'performance' && "Workforce Engagement & Scoring"}
            {activeTab === 'burnout' && "Wellness & Biometric Monitoring"}
            {activeTab === 'coach' && "AI Performance Coach"}
            {activeTab === 'tech' && "System Documentation"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {activeTab === 'hiring' && "Transparent, skill-focused candidate assessment using context-aware AI."}
            {activeTab === 'performance' && "Track event attendance, ranks, and performance decay."}
            {activeTab === 'burnout' && "Monitor employee health, burnout risks, and workload distribution."}
            {activeTab === 'coach' && "Interactive roleplay to improve communication skills."}
            {activeTab === 'tech' && "Detailed technical specifications for stakeholders."}
          </p>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default App;