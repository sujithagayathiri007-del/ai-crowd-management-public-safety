import { UserLocation } from '../types';

export async function getUserLocation(): Promise<UserLocation> {
  // Try browser geolocation first
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true,
        });
      });

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        method: 'GPS',
      };
    } catch (error) {
      console.log('GPS failed, falling back to IP geolocation');
    }
  }

  // Fallback to IP-based geolocation
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    return {
      lat: data.latitude,
      lng: data.longitude,
      accuracy: 5000, // IP-based is approximately 5km accurate
      method: 'IP',
      city: data.city,
      region: data.region,
      country: data.country_name,
    };
  } catch (error) {
    console.error('IP geolocation failed', error);
    
    // Default fallback location (adjust to your region)
    return {
      lat: 13.0827,
      lng: 80.2707, // Chennai, India
      accuracy: 50000,
      method: 'Manual',
      city: 'Unknown',
      country: 'Unknown',
    };
  }
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'Safe':
      return '#22c55e';
    case 'Warning':
      return '#facc15';
    case 'High Risk':
      return '#f97316';
    case 'Critical':
      return '#ef4444';
    default:
      return '#06b6d4';
  }
}

export function getRiskRadius(density: number, riskLevel: string): number {
  const baseRadius = 50;
  const densityFactor = Math.min(density * 10, 100);
  
  const riskMultiplier = {
    'Safe': 1,
    'Warning': 1.5,
    'High Risk': 2,
    'Critical': 2.5,
  }[riskLevel] || 1;

  return baseRadius + (densityFactor * riskMultiplier);
}
