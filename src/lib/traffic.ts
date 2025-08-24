export interface TrafficAlert {
  type: 'congestion' | 'construction' | 'accident' | 'weather' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  estimatedDelay: number; // minutes
}

export class TrafficService {
  static async getTrafficAlertsForLocation(location: string): Promise<TrafficAlert[]> {
    // Simple mocked alerts based on keywords; replace with a real provider later
    const alerts: TrafficAlert[] = [];

    const lower = location.toLowerCase();
    if (lower.includes('highway') || lower.includes('nh-') || lower.includes('expressway')) {
      alerts.push({
        type: 'construction',
        severity: 'medium',
        description: 'Road work reported on nearby highway',
        location,
        estimatedDelay: 10,
      });
    }

    if (lower.includes('station') || lower.includes('airport')) {
      alerts.push({
        type: 'congestion',
        severity: 'high',
        description: 'Heavy congestion expected near transit hub',
        location,
        estimatedDelay: 20,
      });
    }

    return alerts;
  }
}


