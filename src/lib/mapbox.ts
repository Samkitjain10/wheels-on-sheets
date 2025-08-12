// Mapbox API configuration
export const MAPBOX_CONFIG = {
  // Replace with your actual Mapbox access token
  ACCESS_TOKEN: 'YOUR_MAPBOX_ACCESS_TOKEN_HERE',
  BASE_URL: 'https://api.mapbox.com',
  GEOCODING_API: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  DIRECTIONS_API: 'https://api.mapbox.com/directions/v5/mapbox/driving',
  TRAFFIC_API: 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic'
};

// Mapbox Geocoding API response types
export interface MapboxFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    accuracy?: string;
    address?: string;
    category?: string;
    maki?: string;
    wikidata?: string;
    short_code?: string;
  };
  text: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  bbox?: [number, number, number, number];
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
    wikidata?: string;
  }>;
}

export interface MapboxGeocodingResponse {
  type: string;
  query: string[];
  features: MapboxFeature[];
  attribution: string;
}

// Traffic and routing types
export interface TrafficAlert {
  type: 'congestion' | 'construction' | 'accident' | 'weather' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  estimatedDelay: number; // in minutes
  coordinates: [number, number];
}

export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  trafficDelay: number; // in seconds
  coordinates: [number, number][];
  alerts: TrafficAlert[];
}

// Mapbox API utility functions
export class MapboxService {
  private static accessToken = MAPBOX_CONFIG.ACCESS_TOKEN;

  // Search for locations using Mapbox Geocoding API
  static async searchLocations(query: string, country?: string): Promise<MapboxFeature[]> {
    try {
      const params = new URLSearchParams({
        access_token: this.accessToken,
        q: query,
        types: 'poi,place,address',
        limit: '10',
        language: 'en'
      });

      if (country) {
        params.append('country', country);
      }

      const response = await fetch(`${MAPBOX_CONFIG.GEOCODING_API}/${encodeURIComponent(query)}.json?${params}`);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data: MapboxGeocodingResponse = await response.json();
      return data.features;
    } catch (error) {
      console.error('Error searching locations with Mapbox:', error);
      return [];
    }
  }

  // Get route information with traffic data
  static async getRouteWithTraffic(
    origin: [number, number], 
    destination: [number, number]
  ): Promise<RouteInfo | null> {
    try {
      const coords = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
      const params = new URLSearchParams({
        access_token: this.accessToken,
        coordinates: coords,
        alternatives: 'false',
        steps: 'true',
        annotations: 'duration,distance,speed',
        overview: 'full',
        geometries: 'geojson'
      });

      const response = await fetch(`${MAPBOX_CONFIG.DIRECTIONS_API}/${coords}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Mapbox Directions API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.distance,
          duration: route.duration,
          trafficDelay: route.duration - route.duration_typical || 0,
          coordinates: route.geometry.coordinates,
          alerts: this.extractTrafficAlerts(route)
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting route with traffic:', error);
      return null;
    }
  }

  // Extract traffic alerts from route data
  private static extractTrafficAlerts(route: any): TrafficAlert[] {
    const alerts: TrafficAlert[] = [];
    
    if (route.legs && route.legs.length > 0) {
      const leg = route.legs[0];
      
      // Check for significant delays
      if (leg.duration > leg.duration_typical * 1.2) {
        const delayMinutes = Math.round((leg.duration - leg.duration_typical) / 60);
        alerts.push({
          type: 'congestion',
          severity: delayMinutes > 15 ? 'high' : delayMinutes > 8 ? 'medium' : 'low',
          description: `Traffic delay: ${delayMinutes} minutes`,
          location: 'Route',
          estimatedDelay: delayMinutes,
          coordinates: leg.steps[0]?.maneuver?.location || [0, 0]
        });
      }
    }

    return alerts;
  }

  // Get traffic alerts for a specific area
  static async getTrafficAlerts(center: [number, number], radius: number = 5000): Promise<TrafficAlert[]> {
    try {
      // This would typically use Mapbox's traffic tiles or real-time data
      // For now, we'll return simulated alerts based on location
      const alerts: TrafficAlert[] = [];
      
      // Simulate traffic alerts based on location (you can replace this with real API calls)
      if (center[0] > 74 && center[0] < 76 && center[1] > 25 && center[1] < 27) {
        // Rajasthan area
        alerts.push({
          type: 'construction',
          severity: 'medium',
          description: 'Road construction on NH-8 near Ajmer',
          location: 'Ajmer - Pushkar Highway',
          estimatedDelay: 15,
          coordinates: center
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error getting traffic alerts:', error);
      return [];
    }
  }

  // Convert coordinates to address (reverse geocoding)
  static async getAddressFromCoordinates(coordinates: [number, number]): Promise<string> {
    try {
      const params = new URLSearchParams({
        access_token: this.accessToken,
        types: 'poi,place,address',
        limit: '1'
      });

      const response = await fetch(
        `${MAPBOX_CONFIG.GEOCODING_API}/${coordinates[0]},${coordinates[1]}.json?${params}`
      );
      
      if (!response.ok) {
        throw new Error(`Mapbox Reverse Geocoding API error: ${response.status}`);
      }

      const data: MapboxGeocodingResponse = await response.json();
      return data.features[0]?.place_name || 'Unknown location';
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return 'Unknown location';
    }
  }
}
