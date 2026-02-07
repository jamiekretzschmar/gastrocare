import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { askDietitian } from '../services/gemini';
import { LogEntry } from '../types';

interface AiAssistantProps {
  logs: LogEntry[];
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ logs }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I'm your GastroCare Assistant. I know about your specific restrictions (Immunosuppressed & Gastroparesis). Ask me about a specific food or symptom." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    // Build enhanced context from last 7 logs
    const recentLogs = logs.slice(0, 7).map(l => {
        const foodInfo = `${l.food} (${l.texture || 'Unspecified Texture'})`;
        const symptoms = l.symptoms.length > 0 ? l.symptoms.join(', ') : 'None';
        const bs = l.bloodSugarAfter ? `BS: ${l.bloodSugarAfter}` : 'BS: Not recorded';
        return `[${new Date(l.date).toLocaleString()}] Meal: ${foodInfo} | Symptoms: ${symptoms} (Severity: ${l.severity}/10) | ${bs} | Activity: ${l.activity}`;
    }).join('\n');
    
    const context = `
      Current Patient Context from Log History (Last 7 entries):
      ${recentLogs || "No recent logs available."}
      
      Note: High severity (>6) or frequent vomiting indicates potential flare-up. 
      High blood sugar suggests delayed emptying risk.
    `;

    const response = await askDietitian(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-600" />
          AI Dietitian
        </h2>
        <p className="text-xs text-slate-500">Powered by Gemini 2.5 • Context-Aware (History Included)</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              m.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'
            }`}>
              {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`p-3 rounded-lg text-sm max-w-[80%] ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {m.content.split('\n').map((line, idx) => <p key={idx} className="mb-1">{line}</p>)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
               <Bot className="w-5 h-5 text-teal-600" />
             </div>
             <div className="bg-slate-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-500 italic">
               Analyzing history and safety restrictions...
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="e.g. Can I eat banana bread? Why do I feel sick?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

