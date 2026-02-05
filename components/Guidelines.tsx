import React, { useState } from 'react';
import { GUIDELINES } from '../constants';
import { ShieldAlert, Activity, Utensils, AlertTriangle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import GastroparesisEducation from './GastroparesisEducation';

const Guidelines: React.FC = () => {
  const [showEducation, setShowEducation] = useState(true);

  const getIcon = (category: string) => {
    if (category.includes('Dietary')) return <Utensils className="w-5 h-5" />;
    if (category.includes('Infection')) return <ShieldAlert className="w-5 h-5" />;
    if (category.includes('Medical')) return <Activity className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  // Group by category
  const grouped = GUIDELINES.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof GUIDELINES>);

  return (
    <div className="space-y-8">
      
      {/* Education Toggle Section */}
      <section>
        <button 
          onClick={() => setShowEducation(!showEducation)}
          className="w-full flex items-center justify-between bg-indigo-600 text-white p-4 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <span className="font-bold text-lg">Understanding Gastroparesis</span>
          </div>
          {showEducation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showEducation && (
          <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <GastroparesisEducation />
          </div>
        )}
      </section>

      <h2 className="text-xl font-bold text-slate-800 mt-8">Daily Safety Rules</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-2">
              <span className={`p-2 rounded-lg ${
                category.includes('Infection') ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'
              }`}>
                {getIcon(category)}
              </span>
              <h3 className="font-bold text-slate-800">{category}</h3>
            </div>
            <div className="p-4 space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.isCritical && (
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical Safety Rule"></span>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${item.isCritical ? 'text-red-700' : 'text-slate-800'}`}>
                      {item.rule}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">{item.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="md:col-span-2 bg-teal-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-2">Remember the "Small Particle" Rule</h3>
          <p className="opacity-90">
            Chew all food until it is the consistency of applesauce. If your symptoms flare up, immediately switch back to Stage 1 (Liquids) or Stage 2 (Purees) for 24 hours to let your stomach recover.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;