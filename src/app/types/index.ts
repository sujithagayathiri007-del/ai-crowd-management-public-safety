export interface CameraLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  crowdCount: number;
  density: number;
  riskLevel: 'Safe' | 'Warning' | 'High Risk' | 'Critical';
  confidence: number;
  futureRisk: 'Safe' | 'Warning' | 'High Risk' | 'Critical';
  timestamp: string;
  isActive: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  method: 'GPS' | 'IP' | 'Manual';
  city?: string;
  region?: string;
  country?: string;
}

export interface DetectedPerson {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  zone: string;
}

export interface ZoneAnalytics {
  zone: string;
  count: number;
  density: number;
  risk: 'Safe' | 'Warning' | 'High Risk' | 'Critical';
  futureRisk: 'Safe' | 'Warning' | 'High Risk' | 'Critical';
  trend: 'increasing' | 'stable' | 'decreasing';
  confidence: number;
}
