// Indian Railways API integration for real-time train tracking
export interface IRCTCTrainInfo {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: 'On Time' | 'Delayed' | 'Arrived' | 'Departed' | 'Cancelled';
  delay: number; // in minutes
  platform: string;
  runningDate: string;
  lastUpdated: string;
}

export interface TrainStation {
  code: string;
  name: string;
  state: string;
  platforms: number;
}

export class IndianRailwaysAPI {
  // RapidAPI key for Indian Railways API
  private static readonly RAPID_API_KEY = 'YOUR_RAPID_API_KEY_HERE';
  private static readonly RAPID_API_HOST = 'irctc1.p.rapidapi.com';

  // Alternative: Railway Enquiry API (free tier available)
  private static readonly RAILWAY_ENQUIRY_BASE = 'https://api.railwayapi.com/v1';

  // Get real-time train status by train number
  static async getTrainStatus(trainNumber: string): Promise<IRCTCTrainInfo | null> {
    try {
      // Method 1: Try RapidAPI (paid but reliable)
      const rapidApiResult = await this.getTrainStatusRapidAPI(trainNumber);
      if (rapidApiResult) return rapidApiResult;

      // Method 2: Try Railway Enquiry API (free tier)
      const railwayApiResult = await this.getTrainStatusRailwayAPI(trainNumber);
      if (railwayApiResult) return railwayApiResult;

      // Method 3: Try scraping from IRCTC website (fallback)
      const scrapedResult = await this.scrapeTrainStatus(trainNumber);
      return scrapedResult;

    } catch (error) {
      console.error('Error fetching train status:', error);
      return null;
    }
  }

  // RapidAPI method for Indian Railways
  private static async getTrainStatusRapidAPI(trainNumber: string): Promise<IRCTCTrainInfo | null> {
    try {
      const response = await fetch(`https://irctc1.p.rapidapi.com/api/v1/trainStatus?trainNo=${trainNumber}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.RAPID_API_KEY,
          'X-RapidAPI-Host': this.RAPID_API_HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`RapidAPI error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          trainNumber: data.data.trainNo || trainNumber,
          trainName: data.data.trainName || `Train ${trainNumber}`,
          origin: data.data.from || 'Unknown',
          destination: data.data.to || 'Unknown',
          departureTime: data.data.departureTime || '',
          arrivalTime: data.data.arrivalTime || '',
          status: this.mapStatus(data.data.status),
          delay: this.parseDelay(data.data.delay),
          platform: data.data.platform || 'TBD',
          runningDate: data.data.runningDate || new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('RapidAPI failed:', error);
      return null;
    }
  }

  // Railway Enquiry API method (free tier)
  private static async getTrainStatusRailwayAPI(trainNumber: string): Promise<IRCTCTrainInfo | null> {
    try {
      const response = await fetch(`${this.RAILWAY_ENQUIRY_BASE}/train_status/train/${trainNumber}/apikey/YOUR_API_KEY/`);
      
      if (!response.ok) {
        throw new Error(`Railway API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response_code === 200 && data.train) {
        return {
          trainNumber: data.train.number || trainNumber,
          trainName: data.train.name || `Train ${trainNumber}`,
          origin: data.train.from?.name || 'Unknown',
          destination: data.train.to?.name || 'Unknown',
          departureTime: data.train.from?.time || '',
          arrivalTime: data.train.to?.time || '',
          status: this.mapStatus(data.train.status),
          delay: this.parseDelay(data.train.delay),
          platform: data.train.from?.platform || 'TBD',
          runningDate: data.train.doj || new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Railway API failed:', error);
      return null;
    }
  }

  // Fallback: Scrape from IRCTC website
  private static async scrapeTrainStatus(trainNumber: string): Promise<IRCTCTrainInfo | null> {
    try {
      // This would require a backend service due to CORS restrictions
      // For now, return null and suggest backend implementation
      console.warn('Web scraping requires backend service. Consider implementing a server-side scraper.');
      return null;
    } catch (error) {
      console.error('Scraping failed:', error);
      return null;
    }
  }

  // Get train route and stations
  static async getTrainRoute(trainNumber: string): Promise<TrainStation[]> {
    try {
      const response = await fetch(`https://irctc1.p.rapidapi.com/api/v1/trainRoute?trainNo=${trainNumber}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.RAPID_API_KEY,
          'X-RapidAPI-Host': this.RAPID_API_HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`Route API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data?.stations) {
        return data.data.stations.map((station: any) => ({
          code: station.code || '',
          name: station.name || '',
          state: station.state || '',
          platforms: station.platforms || 1,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching train route:', error);
      return [];
    }
  }

  // Get live running status
  static async getLiveRunningStatus(trainNumber: string, date: string): Promise<any> {
    try {
      const response = await fetch(`https://irctc1.p.rapidapi.com/api/v1/liveStatus?trainNo=${trainNumber}&date=${date}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.RAPID_API_KEY,
          'X-RapidAPI-Host': this.RAPID_API_HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`Live status API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching live status:', error);
      return null;
    }
  }

  // Helper methods
  private static mapStatus(apiStatus: string): IRCTCTrainInfo['status'] {
    const statusMap: Record<string, IRCTCTrainInfo['status']> = {
      'ON_TIME': 'On Time',
      'DELAYED': 'Delayed',
      'ARRIVED': 'Arrived',
      'DEPARTED': 'Departed',
      'CANCELLED': 'Cancelled',
      'RUNNING': 'On Time',
      'COMPLETED': 'Arrived',
    };

    return statusMap[apiStatus?.toUpperCase()] || 'On Time';
  }

  private static parseDelay(delayString: string | number): number {
    if (typeof delayString === 'number') return delayString;
    if (!delayString) return 0;

    // Parse delay strings like "2h 30m", "45m", "1h"
    const hours = delayString.match(/(\d+)h/)?.[1] || '0';
    const minutes = delayString.match(/(\d+)m/)?.[1] || '0';
    
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  // Get station information
  static async getStationInfo(stationCode: string): Promise<TrainStation | null> {
    try {
      const response = await fetch(`https://irctc1.p.rapidapi.com/api/v1/stationInfo?stationCode=${stationCode}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.RAPID_API_KEY,
          'X-RapidAPI-Host': this.RAPID_API_HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`Station API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          code: data.data.code || stationCode,
          name: data.data.name || '',
          state: data.data.state || '',
          platforms: data.data.platforms || 1,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching station info:', error);
      return null;
    }
  }
}
