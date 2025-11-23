import React, { useState, useRef, useEffect } from 'react';
import { getCoachingResponse } from '../services/geminiService';
import { MessageSquare, Send, User, Bot, Sparkles, Settings } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SoftSkillsCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hi! I'm your Soft Skills Coach. What scenario would you like to practice today? (e.g., 'Asking for a raise', 'Giving negative feedback', 'Resolving a conflict')" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<string>("General Practice");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));
    
    // If it's the second message (first user reply), assume it sets the scenario context
    const currentScenario = messages.length === 1 ? input : scenario;
    if (messages.length === 1) setScenario(input);

    try {
      const responseText = await getCoachingResponse(history, input, currentScenario);
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Sidebar / Info */}
      <div className="w-1/4 hidden lg:block space-y-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
          <div className="flex items-center gap-2 mb-6">
             <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                <Sparkles className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-slate-800">Roleplay Mode</h3>
          </div>
          
          <div className="flex-1 space-y-6">
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Scenario</label>
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
                  {messages.length > 1 ? scenario : "Not selected yet..."}
                </div>
             </div>

             <div>
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Suggested Topics</h4>
               <div className="flex flex-col gap-2">
                 {["Negotiating a Deadline", "Conflict with Peer", "Delivering Bad News"].map(topic => (
                   <button 
                     key={topic}
                     onClick={() => { setInput(topic); if(messages.length===1) setScenario(topic); }}
                     className="text-left text-sm p-2 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded transition-colors"
                   >
                     • {topic}
                   </button>
                 ))}
               </div>
             </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-100">
             <div className="flex items-center gap-2 text-xs text-slate-400">
               <Settings className="w-3 h-3" />
               AI calibrated for empathetic but professional responses.
             </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50" ref={scrollRef}>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                  ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'}`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="flex gap-3 max-w-[80%]">
                 <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                   <Bot className="w-5 h-5" />
                 </div>
                 <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                 </div>
               </div>
             </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response here..."
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftSkillsCoach;
