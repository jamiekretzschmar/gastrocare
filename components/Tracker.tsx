import React, { useState } from 'react';
import { Plus, Download, Trash2, ChevronDown, ChevronUp, AlertTriangle, Pill, Zap } from 'lucide-react';
import { LogEntry, MealTexture, BristolScale } from '../types';
import { SYMPTOM_OPTIONS, QUICK_ADD_FOODS } from '../constants';
import { safeLocalStorage } from '../utils/storage';

interface TrackerProps {
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

const Tracker: React.FC<TrackerProps> = ({ logs, setLogs }) => {
  const [showMacros, setShowMacros] = useState(false);
  const [showClinical, setShowClinical] = useState(false); // Texture, Stool, Meds
  const [newLog, setNewLog] = useState<Partial<LogEntry>>({
    date: new Date().toISOString().slice(0, 16),
    symptoms: [],
    severity: 1,
    activity: 'Sat Upright',
    bloodSugarBefore: '',
    bloodSugarAfter: '',
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    texture: 'Solid',
    medicationTaken: false,
    bristolScore: null,
  });

  const handleAddLog = () => {
    if (!newLog.food) return;

    const entry: LogEntry = {
      id: Date.now().toString(),
      date: newLog.date || new Date().toISOString(),
      food: newLog.food || '',
      portionSize: newLog.portionSize || '',
      bloodSugarBefore: newLog.bloodSugarBefore || '',
      bloodSugarAfter: newLog.bloodSugarAfter || '',
      symptoms: newLog.symptoms || [],
      severity: newLog.severity || 1,
      activity: newLog.activity as any,
      notes: newLog.notes || '',
      nutrition: newLog.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      texture: newLog.texture,
      medicationTaken: newLog.medicationTaken,
      bristolScore: newLog.bristolScore,
    };

    const updatedLogs = [entry, ...logs];
    setLogs(updatedLogs);
    safeLocalStorage.setItem('gastroLogs', updatedLogs);
    
    // Reset form
    setNewLog({
      date: new Date().toISOString().slice(0, 16),
      symptoms: [],
      severity: 1,
      activity: 'Sat Upright',
      bloodSugarBefore: '',
      bloodSugarAfter: '',
      food: '',
      portionSize: '',
      notes: '',
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      texture: 'Solid',
      medicationTaken: false,
      bristolScore: null,
    });
    setShowMacros(false);
    setShowClinical(false);
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    safeLocalStorage.setItem('gastroLogs', updated);
  };

  const applyQuickAdd = (food: typeof QUICK_ADD_FOODS[0]) => {
    setNewLog({
      ...newLog,
      food: food.name,
      portionSize: food.portion,
      texture: food.texture as MealTexture,
      nutrition: {
        calories: food.cal,
        protein: food.p,
        carbs: food.c,
        fat: food.f,
        fiber: food.fiber
      }
    });
    setShowMacros(true);
  };

  const toggleSymptom = (symptom: string) => {
    const current = newLog.symptoms || [];
    if (current.includes(symptom)) {
      setNewLog({ ...newLog, symptoms: current.filter(s => s !== symptom) });
    } else {
      setNewLog({ ...newLog, symptoms: [...current, symptom] });
    }
  };

  const updateNutrition = (field: keyof typeof newLog.nutrition, value: string) => {
    // Stress Test Fix: Handle empty string (NaN) gracefully and prevent crash if nutrition is undefined
    const val = value === '' ? 0 : parseInt(value);
    setNewLog({
      ...newLog,
      nutrition: {
        ...(newLog.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }),
        [field]: isNaN(val) ? 0 : val
      }
    });
  };

  // Safety Warnings
  const fatWarning = (newLog.nutrition?.fat || 0) > 10;
  const fiberWarning = (newLog.nutrition?.fiber || 0) > 3;

  const exportToCSV = () => {
    const headers = ['Date', 'Food', 'Texture', 'Meds Taken', 'Calories', 'Protein', 'Carbs', 'Fat', 'Fiber', 'BS Before', 'BS After', 'Symptoms', 'Severity', 'Bristol Score', 'Activity', 'Notes'];
    const rows = logs.map(log => [
      // Stress Test Fix: Handle invalid dates
      !isNaN(Date.parse(log.date)) ? new Date(log.date).toLocaleString() : 'Invalid Date',
      `"${log.food.replace(/"/g, '""')}"`, // Escape quotes
      log.texture || 'N/A',
      log.medicationTaken ? 'Yes' : 'No',
      log.nutrition?.calories || 0,
      log.nutrition?.protein || 0,
      log.nutrition?.carbs || 0,
      log.nutrition?.fat || 0,
      log.nutrition?.fiber || 0,
      log.bloodSugarBefore,
      log.bloodSugarAfter,
      `"${log.symptoms.join(', ')}"`,
      log.severity,
      log.bristolScore || '',
      log.activity,
      `"${(log.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gastro_symptom_tracker.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          Log Meal & Symptoms
        </h2>
        
        {/* Quick Add Bar */}
        <div className="mb-6 overflow-x-auto pb-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Add Safe Foods</p>
          <div className="flex gap-2">
            {QUICK_ADD_FOODS.map((q, i) => (
              <button 
                key={i} 
                onClick={() => applyQuickAdd(q)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-full text-xs font-medium transition-colors"
              >
                {q.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Date & Time</label>
            <input 
              type="datetime-local" 
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={newLog.date}
              onChange={e => setNewLog({...newLog, date: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Food / Drink</label>
            <input 
              type="text" 
              placeholder="e.g. Cream of Rice, Egg Whites"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              value={newLog.food}
              onChange={e => setNewLog({...newLog, food: e.target.value})}
            />
          </div>

          {/* Clinical Data Section (Texture, Meds, Stool) */}
          <div className="md:col-span-2 border rounded-lg border-slate-200 overflow-hidden">
             <button 
              onClick={() => setShowClinical(!showClinical)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-indigo-500" />
                <span>Clinical Details (Meds, Texture, Stool)</span>
              </div>
              {showClinical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showClinical && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Meal Texture</label>
                   <select 
                     className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                     value={newLog.texture}
                     onChange={(e) => setNewLog({...newLog, texture: e.target.value as MealTexture})}
                   >
                     <option value="Liquid">Liquid (Best)</option>
                     <option value="Pureed">Pureed (Good)</option>
                     <option value="Soft Solid">Soft Solid (Okay)</option>
                     <option value="Solid">Solid (Risky)</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Medication</label>
                   <div 
                    onClick={() => setNewLog({...newLog, medicationTaken: !newLog.medicationTaken})}
                    className={`cursor-pointer p-2 border rounded-lg text-sm flex items-center gap-2 ${newLog.medicationTaken ? 'bg-green-50 border-green-200 text-green-700' : 'border-slate-200 text-slate-500'}`}
                   >
                     <div className={`w-4 h-4 rounded border flex items-center justify-center ${newLog.medicationTaken ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                       {newLog.medicationTaken && <div className="w-2 h-2 bg-white rounded-sm" />}
                     </div>
                     Prokinetic Taken (30m prior)
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Bristol Stool (1-7)</label>
                   <input 
                     type="number" 
                     min="1" 
                     max="7"
                     className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                     placeholder="Score 1-7 (Optional)"
                     value={newLog.bristolScore || ''}
                     onChange={e => setNewLog({...newLog, bristolScore: parseInt(e.target.value) as BristolScale})}
                   />
                </div>
              </div>
            )}
          </div>

          {/* Macros Toggle Section */}
          <div className="md:col-span-2 border rounded-lg border-slate-200 overflow-hidden">
            <button 
              onClick={() => setShowMacros(!showMacros)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                 <Zap className="w-4 h-4 text-orange-500" />
                 <span>Nutritional Facts</span>
              </div>
              {showMacros ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showMacros && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase font-bold">Calories</label>
                    <input type="number" className="w-full p-2 border border-slate-200 rounded-md text-sm" value={newLog.nutrition?.calories || ''} onChange={e => updateNutrition('calories', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase font-bold">Protein (g)</label>
                    <input type="number" className="w-full p-2 border border-slate-200 rounded-md text-sm" value={newLog.nutrition?.protein || ''} onChange={e => updateNutrition('protein', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase font-bold">Carbs (g)</label>
                    <input type="number" className="w-full p-2 border border-slate-200 rounded-md text-sm" value={newLog.nutrition?.carbs || ''} onChange={e => updateNutrition('carbs', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase font-bold">Fat (g)</label>
                    <input type="number" className="w-full p-2 border border-slate-200 rounded-md text-sm" value={newLog.nutrition?.fat || ''} onChange={e => updateNutrition('fat', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase font-bold">Fiber (g)</label>
                    <input type="number" className="w-full p-2 border border-slate-200 rounded-md text-sm" value={newLog.nutrition?.fiber || ''} onChange={e => updateNutrition('fiber', e.target.value)} />
                  </div>
                </div>
                
                {/* Real-time warnings */}
                {fatWarning && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                    <AlertTriangle className="w-3 h-3" /> Warning: High fat (>10g) drastically slows gastric emptying.
                  </div>
                )}
                {fiberWarning && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 mt-1">
                    <AlertTriangle className="w-3 h-3" /> Warning: High fiber (>3g) increases bezoar risk.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">BS Before</label>
              <input 
                type="number" 
                placeholder="mmol/L"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={newLog.bloodSugarBefore}
                onChange={e => setNewLog({...newLog, bloodSugarBefore: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">BS 2hr After</label>
              <input 
                type="number" 
                placeholder="mmol/L"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={newLog.bloodSugarAfter}
                onChange={e => setNewLog({...newLog, bloodSugarAfter: e.target.value})}
              />
            </div>
          </div>

           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Activity After Meal</label>
            <select 
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              value={newLog.activity}
              onChange={e => setNewLog({...newLog, activity: e.target.value as any})}
            >
              <option value="Sat Upright">Sat Upright (Recommended)</option>
              <option value="Walked">Gentle Walk (Recommended)</option>
              <option value="Lay Down">Lay Down (Avoid!)</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-600">Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map(sym => (
                <button
                  key={sym}
                  onClick={() => toggleSymptom(sym)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    newLog.symptoms?.includes(sym)
                      ? 'bg-red-50 border-red-200 text-red-700 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-600 flex justify-between">
              <span>Severity (1 = Mild, 10 = Severe)</span>
              <span className="font-bold text-teal-700">{newLog.severity}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              value={newLog.severity}
              onChange={e => setNewLog({...newLog, severity: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={handleAddLog}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-[0.99]"
          >
            Log Entry
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="text-lg font-semibold text-slate-800">History</h3>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-800 font-medium bg-teal-50 px-3 py-2 rounded-lg"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="space-y-3">
        {logs.length === 0 && <p className="text-slate-500 italic text-center py-8">No logs yet. Start tracking above.</p>}
        {logs.map(log => (
          <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-baseline gap-2">
                   <p className="text-sm text-slate-500 font-medium">{!isNaN(Date.parse(log.date)) ? new Date(log.date).toLocaleString() : 'Date Error'}</p>
                   {log.texture && <span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">{log.texture}</span>}
                </div>
                <h4 className="text-lg font-bold text-slate-800 mt-1">{log.food}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    log.activity === 'Lay Down' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {log.activity || 'Unknown Activity'}
                  </span>
                  {log.medicationTaken && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Meds Taken</span>}
                  {log.severity > 5 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-bold">
                      Severity: {log.severity}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => handleDeleteLog(log.id)} className="text-slate-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            {log.nutrition && (
              <div className="mt-3 flex gap-3 text-xs text-slate-500">
                <span>P: {log.nutrition.protein || 0}g</span>
                <span>C: {log.nutrition.carbs || 0}g</span>
                <span className={`${(log.nutrition.fat || 0) > 10 ? 'text-red-600 font-bold' : ''}`}>F: {log.nutrition.fat || 0}g</span>
                <span className={`${(log.nutrition.fiber || 0) > 3 ? 'text-red-600 font-bold' : ''}`}>Fib: {log.nutrition.fiber || 0}g</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tracker;