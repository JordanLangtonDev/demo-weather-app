import { useQuery } from '@tanstack/react-query';
import { weatherAPI } from './weather-api';
import { useWeatherStore } from '@/stores/weather-store';

export const useCurrentWeather = (lat: number, lon: number) => {
  const { setCurrentWeather, setError, setLoading } = useWeatherStore();
  
  return useQuery({
    queryKey: ['currentWeather', lat, lon],
    queryFn: async () => {
      setLoading(true);
      try {
        const weather = await weatherAPI.getCurrentWeather(lat, lon);
        setCurrentWeather(weather);
        return weather;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch current weather';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!lat && !!lon && lat !== 0 && lon !== 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useForecast = (lat: number, lon: number) => {
  const { setForecast, setError, setLoading } = useWeatherStore();
  
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: async () => {
      setLoading(true);
      try {
        const forecast = await weatherAPI.getForecast(lat, lon, 8);
        setForecast(forecast);
        return forecast;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch forecast';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!lat && !!lon && lat !== 0 && lon !== 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

export const useHistoricalWeather = (lat: number, lon: number, date: string) => {
  const { setHistory, setError, setLoading } = useWeatherStore();
  
  return useQuery({
    queryKey: ['historicalWeather', lat, lon, date],
    queryFn: async () => {
      setLoading(true);
      try {
        // For historical weather, we need start and end dates
        // Since we only have one date, we'll use it as both start and end
        const history = await weatherAPI.getHistoricalWeather(lat, lon, date, date);
        setHistory(history);
        return history;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch historical weather';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!lat && !!lon && !!date && lat !== 0 && lon !== 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
  });
};

export const useHistoricalWeatherRange = (lat: number, lon: number, days: number = 3) => {
  const { setHistory, setError, setLoading } = useWeatherStore();
  
  return useQuery({
    queryKey: ['historicalWeatherRange', lat, lon, days],
    queryFn: async () => {
      setLoading(true);
      try {
        // Calculate date range for past days
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1); // Yesterday
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days); // N days ago
        
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];
        
        const history = await weatherAPI.getHistoricalWeather(lat, lon, startDateString, endDateString);
        setHistory(history);
        return history;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch historical weather';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!lat && !!lon && lat !== 0 && lon !== 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
  });
};
