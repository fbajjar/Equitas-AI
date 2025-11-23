import React, { useState, useRef } from 'react';
import { evaluateCandidate, HiringAnalysisResult } from '../services/geminiService';
import { Upload, Link as LinkIcon, CheckCircle, FileText, Search, Briefcase, FileUp, X, AlertCircle } from 'lucide-react';

const HiringPortal: React.FC = () => {
  // Store either raw text (for .txt) or base64 data (for .pdf)
  const [resumeInput, setResumeInput] = useState<{ text?: string; data?: string; mimeType?: string } | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [portfolioLinks, setPortfolioLinks] = useState<string>("");
  const [jobDesc, setJobDesc] = useState<string>("Senior React Engineer with 5+ years experience, familiarity with Tailwind and GenAI.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HiringAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setResult(null); // Clear previous results

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeInput({ text: e.target?.result as string });
      };
      reader.readAsText(file);
    } else {
      // For PDF, we read as DataURL to get Base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Strip the "data:application/pdf;base64," prefix
        const base64Data = result.split(',')[1];
        setResumeInput({ 
          data: base64Data, 
          mimeType: file.type 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeInput) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await evaluateCandidate(resumeInput, portfolioLinks, jobDesc);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please ensure the file is a valid PDF or Text file.");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setUploadedFileName(null);
    setResumeInput(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-full">
      {/* Input Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Candidate Data
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Job Description</label>
              <textarea
                className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 transition-all resize-none"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste Job Description..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                 <FileText className="w-4 h-4" /> 
                 Upload Resume / CV
              </label>
              
              {!uploadedFileName ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer p-8 flex flex-col items-center justify-center group"
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileUp className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click to upload CV</p>
                  <p className="text-xs text-slate-400 mt-1">PDF or TXT supported</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.txt,application/pdf,text/plain"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{uploadedFileName}</p>
                      <p className="text-xs text-slate-500">
                        {resumeInput?.mimeType === 'application/pdf' ? 'PDF Document Ready' : 'Text File Ready'}
                      </p>
                    </div>
                  </div>
                  <button onClick={clearFile} className="p-2 hover:bg-indigo-200 rounded-full transition-colors">
                    <X className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                 <LinkIcon className="w-4 h-4" /> 
                 E-Portfolio / External Links
              </label>
              <input
                type="text"
                className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={portfolioLinks}
                onChange={(e) => setPortfolioLinks(e.target.value)}
                placeholder="e.g. GitHub, Behance, LinkedIn URL (Context)"
              />
              <p className="text-[10px] text-slate-400 mt-2">
                Provide links or descriptions of external work to include in the context analysis.
              </p>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeInput}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <Search className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
              {loading ? "Analyzing Document..." : "Run Merit Evaluation"}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-7 flex flex-col h-full">
        {result ? (
          <div className="bg-white rounded-xl shadow-xl border border-indigo-50 overflow-hidden flex flex-col h-full animate-fade-in">
            {/* Header Score */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono tracking-wider text-slate-300">
                        ID: {result.anonymousId.substring(0, 8)}
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono tracking-wider text-green-400">
                        ANONYMIZED
                    </span>
                </div>
                <h3 className="text-3xl font-bold">{result.recommendation}</h3>
                <p className="text-slate-400 text-sm mt-1">Based on verifiable skills and impact.</p>
              </div>
              <div className="text-center relative z-10">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-indigo-300 to-white">
                    {result.matchScore}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mt-1">Merit Score</div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              
              {/* Transparency Section */}
              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4" /> Scoring Context & Transparency
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed border-l-2 border-indigo-300 pl-4">
                  {result.scoreReasoning}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Identified Strengths</h4>
                    <ul className="space-y-2">
                        {result.keyStrengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                {s}
                            </li>
                        ))}
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Portfolio Analysis</h4>
                    <div className="p-3 bg-slate-50 rounded border border-slate-100 text-sm text-slate-600 italic">
                        "{result.portfolioInsights}"
                    </div>
                 </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Suggested Technical Deep-Dive Questions</h4>
                <div className="grid gap-3">
                    {result.interviewQuestions.map((q, i) => (
                        <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-default group">
                            <span className="text-slate-300 font-bold group-hover:text-indigo-400 transition-colors">0{i+1}</span>
                            <p className="text-slate-700 text-sm font-medium">{q}</p>
                        </div>
                    ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 mb-2">Awaiting Documentation</h3>
            <p className="text-sm max-w-md mx-auto">
              Upload a candidate CV (PDF) to perform a real-time merit analysis against the job description.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiringPortal;