'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function CurrentWeatherEmptyState() {
  return (
    <Card className="border-0 shadow-lg rounded-2xl weather-gradient-cloudy">
      <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌤️</div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Weather Data
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Search for a location to see current weather
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
