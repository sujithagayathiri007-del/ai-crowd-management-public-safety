import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { motion } from 'motion/react';
import { MapPin, Wifi, WifiOff, Activity, Users, AlertTriangle, TrendingUp, Camera, Navigation, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { CameraLocation, UserLocation } from '../types';
import { getUserLocation, getRiskColor, getRiskRadius } from '../utils/geolocation';

// Custom map component to handle flying to location
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, 13, {
      duration: 2,
    });
  }, [center, map]);
  
  return null;
}

export function RiskMapPage() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [cameras, setCameras] = useState<CameraLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<CameraLocation | null>(null);

  // Fetch user location on mount
  useEffect(() => {
    async function fetchLocation() {
      setIsLoading(true);
      const location = await getUserLocation();
      setUserLocation(location);
      
      // Generate mock camera locations around user
      const mockCameras: CameraLocation[] = [
        {
          id: 'cam-1',
          name: 'Camera A - Main Plaza',
          lat: location.lat + 0.005,
          lng: location.lng + 0.003,
          crowdCount: Math.floor(Math.random() * 150) + 20,
          density: parseFloat((Math.random() * 8).toFixed(1)),
          riskLevel: ['Safe', 'Warning', 'High Risk', 'Critical'][Math.floor(Math.random() * 4)] as any,
          confidence: parseFloat((Math.random() * 15 + 85).toFixed(1)),
          futureRisk: ['Safe', 'Warning', 'High Risk'][Math.floor(Math.random() * 3)] as any,
          timestamp: new Date().toISOString(),
          isActive: true,
        },
        {
          id: 'cam-2',
          name: 'Camera B - Shopping District',
          lat: location.lat - 0.003,
          lng: location.lng + 0.007,
          crowdCount: Math.floor(Math.random() * 100) + 10,
          density: parseFloat((Math.random() * 5).toFixed(1)),
          riskLevel: ['Safe', 'Warning', 'High Risk'][Math.floor(Math.random() * 3)] as any,
          confidence: parseFloat((Math.random() * 15 + 85).toFixed(1)),
          futureRisk: ['Safe', 'Warning'][Math.floor(Math.random() * 2)] as any,
          timestamp: new Date().toISOString(),
          isActive: true,
        },
        {
          id: 'cam-3',
          name: 'Camera C - Transit Hub',
          lat: location.lat + 0.008,
          lng: location.lng - 0.004,
          crowdCount: Math.floor(Math.random() * 200) + 50,
          density: parseFloat((Math.random() * 10).toFixed(1)),
          riskLevel: ['Warning', 'High Risk', 'Critical'][Math.floor(Math.random() * 3)] as any,
          confidence: parseFloat((Math.random() * 15 + 85).toFixed(1)),
          futureRisk: ['Warning', 'High Risk', 'Critical'][Math.floor(Math.random() * 3)] as any,
          timestamp: new Date().toISOString(),
          isActive: true,
        },
        {
          id: 'cam-4',
          name: 'Camera D - Park Area',
          lat: location.lat - 0.007,
          lng: location.lng - 0.005,
          crowdCount: Math.floor(Math.random() * 50) + 5,
          density: parseFloat((Math.random() * 3).toFixed(1)),
          riskLevel: 'Safe',
          confidence: parseFloat((Math.random() * 10 + 90).toFixed(1)),
          futureRisk: 'Safe',
          timestamp: new Date().toISOString(),
          isActive: true,
        },
      ];
      
      setCameras(mockCameras);
      setIsLoading(false);
    }

    fetchLocation();
  }, []);

  // Update camera data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prev => prev.map(cam => ({
        ...cam,
        crowdCount: Math.max(0, cam.crowdCount + Math.floor(Math.random() * 20 - 10)),
        density: parseFloat((Math.max(0, cam.density + (Math.random() * 2 - 1))).toFixed(1)),
        confidence: parseFloat((85 + Math.random() * 15).toFixed(1)),
        timestamp: new Date().toISOString(),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !userLocation) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
          <p className="text-gray-400 text-lg">Detecting your location...</p>
          <p className="text-gray-500 text-sm mt-2">Using {userLocation?.method || 'GPS/IP'} geolocation</p>
        </div>
      </DashboardLayout>
    );
  }

  const activeCameras = cameras.filter(c => c.isActive);
  const criticalCameras = cameras.filter(c => c.riskLevel === 'Critical');
  const totalCrowd = cameras.reduce((sum, cam) => sum + cam.crowdCount, 0);

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Geo-Intelligence Map</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Navigation className="w-4 h-4" />
                <span>Location: {userLocation.method === 'GPS' ? 'GPS (High Accuracy)' : `IP-Based (${userLocation.city || 'Approximate'})`}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Camera className="w-4 h-4" />
                <span>{activeCameras.length} Active Cameras</span>
              </div>
              {criticalCameras.length > 0 && (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{criticalCameras.length} Critical Zones</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Map */}
          <div className="lg:col-span-3 bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 relative">
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <MapController center={[userLocation.lat, userLocation.lng]} />
              
              {/* Dark theme tiles */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* User location marker */}
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={new Icon({
                  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2">
                      <circle cx="12" cy="12" r="10" fill="#06b6d4" fill-opacity="0.2"/>
                      <circle cx="12" cy="12" r="3" fill="#06b6d4"/>
                    </svg>
                  `),
                  iconSize: [40, 40],
                  iconAnchor: [20, 20],
                })}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-cyan-600">Your Location</p>
                    <p className="text-xs text-gray-600">Method: {userLocation.method}</p>
                    {userLocation.city && <p className="text-xs text-gray-600">{userLocation.city}, {userLocation.country}</p>}
                    <p className="text-xs text-gray-500">Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                  </div>
                </Popup>
              </Marker>

              {/* Camera markers with risk circles */}
              {cameras.map((camera) => {
                const riskColor = getRiskColor(camera.riskLevel);
                const radius = getRiskRadius(camera.density, camera.riskLevel);

                return (
                  <div key={camera.id}>
                    {/* Pulsing risk circle */}
                    <Circle
                      center={[camera.lat, camera.lng]}
                      radius={radius}
                      pathOptions={{
                        color: riskColor,
                        fillColor: riskColor,
                        fillOpacity: camera.riskLevel === 'Critical' ? 0.4 : 0.2,
                        weight: camera.riskLevel === 'Critical' ? 3 : 2,
                      }}
                      className={camera.riskLevel === 'Critical' ? 'animate-pulse' : ''}
                    />

                    {/* Camera marker */}
                    <Marker
                      position={[camera.lat, camera.lng]}
                      icon={divIcon({
                        html: `
                          <div style="position: relative;">
                            <div style="
                              width: 32px;
                              height: 32px;
                              background: ${riskColor};
                              border-radius: 50%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              box-shadow: 0 0 20px ${riskColor};
                              ${camera.riskLevel === 'Critical' ? 'animation: pulse 2s infinite;' : ''}
                            ">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                <circle cx="12" cy="13" r="4" fill="#000" fill-opacity="0.3"/>
                              </svg>
                            </div>
                          </div>
                        `,
                        iconSize: [32, 32],
                        iconAnchor: [16, 16],
                        className: '',
                      })}
                      eventHandlers={{
                        click: () => setSelectedCamera(camera),
                      }}
                    >
                      <Popup>
                        <div className="text-sm min-w-[220px]">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-gray-800">{camera.name}</p>
                            <div className="flex items-center gap-1">
                              {camera.isActive ? (
                                <Wifi className="w-3 h-3 text-green-500" />
                              ) : (
                                <WifiOff className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-1 mb-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Crowd Count:</span>
                              <span className="text-xs font-semibold text-gray-800">{camera.crowdCount} people</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Density:</span>
                              <span className="text-xs font-semibold text-gray-800">{camera.density} people/m²</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Current Risk:</span>
                              <span className={`text-xs font-bold`} style={{ color: getRiskColor(camera.riskLevel) }}>
                                {camera.riskLevel}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Future Risk:</span>
                              <span className={`text-xs font-semibold`} style={{ color: getRiskColor(camera.futureRisk) }}>
                                {camera.futureRisk}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Confidence:</span>
                              <span className="text-xs font-semibold text-gray-800">{camera.confidence}%</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                            Last updated: {new Date(camera.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                );
              })}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700 z-[1000]">
              <p className="text-xs font-semibold text-gray-300 mb-2">Risk Levels</p>
              <div className="space-y-1">
                {['Safe', 'Warning', 'High Risk', 'Critical'].map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getRiskColor(level) }}
                    />
                    <span className="text-xs text-gray-400">{level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Camera List Panel */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Active Cameras
            </h2>

            <div className="grid gap-3">
              {cameras.map((camera) => (
                <motion.div
                  key={camera.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedCamera(camera)}
                  className={`bg-slate-900/50 rounded-lg p-3 border cursor-pointer transition-all ${
                    selectedCamera?.id === camera.id
                      ? 'border-cyan-400 shadow-lg shadow-cyan-400/20'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                  style={{
                    boxShadow: camera.riskLevel === 'Critical' 
                      ? `0 0 20px ${getRiskColor(camera.riskLevel)}40`
                      : undefined
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white mb-1">{camera.name}</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getRiskColor(camera.riskLevel) }}
                        />
                        <span className="text-xs text-gray-400">{camera.riskLevel}</span>
                      </div>
                    </div>
                    {camera.isActive ? (
                      <Wifi className="w-4 h-4 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <Users className="w-3 h-3 text-gray-500 inline mr-1" />
                      <span className="text-gray-400">{camera.crowdCount}</span>
                    </div>
                    <div>
                      <TrendingUp className="w-3 h-3 text-gray-500 inline mr-1" />
                      <span className="text-gray-400">{camera.density}/m²</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(camera.timestamp).toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <p className="text-xs font-semibold text-gray-300 mb-3">System Overview</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Total Cameras:</span>
                  <span className="text-white font-semibold">{cameras.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Active:</span>
                  <span className="text-green-400 font-semibold">{activeCameras.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Critical Zones:</span>
                  <span className="text-red-400 font-semibold">{criticalCameras.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Total Crowd:</span>
                  <span className="text-white font-semibold">{totalCrowd} people</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
