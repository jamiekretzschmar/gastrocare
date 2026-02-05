import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, BookOpen, Activity, Stethoscope, Building2, Flame, Pill, HelpCircle, Github, Menu } from 'lucide-react';
import Tracker from './components/Tracker';
import MealPlan from './components/MealPlan';
import Guidelines from './components/Guidelines';
import Analytics from './components/Analytics';
import AiAssistant from './components/AiAssistant';
import HydrationTracker from './components/HydrationTracker';
import NutrientSummary from './components/NutrientSummary';
import HamiltonGuide from './components/HamiltonGuide';
import UprightTimer from './components/UprightTimer';
import MedicationManager from './components/MedicationManager';
import FlareProtocolInfo from './components/FlareProtocolInfo';
import { Tab, LogEntry, HydrationEntry, HydrationSettings, Medication, MealItem } from './types';
import { MEAL_PLAN } from './constants';
import { safeLocalStorage } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [flareMode, setFlareMode] = useState(false);
  const [showFlareInfo, setShowFlareInfo] = useState(false);
  
  // Dynamic State
  const [medications, setMedications] = useState<Medication[]>([]);
  const [mealPlan, setMealPlan] = useState<MealItem[]>(MEAL_PLAN);

  // Hydration State
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

  // Safe Notification Helper
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, options);
      } catch (e) {
        console.warn('Notification failed', e);
      }
    }
  };

  // Safe Permission Request
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  // Hydration Reminder Logic
  useEffect(() => {
    if (!hydrationSettings.enabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentHm = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      if (hydrationSettings.reminderTimes && hydrationSettings.reminderTimes.includes(currentHm)) {
        sendNotification("Hydration Reminder", { 
          body: "It's time to drink some water!",
          icon: "/vite.svg" 
        });
      }
    };

    if (hydrationSettings.enabled) {
      requestNotificationPermission();
    }

    const intervalId = setInterval(checkReminders, 60000); 
    return () => clearInterval(intervalId);
  }, [hydrationSettings.enabled, hydrationSettings.reminderTimes]);

  // Interval Hydration Check
  useEffect(() => {
    if (!hydrationSettings.enabled || hydrationSettings.reminderIntervalMinutes <= 0) return;
    const intervalId = setInterval(() => {
       sendNotification("Hydration Check", {
         body: `Remember to sip water! Interval: ${hydrationSettings.reminderIntervalMinutes}m`,
       });
    }, hydrationSettings.reminderIntervalMinutes * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [hydrationSettings.reminderIntervalMinutes, hydrationSettings.enabled]);

  // Medication Notification Logic
  useEffect(() => {
    if (!Array.isArray(medications)) return;

    const checkMeds = () => {
      const now = new Date();
      const currentHm = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      medications.forEach(med => {
        if (med.enabled && med.time === currentHm) {
           sendNotification("Medication Reminder", {
             body: `Time to take ${med.name} (${med.dosage})`,
           });
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
                     <button 
                       onClick={() => setShowFlareInfo(true)}
                       className="text-slate-400 hover:text-slate-600 p-2"
                       title="What is Flare-Up Mode?"
                     >
                       <HelpCircle className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => setFlareMode(!flareMode)}
                       className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${
                         flareMode 
                         ? 'bg-red-600 text-white shadow-red-200 ring-2 ring-red-100' 
                         : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                       }`}
                     >
                       <Flame className={`w-4 h-4 ${flareMode ? 'fill-current' : ''}`} />
                       <span className="hidden sm:inline">Flare-Up Mode:</span> {flareMode ? 'ON' : 'OFF'}
                     </button>
                   </div>
                </div>
                <NutrientSummary logs={logs} flareMode={flareMode} />
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  {flareMode ? 'Liquid/Puree Plan' : 'Standard Meal Plan'}
                </h2>
                <MealPlan 
                  flareMode={flareMode} 
                  mealPlan={mealPlan}
                  setMealPlan={setMealPlan}
                />
              </section>
            </div>
            <div className="space-y-8">
              <section>
                 <UprightTimer />
              </section>
              <section>
                 <MedicationManager medications={medications} setMedications={setMedications} />
              </section>
              <section>
                 <HydrationTracker 
                   entries={hydrationLogs} 
                   setEntries={setHydrationLogs}
                   settings={hydrationSettings}
                   setSettings={setHydrationSettings}
                 />
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Tracker</h2>
                <Tracker logs={logs} setLogs={setLogs} />
              </section>
            </div>
          </div>
        );
      case Tab.MEAL_PLAN:
        return (
          <div className="space-y-6">
             <div className="flex justify-end gap-2">
               <button 
                 onClick={() => setShowFlareInfo(true)}
                 className="text-slate-500 hover:bg-slate-100 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
               >
                 <HelpCircle className="w-4 h-4" /> Protocol Info
               </button>
               <button 
                     onClick={() => setFlareMode(!flareMode)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${
                       flareMode 
                       ? 'bg-red-600 text-white shadow-md ring-2 ring-red-300' 
                       : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                     }`}
                   >
                     <Flame className={`w-4 h-4 ${flareMode ? 'fill-current' : ''}`} />
                     Flare-Up Mode: {flareMode ? 'ON' : 'OFF'}
               </button>
             </div>
             <MealPlan flareMode={flareMode} mealPlan={mealPlan} setMealPlan={setMealPlan} />
          </div>
        );
      case Tab.MEDS:
        return <MedicationManager medications={medications} setMedications={setMedications} />;
      case Tab.GUIDELINES:
        return <Guidelines />;
      case Tab.TRACKER:
        return (
          <div className="space-y-8">
            <NutrientSummary logs={logs} flareMode={flareMode} />
            <Tracker logs={logs} setLogs={setLogs} />
          </div>
        );
      case Tab.ASSISTANT: 
        return <AiAssistant logs={logs} />;
      case Tab.CLINIC:
        return <HamiltonGuide />;
      default:
        return <Analytics logs={logs} />;
    }
  };

  const NavBtn = ({ tab, icon: Icon }: { tab: Tab | 'Analytics', icon: any }) => (
    <button
      onClick={() => setActiveTab(tab as Tab)}
      className={`flex flex-col items-center gap-1 p-2 min-w-[4.5rem] rounded-xl transition-all select-none active:scale-95 ${
        activeTab === tab 
          ? 'text-teal-600 bg-teal-50 font-bold' 
          : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className={`w-6 h-6 ${activeTab === tab ? 'stroke-[2.5px]' : ''}`} />
      <span className="text-[10px] whitespace-nowrap">{tab === Tab.DASHBOARD ? 'Home' : tab.split(' ')[0]}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 md:pl-24">
      {/* Mobile-Optimized Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 z-40 md:static md:bg-transparent md:border-none md:p-8">
         <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-6 h-6 text-teal-600 md:hidden" />
                GastroCare Sync
              </h1>
              <p className="hidden md:block text-slate-500 mt-1">Daily management & safety protocol</p>
            </div>
            <div className="hidden md:block">
              <span className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold border border-teal-100">
                Immunosuppressed Protocol Active
              </span>
            </div>
            {/* Mobile Flare Toggle Mini */}
            <div className="md:hidden">
              <button 
                  onClick={() => setFlareMode(!flareMode)}
                  className={`p-2 rounded-full transition-all ${flareMode ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}
              >
                  <Flame className={`w-5 h-5 ${flareMode ? 'fill-current' : ''}`} />
              </button>
            </div>
         </div>
      </header>

      {/* Spacer for fixed header on mobile */}
      <div className="h-16 md:hidden" />

      {/* Navigation - Sidebar on Desktop, Horizontal Scroll Strip on Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:left-0 md:w-24 bg-white border-t md:border-t-0 md:border-r border-slate-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
        
        {/* Mobile: Horizontal Scroll Container */}
        <div className="md:hidden w-full overflow-x-auto hide-scrollbar flex items-center gap-2 px-4 py-2">
            <NavBtn tab={Tab.DASHBOARD} icon={LayoutDashboard} />
            <NavBtn tab={Tab.TRACKER} icon={Activity} />
            <NavBtn tab={Tab.MEAL_PLAN} icon={CalendarDays} />
            <NavBtn tab={Tab.MEDS} icon={Pill} />
            <NavBtn tab={Tab.ASSISTANT} icon={Stethoscope} />
            <NavBtn tab={Tab.GUIDELINES} icon={BookOpen} />
            <NavBtn tab={'Analytics' as any} icon={Activity} />
            <NavBtn tab={Tab.CLINIC} icon={Building2} />
        </div>

        {/* Desktop: Vertical Column */}
        <div className="hidden md:flex flex-col justify-center gap-8 h-full p-2 overflow-y-auto hide-scrollbar">
            <NavBtn tab={Tab.DASHBOARD} icon={LayoutDashboard} />
            <NavBtn tab={Tab.MEAL_PLAN} icon={CalendarDays} />
            <NavBtn tab={Tab.MEDS} icon={Pill} />
            <NavBtn tab={Tab.TRACKER} icon={Activity} />
            <NavBtn tab={Tab.GUIDELINES} icon={BookOpen} />
            <NavBtn tab={Tab.CLINIC} icon={Building2} />
            <NavBtn tab={Tab.ASSISTANT} icon={Stethoscope} />
            <button
              onClick={() => setActiveTab('Analytics' as any)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                activeTab === 'Analytics' 
                  ? 'bg-teal-600 text-white shadow-lg scale-105' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <Activity className="w-6 h-6" />
              <span className="text-xs font-medium">Analytics</span>
            </button>
            <a
              href="https://github.com/jamiekretzschmar/gastrocare"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-slate-400 hover:bg-slate-100 hover:text-slate-700 mt-auto"
              title="View on GitHub"
            >
              <Github className="w-6 h-6" />
              <span className="text-[10px] font-medium">Source</span>
            </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {renderContent()}

        {showFlareInfo && (
          <FlareProtocolInfo onClose={() => setShowFlareInfo(false)} />
        )}
      </main>
    </div>
  );
}

export default App;