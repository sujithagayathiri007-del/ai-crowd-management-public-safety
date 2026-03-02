import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Filter, Check, X, Clock } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

interface Alert {
  id: string;
  time: string;
  zone: string;
  risk: 'Warning' | 'High Risk' | 'Critical';
  actionTaken: string;
  acknowledged: boolean;
}

export function AlertsPage() {
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', time: '14:32:15', zone: 'Zone A', risk: 'Critical', actionTaken: 'Security dispatched', acknowledged: true },
    { id: '2', time: '14:28:42', zone: 'Zone C', risk: 'High Risk', actionTaken: 'Monitoring increased', acknowledged: true },
    { id: '3', time: '14:25:10', zone: 'Zone B', risk: 'Warning', actionTaken: 'Alert sent to operators', acknowledged: false },
    { id: '4', time: '14:20:05', zone: 'Zone D', risk: 'Critical', actionTaken: 'Emergency protocol activated', acknowledged: true },
    { id: '5', time: '14:15:33', zone: 'Zone A', risk: 'High Risk', actionTaken: 'Crowd control notified', acknowledged: false },
    { id: '6', time: '14:10:22', zone: 'Zone C', risk: 'Warning', actionTaken: 'Monitoring initiated', acknowledged: true },
  ]);

  const getRiskColor = (risk: string) => {
    const colors = {
      'Warning': '#facc15',
      'High Risk': '#f97316',
      'Critical': '#ef4444',
    };
    return colors[risk as keyof typeof colors];
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const filteredAlerts = selectedRisk === 'all' 
    ? alerts 
    : alerts.filter(a => a.risk === selectedRisk);

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Alert Management System</h1>
          <p className="text-gray-400">Monitor and manage all risk alerts and incidents</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filter by Risk:</span>
          </div>
          {['all', 'Critical', 'High Risk', 'Warning'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedRisk === risk
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {risk === 'all' ? 'All Alerts' : risk}
            </button>
          ))}
        </div>

        {/* Alerts Table */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Zone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Risk Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Action Taken</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredAlerts.map((alert, index) => (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {alert.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-cyan-400">{alert.zone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-sm"
                        style={{
                          backgroundColor: `${getRiskColor(alert.risk)}20`,
                          color: getRiskColor(alert.risk),
                        }}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {alert.risk}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{alert.actionTaken}</td>
                    <td className="px-6 py-4">
                      {alert.acknowledged ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Acknowledged</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Total Alerts</div>
            <div className="text-3xl font-bold text-white">{alerts.length}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Critical Alerts</div>
            <div className="text-3xl font-bold text-red-400">
              {alerts.filter(a => a.risk === 'Critical').length}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Pending Acknowledgment</div>
            <div className="text-3xl font-bold text-yellow-400">
              {alerts.filter(a => !a.acknowledged).length}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
