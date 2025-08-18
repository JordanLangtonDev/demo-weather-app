// Open-Meteo Weather API Integration
// Based on: https://open-meteo.com/en/docs

export interface OpenMeteoCurrentWeather {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
    timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    is_day: string;
    precipitation: string;
    rain: string;
    showers: string;
    snowfall: string;
    weather_code: string;
    cloud_cover: string;
    pressure_msl: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    wind_gusts_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
}

export interface OpenMeteoForecast {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    apparent_temperature_max: string;
    apparent_temperature_min: string;
    precipitation_sum: string;
    rain_sum: string;
    showers_sum: string;
    snowfall_sum: string;
    precipitation_hours: string;
    precipitation_probability_max: string;
    wind_speed_10m_max: string;
    wind_gusts_10m_max: string;
    wind_direction_10m_dominant: string;
    sunshine_duration: string;
    uv_index_max: string;
    uv_index_clear_sky_max: string;
    sunrise?: string;
    sunset?: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: string[];
    snowfall_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    sunshine_duration: number[];
    uv_index_max: number[];
    uv_index_clear_sky_max: number[];
    sunrise?: string[];
    sunset?: string[];
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation_probability: string;
    precipitation: string;
    rain: string;
    showers: string;
    snowfall: string;
    weather_code: string;
    cloud_cover: string;
    pressure_msl: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    wind_gusts_10m: string;
    uv_index: string;
    uv_index_clear_sky: string;
    visibility: string;
    cape: string;
    evapotranspiration: string;
    is_day?: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    rain: number[];
    showers: number[];
    snowfall: number[];
    weather_code: number[];
    cloud_cover: number[];
    pressure_msl: number[];
    surface_pressure: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    wind_gusts_10m: number[];
    uv_index: number[];
    uv_index_clear_sky: number[];
    visibility: number[];
    cape: number[];
    evapotranspiration: number[];
    is_day?: number[];
  };
}

export interface OpenMeteoHistorical {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    rain_sum: string;
    snowfall_sum: string;
    wind_speed_10m_max: string;
    wind_gusts_10m_max: string;
    wind_direction_10m_dominant: string;
    sunshine_duration: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    snowfall_sum: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    sunshine_duration: number[];
  };
}

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number; // ms since epoch
  expiresAt: number; // ms since epoch
}

type CacheMap<T> = Record<string, CacheEntry<T>>;

export class WeatherAPI {
  private readonly baseURL = 'https://api.open-meteo.com/v1';
  private readonly CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

  private currentCache: CacheMap<OpenMeteoCurrentWeather> = {};
  private forecastCache: CacheMap<OpenMeteoForecast> = {};
  private historicalCache: CacheMap<OpenMeteoHistorical> = {};

  private generateCacheKey(prefix: string, params: Record<string, string | number>): string {
    const sorted = Object.keys(params)
      .sort()
      .map((k) => `${k}:${params[k]}`)
      .join('|');
    return `${prefix}|${sorted}`;
  }

  private getCached<T>(map: CacheMap<T>, key: string): T | null {
    const entry = map[key];
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      delete map[key];
      return null;
    }
    return entry.data;
    }

  private setCached<T>(map: CacheMap<T>, key: string, data: T): void {
    map[key] = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION_MS,
    };
  }

  /**
   * Get current weather for coordinates
   */
  async getCurrentWeather(lat: number, lon: number): Promise<OpenMeteoCurrentWeather> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      timezone: 'auto'
    });

    const cacheKey = this.generateCacheKey('current', { lat, lon });
    const cached = this.getCached(this.currentCache, cacheKey);
    if (cached) return cached;

    const result = await this.makeRequest<OpenMeteoCurrentWeather>(`/forecast?${params}`);
    this.setCached(this.currentCache, cacheKey, result);
    return result;
  }

  /**
   * Get weather forecast for coordinates
   */
  async getForecast(lat: number, lon: number, days: number = 7): Promise<OpenMeteoForecast> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,uv_index_clear_sky,visibility,cape,evapotranspiration,is_day',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,sunshine_duration,uv_index_max,uv_index_clear_sky_max,sunrise,sunset',
      forecast_days: '4',
      timezone: 'auto'
    });

    const cacheKey = this.generateCacheKey('forecast', { lat, lon, days });
    const cached = this.getCached(this.forecastCache, cacheKey);
    if (cached) return cached;

    const result = await this.makeRequest<OpenMeteoForecast>(`/forecast?${params}`);
    this.setCached(this.forecastCache, cacheKey, result);
    return result;
  }

  /**
   * Get historical weather data for coordinates
   */
  async getHistoricalWeather(lat: number, lon: number, startDate: string, endDate: string): Promise<OpenMeteoHistorical> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: startDate,
      end_date: endDate,
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,snowfall_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,sunshine_duration',
      timezone: 'auto'
    });

    const cacheKey = this.generateCacheKey('historical', { lat, lon, startDate, endDate });
    const cached = this.getCached(this.historicalCache, cacheKey);
    if (cached) return cached;

    const result = await this.makeRequest<OpenMeteoHistorical>(`/forecast?${params}`);
    this.setCached(this.historicalCache, cacheKey, result);
    return result;
  }

  /**
   * Get current weather by city name (requires coordinates from location service)
   */
  async getCurrentWeatherByCity(city: string, lat: number, lon: number): Promise<OpenMeteoCurrentWeather> {
    return this.getCurrentWeather(lat, lon);
  }

  /**
   * Get forecast by city name (requires coordinates from location service)
   */
  async getForecastByCity(city: string, lat: number, lon: number, days: number = 7): Promise<OpenMeteoForecast> {
    return this.getForecast(lat, lon, days);
  }

  /**
   * Get historical weather by city name (requires coordinates from location service)
   */
  async getHistoricalWeatherByCity(city: string, lat: number, lon: number, startDate: string, endDate: string): Promise<OpenMeteoHistorical> {
    return this.getHistoricalWeather(lat, lon, startDate, endDate);
  }

  /**
   * Make HTTP request to Open-Meteo API
   */
  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${url}`);
      
      if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;

    } catch (error) {
      console.error('Weather API request failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const weatherAPI = new WeatherAPI();
