'use client';

import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { getWeatherIcon } from '@/lib/weather-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HourlyForecast() {
  const { state } = useWeather();
  const { forecast } = state;

  if (!forecast) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            TODAY&apos;S FORECAST
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {[6, 9, 12, 15, 18, 21].map((hour, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {hour}:00 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : 'PM'}
                </div>
                <div className="text-2xl mb-2">
                  🌤️
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  -.-
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate hourly data for today (simplified - in real app you'd get hourly forecast from API)
  const generateHourlyData = () => {
    const hours = [6, 9, 12, 15, 18, 21];
    const baseTemp = forecast.data[0]?.temp || 25;
    
    return hours.map(hour => ({
      time: `${hour}:00 ${hour < 12 ? 'AM' : hour === 12 ? 'PM' : 'PM'}`,
      temp: Math.round(baseTemp + (hour - 12) * 2 + Math.random() * 4),
      icon: forecast.data[0]?.weather.icon || 'c01d',
      condition: forecast.data[0]?.weather.description || 'Clear sky'
    }));
  };

  const hourlyData = generateHourlyData();

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          TODAY&apos;S FORECAST
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-4">
          {hourlyData.map((hour, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {hour.time}
              </div>
              <div className="text-2xl mb-2">
                {getWeatherIcon(hour.icon)}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {hour.temp}°
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
