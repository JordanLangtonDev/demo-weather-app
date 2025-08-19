'use client';

import React from 'react';
import { useWeatherStore } from '@/stores/weather-store';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentWeather, useForecast, useHistoricalWeather } from '@/lib/weather-queries';
import { CurrentWeatherLoadingState } from './CurrentWeatherLoadingState';
import { CurrentWeatherEmptyState } from './CurrentWeatherEmptyState';
import { WeatherHeader } from './WeatherHeader';
import { WeatherDisplay } from './WeatherDisplay';
import { WeatherDetails } from './WeatherDetails';
import { WeatherSidebar } from './WeatherSidebar';
import { getSelectedDateWeather, getWeatherGradient, WeatherData } from '@/lib/current-weather-utils';

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
    return <CurrentWeatherLoadingState />;
  }

  if (!currentWeather || !weather) {
    return <CurrentWeatherEmptyState />;
  }

  const selectedWeather = getSelectedDateWeather(selectedDate, forecastData, historyData, weather);

  // Use selected weather data if available, otherwise fall back to current weather
  const displayWeather: WeatherData = selectedWeather || {
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

  const gradientClass = getWeatherGradient(
    displayWeather.weatherCode, 
    displayWeather.isHistorical ? true : (currentWeather?.current.is_day === 1)
  );

  return (
    <Card className={`border-0 shadow-lg rounded-2xl ${gradientClass}`}>
      <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <WeatherHeader 
              location={location || {}}
              selectedDate={selectedDate}
              isHistorical={displayWeather.isHistorical}
            />

            <WeatherDisplay 
              temperature={displayWeather.temperature}
              weatherCode={displayWeather.weatherCode}
            />

            <WeatherDetails 
              humidity={displayWeather.humidity}
              windSpeed={displayWeather.windSpeed}
              windDirection={displayWeather.windDirection}
              pressure={displayWeather.pressure}
              precipitation={displayWeather.precipitation}
            />
          </div>

          <WeatherSidebar 
            time={displayWeather.time}
            isHistorical={displayWeather.isHistorical}
            onShowDetails={onShowDetails}
          />
        </div>
      </CardContent>
    </Card>
  );
}
