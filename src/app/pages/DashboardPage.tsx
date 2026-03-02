import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Camera, Play, Square, AlertTriangle, Users, Activity,
  TrendingUp, TrendingDown, Minus, Eye, Wifi, Radio
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '../components/DashboardLayout';
import { DetectedPerson, ZoneAnalytics } from '../types';

export function DashboardPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedPeople, setDetectedPeople] = useState<DetectedPerson[]>([]);
  const [zoneAnalytics, setZoneAnalytics] = useState<ZoneAnalytics[]>([
    { zone: 'A', count: 0, density: 0, risk: 'Safe', futureRisk: 'Safe', trend: 'stable', confidence: 0 },
    { zone: 'B', count: 0, density: 0, risk: 'Safe', futureRisk: 'Safe', trend: 'stable', confidence: 0 },
    { zone: 'C', count: 0, density: 0, risk: 'Safe', futureRisk: 'Safe', trend: 'stable', confidence: 0 },
    { zone: 'D', count: 0, density: 0, risk: 'Safe', futureRisk: 'Safe', trend: 'stable', confidence: 0 },
  ]);
  const [riskHistory, setRiskHistory] = useState<any[]>([]);
  const [totalCrowd, setTotalCrowd] = useState(0);
  const [avgDensity, setAvgDensity] = useState(0);
  const [highestRiskZone, setHighestRiskZone] = useState('None');

  // Start camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
        startDetection();
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Please allow camera access to use YOLO detection');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setDetectedPeople([]);
    }
  };

  // YOLO-style person detection simulation
  const detectPeople = (videoWidth: number, videoHeight: number) => {
    // Simulate YOLO detections - in production, this would call your backend API
    const numPeople = Math.floor(Math.random() * 20) + 5;
    const zones = ['A', 'B', 'C', 'D'];
    
    const people: DetectedPerson[] = Array.from({ length: numPeople }, (_, i) => {
      const x = Math.random() * (videoWidth - 80);
      const y = Math.random() * (videoHeight - 120);
      const width = 60 + Math.random() * 40;
      const height = 100 + Math.random() * 60;
      
      // Determine zone based on position
      const zoneX = x < videoWidth / 2 ? 0 : 1;
      const zoneY = y < videoHeight / 2 ? 0 : 1;
      const zone = zones[zoneY * 2 + zoneX];

      return {
        id: i,
        x,
        y,
        width,
        height,
        confidence: 0.85 + Math.random() * 0.14,
        zone,
      };
    });

    return people;
  };

  // Calculate zone analytics
  const calculateZoneAnalytics = (people: DetectedPerson[], videoWidth: number, videoHeight: number) => {
    const zones = ['A', 'B', 'C', 'D'];
    const zoneArea = (videoWidth * videoHeight) / 4 / 10000; // Convert to m²
    
    return zones.map((zone, index) => {
      const zonePeople = people.filter(p => p.zone === zone);
      const count = zonePeople.length;
      const density = parseFloat((count / zoneArea).toFixed(1));
      
      // Risk calculation
      let risk: 'Safe' | 'Warning' | 'High Risk' | 'Critical';
      let futureRisk: 'Safe' | 'Warning' | 'High Risk' | 'Critical';
      
      if (density < 2) {
        risk = 'Safe';
        futureRisk = density < 1.5 ? 'Safe' : 'Warning';
      } else if (density < 4) {
        risk = 'Warning';
        futureRisk = density < 3 ? 'Warning' : 'High Risk';
      } else if (density < 6) {
        risk = 'High Risk';
        futureRisk = 'Critical';
      } else {
        risk = 'Critical';
        futureRisk = 'Critical';
      }

      // Trend (simulate based on previous frame)
      const prevZone = zoneAnalytics[index];
      let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      if (prevZone && count > prevZone.count + 2) trend = 'increasing';
      else if (prevZone && count < prevZone.count - 2) trend = 'decreasing';

      const confidence = zonePeople.reduce((sum, p) => sum + p.confidence, 0) / Math.max(count, 1) * 100;

      return {
        zone,
        count,
        density,
        risk,
        futureRisk,
        trend,
        confidence: parseFloat(confidence.toFixed(1)),
      };
    });
  };

  // Draw detections on canvas
  const drawDetections = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isStreaming) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw zone dividers
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Draw zone labels
    ctx.font = 'bold 24px Inter';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
    const zones = [
      { label: 'A', x: canvas.width * 0.25, y: canvas.height * 0.25 },
      { label: 'B', x: canvas.width * 0.75, y: canvas.height * 0.25 },
      { label: 'C', x: canvas.width * 0.25, y: canvas.height * 0.75 },
      { label: 'D', x: canvas.width * 0.75, y: canvas.height * 0.75 },
    ];
    
    zones.forEach(({ label, x, y }) => {
      ctx.fillText(`Zone ${label}`, x - 40, y - 20);
    });

    // Detect people
    const people = detectPeople(canvas.width, canvas.height);
    setDetectedPeople(people);

    // Calculate analytics
    const analytics = calculateZoneAnalytics(people, canvas.width, canvas.height);
    setZoneAnalytics(analytics);

    // Update metrics
    const total = people.length;
    setTotalCrowd(total);
    
    const avgDens = analytics.reduce((sum, z) => sum + z.density, 0) / 4;
    setAvgDensity(parseFloat(avgDens.toFixed(1)));

    const highestRisk = analytics.reduce((max, z) => {
      const riskValue = { 'Safe': 0, 'Warning': 1, 'High Risk': 2, 'Critical': 3 };
      return riskValue[z.risk] > riskValue[max.risk] ? z : max;
    });
    setHighestRiskZone(`Zone ${highestRisk.zone} (${highestRisk.risk})`);

    // Draw bounding boxes
    people.forEach((person) => {
      const colors = {
        'Safe': '#22c55e',
        'Warning': '#facc15',
        'High Risk': '#f97316',
        'Critical': '#ef4444',
      };
      
      const zoneData = analytics.find(z => z.zone === person.zone);
      const color = colors[zoneData?.risk || 'Safe'];

      // Box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(person.x, person.y, person.width, person.height);

      // Background for label
      ctx.fillStyle = color;
      ctx.fillRect(person.x, person.y - 25, person.width, 25);

      // Label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Inter';
      ctx.fillText(
        `Person ${(person.confidence * 100).toFixed(0)}%`,
        person.x + 5,
        person.y - 8
      );

      // Center dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(person.x + person.width / 2, person.y + person.height / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Update risk history
    setRiskHistory(prev => {
      const newHistory = [...prev, {
        frame: prev.length,
        overall: avgDens,
        zoneA: analytics[0].density,
        zoneB: analytics[1].density,
        zoneC: analytics[2].density,
        zoneD: analytics[3].density,
      }];
      return newHistory.slice(-50); // Keep last 50 frames
    });
  };

  // Detection loop
  const startDetection = () => {
    const interval = setInterval(() => {
      if (isStreaming) {
        drawDetections();
      }
    }, 100); // 10 FPS

    return () => clearInterval(interval);
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (isStreaming) {
      cleanup = startDetection();
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [isStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getRiskColor = (risk: string) => {
    const colors = {
      'Safe': '#22c55e',
      'Warning': '#facc15',
      'High Risk': '#f97316',
      'Critical': '#ef4444',
    };
    return colors[risk as keyof typeof colors] || '#06b6d4';
  };

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Center - Video Feed */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Video Panel */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-cyan-400" />
                    Live YOLO Detection
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Real-time crowd monitoring with AI person detection</p>
                </div>
                <div className="flex items-center gap-3">
                  {isStreaming && (
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Live
                    </div>
                  )}
                  {!isStreaming ? (
                    <button
                      onClick={startCamera}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Start Camera & Detection
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Square className="w-4 h-4" />
                      Stop
                    </button>
                  )}
                </div>
              </div>

              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ display: isStreaming ? 'block' : 'none' }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ display: isStreaming ? 'block' : 'none' }}
                />
                
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Click "Start Camera & Detection" to begin</p>
                      <p className="text-gray-500 text-sm mt-2">YOLO will detect and track people in real-time</p>
                    </div>
                  </div>
                )}

                {/* Overlays */}
                {isStreaming && (
                  <>
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-semibold">YOLO Detection Active</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {detectedPeople.length} people detected
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
                      <div className="text-xs text-gray-400">Mode</div>
                      <div className="text-white font-semibold">Normal Operation</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Metrics Below Video */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Users className="w-4 h-4" />
                  Current Crowd Count
                </div>
                <div className="text-3xl font-bold text-white">{totalCrowd}</div>
                <div className="text-xs text-gray-500 mt-1">people detected</div>
              </div>

              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Activity className="w-4 h-4" />
                  Avg Density
                </div>
                <div className="text-3xl font-bold text-white">{avgDensity}</div>
                <div className="text-xs text-gray-500 mt-1">people/m²</div>
              </div>

              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Highest Risk Zone
                </div>
                <div className="text-lg font-bold text-white">{highestRiskZone}</div>
                <div className="text-xs text-gray-500 mt-1">requires attention</div>
              </div>
            </div>

            {/* Risk Graph */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Risk Trend - Last 50 Frames
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={riskHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="frame" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="overall" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="zoneA" stroke="#22c55e" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="zoneB" stroke="#facc15" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="zoneC" stroke="#f97316" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="zoneD" stroke="#ef4444" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Panel - Analytics */}
          <div className="flex flex-col gap-6">
            {/* Zone Cards */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <h3 className="text-lg font-bold text-white mb-4">Zone Risk Overview</h3>
              <div className="space-y-3">
                {zoneAnalytics.map((zone) => (
                  <motion.div
                    key={zone.zone}
                    className="bg-slate-900/50 rounded-lg p-4 border-2 transition-all"
                    style={{
                      borderColor: getRiskColor(zone.risk),
                      boxShadow: zone.risk === 'Critical' ? `0 0 20px ${getRiskColor(zone.risk)}40` : 'none',
                    }}
                    animate={zone.risk === 'Critical' ? {
                      borderColor: [getRiskColor(zone.risk), '#ffffff', getRiskColor(zone.risk)],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-white">Zone {zone.zone}</div>
                      <div className="flex items-center gap-1">
                        {zone.trend === 'increasing' && <TrendingUp className="w-4 h-4 text-red-400" />}
                        {zone.trend === 'decreasing' && <TrendingDown className="w-4 h-4 text-green-400" />}
                        {zone.trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <div className="text-gray-400">Count</div>
                        <div className="text-white font-semibold">{zone.count}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Density</div>
                        <div className="text-white font-semibold">{zone.density}/m²</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Current Risk</span>
                        <span className="font-bold" style={{ color: getRiskColor(zone.risk) }}>
                          {zone.risk}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Future Risk</span>
                        <span className="font-semibold" style={{ color: getRiskColor(zone.futureRisk) }}>
                          {zone.futureRisk}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white font-semibold">{zone.confidence.toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Health */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-green-400" />
                AI Health & Confidence
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Overall Confidence</span>
                  <span className="text-lg font-bold text-green-400">
                    {zoneAnalytics.reduce((sum, z) => sum + z.confidence, 0) / 4 || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Anomaly Detected</span>
                  <span className="text-lg font-bold text-gray-400">No</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Model Response</span>
                  <span className="text-lg font-bold text-cyan-400">~100ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">SLA Status</span>
                  <span className="text-lg font-bold text-green-400">Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
