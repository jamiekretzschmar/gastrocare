import React, { useState, useEffect } from 'react';
import { Droplets, Bell, Settings, Plus, Minus, Clock } from 'lucide-react';
import { HydrationEntry, HydrationSettings } from '../types';
import { safeLocalStorage } from '../utils/storage';

interface HydrationTrackerProps {
  entries: HydrationEntry[];
  setEntries: React.Dispatch<React.SetStateAction<HydrationEntry[]>>;
  settings: HydrationSettings;
  setSettings: React.Dispatch<React.SetStateAction<HydrationSettings>>;
}

const HydrationTracker: React.FC<HydrationTrackerProps> = ({ 
  entries, setEntries, settings, setSettings 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [newTime, setNewTime] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const todayTotal = entries
    .filter(e => e.date.startsWith(today))
    .reduce((sum, e) => sum + e.amountMl, 0);

  const progress = Math.min((todayTotal / (settings.dailyGoalMl || 2000)) * 100, 100);

  const addWater = (amount: number) => {
    const newEntry: HydrationEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amountMl: amount
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    safeLocalStorage.setItem('hydrationLogs', updated);
  };

  const saveSettings = (newSettings: HydrationSettings) => {
    setSettings(newSettings);
    safeLocalStorage.setItem('hydrationSettings', newSettings);
    
    // Request notification permission if enabled
    if (newSettings.enabled && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const addReminderTime = () => {
    if (newTime && !settings.reminderTimes.includes(newTime)) {
      saveSettings({
        ...settings,
        reminderTimes: [...settings.reminderTimes, newTime].sort()
      });
      setNewTime("");
    }
  };

  const removeReminderTime = (time: string) => {
    saveSettings({
      ...settings,
      reminderTimes: settings.reminderTimes.filter(t => t !== time)
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Droplets className="w-32 h-32" />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Droplets className="w-5 h-5" />
            </div>
            Hydration
          </h2>
          <p className="text-sm text-slate-500 mt-1">Goal: {settings.dailyGoalMl}ml / day</p>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings ? (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Reminder Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-600">Enable Notifications</label>
              <button 
                onClick={() => saveSettings({...settings, enabled: !settings.enabled})}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.enabled ? 'bg-teal-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.enabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Interval Reminders (Minutes)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={settings.reminderIntervalMinutes}
                  onChange={(e) => saveSettings({...settings, reminderIntervalMinutes: parseInt(e.target.value) || 0})}
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="e.g. 60"
                />
                <span className="text-xs text-slate-400 self-center">0 to disable</span>
              </div>
            </div>

             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Specific Times</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="time" 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
                />
                <button 
                  onClick={addReminderTime}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {settings.reminderTimes.map(t => (
                  <span key={t} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    {t}
                    <button onClick={() => removeReminderTime(t)} className="text-red-400 hover:text-red-600">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-slate-800">{todayTotal}<span className="text-sm font-normal text-slate-500 ml-1">ml</span></span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}% of goal</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <button 
              onClick={() => addWater(250)}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4 mb-1" />
              <span className="text-xs font-semibold">250ml</span>
            </button>
            <button 
              onClick={() => addWater(500)}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4 mb-1" />
              <span className="text-xs font-semibold">500ml</span>
            </button>
             <button 
              onClick={() => addWater(-250)}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-white text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <Minus className="w-4 h-4 mb-1" />
              <span className="text-xs font-semibold">Undo</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HydrationTracker;