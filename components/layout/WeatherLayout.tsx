'use client';

import React, { useState, useEffect } from 'react';
import { LocationSearch } from '@/components/weather/LocationSearch';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { SevenDayForecast } from '@/components/weather/SevenDayForecast';
import { DayDetailsDrawer } from '@/components/weather/DayDetailsDrawer';
import { useWeatherStore } from '@/stores/weather-store';

export function WeatherLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setSelectedDate } = useWeatherStore();

  // Ensure we're on the client side
  useEffect(() => {
    setMounted(true);
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, [setSelectedDate]);

  const handleDayClick = () => {
    setIsDrawerOpen(true);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-6">
          <div className="flex-1">
            <LocationSearch />
          </div>
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="space-y-4 sm:space-y-6">
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
