'use client';

import React from 'react';
import { useWeatherStore } from '@/stores/weather-store';
import { getWeatherIcon, formatTemperature } from '@/lib/weather-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar } from 'lucide-react';
import { WeatherIcon } from '@/components/ui/weather-icon';
import { useHistoricalWeatherRange } from '@/lib/weather-queries';

interface SevenDayForecastProps {
  onDayClick?: () => void;
}

export function SevenDayForecast({ onDayClick }: SevenDayForecastProps) {
  const { 
    forecast, 
    history, 
    selectedDate, 
    loading, 
    currentWeather,
    location,
    setSelectedDate 
  } = useWeatherStore();

  // Fetch historical weather data for the past 3 days
  const historicalWeatherQuery = useHistoricalWeatherRange(
    location?.lat || 0, 
    location?.lon || 0, 
    3
  );

  // Use query data if available, otherwise fall back to store data
  const historyData = historicalWeatherQuery.data || history;

  // Show loading state
  if (loading || (location && historicalWeatherQuery.isLoading)) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="w-full p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="min-w-[60px]">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
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
        <CardContent className="p-4 sm:p-6 md:p-8">
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
  const hasValidHistory = historyData && historyData.daily && historyData.daily.time && historyData.daily.time.length > 0;

  if (!hasValidForecast) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
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
      for (let i = 0; i < historyData.daily.time.length; i++) {
        const date = historyData.daily.time[i];
        const dayDate = new Date(date);
        const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = dayDate.getDate();
        
        data.push({
          date: date,
          dayName: dayName,
          dayNumber: dayNumber,
          maxTemp: historyData.daily.temperature_2m_max[i],
          minTemp: historyData.daily.temperature_2m_min[i],
          weatherCode: historyData.daily.weather_code[i],
          precipitation: historyData.daily.precipitation_sum[i],
          windSpeed: historyData.daily.wind_speed_10m_max[i],
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
        weatherCode: currentWeather?.current.weather_code ?? forecast.daily.weather_code[todayIndex],
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
    setSelectedDate(date);
    onDayClick?.();
  };

  const isSelected = (date: string) => {
    // Only highlight today's card, not the selected date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return date === todayString;
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          7-Day Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sevenDayData.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(day.date)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected(day.date)
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400 shadow-lg'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {day.dayName}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {day.dayNumber}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <WeatherIcon 
                      icon={getWeatherIcon(day.weatherCode, day.isToday ? (currentWeather?.current.is_day === 1) : true)} 
                      size={32}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatTemperature(day.maxTemp)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTemperature(day.minTemp)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    <div className="font-medium">Precipitation</div>
                    {day.precipitation > 0 ? `${day.precipitation.toFixed(1)} mm` : '0 mm'}
                  </div>
                  

                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
