'use client';

import React, { useState } from 'react';
import { LocationSearch } from '@/components/weather/LocationSearch';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { SevenDayForecast } from '@/components/weather/SevenDayForecast';
import { DayDetailsDrawer } from '@/components/weather/DayDetailsDrawer';
import { useWeather } from '@/contexts/WeatherContext';

export function WeatherLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { state } = useWeather();
  const { loading } = state;

  const handleDayClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="flex-1">
            <LocationSearch />
          </div>
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Current Weather */}
          <CurrentWeather onShowDetails={() => setIsDrawerOpen(true)} />
          
          {/* 7-Day Forecast */}
          <SevenDayForecast onDayClick={handleDayClick} />
        </div>
      </main>

      {/* Day Details Drawer */}
      <DayDetailsDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
    </div>
  );
}
