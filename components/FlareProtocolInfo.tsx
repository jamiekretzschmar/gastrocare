import React from 'react';
import { X, AlertCircle, Droplet, Ban, Activity } from 'lucide-react';

interface FlareProtocolInfoProps {
  onClose: () => void;
}

const FlareProtocolInfo: React.FC<FlareProtocolInfoProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-red-600 p-6 flex justify-between items-start text-white">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Flare-Up Protocol</h2>
              <p className="text-red-100 text-sm">Emergency management for severe symptoms</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" /> When to Activate
            </h3>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-slate-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>Vomiting has occurred within the last 24 hours.</li>
                <li>Nausea severity is consistently above 7/10.</li>
                <li>Unable to tolerate solid foods without significant pain.</li>
                <li>Feeling full after only a few bites of food.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-600" /> Dietary Changes (Stage 1 & 2)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">Allowed Foods</h4>
                <ul className="text-sm text-blue-900 space-y-1">
                  <li>• Clear Broths (Chicken/Beef/Bone)</li>
                  <li>• Electrolyte Drinks (Pedialyte/Gatorade)</li>
                  <li>• Jell-O (No fruit pieces)</li>
                  <li>• Pureed Soups (No chunks)</li>
                  <li>• Nutritional Shakes (Ensure/Boost)</li>
                  <li>• Crackers/Toast (If tolerated, chewed well)</li>
                </ul>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 opacity-75">
                 <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Ban className="w-4 h-4" /> Strictly Prohibited</h4>
                 <ul className="text-sm text-slate-600 space-y-1">
                  <li>• All Raw Vegetables & Fruits</li>
                  <li>• All Solid Meats (Steak, Chicken Breast)</li>
                  <li>• High Fiber (Oatmeal, Whole Grains)</li>
                  <li>• Dairy (if lactose aggravates bloating)</li>
                  <li>• Carbonated Beverages</li>
                 </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Activity & Lifestyle Modifications</h3>
            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                 <div>
                   <h4 className="font-semibold text-slate-800">Hydration is Priority #1</h4>
                   <p className="text-sm text-slate-600">Sip fluids continuously. Aim for 125ml (1/2 cup) every hour rather than gulping large amounts.</p>
                 </div>
              </div>
              <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                 <div>
                   <h4 className="font-semibold text-slate-800">Strict Vertical Rest</h4>
                   <p className="text-sm text-slate-600">Do not lie flat for at least 2 hours after any intake. Sleep with your head elevated on wedges or pillows.</p>
                 </div>
              </div>
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                 <div>
                   <h4 className="font-semibold text-slate-800">Bowel Management</h4>
                   <p className="text-sm text-slate-600">Ensure you are still passing stool. If constipated, hydration and doctor-approved softeners are critical as constipation worsens nausea.</p>
                 </div>
              </div>
            </div>
          </section>

          <section>
             <h3 className="text-lg font-bold text-slate-800 mb-2">Expected Outcomes</h3>
             <p className="text-slate-600">
               The goal of this protocol is to give the stomach muscles "mechanical rest". By removing solids, we allow gravity to empty the stomach without requiring strong contractions. Most patients see a reduction in nausea within 24-48 hours. If vomiting persists > 48 hours despite this protocol, seek medical attention.
             </p>
          </section>

        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-900 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlareProtocolInfo;