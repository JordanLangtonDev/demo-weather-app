'use client';

import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { LocationSearch } from '@/components/weather/LocationSearch';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { AirConditions } from '@/components/weather/AirConditions';
import { SevenDayForecast } from '@/components/weather/SevenDayForecast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export function WeatherLayout() {
  const { state } = useWeather();
  const { loading, error, currentWeather } = state;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center bg-transparent p-5">
          <LocationSearch />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Weather Info */}
            <div className="lg:col-span-2 space-y-6">
              <CurrentWeather />
              <HourlyForecast />
              <AirConditions />
            </div>

            {/* Right Column - 7-Day Forecast */}
            <div className="lg:col-span-1">
              <SevenDayForecast />
            </div>
          </div>
      </div>
    </div>
  );
}
