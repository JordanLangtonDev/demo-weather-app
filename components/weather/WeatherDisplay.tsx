'use client';

import React from 'react';
import { getWeatherIcon, formatTemperature } from '@/lib/weather-utils';
import { WeatherIcon } from '@/components/ui/weather-icon';

interface WeatherDisplayProps {
  temperature: number;
  weatherCode: number;
}

export function WeatherDisplay({ temperature, weatherCode }: WeatherDisplayProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-baseline gap-3">
        <span className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
          {formatTemperature(temperature)}
        </span>
        <span className="text-2xl sm:text-3xl text-gray-700 dark:text-gray-300 drop-shadow-sm">°C</span>
      </div>
      
      <div className="flex items-center">
        <WeatherIcon 
          icon={getWeatherIcon(weatherCode.toString())} 
          size={80}
          className="text-gray-600 dark:text-gray-400"
        />
      </div>
    </div>
  );
}
