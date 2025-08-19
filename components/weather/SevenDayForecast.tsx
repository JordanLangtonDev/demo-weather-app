'use client';

import React from 'react';
import { useWeatherStore } from '@/stores/weather-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useHistoricalWeatherRange } from '@/lib/weather-queries';
import { DayCard } from './DayCard';
import { ForecastLoadingState } from './ForecastLoadingState';
import { ForecastEmptyState } from './ForecastEmptyState';
import { ForecastErrorState } from './ForecastErrorState';
import { generateSevenDayData, isToday } from '@/lib/forecast-utils';

interface SevenDayForecastProps {
  onDayClick?: () => void;
}

export function SevenDayForecast({ onDayClick }: SevenDayForecastProps) {
  const { 
    forecast, 
    history, 
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
    return <ForecastLoadingState />;
  }

  if (!forecast) {
    return <ForecastEmptyState />;
  }

  // Check if forecast data has the expected structure
  const hasValidForecast = forecast.daily && forecast.daily.time && forecast.daily.time.length > 0;

  if (!hasValidForecast) {
    return <ForecastErrorState />;
  }

  const sevenDayData = generateSevenDayData(forecast, historyData, currentWeather);

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    onDayClick?.();
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
        {/* Mobile Layout - Vertical List */}
        <div className="block md:hidden space-y-3">
          {sevenDayData.map((day, index) => (
            <DayCard
              key={index}
              day={day}
              isSelected={isToday(day.date)}
              isMobile={true}
              currentWeather={currentWeather}
              onClick={handleDayClick}
            />
          ))}
        </div>

        {/* Desktop Layout - Horizontal Row of Cards */}
        <div className="hidden md:grid md:grid-cols-7 gap-2">
          {sevenDayData.map((day, index) => (
            <DayCard
              key={index}
              day={day}
              isSelected={isToday(day.date)}
              isMobile={false}
              currentWeather={currentWeather}
              onClick={handleDayClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
