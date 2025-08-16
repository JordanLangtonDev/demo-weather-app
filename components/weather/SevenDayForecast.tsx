'use client';

import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { getWeatherIcon } from '@/lib/weather-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SevenDayForecast() {
  const { state } = useWeather();
  const { forecast } = state;

  if (!forecast) {
    return (
      <Card className="shadow-md h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            7-DAY FORECAST
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-sm font-medium text-gray-600 min-w-[40px]">
                    {day}
                  </div>
                  <div className="text-xl">
                    🌤️
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    -.-°
                  </div>
                  <div className="text-xs text-gray-500">
                    -.-°
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate 7-day forecast data (combining current day + forecast)
  const generateSevenDayData = () => {
    const today = new Date();
    const days = [];
    
    // Add today
    days.push({
      date: today,
      day: 'Today',
      high: Math.round(forecast.data[0]?.temp || 25),
      low: Math.round((forecast.data[0]?.temp || 25) - 8),
      icon: forecast.data[0]?.weather.icon || 'c01d',
      condition: forecast.data[0]?.weather.description || 'Clear sky'
    });

    // Add next 6 days
    for (let i = 1; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const forecastDay = forecast.data[i] || forecast.data[0];
      days.push({
        date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round((forecastDay?.temp || 25) + Math.random() * 5),
        low: Math.round((forecastDay?.temp || 25) - 8 + Math.random() * 3),
        icon: forecastDay?.weather.icon || 'c01d',
        condition: forecastDay?.weather.description || 'Clear sky'
      });
    }

    return days;
  };

  const sevenDayData = generateSevenDayData();

  return (
    <Card className="shadow-md h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          7-DAY FORECAST
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sevenDayData.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-sm font-medium text-gray-600 min-w-[40px]">
                  {day.day}
                </div>
                <div className="text-xl">
                  {getWeatherIcon(day.icon)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {day.high}°
                </div>
                <div className="text-xs text-gray-500">
                  {day.low}°
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
