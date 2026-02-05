import React from 'react';
import { Brain, ZapOff, ArrowDown, XCircle, CheckCircle2 } from 'lucide-react';

const GastroparesisEducation: React.FC = () => {
  return (
    <div className="space-y-8">
      
      {/* SECTION 1: The Anatomy of Delay */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">1. The Mechanics: Why Food Stays Stuck</h3>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-8 items-center">
          
          {/* Diagram: Normal vs GP */}
          <div className="relative h-64 bg-indigo-50 rounded-xl p-4 flex items-center justify-center border border-indigo-100">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Labels */}
              <text x="100" y="20" className="text-xs font-bold fill-slate-500" textAnchor="middle">Healthy Stomach</text>
              <text x="300" y="20" className="text-xs font-bold fill-slate-500" textAnchor="middle">Gastroparesis</text>

              {/* HEALTHY STOMACH SVG */}
              <g transform="translate(50, 40)">
                {/* Esophagus */}
                <path d="M40,0 L40,30" stroke="#cbd5e1" strokeWidth="12" fill="none" />
                {/* Stomach Shape */}
                <path d="M40,30 C-10,50 -10,100 40,130 C70,140 90,120 100,100" fill="#e0e7ff" stroke="#6366f1" strokeWidth="3" />
                {/* Pyloric Valve (Open) */}
                <path d="M100,90 L120,90" stroke="#6366f1" strokeWidth="8" strokeDasharray="4 2" />
                {/* Food Particles (Small & Exiting) */}
                <circle cx="50" cy="80" r="3" fill="#4338ca" />
                <circle cx="60" cy="90" r="3" fill="#4338ca" />
                <circle cx="110" cy="90" r="3" fill="#4338ca">
                   <animate attributeName="cx" from="110" to="140" dur="1s" repeatCount="indefinite" />
                   <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x="50" y="155" fontSize="10" textAnchor="middle" fill="#4338ca">Strong Contractions</text>
              </g>

              {/* GP STOMACH SVG */}
              <g transform="translate(250, 40)">
                {/* Esophagus */}
                <path d="M40,0 L40,30" stroke="#cbd5e1" strokeWidth="12" fill="none" />
                {/* Stomach Shape (Distended) */}
                <path d="M40,30 C-20,50 -20,110 40,140 C80,150 100,130 110,110" fill="#fee2e2" stroke="#ef4444" strokeWidth="3" />
                {/* Pyloric Valve (Tight/Spasming) */}
                <path d="M110,100 L110,120" stroke="#ef4444" strokeWidth="4" /> 
                {/* Food Particles (Stuck) */}
                <circle cx="40" cy="80" r="6" fill="#b91c1c" />
                <circle cx="50" cy="100" r="5" fill="#b91c1c" />
                <circle cx="30" cy="110" r="6" fill="#b91c1c" />
                <path d="M115,105 L125,115 M125,105 L115,115" stroke="#ef4444" strokeWidth="2" /> {/* X mark */}
                <text x="50" y="165" fontSize="10" textAnchor="middle" fill="#b91c1c">Weak/No Contractions</text>
              </g>
            </svg>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 p-2 bg-slate-100 rounded-full h-fit"><Brain className="w-4 h-4 text-slate-600" /></div>
              <div>
                <h4 className="font-bold text-slate-800">The Vagus Nerve Problem</h4>
                <p className="text-sm text-slate-600">Think of the Vagus nerve as the power cord connecting your brain to your stomach. In GP, this cord is damaged (often by diabetes or surgery), so the "churning signal" never arrives.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 p-2 bg-red-100 rounded-full h-fit"><ZapOff className="w-4 h-4 text-red-600" /></div>
              <div>
                <h4 className="font-bold text-slate-800">Paralysis (Gastroparesis)</h4>
                <p className="text-sm text-slate-600">Without signals, the stomach muscles stop moving. Food just sits there, relying entirely on gravity to drain out (which is why you must stay upright!).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: The Sieve Concept */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">2. The "Pyloric Sieve": Why Texture Matters</h3>
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-6">
            The Pyloric Valve (the exit door) normally grinds food down to 1-2mm. In GP, it doesn't grind. It acts like a stiff mesh sieve.
          </p>

          <div className="grid grid-cols-2 gap-4">
            
            {/* BAD EXAMPLE */}
            <div className="border border-red-200 bg-red-50 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="w-full h-32 bg-white rounded-lg border-2 border-red-200 relative mb-3 overflow-hidden">
                 {/* The Sieve Line */}
                 <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-300 z-10"></div>
                 <div className="absolute bottom-2 left-0 right-0 border-b-4 border-dotted border-red-400"></div>
                 
                 {/* Large Particles Stuck */}
                 <div className="absolute bottom-4 left-8 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-[8px] text-white font-bold">Fiber</div>
                 <div className="absolute bottom-4 right-8 w-10 h-6 rounded-md bg-amber-800 flex items-center justify-center text-[8px] text-white font-bold">Steak</div>
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-6 h-6 rounded-sm bg-yellow-600 flex items-center justify-center text-[8px] text-white font-bold">Corn</div>
              </div>
              <h4 className="font-bold text-red-700 flex items-center gap-2"><XCircle className="w-4 h-4" /> Solid/Fiber Diet</h4>
              <p className="text-xs text-red-600 mt-1">Large particles get stuck. They ferment (bloating) or harden into rocks (bezoars).</p>
            </div>

            {/* GOOD EXAMPLE */}
            <div className="border border-teal-200 bg-teal-50 rounded-xl p-4 flex flex-col items-center text-center">
               <div className="w-full h-32 bg-white rounded-lg border-2 border-teal-200 relative mb-3 overflow-hidden">
                 {/* The Sieve Line */}
                 <div className="absolute bottom-0 left-0 right-0 h-2 bg-teal-300 z-10"></div>
                 <div className="absolute bottom-2 left-0 right-0 border-b-4 border-dotted border-teal-400"></div>
                 
                 {/* Liquid Particles Passing */}
                 <div className="absolute bottom-[-10px] left-10 w-2 h-2 rounded-full bg-teal-500 animate-bounce"></div>
                 <div className="absolute bottom-[-15px] right-12 w-2 h-2 rounded-full bg-teal-500 animate-bounce delay-75"></div>
                 
                 {/* Soup/Puree */}
                 <div className="absolute bottom-4 w-full h-12 bg-teal-100 opacity-50 flex items-end justify-center pb-1">
                    <span className="text-[10px] text-teal-800 font-bold">Puree / Liquid</span>
                 </div>
              </div>
              <h4 className="font-bold text-teal-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> "Small Particle" Diet</h4>
              <p className="text-xs text-teal-600 mt-1">Liquids and purees flow through the "sieve" by gravity alone, even without muscle contractions.</p>
            </div>

          </div>
        </div>
      </div>

       {/* SECTION 3: Gravity Helper */}
       <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg flex items-start gap-4">
          <ArrowDown className="w-10 h-10 flex-shrink-0 animate-bounce" />
          <div>
            <h3 className="text-lg font-bold">Physics is your Friend</h3>
            <p className="text-blue-100 mt-1 text-sm">
              Because your stomach isn't pumping, <strong>gravity</strong> is the only force moving food down. This is why lying down after eating is dangerous—it turns your stomach into a flat bowl that can't drain.
            </p>
          </div>
       </div>

    </div>
  );
};

export default GastroparesisEducation;