'use client';

import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { getWeatherIcon, formatTemperature } from '@/lib/weather-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar } from 'lucide-react';
import { WeatherIcon } from '@/components/ui/weather-icon';

interface SevenDayForecastProps {
  onDayClick?: () => void;
}

export function SevenDayForecast({ onDayClick }: SevenDayForecastProps) {
  const { state, dispatch } = useWeather();
  const { forecast, history, selectedDate, loading } = state;

  // Show loading state
  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="text-center p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-3"></div>
                  <div className="space-y-2 mb-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!forecast) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              7-Day Weather
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Search for a location to see forecast and history
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if forecast data has the expected structure
  const hasValidForecast = forecast.daily && forecast.daily.time && forecast.daily.time.length > 0;
  const hasValidHistory = history && history.daily && history.daily.time && history.daily.time.length > 0;

  if (!hasValidForecast) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Weather Data Unavailable
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Weather data is not available for this location
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

  // Generate combined 7-day data (3 days history + today + 3 days forecast)
  const generateSevenDayData = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const data: Array<{
      date: string;
      dayName: string;
      dayNumber: number;
      maxTemp: number;
      minTemp: number;
      weatherCode: number;
      precipitation: number;
      windSpeed: number;
      isHistorical: boolean;
      isToday: boolean;
    }> = [];
    
    // Add historical days (past 3 days) in chronological order (oldest -> newest)
    if (hasValidHistory) {
      for (let i = 0; i < history.daily.time.length; i++) {
        const date = history.daily.time[i];
        const dayDate = new Date(date);
        const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = dayDate.getDate();
        
        data.push({
          date: date,
          dayName: dayName,
          dayNumber: dayNumber,
          maxTemp: history.daily.temperature_2m_max[i],
          minTemp: history.daily.temperature_2m_min[i],
          weatherCode: history.daily.weather_code[i],
          precipitation: history.daily.precipitation_sum[i],
          windSpeed: history.daily.wind_speed_10m_max[i],
          isHistorical: true,
          isToday: false
        });
      }
    }
    
    // Add today
    const todayIndex = forecast.daily.time.findIndex(date => date === todayString);
    if (todayIndex !== -1) {
      const todayDate = new Date(forecast.daily.time[todayIndex]);
      const todayName = todayDate.toLocaleDateString('en-US', { weekday: 'short' });
      const todayNumber = todayDate.getDate();
      
      data.push({
        date: forecast.daily.time[todayIndex],
        dayName: todayName,
        dayNumber: todayNumber,
        maxTemp: forecast.daily.temperature_2m_max[todayIndex],
        minTemp: forecast.daily.temperature_2m_min[todayIndex],
        weatherCode: state.currentWeather?.current.weather_code ?? forecast.daily.weather_code[todayIndex],
        precipitation: forecast.daily.precipitation_sum[todayIndex],
        windSpeed: forecast.daily.wind_speed_10m_max[todayIndex],
        isHistorical: false,
        isToday: true
      });
    }
    
    // Add forecast days (next 3 days)
    for (let i = 0; i < forecast.daily.time.length; i++) {
      const date = forecast.daily.time[i];
      if (date === todayString) continue; // Skip today if already added
      
      const dayDate = new Date(date);
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = dayDate.getDate();
      
      data.push({
        date: date,
        dayName: dayName,
        dayNumber: dayNumber,
        maxTemp: forecast.daily.temperature_2m_max[i],
        minTemp: forecast.daily.temperature_2m_min[i],
        weatherCode: forecast.daily.weather_code[i],
        precipitation: forecast.daily.precipitation_sum[i],
        windSpeed: forecast.daily.wind_speed_10m_max[i],
        isHistorical: false,
        isToday: false
      });
      
      // Stop after we have 3 forecast days
      if (data.filter(d => !d.isHistorical && !d.isToday).length >= 3) break;
    }
    
    return data;
  };

  const sevenDayData = generateSevenDayData();

  const handleDayClick = (date: string) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
    onDayClick?.();
  };

  const isSelected = (date: string) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return date === todayString;
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          7-Day Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {sevenDayData.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(day.date)}
              className={`text-center p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected(day.date)
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400 shadow-lg'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {day.dayName}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {day.dayNumber}
              </div>
              <div className="text-4xl mb-3">
                <WeatherIcon 
                  icon={getWeatherIcon(day.weatherCode, day.isToday ? (state.currentWeather?.current.is_day === 1) : true)} 
                  size={48}
                  className="mx-auto"
                />
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatTemperature(day.maxTemp)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTemperature(day.minTemp)}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div className="font-medium mb-1">Precipitation</div>
                {day.precipitation > 0 ? `${day.precipitation.toFixed(1)} mm` : '0 mm'}
              </div>
              {isSelected(day.date) && (
                <div className="mt-3">
                  <Badge className="bg-blue-500 text-white text-xs">Today</Badge>
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
