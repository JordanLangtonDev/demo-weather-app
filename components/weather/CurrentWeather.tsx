'use client';

import React from 'react';
import { useWeatherStore } from '@/stores/weather-store';
import { getWeatherIcon, formatTemperature } from '@/lib/weather-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeatherIcon } from '@/components/ui/weather-icon';
import { useCurrentWeather, useForecast, useHistoricalWeather } from '@/lib/weather-queries';

interface CurrentWeatherProps {
  onShowDetails?: () => void;
}

export function CurrentWeather({ onShowDetails }: CurrentWeatherProps) {
  const { 
    currentWeather, 
    location, 
    selectedDate, 
    forecast, 
    history, 
    loading 
  } = useWeatherStore();

  // Use TanStack Query hooks when location is available
  const currentWeatherQuery = useCurrentWeather(
    location?.lat || 0, 
    location?.lon || 0
  );
  const forecastQuery = useForecast(
    location?.lat || 0, 
    location?.lon || 0
  );
  const historicalQuery = useHistoricalWeather(
    location?.lat || 0, 
    location?.lon || 0, 
    selectedDate
  );

  // Use query data if available, otherwise fall back to store data
  const weather = currentWeatherQuery.data?.current || currentWeather?.current;
  const forecastData = forecastQuery.data || forecast;
  const historyData = historicalQuery.data || history;

  // Show loading state
  if (loading || (location && (currentWeatherQuery.isLoading || forecastQuery.isLoading))) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="animate-pulse">
            <div className="mb-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            
            <div className="flex items-center gap-12 mb-6">
              <div className="flex items-baseline gap-3">
                <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              
              <div className="text-center">
                <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get weather data for the selected date
  const getSelectedDateWeather = () => {
    if (!selectedDate || !forecastData) return null;
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    if (selectedDate === todayString) {
      // Return current weather for today
      return {
        temperature: weather?.temperature_2m,
        weatherCode: weather?.weather_code,
        humidity: weather?.relative_humidity_2m,
        windSpeed: weather?.wind_speed_10m,
        windDirection: weather?.wind_direction_10m,
        pressure: weather?.pressure_msl,
        precipitation: weather?.precipitation,
        isHistorical: false,
        time: weather?.time
      };
    }
    
    // Check if it's a historical date
    if (historyData && historyData.daily && historyData.daily.time) {
      const historyIndex = historyData.daily.time.findIndex((date: string) => date === selectedDate);
      if (historyIndex !== -1) {
        return {
          temperature: (historyData.daily.temperature_2m_max[historyIndex] + historyData.daily.temperature_2m_min[historyIndex]) / 2,
          weatherCode: historyData.daily.weather_code[historyIndex],
          humidity: null, // Historical data doesn't include humidity
          windSpeed: historyData.daily.wind_speed_10m_max[historyIndex],
          windDirection: historyData.daily.wind_direction_10m_dominant[historyIndex],
          pressure: null, // Historical data doesn't include pressure
          precipitation: historyData.daily.precipitation_sum[historyIndex],
          isHistorical: true,
          time: selectedDate
        };
      }
    }
    
    // Check if it's a forecast date
    if (forecastData.daily && forecastData.daily.time) {
      const forecastIndex = forecastData.daily.time.findIndex((date: string) => date === selectedDate);
      if (forecastIndex !== -1) {
        return {
          temperature: (forecastData.daily.temperature_2m_max[forecastIndex] + forecastData.daily.temperature_2m_min[forecastIndex]) / 2,
          weatherCode: forecastData.daily.weather_code[forecastIndex],
          humidity: null, // Forecast daily data doesn't include humidity
          windSpeed: forecastData.daily.wind_speed_10m_max[forecastIndex],
          windDirection: forecastData.daily.wind_direction_10m_dominant[forecastIndex],
          pressure: null, // Forecast daily data doesn't include pressure
          precipitation: forecastData.daily.precipitation_sum[forecastIndex],
          isHistorical: false,
          time: selectedDate
        };
      }
    }
    
    return null;
  };

  const selectedWeather = getSelectedDateWeather();

  if (!currentWeather || !weather) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌤️</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Weather Data
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Search for a location to see current weather
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format the selected date for display
  const formatSelectedDate = () => {
    if (!selectedDate) return 'Current Weather';
    const date = new Date(selectedDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Current Weather';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday\'s Weather';
    return `${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} Weather`;
  };

  // Use selected weather data if available, otherwise fall back to current weather
  const displayWeather = selectedWeather || {
    temperature: weather.temperature_2m,
    weatherCode: weather.weather_code,
    humidity: weather.relative_humidity_2m,
    windSpeed: weather.wind_speed_10m,
    windDirection: weather.wind_direction_10m,
    pressure: weather.pressure_msl,
    precipitation: weather.precipitation,
    isHistorical: false,
    time: weather.time
  };

  // Ensure required props are present
  if (
    displayWeather.temperature === undefined ||
    displayWeather.weatherCode === undefined ||
    displayWeather.windSpeed === undefined ||
    displayWeather.windDirection === undefined ||
    !displayWeather.time
  ) {
    return null;
  }

  return (
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-6">
              <div className="mb-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {location?.city || 'Unknown Location'}
                  {location?.state && (
                    <span className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 ml-2 sm:ml-3">, {location.state}</span>
                  )}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
                    {formatSelectedDate()}
                  </span>
                  {displayWeather.isHistorical && (
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs">
                      Historical
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-sm px-3 py-1">
                  Precipitation: {displayWeather.precipitation && displayWeather.precipitation > 0 ? `${displayWeather.precipitation.toFixed(1)} mm` : '0 mm'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white">
                  {formatTemperature(displayWeather.temperature)}
                </span>
                <span className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400">°C</span>
              </div>
              
              <div className="flex items-center">
                <WeatherIcon 
                  icon={getWeatherIcon(displayWeather.weatherCode.toString())} 
                  size={80}
                  className="text-gray-600 dark:text-gray-400"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              {displayWeather.humidity !== null && (
                <div>
                  <span className="font-medium">Humidity:</span> {displayWeather.humidity}%
                </div>
              )}
              <div>
                <span className="font-medium">Wind:</span> {displayWeather.windSpeed.toFixed(1)} km/h {getWindDirection(displayWeather.windDirection)}
              </div>
              {displayWeather.pressure !== null && (
                <div>
                  <span className="font-medium">Pressure:</span> {displayWeather.pressure} mb
                </div>
              )}
              <div>
                <span className="font-medium">Precipitation:</span> {displayWeather.precipitation && displayWeather.precipitation > 0 ? `${displayWeather.precipitation.toFixed(1)} mm` : '0 mm'}
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right text-sm text-gray-500 dark:text-gray-400 w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-2 justify-center lg:justify-end">
              <Clock className="w-4 h-4" />
              <span>{displayWeather.isHistorical ? 'Date' : 'Last updated'}</span>
            </div>
            <div className="font-medium mb-4">
              {displayWeather.isHistorical 
                ? new Date(displayWeather.time).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })
                : new Date(displayWeather.time).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })
              }
            </div>
            <Button variant="outline" size="sm" onClick={onShowDetails}>
              See more details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to convert wind direction degrees to cardinal directions
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
