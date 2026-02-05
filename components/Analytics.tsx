import React from 'react';
import { LogEntry } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

interface AnalyticsProps {
  logs: LogEntry[];
}

const Analytics: React.FC<AnalyticsProps> = ({ logs }) => {
  if (logs.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 rounded-xl border-dashed border-2 border-slate-300 text-slate-400">
        Log at least 2 meals to see analytics
      </div>
    );
  }

  // Process data for charts
  const reversedLogs = [...logs].reverse(); // Chronological order
  
  const chartData = reversedLogs.map(log => ({
    time: !isNaN(Date.parse(log.date)) ? new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '?',
    severity: log.severity,
    bsAfter: Number(log.bloodSugarAfter) || 0,
    activity: log.activity
  }));

  // Stress Test Fix: Handle unknown activity types dynamically to prevent crash
  const avgSeverityByActivity: Record<string, { total: number, count: number }> = {
    'Sat Upright': { total: 0, count: 0 },
    'Walked': { total: 0, count: 0 },
    'Lay Down': { total: 0, count: 0 },
  };

  logs.forEach(log => {
    const act = log.activity || 'Unknown';
    if (!avgSeverityByActivity[act]) {
      avgSeverityByActivity[act] = { total: 0, count: 0 };
    }
    avgSeverityByActivity[act].total += log.severity;
    avgSeverityByActivity[act].count += 1;
  });

  const activityData = Object.keys(avgSeverityByActivity).map(key => ({
    name: key,
    avgSeverity: avgSeverityByActivity[key].count > 0 
      ? parseFloat((avgSeverityByActivity[key].total / avgSeverityByActivity[key].count).toFixed(1))
      : 0
  }));

  return (
    <div className="space-y-8">
      
      {/* Chart 1: Severity Over Time */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Symptom Severity Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Line 
                type="monotone" 
                dataKey="severity" 
                stroke="#0d9488" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0d9488' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Impact of Post-Meal Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Impact of Activity on Symptoms</h3>
        <p className="text-sm text-slate-500 mb-6">Average severity score based on what you did after eating.</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" domain={[0, 10]} fontSize={12} />
              <Tooltip 
                 cursor={{fill: '#f1f5f9'}}
                 contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="avgSeverity" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Correlation Hint */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
        <div className="mt-1">💡</div>
        <div>
          <h4 className="font-semibold text-blue-900">Pattern Recognition</h4>
          <p className="text-sm text-blue-800">
            If your "Lay Down" bar is significantly higher than "Walked", this confirms the gravity rule is critical for your management. 
            Also watch for spikes in severity when Blood Sugar is high.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Analytics;