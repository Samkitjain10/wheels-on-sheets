// Weather API integration for transport delay context
export interface WeatherInfo {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  precipitation: number;
  lastUpdated: string;
}

export interface WeatherAlert {
  type: 'rain' | 'fog' | 'storm' | 'snow' | 'heat' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  duration: string;
}

export class WeatherAPI {
  // OpenWeatherMap API (free tier available)
  private static readonly OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY_HERE';
  private static readonly OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

  // Alternative: WeatherAPI.com (free tier available)
  private static readonly WEATHERAPI_KEY = 'YOUR_WEATHERAPI_KEY_HERE';
  private static readonly WEATHERAPI_BASE = 'http://api.weatherapi.com/v1';

  // Get current weather for a location
  static async getCurrentWeather(location: string): Promise<WeatherInfo | null> {
    try {
      // Method 1: Try OpenWeatherMap API
      const openWeatherResult = await this.getWeatherOpenWeatherMap(location);
      if (openWeatherResult) return openWeatherResult;

      // Method 2: Try WeatherAPI.com
      const weatherApiResult = await this.getWeatherWeatherAPI(location);
      if (weatherApiResult) return weatherApiResult;

      return null;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  // OpenWeatherMap API method
  private static async getWeatherOpenWeatherMap(location: string): Promise<WeatherInfo | null> {
    try {
      const response = await fetch(`${this.OPENWEATHER_BASE}/weather?q=${encodeURIComponent(location)}&appid=${this.OPENWEATHER_API_KEY}&units=metric`);
      
      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.main && data.weather) {
        return {
          location: data.name || location,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          visibility: Math.round(data.visibility / 1000), // Convert m to km
          precipitation: data.rain?.['1h'] || 0,
          lastUpdated: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('OpenWeatherMap API failed:', error);
      return null;
    }
    }

  // WeatherAPI.com method
  private static async getWeatherWeatherAPI(location: string): Promise<WeatherInfo | null> {
    try {
      const response = await fetch(`${this.WEATHERAPI_BASE}/current.json?key=${this.WEATHERAPI_KEY}&q=${encodeURIComponent(location)}&aqi=no`);
      
      if (!response.ok) {
        throw new Error(`WeatherAPI error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.current && data.location) {
        return {
          location: data.location.name || location,
          temperature: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          description: data.current.condition.text,
          humidity: data.current.humidity,
          windSpeed: Math.round(data.current.wind_kph),
          visibility: Math.round(data.current.vis_km),
          precipitation: data.current.precip_mm || 0,
          lastUpdated: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('WeatherAPI failed:', error);
      return null;
    }
  }

  // Get weather forecast for planning
  static async getWeatherForecast(location: string, days: number = 3): Promise<WeatherInfo[]> {
    try {
      const response = await fetch(`${this.OPENWEATHER_BASE}/forecast?q=${encodeURIComponent(location)}&appid=${this.OPENWEATHER_API_KEY}&units=metric&cnt=${days * 8}`);
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.list) {
        return data.list.map((item: any) => ({
          location: data.city.name || location,
          temperature: Math.round(item.main.temp),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 3.6),
          visibility: Math.round(item.visibility / 1000),
          precipitation: item.rain?.['3h'] || 0,
          lastUpdated: new Date(item.dt * 1000).toISOString(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return [];
    }
  }

  // Get weather alerts for a location
  static async getWeatherAlerts(location: string): Promise<WeatherAlert[]> {
    try {
      const response = await fetch(`${this.OPENWEATHER_BASE}/onecall?q=${encodeURIComponent(location)}&appid=${this.OPENWEATHER_API_KEY}&exclude=current,minutely,hourly,daily&units=metric`);
      
      if (!response.ok) {
        throw new Error(`Alerts API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.alerts) {
        return data.alerts.map((alert: any) => ({
          type: this.mapWeatherAlertType(alert.event),
          severity: this.mapWeatherAlertSeverity(alert.severity),
          description: alert.description,
          impact: alert.tags.join(', '),
          duration: `${new Date(alert.start * 1000).toLocaleString()} - ${new Date(alert.end * 1000).toLocaleString()}`,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  }

  // Analyze weather impact on transport
  static analyzeTransportImpact(weather: WeatherInfo): {
    impact: 'none' | 'low' | 'medium' | 'high';
    description: string;
    recommendations: string[];
  } {
    let impact: 'none' | 'low' | 'medium' | 'high' = 'none';
    let description = 'Weather conditions are normal';
    const recommendations: string[] = [];

    // Rain impact
    if (weather.precipitation > 10) {
      impact = 'high';
      description = 'Heavy rain may cause delays and slippery roads';
      recommendations.push('Allow extra travel time');
      recommendations.push('Use caution on wet roads');
      recommendations.push('Check for route closures');
    } else if (weather.precipitation > 5) {
      impact = 'medium';
      description = 'Light rain may cause minor delays';
      recommendations.push('Allow some extra travel time');
    }

    // Fog impact
    if (weather.visibility < 1) {
      impact = 'high';
      description = 'Dense fog significantly reduces visibility';
      recommendations.push('Allow substantial extra travel time');
      recommendations.push('Use fog lights and caution');
      recommendations.push('Consider delaying non-essential travel');
    } else if (weather.visibility < 5) {
      impact = 'medium';
      description = 'Reduced visibility due to fog';
      recommendations.push('Allow extra travel time');
      recommendations.push('Use caution');
    }

    // Wind impact
    if (weather.windSpeed > 50) {
      impact = 'high';
      description = 'Strong winds may affect transport';
      recommendations.push('Check for service disruptions');
      recommendations.push('Allow extra travel time');
    } else if (weather.windSpeed > 30) {
      impact = 'medium';
      description = 'Moderate winds may cause minor delays';
      recommendations.push('Allow some extra travel time');
    }

    // Temperature impact
    if (weather.temperature > 40) {
      impact = 'medium';
      description = 'High temperatures may affect vehicle performance';
      recommendations.push('Check vehicle cooling systems');
      recommendations.push('Stay hydrated during travel');
    } else if (weather.temperature < 0) {
      impact = 'medium';
      description = 'Freezing temperatures may cause icy conditions';
      recommendations.push('Check for ice on roads');
      recommendations.push('Allow extra travel time');
    }

    return { impact, description, recommendations };
  }

  // Helper methods
  private static mapWeatherAlertType(event: string): WeatherAlert['type'] {
    const typeMap: Record<string, WeatherAlert['type']> = {
      'Rain': 'rain',
      'Storm': 'storm',
      'Fog': 'fog',
      'Snow': 'snow',
      'Heat': 'heat',
    };

    return typeMap[event] || 'other';
  }

  private static mapWeatherAlertSeverity(severity: string): WeatherAlert['severity'] {
    const severityMap: Record<string, WeatherAlert['severity']> = {
      'Minor': 'low',
      'Moderate': 'medium',
      'Severe': 'high',
      'Extreme': 'high',
    };

    return severityMap[severity] || 'medium';
  }

  // Get weather for multiple transport locations
  static async getMultiLocationWeather(locations: string[]): Promise<Record<string, WeatherInfo>> {
    try {
      const weatherPromises = locations.map(async (location) => {
        const weather = await this.getCurrentWeather(location);
        return { location, weather };
      });

      const results = await Promise.all(weatherPromises);
      
      const weatherMap: Record<string, WeatherInfo> = {};
      results.forEach(({ location, weather }) => {
        if (weather) {
          weatherMap[location] = weather;
        }
      });

      return weatherMap;
    } catch (error) {
      console.error('Error fetching multi-location weather:', error);
      return {};
    }
  }
}
