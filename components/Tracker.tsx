import React, { useState } from 'react';
import { Pill, Zap, ChevronDown, ChevronUp, Save, Plus } from 'lucide-react';
import { MealTexture, BristolScale } from '../types';

export export function Tracker({ logs, setLogs }) {
  const [showClinical, setShowClinical] = useState(false);
  const [showMacros, setShowMacros] = useState(false);

  const [newLog, setNewLog] = useState({
    timestamp: new Date().toISOString(),
    mealName: '',
    texture: 'Standard' as MealTexture,
    calories: 0,
    nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
    stoolBristol: 4 as BristolScale,
    notes: ''
  });

  const handleNutrientChange = (field, value) => {
    setNewLog({
      ...newLog,
      nutrition: {
        ...newLog.nutrition,
        [field]: parseFloat(value) || 0
      }
    });
  };

  const saveLog = () => {
    if (!newLog.mealName) return;
    setLogs([newLog, ...logs]);
    setNewLog({
      timestamp: new Date().toISOString(),
      mealName: '',
      texture: 'Standard',
      calories: 0,
      nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
      stoolBristol: 4,
      notes: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="What did you eat?"
          className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
          value={newLog.mealName}
          onChange={(e) => setNewLog({ ...newLog, mealName: e.target.value })}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Calories"
            className="p-3 rounded-xl border border-slate-200 outline-none"
            onChange={(e) => setNewLog({ ...newLog, calories: parseInt(e.target.value) || 0 })}
          />
          <select 
            className="p-3 rounded-xl border border-slate-200 outline-none bg-white"
            value={newLog.texture}
            onChange={(e) => setNewLog({ ...newLog, texture: e.target.value as MealTexture })}
          >
            <option value="Standard">Standard</option>
            <option value="Soft">Soft</option>
            <option value="Puree">Puree</option>
            <option value="Liquid">Liquid</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowMacros(!showMacros)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl text-slate-600 text-sm font-medium"
      >
        <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Macros (Optional)</span>
        {showMacros ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showMacros && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          {['protein', 'carbs', 'fat', 'fiber'].map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{field}</label>
              <input
                type="number"
                placeholder="0g"
                className="w-full p-2 rounded-lg border border-slate-100 text-sm"
                onChange={(e) => handleNutrientChange(field, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowClinical(!showClinical)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl text-slate-600 text-sm font-medium"
      >
        <span className="flex items-center gap-2"><Pill className="w-4 h-4 text-indigo-500" /> Clinical Details</span>
        {showClinical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showClinical && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Stool Quality (Bristol Scale)</label>
            <input 
              type="range" min="1" max="7" 
              className="w-full accent-indigo-500"
              value={newLog.stoolBristol}
              onChange={(e) => setNewLog({ ...newLog, stoolBristol: parseInt(e.target.value) as BristolScale })}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>CONSTIPATED</span>
              <span>NORMAL</span>
              <span>DIARRHEA</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={saveLog}
        className="w-full bg-teal-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors active:scale-95 shadow-lg shadow-teal-100"
      >
        <Plus className="w-5 h-5" /> Save Entry
      </button>
    </div>
  );
}
