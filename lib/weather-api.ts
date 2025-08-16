// Weather API service using Weatherbit API
// https://www.weatherbit.io/api/weather-current

export interface WeatherData {
  data: Array<{
    wind_cdir: string;
    rh: number;
    pod: string;
    lon: number;
    pres: number;
    timezone: string;
    ob_time: string;
    country_code: string;
    clouds: number;
    vis: number;
    wind_spd: number;
    gust: number;
    wind_cdir_full: string;
    app_temp: number;
    state_code: string;
    ts: number;
    h_angle: number;
    dewpt: number;
    weather: {
      icon: string;
      code: number;
      description: string;
    };
    uv: number;
    aqi: number;
    station: string;
    sources: string[];
    wind_dir: number;
    elev_angle: number;
    datetime: string;
    precip: number;
    ghi: number;
    dni: number;
    dhi: number;
    solar_rad: number;
    city_name: string;
    sunrise: string;
    sunset: string;
    temp: number;
    lat: number;
    slp: number;
  }>;
  count: number;
}

export interface ForecastData {
  data: Array<{
    datetime: string;
    ts: number;
    temp: number;
    app_temp: number;
    rh: number;
    dewpt: number;
    clouds: number;
    wind_spd: number;
    wind_dir: number;
    wind_cdir: string;
    wind_cdir_full: string;
    pres: number;
    precip: number;
    snow: number;
    uv: number;
    weather: {
      icon: string;
      code: number;
      description: string;
    };
    pop: number;
    sunrise_ts: number;
    sunset_ts: number;
    moonrise_ts: number;
    moonset_ts: number;
  }>;
  city_name: string;
  country_code: string;
  state_code: string;
  timezone: string;
  lat: number;
  lon: number;
}

export interface HistoricalData {
  data: Array<{
    datetime: string;
    ts: number;
    temp: number;
    app_temp: number;
    rh: number;
    dewpt: number;
    clouds: number;
    wind_spd: number;
    wind_dir: number;
    wind_cdir: string;
    wind_cdir_full: string;
    pres: number;
    precip: number;
    snow: number;
    uv: number;
    weather: {
      icon: string;
      code: number;
      description: string;
    };
  }>;
  city_name: string;
  country_code: string;
  state_code: string;
  timezone: string;
  lat: number;
  lon: number;
}

class WeatherAPI {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_WEATHERBIT_BASE_URL || 'https://api.weatherbit.io/v2.0';
    this.apiKey = process.env.NEXT_PUBLIC_WEATHERBIT_API_KEY || '954a9337cb174e2ebecb69db7fc582d4';
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string | number>): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Weatherbit API key is not configured');
    }

    const url = new URL(`${this.baseURL}${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    
    // Add all parameters to the URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Weather API request failed:', error);
      throw error;
    }
  }

  // Get current weather by coordinates
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    return this.makeRequest<WeatherData>('/current', { lat, lon });
  }

  // Get current weather by city name
  async getCurrentWeatherByCity(city: string, state?: string, country?: string): Promise<WeatherData> {
    const params: Record<string, string> = { city };
    if (state) params.state = state;
    if (country) params.country = country;
    
    return this.makeRequest<WeatherData>('/current', params);
  }

  // Get 3-day forecast by coordinates
  async getForecast(lat: number, lon: number): Promise<ForecastData> {
    return this.makeRequest<ForecastData>('/forecast/daily', { lat, lon, days: 3 });
  }

  // Get 3-day historical weather by coordinates
  async getHistoricalWeather(lat: number, lon: number, startDate: string, endDate: string): Promise<HistoricalData> {
    return this.makeRequest<HistoricalData>('/history/daily', { 
      lat, 
      lon, 
      start_date: startDate, 
      end_date: endDate 
    });
  }

  // Get weather by postal code
  async getWeatherByPostalCode(postalCode: string, country?: string): Promise<WeatherData> {
    const params: Record<string, string> = { postal_code: postalCode };
    if (country) params.country = country;
    
    return this.makeRequest<WeatherData>('/current', params);
  }
}

export const weatherAPI = new WeatherAPI();
