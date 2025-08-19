import { create } from 'zustand';
import { OpenMeteoCurrentWeather, OpenMeteoForecast, OpenMeteoHistorical } from '@/lib/weather-api';

interface Location {
  city: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
}

interface WeatherStore {
  // State
  currentWeather: OpenMeteoCurrentWeather | null;
  forecast: OpenMeteoForecast | null;
  history: OpenMeteoHistorical | null;
  location: Location | null;
  selectedDate: string;
  loading: boolean;
  error: string | null;
  
  // Actions
  setCurrentWeather: (weather: OpenMeteoCurrentWeather) => void;
  setForecast: (forecast: OpenMeteoForecast) => void;
  setHistory: (history: OpenMeteoHistorical) => void;
  setLocation: (location: Location) => void;
  setSelectedDate: (date: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearWeather: () => void;
  clearError: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  // Initial state
  currentWeather: null,
  forecast: null,
  history: null,
  location: null,
  selectedDate: '2024-01-01', // Default date for SSR
  loading: false,
  error: null,
  
  // Actions
  setCurrentWeather: (weather) => set({ currentWeather: weather, error: null }),
  setForecast: (forecast) => set({ forecast, error: null }),
  setHistory: (history) => set({ history, error: null }),
  setLocation: (location) => set({ location, error: null }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  clearWeather: () => set({ 
    currentWeather: null, 
    forecast: null, 
    history: null 
  }),
  clearError: () => set({ error: null }),
}));
