import React, { useEffect, useState } from 'react';
import { generateTechReport, TechReportData } from '../services/geminiService';
import { Server, Shield, Database, Cpu, Download, CheckCircle, Lock, Zap, Layers } from 'lucide-react';

const TechnicalReport: React.FC = () => {
  const [report, setReport] = useState<TechReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await generateTechReport();
        setReport(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-slate-700">Compiling System Architecture...</h2>
        <p className="text-slate-500 mt-2">Analyzing React Components, Gemini Services, and Security Protocols.</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-red-50 rounded-xl border border-red-100">
        <h2 className="text-lg font-bold text-red-700">Generation Failed</h2>
        <p className="text-red-500">Could not generate the report. Please verify API connectivity.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Document Header */}
      <div className="bg-white rounded-t-xl shadow-sm border border-slate-200 border-b-0 p-8 flex justify-between items-end relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Server className="w-6 h-6" />
             </div>
             <span className="text-xs font-mono font-bold text-indigo-600 tracking-widest uppercase">
                System Documentation
             </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{report.title}</h1>
          <div className="flex gap-4 text-sm text-slate-500 font-medium">
             <span>Version: {report.systemVersion}</span>
             <span>•</span>
             <span>Generated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <button className="relative z-10 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg">
           <Download className="w-4 h-4" /> Export PDF
        </button>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -mr-12 -mt-12"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-xl shadow-lg border border-slate-200 p-10 space-y-12">
        
        {/* Executive Summary */}
        <section>
           <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-500 pl-3">Executive Summary</h3>
           <p className="text-slate-600 leading-relaxed text-lg">
             {report.executiveSummary}
           </p>
        </section>

        <div className="h-px bg-slate-100"></div>

        {/* AI Implementation Grid */}
        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" /> AI Implementation Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                {report.aiImplementation.map((ai, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800">{ai.role}</h4>
                            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-indigo-600 font-bold">
                                {ai.model}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {ai.reasoning}
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* Core Components Table */}
        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Core System Components
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Module Name</th>
                            <th className="px-6 py-4">Tech Stack</th>
                            <th className="px-6 py-4">Functionality</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {report.coreComponents.map((comp, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-800">{comp.name}</td>
                                <td className="px-6 py-4 font-mono text-xs text-indigo-600">{comp.techStack}</td>
                                <td className="px-6 py-4 text-slate-600">{comp.functionality}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                                        ${comp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {comp.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
            
            {/* Privacy Section */}
            <section>
                 <h3 className="text-lg font-bold text-slate-900 mb-6 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-500" /> Privacy & Security
                </h3>
                <ul className="space-y-4">
                    {report.dataPrivacyFramework.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700">
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

             {/* Fairness Section */}
             <section>
                 <h3 className="text-lg font-bold text-slate-900 mb-6 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-500" /> Fairness Mechanisms
                </h3>
                <ul className="space-y-4">
                    {report.fairnessMechanisms.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

        </div>

      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-400 text-sm">
            This document is automatically generated by the Equitas AI engine based on real-time system architecture analysis.
        </p>
      </div>

    </div>
  );
};

export default TechnicalReport;
