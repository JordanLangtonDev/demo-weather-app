'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function CurrentWeatherLoadingState() {
  return (
    <Card className="border-0 shadow-lg rounded-2xl weather-gradient-cloudy">
      <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
        <div className="animate-pulse">
          <div className="mb-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          
          <div className="flex items-center gap-12 mb-6">
            <div className="flex items-baseline gap-3">
              <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            
            <div className="text-center">
              <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
