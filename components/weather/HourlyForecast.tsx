'use client';

import React from 'react';
import { useWeatherStore } from '@/stores/weather-store';
import { getWeatherIcon, formatTemperature } from '@/lib/weather-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock } from 'lucide-react';

export function HourlyForecast() {
  const { forecast, selectedDate } = useWeatherStore();

  if (!forecast) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Hourly Forecast
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Search for a location to see hourly forecast
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if forecast data has the expected structure
  const hasValidForecast = forecast.hourly && forecast.hourly.time && forecast.hourly.time.length > 0;

  if (!hasValidForecast) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Hourly Data Unavailable
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Hourly forecast data is not available for this location
            </p>
            <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="w-4 h-4 mr-2" />
              Data Unavailable
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate hourly data for the selected date
  const generateHourlyData = () => {
    if (!selectedDate) return [];
    
    // Find the selected date in the hourly data
    const hourlyData = [];
    for (let i = 0; i < forecast.hourly.time.length; i++) {
      const hourTime = forecast.hourly.time[i];
      const hourDate = hourTime.split('T')[0];
      
      if (hourDate === selectedDate) {
        const hour = new Date(hourTime).getHours();
        hourlyData.push({
          time: hour,
          temperature: forecast.hourly.temperature_2m[i],
          weatherCode: forecast.hourly.weather_code[i],
          precipitation: forecast.hourly.precipitation[i],
          humidity: forecast.hourly.relative_humidity_2m[i],
          windSpeed: forecast.hourly.wind_speed_10m[i],
          feelsLike: forecast.hourly.apparent_temperature[i]
        });
      }
    }
    
    return hourlyData;
  };

  const hourlyData = generateHourlyData();
  
  // Format the selected date for display
  const formatSelectedDate = () => {
    if (!selectedDate) return 'Today';
    const date = new Date(selectedDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  if (hourlyData.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏰</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Hourly Data
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Select a date to view hourly weather details
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Hourly Forecast
        </CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {formatSelectedDate()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-3">
          {hourlyData.map((hour, index) => (
            <div key={index} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {hour.time === 0 ? '12 AM' : hour.time > 12 ? `${hour.time - 12} PM` : `${hour.time} AM`}
              </div>
              <div className="text-2xl mb-2">
                {getWeatherIcon(hour.weatherCode.toString())}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                {formatTemperature(hour.temperature)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Feels like {formatTemperature(hour.feelsLike)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {hour.precipitation > 0 ? `${Math.round(hour.precipitation * 100)}%` : '0%'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                💨 {Math.round(hour.windSpeed)} km/h
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
