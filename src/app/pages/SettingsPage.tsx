import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Sliders, ToggleLeft, Camera, Bell } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export function SettingsPage() {
  const [safeThreshold, setSafeThreshold] = useState(2);
  const [warningThreshold, setWarningThreshold] = useState(4);
  const [highRiskThreshold, setHighRiskThreshold] = useState(6);
  const [failureMode, setFailureMode] = useState(false);
  const [cameraMode, setCameraMode] = useState('webcam');

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-400">Configure risk thresholds and system parameters</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Risk Thresholds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sliders className="w-6 h-6 text-cyan-400" />
              Risk Threshold Configuration
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 font-semibold">Safe Threshold</label>
                  <span className="text-green-400 font-bold">{safeThreshold} people/m²</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={safeThreshold}
                  onChange={(e) => setSafeThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 font-semibold">Warning Threshold</label>
                  <span className="text-yellow-400 font-bold">{warningThreshold} people/m²</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.1"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 font-semibold">High Risk Threshold</label>
                  <span className="text-orange-400 font-bold">{highRiskThreshold} people/m²</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="0.1"
                  value={highRiskThreshold}
                  onChange={(e) => setHighRiskThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </motion.div>

          {/* System Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-cyan-400" />
              System Options
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300 font-semibold block">Failure Mode Simulation</label>
                  <p className="text-sm text-gray-500">Test system response to sensor failures</p>
                </div>
                <button
                  onClick={() => setFailureMode(!failureMode)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    failureMode ? 'bg-red-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                    failureMode ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-3">Camera Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {['webcam', 'ip-camera', 'cctv'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCameraMode(mode)}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        cameraMode === mode
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      <Camera className="w-5 h-5 mx-auto mb-1" />
                      {mode.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Alert Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-cyan-400" />
              Alert Recipients
            </h2>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors">
                Add Recipient
              </button>
            </div>
          </motion.div>

          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-lg transition-all">
            Save All Settings
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
