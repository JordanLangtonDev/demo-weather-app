'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface WeatherDetailsProps {
  humidity: number | null;
  windSpeed: number;
  windDirection: number;
  pressure: number | null;
  precipitation: number;
}

export function WeatherDetails({ 
  humidity, 
  windSpeed, 
  windDirection, 
  pressure, 
  precipitation 
}: WeatherDetailsProps) {
  // Helper function to convert wind direction degrees to cardinal directions
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {humidity !== null && (
        <Badge variant="secondary" className="bg-transparent dark:bg-blue-900 text-blue-900 dark:text-blue-200 border-blue-700 dark:border-blue-700 text-sm px-3 py-1">
          Humidity: {humidity}%
        </Badge>
      )}
      <Badge variant="secondary" className="bg-transparent dark:bg-blue-900 text-blue-900 dark:text-blue-200 border-blue-700 dark:border-blue-700 text-sm px-3 py-1">
        Wind: {windSpeed.toFixed(1)} km/h {getWindDirection(windDirection)}
      </Badge>
      {pressure !== null && (
        <Badge variant="secondary" className="bg-transparent dark:bg-blue-900 text-blue-900 dark:text-blue-200 border-blue-700 dark:border-blue-700 text-sm px-3 py-1">
          Pressure: {pressure} mb
        </Badge>
      )}
      <Badge variant="secondary" className="bg-transparent dark:bg-blue-900 text-blue-900 dark:text-blue-200 border-blue-700 dark:border-blue-700 text-sm px-3 py-1">
        Precipitation: {precipitation && precipitation > 0 ? `${precipitation.toFixed(1)} mm` : '0 mm'}
      </Badge>
    </div>
  );
}
