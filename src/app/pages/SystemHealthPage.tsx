import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Wifi, WifiOff, Cpu, HardDrive, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '../components/DashboardLayout';

export function SystemHealthPage() {
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      time: i,
      latency: 80 + Math.random() * 40,
      fps: 28 + Math.random() * 4,
      cpu: 40 + Math.random() * 30,
    }));
    setPerformanceData(data);

    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          latency: 80 + Math.random() * 40,
          fps: 28 + Math.random() * 4,
          cpu: 40 + Math.random() * 30,
        }];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const cameras = [
    { id: 'A', name: 'Camera A', status: 'online' },
    { id: 'B', name: 'Camera B', status: 'online' },
    { id: 'C', name: 'Camera C', status: 'online' },
    { id: 'D', name: 'Camera D', status: 'offline' },
  ];

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">System Health Monitor</h1>
          <p className="text-gray-400">Real-time performance metrics and sensor status</p>
        </div>

        <div className="grid gap-6">
          {/* Metrics Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <Zap className="w-8 h-8 text-cyan-400" />
                <span className="text-sm text-gray-400">Real-time</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">98ms</div>
              <div className="text-sm text-gray-400">Frame Processing Time</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <Activity className="w-8 h-8 text-green-400" />
                <span className="text-sm text-gray-400">Optimal</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">105ms</div>
              <div className="text-sm text-gray-400">Average Latency</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <Wifi className="w-8 h-8 text-green-400" />
                <span className="text-sm text-gray-400">Status</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">3/4</div>
              <div className="text-sm text-gray-400">Active Sensors</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <Cpu className="w-8 h-8 text-purple-400" />
                <span className="text-sm text-gray-400">Load</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">55%</div>
              <div className="text-sm text-gray-400">CPU Usage</div>
            </motion.div>
          </div>

          {/* Performance Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Performance Metrics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2} name="Latency (ms)" />
                <Line type="monotone" dataKey="fps" stroke="#22c55e" strokeWidth={2} name="FPS" />
                <Line type="monotone" dataKey="cpu" stroke="#f97316" strokeWidth={2} name="CPU %" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Camera Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Camera Status</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {cameras.map((camera, index) => (
                <div
                  key={camera.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-white mb-1">{camera.name}</div>
                      <div className="text-sm text-gray-400">Zone {camera.id}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      {camera.status === 'online' ? (
                        <>
                          <Wifi className="w-6 h-6 text-green-400 mb-1" />
                          <span className="text-xs text-green-400 font-semibold">Online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-6 h-6 text-red-400 mb-1" />
                          <span className="text-xs text-red-400 font-semibold">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
