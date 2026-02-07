import React, { useState, useEffect } from 'react';
import { ArrowUp, Play, Pause, RotateCcw, Footprints } from 'lucide-react';

const UprightTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Upright' | 'Walking'>('Upright');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (isActive) {
        new Notification("Timer Complete", { body: `You have completed your ${mode} session.` });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const startTimer = (durationMinutes: number, type: 'Upright' | 'Walking') => {
    setTimeLeft(durationMinutes * 60);
    setMode(type);
    setIsActive(true);
    if (Notification.permission !== 'granted') Notification.requestPermission();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {mode === 'Upright' ? <ArrowUp className="w-5 h-5 text-indigo-600" /> : <Footprints className="w-5 h-5 text-teal-600" />}
            Post-Meal Timer
          </h2>
          <p className="text-sm text-slate-500">
            {mode === 'Upright' ? 'Gravity helps stomach emptying.' : 'Gentle movement stimulates motility.'}
          </p>
        </div>
        <div className="text-3xl font-mono font-bold text-slate-700">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {!isActive ? (
          <>
            <button 
              onClick={() => startTimer(60, 'Upright')}
              className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
            >
              1 Hr Upright
            </button>
            <button 
              onClick={() => startTimer(15, 'Walking')}
              className="flex-1 bg-teal-50 text-teal-700 py-2 rounded-lg text-sm font-semibold hover:bg-teal-100 transition-colors"
            >
              15m Walk
            </button>
          </>
        ) : (
          <div className="flex-1 flex gap-2">
             <button 
              onClick={() => setIsActive(!isActive)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold"
            >
              {isActive ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
              {isActive ? 'Pause' : 'Resume'}
            </button>
            <button 
              onClick={() => { setIsActive(false); setTimeLeft(0); }}
              className="px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded border border-slate-100">
        <span className="font-bold">Clinical Note:</span> Do not lie flat! Keep head elevated at least 45 degrees if you must rest.
      </div>
    </div>
  );
};

