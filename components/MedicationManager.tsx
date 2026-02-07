import React, { useState, useEffect } from 'react';
import { Pill, Plus, Trash2, Clock, Bell, Check, X, AlertTriangle } from 'lucide-react';
import { Medication } from '../types';
import { safeLocalStorage } from '../utils/storage';

interface MedicationManagerProps {
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
}

const MedicationManager: React.FC<MedicationManagerProps> = ({ medications, setMedications }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);
  const [newMed, setNewMed] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    time: '',
    enabled: true
  });

  useEffect(() => {
    // Check permission status periodically or on mount
    setPermission(Notification.permission);
  }, []);

  const requestPerms = () => {
    Notification.requestPermission().then(setPermission);
  };

  const handleAdd = () => {
    if (!newMed.name || !newMed.time) return;
    const medication: Medication = {
      id: Date.now().toString(),
      name: newMed.name,
      dosage: newMed.dosage || '',
      time: newMed.time,
      enabled: true
    };
    const updated = [...medications, medication];
    setMedications(updated);
    safeLocalStorage.setItem('gastroMeds', updated);
    setNewMed({ name: '', dosage: '', time: '', enabled: true });
    setIsAdding(false);
    
    if (Notification.permission !== 'granted') {
      requestPerms();
    }
  };

  const handleDelete = (id: string) => {
    const updated = medications.filter(m => m.id !== id);
    setMedications(updated);
    safeLocalStorage.setItem('gastroMeds', updated);
  };

  const toggleEnable = (id: string) => {
    const updated = medications.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    );
    setMedications(updated);
    safeLocalStorage.setItem('gastroMeds', updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-6 h-6 text-indigo-600" />
            Medications & Reminders
          </h2>
          <p className="text-sm text-slate-500">Track doses and set daily reminders.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-2 rounded-lg transition-colors"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {permission === 'denied' && (
        <div className="mb-6 bg-red-50 p-3 rounded-lg flex items-center gap-3 text-red-800 text-sm border border-red-200">
          <AlertTriangle className="w-5 h-5" />
          <span>Notifications are blocked. You won't receive reminders. Please enable them in browser settings.</span>
        </div>
      )}
      {permission === 'default' && (
         <button onClick={requestPerms} className="mb-6 w-full py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 text-sm font-semibold">
           Enable Browser Notifications
         </button>
      )}

      {isAdding && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-semibold text-slate-700 mb-3">Add New Medication</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
<input
  type="text"
  placeholder="Medication Name"
  className="p-2 border border-slate-200 rounded text-sm"
  value={newMed.name}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
    setNewMed({...newMed, name: e.target.value})
  }
/>
<input
  type="text"
  placeholder="Dosage (e.g. 10mg)"
  className="p-2 border border-slate-200 rounded text-sm"
  value={newMed.dosage}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
    setNewMed({...newMed, dosage: e.target.value})
  }
/>
<input
  type="time"
  className="p-2 border border-slate-200 rounded text-sm"
  value={newMed.time}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
    setNewMed({...newMed, time: e.target.value})
  }
/>

          </div>
          <button 
            onClick={handleAdd}
            disabled={!newMed.name || !newMed.time}
            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
          >
            Save Reminder
          </button>
        </div>
      )}

      <div className="space-y-3">
        {medications.length === 0 && !isAdding && (
          <p className="text-center text-slate-400 italic py-4">No medications added yet.</p>
        )}
     {medications
  .sort((a: any, b: any) => a.time.localeCompare(b.time)) .map((med: any) => (
                  <div key={med.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${med.enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{med.name} <span className="text-sm font-normal text-slate-500">({med.dosage})</span></p>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
                  <span>{med.time}</span>
                  {med.enabled && <span className="flex items-center gap-1 text-teal-600 bg-teal-50 px-1.5 rounded text-xs"><Bell className="w-3 h-3"/> Active</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleEnable(med.id)}
                className={`p-2 rounded-lg border ${med.enabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                title={med.enabled ? "Disable Reminder" : "Enable Reminder"}
              >
                {med.enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => handleDelete(med.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

