import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Camera, Map, Bell, FileText, Settings,
  Activity, FileCode, AlertTriangle, Shield, Clock
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Camera className="w-5 h-5" />, label: 'Live Cameras', path: '/live-cameras' },
    { icon: <Map className="w-5 h-5" />, label: 'Risk Map', path: '/risk-map' },
    { icon: <Bell className="w-5 h-5" />, label: 'Alerts', path: '/alerts' },
    { icon: <FileText className="w-5 h-5" />, label: 'Reports', path: '/reports' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
    { icon: <Activity className="w-5 h-5" />, label: 'System Health', path: '/system-health' },
    { icon: <FileCode className="w-5 h-5" />, label: 'Logs', path: '/logs' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Crowd Intelligence</h1>
              <p className="text-xs text-gray-400">Live Event Monitoring</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400 font-semibold">System Online</span>
          </div>

          <div className="text-sm text-gray-400">
            Role: <span className="text-white font-semibold">Admin</span>
          </div>

          <button className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-500/30">
            EMERGENCY
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-slate-900/30 border-r border-slate-800 overflow-y-auto">
          <div className="p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Bottom System Metrics Strip */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800 px-6 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="w-3 h-3 text-green-400" />
              <span>FPS: <span className="text-white font-semibold">30</span></span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Latency: <span className="text-cyan-400 font-semibold">~100ms</span></span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Active Sensors: <span className="text-white font-semibold">4</span></span>
            </div>
          </div>
          <div className="text-gray-500">
            AI in Crowd Management and Public Safety v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
