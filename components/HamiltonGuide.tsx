import React from 'react';
import { Building2, Phone, Clock, FileText, Activity } from 'lucide-react';

const HamiltonGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Hamilton Health Sciences</h2>
            <p className="text-slate-500 font-medium">Gastroparesis & Motility Services</p>
            <p className="text-sm text-slate-400 mt-1">Primarily located at McMaster University Medical Centre</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Services Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" /> Key Specialized Services
          </h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">Motility Clinic</span>
                <p className="text-sm text-slate-600">Specialty clinic for conditions where digestive movement is impaired.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">GI Motility Lab</span>
                <p className="text-sm text-slate-600">Performs diagnostic tests like esophageal manometry. Located at Room 4X24.</p>
              </div>
            </li>
             <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">Boris Clinic</span>
                <p className="text-sm text-slate-600">Outpatient gastroenterology consultations for functional GI diseases.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Access Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> How to Access Care
          </h3>
          
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <p className="text-sm font-semibold text-indigo-900 mb-1">Referral Required</p>
              <p className="text-sm text-indigo-800">You cannot book directly. Your family doctor must fax a Gastroenterology Referral Request to the central intake.</p>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-400 mt-1" />
              <div>
                <p className="font-medium text-slate-800">Wait Times</p>
                <p className="text-sm text-slate-600">Routine appointments: <span className="font-semibold">6 to 12 months</span>.</p>
                <p className="text-xs text-slate-500 mt-1">Referrals are triaged by urgency (e.g., severe weight loss).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
           <h3 className="font-bold text-slate-800 flex items-center gap-2">
             <Phone className="w-4 h-4" /> Contact Directory
           </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Facility</th>
                <th className="px-6 py-3">Location (McMaster Med Centre)</th>
                <th className="px-6 py-3">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-white hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">Digestive Diseases Clinic</td>
                <td className="px-6 py-4 text-slate-600">Level 2, Section F</td>
                <td className="px-6 py-4 font-mono text-slate-700">905-521-2100 x76903</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">GI Motility Lab</td>
                <td className="px-6 py-4 text-slate-600">Level 4, Section 4X (Room 4X24)</td>
                <td className="px-6 py-4 font-mono text-slate-700">905-521-2100 x73265</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">The Boris Clinic</td>
                <td className="px-6 py-4 text-slate-600">Level 4, Yellow Section</td>
                <td className="px-6 py-4 font-mono text-slate-700">905-521-2100 x75353</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HamiltonGuide;