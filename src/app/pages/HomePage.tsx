import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Camera, Brain, Shield, TrendingUp, Activity, Bell,
  Video, Map, BarChart, FileText, Settings, Cpu,
  Eye, Users, AlertTriangle, Lock, Database, Zap
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'AI-Based Crowd Detection',
      description: 'Real-time YOLO-powered person detection with 95%+ accuracy',
      color: 'cyan',
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Multi-Sensor Data Fusion',
      description: 'Combines camera, IoT sensors, and environmental data',
      color: 'green',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Risk Classification Engine',
      description: 'ML-powered risk assessment with 4-level classification',
      color: 'yellow',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Future Risk Prediction',
      description: 'Predictive analytics for crowd escalation scenarios',
      color: 'orange',
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Movement Anomaly Detection',
      description: 'Detects unusual crowd patterns and behaviors',
      color: 'red',
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Real-Time Alert System',
      description: 'Instant notifications with automated decision support',
      color: 'purple',
    },
  ];

  const privacyFeatures = [
    'No facial recognition technology used',
    'Zero personal identity storage',
    'End-to-end encrypted data transmission',
    'Automatic 30-day data deletion',
    'GDPR & privacy law compliant',
    'Anonymous crowd analytics only',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-auto">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Crowd Intelligence</h1>
                <p className="text-xs text-gray-400">Public Safety Management</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
            >
              Launch Dashboard
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
              <span className="text-cyan-400 text-sm font-semibold">Powered by YOLOv8 + ML Risk Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
              Real-Time Predictive Crowd Intelligence
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              AI-powered multi-sensor crowd monitoring system that detects risk, predicts escalation,
              and provides automated decision support in real time for safer public spaces.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-cyan-500/30"
              >
                <Video className="w-5 h-5 inline mr-2" />
                Live Demo
              </button>
              <button
                onClick={() => navigate('/risk-map')}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-semibold text-lg transition-all"
              >
                <Map className="w-5 h-5 inline mr-2" />
                View Risk Map
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-semibold text-lg transition-all"
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Download Report
              </button>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">Comprehensive AI Capabilities</h2>
            <p className="text-gray-400 text-center mb-12">
              Enterprise-grade crowd monitoring with predictive intelligence
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                  style={{
                    boxShadow: `0 0 20px ${feature.color === 'cyan' ? '#06b6d440' : ''}`,
                  }}
                >
                  <div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4`}
                    style={{
                      background: `linear-gradient(135deg, ${
                        feature.color === 'cyan' ? '#06b6d4, #0891b2' :
                        feature.color === 'green' ? '#22c55e, #16a34a' :
                        feature.color === 'yellow' ? '#facc15, #eab308' :
                        feature.color === 'orange' ? '#f97316, #ea580c' :
                        feature.color === 'red' ? '#ef4444, #dc2626' :
                        '#a855f7, #9333ea'
                      })`,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-gray-400 text-center mb-12">
              Three-step intelligent crowd monitoring pipeline
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Capture',
                  icon: <Camera className="w-12 h-12" />,
                  description: 'Mobile Camera, CCTV, IoT Sensors',
                  details: 'Multi-source data collection from cameras and environmental sensors',
                  color: 'cyan',
                },
                {
                  step: '02',
                  title: 'Analyze',
                  icon: <Cpu className="w-12 h-12" />,
                  description: 'YOLO + Data Fusion + ML Risk Engine',
                  details: 'Real-time person detection, crowd density calculation, and risk classification',
                  color: 'blue',
                },
                {
                  step: '03',
                  title: 'Act',
                  icon: <Zap className="w-12 h-12" />,
                  description: 'Alert + Decision Support + Risk Mitigation',
                  details: 'Automated alerts and actionable insights for rapid response',
                  color: 'purple',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 hover:border-cyan-500/50 transition-all">
                    <div className="text-6xl font-bold text-slate-800 mb-4">{item.step}</div>
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${
                          item.color === 'cyan' ? '#06b6d4, #0891b2' :
                          item.color === 'blue' ? '#3b82f6, #2563eb' :
                          '#a855f7, #9333ea'
                        })`,
                      }}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-cyan-400 font-semibold mb-3">{item.description}</p>
                    <p className="text-gray-400 text-sm">{item.details}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Privacy Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-green-400" />
              <h2 className="text-3xl font-bold">Privacy-First Architecture</h2>
            </div>
            
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              We prioritize individual privacy while enabling effective crowd management
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {privacyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-4 border border-slate-700"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Public Safety?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Start monitoring crowd dynamics with AI-powered predictive intelligence
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-lg transition-all shadow-lg shadow-cyan-500/30"
            >
              Launch Live Dashboard
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4">Product</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <button onClick={() => navigate('/dashboard')} className="block hover:text-cyan-400">Dashboard</button>
                  <button onClick={() => navigate('/risk-map')} className="block hover:text-cyan-400">Risk Map</button>
                  <button onClick={() => navigate('/alerts')} className="block hover:text-cyan-400">Alerts</button>
                  <button onClick={() => navigate('/reports')} className="block hover:text-cyan-400">Reports</button>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-4">Technology</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>YOLOv8 Detection</p>
                  <p>ML Risk Engine</p>
                  <p>Real-time Analytics</p>
                  <p>Predictive AI</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>About Us</p>
                  <p>Privacy Policy</p>
                  <p>Terms of Service</p>
                  <p>Contact</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-4">AI Crowd Intelligence</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Predictive crowd monitoring for safer public spaces
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Privacy-First Technology</span>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500 pt-8 border-t border-slate-800">
              © 2026 AI in Crowd Management and Public Safety. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
