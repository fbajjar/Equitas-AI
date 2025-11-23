import React, { useEffect, useState } from 'react';
import { generateTechReport } from '../services/geminiService';
import { Server, Shield, Database, Cpu, Download } from 'lucide-react';

const TechnicalReport: React.FC = () => {
  const [reportText, setReportText] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const text = await generateTechReport();
        setReportText(text);
      } catch (e) {
        setReportText("Failed to load technical specifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Technical Architecture Report</h1>
              <p className="text-indigo-300 font-mono text-sm">System: Equitas AI | Version: 2.5.0</p>
            </div>
            <div className="flex gap-2">
                 <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Cpu className="w-6 h-6" />
                 </div>
                 <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Shield className="w-6 h-6" />
                 </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-32 bg-slate-100 rounded w-full mt-6"></div>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 text-sm text-indigo-600 font-bold hover:underline">
                    <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
              
              {/* Manual Layout for better visual if Markdown parsing isn't available, or render raw text cleanly */}
              <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                {reportText}
              </div>

              {/* Static Visual Architecture Summary */}
              <div className="mt-12 pt-12 border-t border-slate-100 grid md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Inference Engine</h3>
                    <p className="text-xs text-slate-500">Built on Google Gemini 2.5 Flash for millisecond-latency reasoning and multi-modal context understanding.</p>
                </div>
                <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Privacy Layer</h3>
                    <p className="text-xs text-slate-500">Client-side NLP preprocessing ensures PII is stripped before storage. Anonymized UUIDs track long-term performance.</p>
                </div>
                <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Database className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">Data Integrity</h3>
                    <p className="text-xs text-slate-500">Immutable scoring logs prevent tampering. Context-aware weighting algorithms reduce subjective variance.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalReport;