'use client';

import React from 'react';
import { getWeatherIcon, formatTemperature } from '@/lib/weather-utils';
import { WeatherIcon } from '@/components/ui/weather-icon';

interface DayCardProps {
  day: {
    date: string;
    dayName: string;
    dayNumber: number;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    precipitation: number;
    isHistorical: boolean;
    isToday: boolean;
  };
  isSelected: boolean;
  isMobile: boolean;
  currentWeather?: any;
  onClick: (date: string) => void;
}

export function DayCard({ day, isSelected, isMobile, currentWeather, onClick }: DayCardProps) {
  const handleClick = () => onClick(day.date);

  if (isMobile) {
    return (
      <button
        onClick={handleClick}
        className={`w-full text-left p-4 rounded-xl transition-all duration-200 cursor-pointer ${
          isSelected
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
    );
  }

  // Desktop layout
  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400 shadow-lg'
          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="text-center w-full">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {day.dayName}
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {day.dayNumber}
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <WeatherIcon 
            icon={getWeatherIcon(day.weatherCode, day.isToday ? (currentWeather?.current.is_day === 1) : true)} 
            size={28}
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
        
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <div className="font-medium">Precipitation</div>
          {day.precipitation > 0 ? `${day.precipitation.toFixed(1)} mm` : '0 mm'}
        </div>
      </div>
    </button>
  );
}
