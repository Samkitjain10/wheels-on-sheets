import { IndianRailwaysAPI, IRCTCTrainInfo } from './indianRailwaysAPI';
import { FlightTrackingAPI, FlightInfo } from './flightTrackingAPI';
import { WeatherAPI, WeatherInfo } from './weatherAPI';

// Transportation tracking service for trains and flights
export interface TransportInfo {
  id: string;
  type: 'train' | 'flight';
  number: string;
  name: string;
  origin: string;
  destination: string;
  scheduledTime: string;
  estimatedTime: string;
  status: 'On Time' | 'Delayed' | 'Arrived' | 'Boarding' | 'Departed' | 'Cancelled';
  delay: number; // in minutes
  platform: string;
  gate?: string;
  terminal?: string;
  guestCount: number;
  taskId: string;
  location: string;
  weather?: WeatherInfo;
  weatherImpact?: {
    impact: 'none' | 'low' | 'medium' | 'high';
    description: string;
    recommendations: string[];
  };
  lastUpdated: string;
}

// Mock API responses for demonstration
// In production, you would integrate with real train/flight APIs
const mockTrainData: Record<string, any> = {
  '12463': {
    name: 'Rajdhani Express',
    origin: 'New Delhi',
    destination: 'Ajmer Junction',
    status: 'On Time',
    delay: 0,
    platform: '2'
  },
  '14707': {
    name: 'Ranakpur Express',
    origin: 'Jaipur',
    destination: 'Bhilwara Station',
    status: 'Delayed',
    delay: 25,
    platform: '1'
  },
  '12991': {
    name: 'Udaipur Express',
    origin: 'Mumbai Central',
    destination: 'Udaipur City',
    status: 'On Time',
    delay: 0,
    platform: '3'
  },
  '19665': {
    name: 'Kurj Express',
    origin: 'Kota Junction',
    destination: 'Jodhpur Junction',
    status: 'Delayed',
    delay: 45,
    platform: '2'
  },
  '14805': {
    name: 'Barmer Express',
    origin: 'Jodhpur Junction',
    destination: 'Jaisalmer',
    status: 'Arrived',
    delay: 0,
    platform: '1'
  },
  '19606': {
    name: 'Bikaner Express',
    origin: 'Bikaner Junction',
    destination: 'Jaipur Junction',
    status: 'On Time',
    delay: 0,
    platform: '3'
  },
  '12309': {
    name: 'Rajdhani Express',
    origin: 'New Delhi',
    destination: 'Howrah Junction',
    status: 'Delayed',
    delay: 15,
    platform: '1'
  },
  '12951': {
    name: 'Mumbai Central Express',
    origin: 'Mumbai Central',
    destination: 'New Delhi',
    status: 'On Time',
    delay: 0,
    platform: '2'
  },
  '12301': {
    name: 'Rajdhani Express',
    origin: 'New Delhi',
    destination: 'Mumbai Central',
    status: 'On Time',
    delay: 0,
    platform: '4'
  }
};

const mockFlightData: Record<string, any> = {
  'AI-101': {
    name: 'Air India',
    origin: 'Delhi',
    destination: 'Jaipur',
    status: 'On Time',
    delay: 0,
    gate: 'A12',
    terminal: 'T1'
  },
  '6E-234': {
    name: 'IndiGo',
    origin: 'Mumbai',
    destination: 'Udaipur',
    status: 'Delayed',
    delay: 30,
    gate: 'B8',
    terminal: 'T2'
  },
  'SG-456': {
    name: 'SpiceJet',
    origin: 'Bangalore',
    destination: 'Jodhpur',
    status: 'Boarding',
    delay: 0,
    gate: 'C15',
    terminal: 'T1'
  },
  'AI-201': {
    name: 'Air India',
    origin: 'Mumbai',
    destination: 'Delhi',
    status: 'On Time',
    delay: 0,
    gate: 'B15',
    terminal: 'T2'
  },
  '6E-789': {
    name: 'IndiGo',
    origin: 'Delhi',
    destination: 'Mumbai',
    status: 'Delayed',
    delay: 20,
    gate: 'A8',
    terminal: 'T1'
  }
};

export class TransportTrackingService {
  // Fetch real-time transport information for a given number
  static async getTransportInfo(
    type: 'train' | 'flight',
    number: string
  ): Promise<any | null> {
    try {
      if (type === 'train') {
        // Try real Indian Railways API first
        const realTrainData = await IndianRailwaysAPI.getTrainStatus(number);
        if (realTrainData) {
          console.log(`Real train data for ${number}:`, realTrainData);
          return realTrainData;
        }

        // Fallback to mock data if real API fails
        console.log(`Falling back to mock data for train ${number}`);
        return mockTrainData[number] || null;
      } else {
        // Try real Flight Tracking API first
        const realFlightData = await FlightTrackingAPI.getFlightStatus(number);
        if (realFlightData) {
          console.log(`Real flight data for ${number}:`, realFlightData);
          return realFlightData;
        }

        // Fallback to mock data if real API fails
        console.log(`Falling back to mock data for flight ${number}`);
        return mockFlightData[number] || null;
      }
    } catch (error) {
      console.error('Error fetching transport info:', error);
      
      // Fallback to mock data on error
      if (type === 'train') {
        return mockTrainData[number] || null;
      } else {
        return mockFlightData[number] || null;
      }
    }
  }

  // Determine transport type from number format
  static getTransportType(number: string): 'train' | 'flight' {
    // Train numbers are typically 5 digits or start with specific patterns
    // Flight numbers contain letters and numbers
    if (/^\d{5}$/.test(number) || /^[A-Z]{2}-\d{3,4}$/.test(number)) {
      return 'train';
    } else if (/^[A-Z]{2}-\d{3,4}$/.test(number) || /^[A-Z]{2}\d{3,4}$/.test(number)) {
      return 'flight';
    }
    
    // Default to train for unknown formats
    return 'train';
  }

  // Get station/airport information
  static getStationInfo(station: string): { platforms: string; facilities: string[] } {
    const stationData: Record<string, any> = {
      'Ajmer Junction': {
        platforms: 'Platform 1-4',
        facilities: ['Waiting Room', 'Food Court', 'Parking']
      },
      'Bhilwara Station': {
        platforms: 'Platform 1-2',
        facilities: ['Waiting Room', 'Parking']
      },
      'Udaipur City': {
        platforms: 'Platform 1-3',
        facilities: ['Waiting Room', 'Food Court', 'Parking', 'Taxi Stand']
      },
      'Jodhpur Junction': {
        platforms: 'Platform 1-5',
        facilities: ['Waiting Room', 'Food Court', 'Parking', 'Hotel Booking']
      },
      'Jaipur Airport': {
        platforms: 'Terminal T1, T2',
        facilities: ['Duty Free', 'Restaurants', 'Parking', 'Car Rental']
      },
      'Udaipur Airport': {
        platforms: 'Terminal T1',
        facilities: ['Restaurants', 'Parking', 'Car Rental']
      }
    };

    return stationData[station] || {
      platforms: 'Platform 1',
      facilities: ['Waiting Room', 'Parking']
    };
  }

  // Calculate ETA based on current time and scheduled time
  static calculateETA(scheduledTime: string, delay: number = 0): string {
    const scheduled = new Date(scheduledTime);
    const delayed = new Date(scheduled.getTime() + delay * 60000);
    const now = new Date();
    
    const diffMs = delayed.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins <= 0) return 'Arrived';
    if (diffMins < 60) return `${diffMins} minutes`;
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  }

  // Get pickup coordination status
  static getPickupStatus(status: string, delay: number): {
    status: string;
    message: string;
    priority: 'success' | 'warning' | 'error' | 'info';
  } {
    switch (status) {
      case 'On Time':
        return {
          status: 'Ready for Pickup',
          message: 'Transport is on time. Driver should arrive 15 minutes before scheduled time.',
          priority: 'success'
        };
      case 'Delayed':
        if (delay <= 15) {
          return {
            status: 'Minor Delay',
            message: `Transport delayed by ${delay} minutes. Driver can wait or adjust pickup time.`,
            priority: 'warning'
          };
        } else {
          return {
            status: 'Significant Delay',
            message: `Transport delayed by ${delay} minutes. Consider reassigning driver or adjusting pickup time.`,
            priority: 'error'
          };
        }
      case 'Arrived':
        return {
          status: 'Immediate Pickup',
          message: 'Transport has arrived. Driver should proceed immediately for pickup.',
          priority: 'success'
        };
      case 'Boarding':
        return {
          status: 'Preparing for Arrival',
          message: 'Transport is boarding. Driver should arrive at scheduled time.',
          priority: 'info'
        };
      default:
        return {
          status: 'Status Unknown',
          message: 'Transport status unclear. Driver should check for updates.',
          priority: 'warning'
        };
    }
  }

  // Get weather information for transport locations
  static async getWeatherForTransport(location: string): Promise<WeatherInfo | null> {
    try {
      const weather = await WeatherAPI.getCurrentWeather(location);
      if (weather) {
        console.log(`Weather for ${location}:`, weather);
      }
      return weather;
    } catch (error) {
      console.error('Error fetching weather for transport:', error);
      return null;
    }
  }

  // Get comprehensive transport info with weather
  static async getComprehensiveTransportInfo(
    type: 'train' | 'flight',
    number: string,
    location: string
  ): Promise<TransportInfo | null> {
    try {
      // Get transport info
      const transportInfo = await this.getTransportInfo(type, number);
      if (!transportInfo) return null;

      // Get weather info for the location
      const weather = await this.getWeatherForTransport(location);
      
      // Analyze weather impact on transport
      let weatherImpact = undefined;
      if (weather) {
        weatherImpact = WeatherAPI.analyzeTransportImpact(weather);
      }

      // Combine transport and weather info
      return {
        ...transportInfo,
        weather,
        weatherImpact,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting comprehensive transport info:', error);
      return null;
    }
  }
}
