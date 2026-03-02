import { motion } from 'motion/react';
import { FileText, Download, FileSpreadsheet, FileBarChart } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export function ReportsPage() {
  const reports = [
    { icon: <FileSpreadsheet className="w-8 h-8" />, title: 'CSV Export', description: 'Raw data export for analysis', color: '#22c55e' },
    { icon: <FileText className="w-8 h-8" />, title: 'PDF Report', description: 'Comprehensive incident report', color: '#ef4444' },
    { icon: <FileBarChart className="w-8 h-8" />, title: 'Incident Summary', description: 'Executive summary of all incidents', color: '#f97316' },
    { icon: <FileBarChart className="w-8 h-8" />, title: 'Performance Report', description: 'System performance metrics', color: '#06b6d4' },
  ];

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Download comprehensive reports and data exports</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-cyan-500/50 transition-all"
            >
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${report.color}20` }}
              >
                <div style={{ color: report.color }}>{report.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
              <p className="text-gray-400 mb-4">{report.description}</p>
              <button className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                <Download className="w-5 h-5" />
                Download
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
