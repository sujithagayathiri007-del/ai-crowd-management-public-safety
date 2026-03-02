import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Play, Square, Users, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

interface CameraFeed {
  id: string;
  name: string;
  isActive: boolean;
  crowdCount: number;
  density: number;
  riskLevel: 'Safe' | 'Warning' | 'High Risk' | 'Critical';
}

export function LiveCamerasPage() {
  const [cameras, setCameras] = useState<CameraFeed[]>([
    { id: '1', name: 'Camera A', isActive: false, crowdCount: 0, density: 0, riskLevel: 'Safe' },
    { id: '2', name: 'Camera B', isActive: false, crowdCount: 0, density: 0, riskLevel: 'Safe' },
    { id: '3', name: 'Camera C', isActive: false, crowdCount: 0, density: 0, riskLevel: 'Safe' },
    { id: '4', name: 'Camera D', isActive: false, crowdCount: 0, density: 0, riskLevel: 'Safe' },
  ]);

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  const startAllCameras = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      setCameras(prev => prev.map(cam => ({
        ...cam,
        isActive: true,
        crowdCount: Math.floor(Math.random() * 100) + 10,
        density: parseFloat((Math.random() * 6).toFixed(1)),
        riskLevel: ['Safe', 'Warning', 'High Risk', 'Critical'][Math.floor(Math.random() * 4)] as any,
      })));

      Object.keys(videoRefs.current).forEach(key => {
        const video = videoRefs.current[key];
        if (video) {
          video.srcObject = stream.clone();
          video.play();
        }
      });

      startDetectionLoop();
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Please allow camera access');
    }
  };

  const stopAllCameras = () => {
    Object.keys(videoRefs.current).forEach(key => {
      const video = videoRefs.current[key];
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    });

    setCameras(prev => prev.map(cam => ({
      ...cam,
      isActive: false,
      crowdCount: 0,
      density: 0,
      riskLevel: 'Safe',
    })));
  };

  const startDetectionLoop = () => {
    const interval = setInterval(() => {
      setCameras(prev => prev.map(cam => cam.isActive ? {
        ...cam,
        crowdCount: Math.max(0, cam.crowdCount + Math.floor(Math.random() * 20 - 10)),
        density: parseFloat((Math.max(0, cam.density + (Math.random() * 2 - 1))).toFixed(1)),
      } : cam));

      // Draw on canvas
      Object.keys(canvasRefs.current).forEach(key => {
        const canvas = canvasRefs.current[key];
        const video = videoRefs.current[key];
        if (canvas && video && video.videoWidth > 0) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            // Draw mock detections
            const numPeople = Math.floor(Math.random() * 10) + 2;
            for (let i = 0; i < numPeople; i++) {
              const x = Math.random() * (canvas.width - 60);
              const y = Math.random() * (canvas.height - 100);
              
              ctx.strokeStyle = '#22c55e';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, 60, 100);
              
              ctx.fillStyle = '#22c55e';
              ctx.fillRect(x, y - 20, 60, 20);
              ctx.fillStyle = '#000';
              ctx.font = 'bold 10px Inter';
              ctx.fillText(`${Math.floor(Math.random() * 20 + 80)}%`, x + 5, y - 6);
            }
          }
        }
      });
    }, 200);

    return () => clearInterval(interval);
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      'Safe': '#22c55e',
      'Warning': '#facc15',
      'High Risk': '#f97316',
      'Critical': '#ef4444',
    };
    return colors[risk as keyof typeof colors];
  };

  const anyActive = cameras.some(c => c.isActive);

  return (
    <DashboardLayout>
      <div className="h-full overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Multi-Camera Live Feeds</h1>
            <p className="text-gray-400">Real-time YOLO detection across all camera zones</p>
          </div>
          {!anyActive ? (
            <button
              onClick={startAllCameras}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-5 h-5" />
              Start All Cameras
            </button>
          ) : (
            <button
              onClick={stopAllCameras}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Square className="w-5 h-5" />
              Stop All Cameras
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cameras.map((camera) => (
            <motion.div
              key={camera.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{camera.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    {camera.isActive && (
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Live
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="px-3 py-1 rounded-lg font-semibold text-sm"
                  style={{
                    backgroundColor: `${getRiskColor(camera.riskLevel)}20`,
                    color: getRiskColor(camera.riskLevel),
                  }}
                >
                  {camera.riskLevel}
                </div>
              </div>

              <div className="relative bg-black aspect-video">
                <video
                  ref={el => videoRefs.current[camera.id] = el}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ display: 'none' }}
                />
                <canvas
                  ref={el => canvasRefs.current[camera.id] = el}
                  className="absolute inset-0 w-full h-full"
                  style={{ display: camera.isActive ? 'block' : 'none' }}
                />
                
                {!camera.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Camera Offline</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Users className="w-3 h-3" />
                    Crowd Count
                  </div>
                  <div className="text-xl font-bold text-white">{camera.crowdCount}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Density
                  </div>
                  <div className="text-xl font-bold text-white">{camera.density}/m²</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
