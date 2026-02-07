import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CalendarDays, BookOpen, Activity, Stethoscope, 
  Building2, Flame, Pill, HelpCircle, Github 
} from 'lucide-react';

// Component Imports
import { Tracker } from './components/Tracker';
import { MealPlan } from './components/MealPlan';
import { Guidelines } from './components/Guidelines';
import { Analytics } from './components/Analytics';
import { AiAssistant } from './components/AiAssistant';
import { HydrationTracker } from './components/HydrationTracker';
import { NutrientSummary } from './components/NutrientSummary';
import { HamiltonGuide } from './components/HamiltonGuide';
import { UprightTimer } from './components/UprightTimer';
import { MedicationManager } from './components/MedicationManager';
import { FlareProtocolInfo } from './components/FlareProtocolInfo';

// Types and Utilities
import { Tab, LogEntry, HydrationEntry, HydrationSettings, Medication, MealItem } from './types';
import { MEAL_PLAN } from './constants';
import { safeLocalStorage } from './utils/storage';


function App() {
  // Gatekeeper to prevent white-screening if the .env key is missing
     const API_KEY = import.meta.env.VITE_API_KEY;
  if (!API_KEY || API_KEY.includes("your_gemini_api_key")) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h2>
          <p className="text-slate-600 mb-6">
            Your <strong>.env</strong> file is missing or <strong>VITE_API_KEY</strong> is incorrect.
          </p>
          <code className="block bg-slate-100 p-3 rounded text-sm text-left mb-4 font-mono">
            VITE_API_KEY=AIzaSy...
          </code>
          <p className="text-xs text-slate-400">Restart your terminal after fixing the .env file.</p>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [flareMode, setFlareMode] = useState(false);
  const [showFlareInfo, setShowFlareInfo] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [mealPlan, setMealPlan] = useState<MealItem[]>(MEAL_PLAN);
  const [hydrationLogs, setHydrationLogs] = useState<HydrationEntry[]>([]);
  const [hydrationSettings, setHydrationSettings] = useState<HydrationSettings>({
    dailyGoalMl: 2000,
    reminderIntervalMinutes: 60,
    reminderTimes: [],
    enabled: false
  });

  // Load data from local storage
  useEffect(() => {
    setLogs(safeLocalStorage.getItem('gastroLogs', []));
    setHydrationLogs(safeLocalStorage.getItem('hydrationLogs', []));
    setHydrationSettings(safeLocalStorage.getItem('hydrationSettings', {
      dailyGoalMl: 2000,
      reminderIntervalMinutes: 60,
      reminderTimes: [],
      enabled: false
    }));
    setMedications(safeLocalStorage.getItem('gastroMeds', []));
    setMealPlan(safeLocalStorage.getItem('gastroMealPlan', MEAL_PLAN));
  }, []);

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, options); } catch (e) { console.warn('Notification failed', e); }
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    if (!hydrationSettings.enabled) return;
    const checkReminders = () => {
      const now = new Date();
      const currentHm = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      if (hydrationSettings.reminderTimes?.includes(currentHm)) {
        sendNotification("Hydration Reminder", { body: "It's time to drink some water!", icon: "/vite.svg" });
      }
    };
    if (hydrationSettings.enabled) requestNotificationPermission();
    const intervalId = setInterval(checkReminders, 60000); 
    return () => clearInterval(intervalId);
  }, [hydrationSettings.enabled, hydrationSettings.reminderTimes]);

  useEffect(() => {
    if (!hydrationSettings.enabled || hydrationSettings.reminderIntervalMinutes <= 0) return;
    const intervalId = setInterval(() => {
       sendNotification("Hydration Check", { body: `Remember to sip water! Interval: ${hydrationSettings.reminderIntervalMinutes}m` });
    }, hydrationSettings.reminderIntervalMinutes * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [hydrationSettings.reminderIntervalMinutes, hydrationSettings.enabled]);

  useEffect(() => {
    if (!Array.isArray(medications)) return;
    const checkMeds = () => {
      const now = new Date();
      const currentHm = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      medications.forEach(med => {
        if (med.enabled && med.time === currentHm) {
           sendNotification("Medication Reminder", { body: `Time to take ${med.name} (${med.dosage})` });
        }
      });
    };
    const intervalId = setInterval(checkMeds, 60000);
    return () => clearInterval(intervalId);
  }, [medications]);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Daily Nutrition</h2>
                   <div className="flex gap-2">
                     <button onClick={() => setShowFlareInfo(true)} className="text-slate-400 hover:text-slate-600 p-2"><HelpCircle className="w-5 h-5" /></button>
                     <button 
                       onClick={() => setFlareMode(!flareMode)}
                       className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${flareMode ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                     >
                       <Flame className={`w-4 h-4 ${flareMode ? 'fill-current' : ''}`} />
                       {flareMode ? 'Flare-Up: ON' : 'Flare-Up: OFF'}
                     </button>
                   </div>
                </div>
                <NutrientSummary logs={logs} flareMode={flareMode} />
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">{flareMode ? 'Liquid/Puree Plan' : 'Standard Meal Plan'}</h2>
                <MealPlan flareMode={flareMode} mealPlan={mealPlan} setMealPlan={setMealPlan} />
              </section>
            </div>
            <div className="space-y-8">
              <UprightTimer />
              <MedicationManager medications={medications} setMedications={setMedications} />
              <HydrationTracker entries={hydrationLogs} setEntries={setHydrationLogs} settings={hydrationSettings} setSettings={setHydrationSettings} />
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Tracker</h2>
                <Tracker logs={logs} setLogs={setLogs} />
              </div>
            </div>
          </div>
        );
      case Tab.MEAL_PLAN: return <MealPlan flareMode={flareMode} mealPlan={mealPlan} setMealPlan={setMealPlan} />;
      case Tab.MEDS: return <MedicationManager medications={medications} setMedications={setMedications} />;
      case Tab.GUIDELINES: return <Guidelines />;
      case Tab.TRACKER: return (
        <div className="space-y-8">
          <NutrientSummary logs={logs} flareMode={flareMode} />
          <Tracker logs={logs} setLogs={setLogs} />
        </div>
      );
      case Tab.ASSISTANT: return <AiAssistant logs={logs} />;
      case Tab.CLINIC: return <HamiltonGuide />;
      default: return <Analytics logs={logs} />;
    }
  };

  const NavBtn = ({ tab, icon: Icon }: { tab: any, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center gap-1 p-2 min-w-[4.5rem] rounded-xl transition-all ${activeTab === tab ? 'text-teal-600 bg-teal-50 font-bold' : 'text-slate-400'}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px]">{tab === Tab.DASHBOARD ? 'Home' : tab.toString().split(' ')[0]}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 md:pl-24">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b p-4 z-40 md:static md:bg-transparent md:border-none md:p-8">
         <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight">GastroCare Sync</h1>
            <div className="hidden md:block">
              <span className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold border border-teal-100">
                Immunosuppressed Protocol Active
              </span>
            </div>
         </div>
      </header>
      <div className="h-16 md:hidden" />
      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:left-0 md:w-24 bg-white border-t md:border-r border-slate-200 z-50">
        <div className="flex md:flex-col justify-around md:justify-center items-center h-full p-2 overflow-x-auto md:overflow-y-auto">
            <NavBtn tab={Tab.DASHBOARD} icon={LayoutDashboard} />
            <NavBtn tab={Tab.TRACKER} icon={Activity} />
            <NavBtn tab={Tab.MEAL_PLAN} icon={CalendarDays} />
            <NavBtn tab={Tab.MEDS} icon={Pill} />
            <NavBtn tab={Tab.ASSISTANT} icon={Stethoscope} />
            <NavBtn tab={Tab.GUIDELINES} icon={BookOpen} />
            <a href="https://github.com/jamiekretzschmar/gastrocare" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-3 text-slate-400 mt-auto">
              <Github className="w-6 h-6" />
            </a>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {renderContent()}
        {showFlareInfo && <FlareProtocolInfo onClose={() => setShowFlareInfo(false)} />}
      </main>
    </div>
  );
}

export default App;
