import React from 'react';
import { LogEntry } from '../types';
import { Flame, Beef, Wheat, Droplet, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface NutrientSummaryProps {
  logs: LogEntry[];
  flareMode: boolean;
}

const NutrientSummary: React.FC<NutrientSummaryProps> = ({ logs, flareMode }) => {
  // Filter for today
  const today = new Date().toISOString().slice(0, 10);
  const todaysLogs = logs.filter(log => log.date.startsWith(today));

  const totals = todaysLogs.reduce(
    (acc, log) => {
      if (log.nutrition) {
        acc.calories += log.nutrition.calories || 0;
        acc.protein += log.nutrition.protein || 0;
        acc.carbs += log.nutrition.carbs || 0;
        acc.fat += log.nutrition.fat || 0;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const macroData = [
    { name: 'Protein', value: totals.protein, color: '#3b82f6' }, // blue
    { name: 'Carbs', value: totals.carbs, color: '#f59e0b' }, // amber
    { name: 'Fat', value: totals.fat, color: '#e11d48' }, // rose
  ].filter(d => d.value > 0);

  const StatCard = ({ icon: Icon, label, value, unit, color }: any) => (
    <div className={`bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 ${color}`}>
      <div className="p-2 rounded-full bg-white/50">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</p>
        <p className="text-lg font-bold">
          {value} <span className="text-xs font-normal opacity-60">{unit}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {flareMode && (
         <div className="bg-red-600 text-white p-4 rounded-xl flex items-center gap-3 shadow-md">
           <AlertCircle className="w-6 h-6" />
           <div>
             <p className="font-bold">Flare-Up Protocol Active</p>
             <p className="text-sm opacity-90">Switching to full liquid/puree diet to allow stomach rest.</p>
           </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <StatCard 
            icon={Flame} 
            label="Calories" 
            value={totals.calories} 
            unit="kcal" 
            color="text-orange-600 bg-orange-50/50" 
          />
          <StatCard 
            icon={Beef} 
            label="Protein" 
            value={totals.protein} 
            unit="g" 
            color="text-blue-600 bg-blue-50/50" 
          />
          <StatCard 
            icon={Wheat} 
            label="Carbs" 
            value={totals.carbs} 
            unit="g" 
            color="text-amber-600 bg-amber-50/50" 
          />
          <StatCard 
            icon={Droplet} 
            label="Fat" 
            value={totals.fat} 
            unit="g" 
            color="text-rose-600 bg-rose-50/50" 
          />
        </div>

        {/* Macro Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex flex-col items-center justify-center relative">
          <h4 className="absolute top-2 left-3 text-xs font-bold text-slate-400 uppercase">Macro Split</h4>
          <div className="w-full h-32">
            {macroData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">No data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

