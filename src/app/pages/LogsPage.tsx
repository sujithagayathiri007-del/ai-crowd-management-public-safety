import { useState } from 'react';
import { motion } from 'motion/react';
import { FileCode, Search, Filter } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
}

export function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs] = useState<Log[]>([
    { id: '1', timestamp: '2026-02-14 14:35:22', level: 'info', message: 'YOLO detection initialized', source: 'Detection Engine' },
    { id: '2', timestamp: '2026-02-14 14:35:20', level: 'success', message: 'Camera A connected successfully', source: 'Camera Manager' },
    { id: '3', timestamp: '2026-02-14 14:35:18', level: 'warning', message: 'High crowd density detected in Zone C', source: 'Risk Analyzer' },
    { id: '4', timestamp: '2026-02-14 14:35:15', level: 'error', message: 'Camera D connection timeout', source: 'Camera Manager' },
    { id: '5', timestamp: '2026-02-14 14:35:10', level: 'info', message: 'Risk prediction model updated', source: 'ML Engine' },
    { id: '6', timestamp: '2026-02-14 14:35:05', level: 'success', message: 'Alert sent to operators', source: 'Alert System' },
    { id: '7', timestamp: '2026-02-14 14:35:00', level: 'info', message: 'System health check completed', source: 'System Monitor' },
    { id: '8', timestamp: '2026-02-14 14:34:55', level: 'warning', message: 'GPU temperature above 70°C', source: 'Hardware Monitor' },
    { id: '9', timestamp: '2026-02-14 14:34:50', level: 'info', message: 'Database backup initiated', source: 'Backup Service' },
    { id: '10', timestamp: '2026-02-14 14:34:45', level: 'success', message: 'WebSocket connection established', source: 'Network Manager' },
  ]);

  const getLevelColor = (level: string) => {
    const colors = {
      'info': { bg: '#06b6d420', text: '#06b6d4', border: '#06b6d4' },
      'warning': { bg: '#facc1520', text: '#facc15', border: '#facc15' },
      'error': { bg: '#ef444420', text: '#ef4444', border: '#ef4444' },
      'success': { bg: '#22c55e20', text: '#22c55e', border: '#22c55e' },
    };
    return colors[level as keyof typeof colors];
  };

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
          <p className="text-gray-400">Real-time system events and activity monitoring</p>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Logs Table */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Timestamp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Source</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLogs.map((log, index) => {
                  const colors = getLevelColor(log.level);
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm">{log.timestamp}</td>
                      <td className="px-6 py-4">
                        <div
                          className="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {log.level}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-cyan-400 font-semibold text-sm">{log.source}</td>
                      <td className="px-6 py-4 text-gray-300">{log.message}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {['info', 'success', 'warning', 'error'].map((level) => {
            const count = logs.filter(l => l.level === level).length;
            const colors = getLevelColor(level);
            return (
              <div
                key={level}
                className="bg-slate-800/50 rounded-lg border p-4"
                style={{ borderColor: colors.border }}
              >
                <div className="text-sm text-gray-400 capitalize mb-1">{level}</div>
                <div className="text-2xl font-bold" style={{ color: colors.text }}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
