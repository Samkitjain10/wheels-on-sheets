// Flight tracking API integration for real-time flight status
export interface FlightInfo {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Arrived' | 'Cancelled';
  delay: number; // in minutes
  gate: string;
  terminal: string;
  aircraft: string;
  lastUpdated: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  terminals: number;
}

export class FlightTrackingAPI {
  // Aviation Stack API (free tier available)
  private static readonly AVIATION_STACK_KEY = 'YOUR_AVIATION_STACK_KEY_HERE';
  private static readonly AVIATION_STACK_BASE = 'http://api.aviationstack.com/v1';

  // Alternative: FlightLabs API (free tier available)
  private static readonly FLIGHT_LABS_KEY = 'YOUR_FLIGHT_LABS_KEY_HERE';
  private static readonly FLIGHT_LABS_BASE = 'https://app.goflightlabs.com';

  // Get real-time flight status by flight number
  static async getFlightStatus(flightNumber: string): Promise<FlightInfo | null> {
    try {
      // Method 1: Try Aviation Stack API
      const aviationStackResult = await this.getFlightStatusAviationStack(flightNumber);
      if (aviationStackResult) return aviationStackResult;

      // Method 2: Try FlightLabs API
      const flightLabsResult = await this.getFlightStatusFlightLabs(flightNumber);
      if (flightLabsResult) return flightLabsResult;

      // Method 3: Try FlightAware API (requires subscription)
      const flightAwareResult = await this.getFlightStatusFlightAware(flightNumber);
      if (flightAwareResult) return flightAwareResult;

      return null;
    } catch (error) {
      console.error('Error fetching flight status:', error);
      return null;
    }
  }

  // Aviation Stack API method
  private static async getFlightStatusAviationStack(flightNumber: string): Promise<FlightInfo | null> {
    try {
      const response = await fetch(`${this.AVIATION_STACK_BASE}/flights?access_key=${this.AVIATION_STACK_KEY}&flight_iata=${flightNumber}`);
      
      if (!response.ok) {
        throw new Error(`Aviation Stack API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const flight = data.data[0];
        return {
          flightNumber: flight.flight?.iata || flightNumber,
          airline: flight.airline?.name || 'Unknown',
          origin: flight.departure?.airport || 'Unknown',
          destination: flight.arrival?.airport || 'Unknown',
          departureTime: flight.departure?.scheduled || '',
          arrivalTime: flight.arrival?.scheduled || '',
          status: this.mapFlightStatus(flight.flight_status),
          delay: this.parseFlightDelay(flight.departure?.delay || 0),
          gate: flight.departure?.gate || 'TBD',
          terminal: flight.departure?.terminal || 'TBD',
          aircraft: flight.aircraft?.icao || 'Unknown',
          lastUpdated: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Aviation Stack API failed:', error);
      return null;
    }
  }

  // FlightLabs API method
  private static async getFlightStatusFlightLabs(flightNumber: string): Promise<FlightInfo | null> {
    try {
      const response = await fetch(`${this.FLIGHT_LABS_BASE}/flights?access_key=${this.FLIGHT_LABS_KEY}&flight_iata=${flightNumber}`);
      
      if (!response.ok) {
        throw new Error(`FlightLabs API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const flight = data.data[0];
        return {
          flightNumber: flight.flight?.iata || flightNumber,
          airline: flight.airline?.name || 'Unknown',
          origin: flight.departure?.airport || 'Unknown',
          destination: flight.arrival?.airport || 'Unknown',
          departureTime: flight.departure?.scheduled || '',
          arrivalTime: flight.arrival?.scheduled || '',
          status: this.mapFlightStatus(flight.flight_status),
          delay: this.parseFlightDelay(flight.departure?.delay || 0),
          gate: flight.departure?.gate || 'TBD',
          terminal: flight.departure?.terminal || 'TBD',
          aircraft: flight.aircraft?.icao || 'Unknown',
          lastUpdated: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('FlightLabs API failed:', error);
      return null;
    }
  }

  // FlightAware API method (requires subscription)
  private static async getFlightStatusFlightAware(flightNumber: string): Promise<FlightInfo | null> {
    try {
      // FlightAware requires a backend service due to CORS and authentication
      // This would be implemented on your server
      console.warn('FlightAware API requires backend service. Consider implementing a server-side integration.');
      return null;
    } catch (error) {
      console.error('FlightAware API failed:', error);
      return null;
    }
  }

  // Get flight route information
  static async getFlightRoute(flightNumber: string): Promise<Airport[]> {
    try {
      const response = await fetch(`${this.AVIATION_STACK_BASE}/flights?access_key=${this.AVIATION_STACK_KEY}&flight_iata=${flightNumber}`);
      
      if (!response.ok) {
        throw new Error(`Route API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const flight = data.data[0];
        return [
          {
            code: flight.departure?.iata || '',
            name: flight.departure?.airport || '',
            city: flight.departure?.city || '',
            country: flight.departure?.country_code || '',
            terminals: 1,
          },
          {
            code: flight.arrival?.iata || '',
            name: flight.arrival?.airport || '',
            city: flight.arrival?.city || '',
            country: flight.arrival?.country_code || '',
            terminals: 1,
          },
        ];
      }

      return [];
    } catch (error) {
      console.error('Error fetching flight route:', error);
      return [];
    }
  }

  // Get live flight tracking
  static async getLiveFlightTracking(flightNumber: string): Promise<any> {
    try {
      const response = await fetch(`${this.AVIATION_STACK_BASE}/flights?access_key=${this.AVIATION_STACK_KEY}&flight_iata=${flightNumber}&live=1`);
      
      if (!response.ok) {
        throw new Error(`Live tracking API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching live flight tracking:', error);
      return null;
    }
  }

  // Get airport information
  static async getAirportInfo(airportCode: string): Promise<Airport | null> {
    try {
      const response = await fetch(`${this.AVIATION_STACK_BASE}/airports?access_key=${this.AVIATION_STACK_KEY}&iata_code=${airportCode}`);
      
      if (!response.ok) {
        throw new Error(`Airport API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const airport = data.data[0];
        return {
          code: airport.iata_code || airportCode,
          name: airport.airport_name || '',
          city: airport.city_name || '',
          country: airport.country_name || '',
          terminals: airport.terminals || 1,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching airport info:', error);
      return null;
    }
  }

  // Helper methods
  private static mapFlightStatus(apiStatus: string): FlightInfo['status'] {
    const statusMap: Record<string, FlightInfo['status']> = {
      'scheduled': 'On Time',
      'delayed': 'Delayed',
      'boarding': 'Boarding',
      'departed': 'Departed',
      'arrived': 'Arrived',
      'cancelled': 'Cancelled',
      'active': 'On Time',
      'landed': 'Arrived',
    };

    return statusMap[apiStatus?.toLowerCase()] || 'On Time';
  }

  private static parseFlightDelay(delay: string | number): number {
    if (typeof delay === 'number') return delay;
    if (!delay) return 0;

    // Parse delay strings like "PT2H30M", "PT45M", "PT1H"
    const hours = delay.match(/PT(\d+)H/)?.[1] || '0';
    const minutes = delay.match(/(\d+)M/)?.[1] || '0';
    
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  // Get weather information for flight delays
  static async getWeatherInfo(airportCode: string): Promise<any> {
    try {
      // This would integrate with a weather API like OpenWeatherMap
      // For now, return null and suggest weather API integration
      console.warn('Weather API integration not implemented. Consider adding OpenWeatherMap API.');
      return null;
    } catch (error) {
      console.error('Error fetching weather info:', error);
      return null;
    }
  }
}
