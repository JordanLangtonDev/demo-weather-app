'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface WeatherHeaderProps {
  location: {
    city?: string;
    state?: string;
  };
  selectedDate?: string;
  isHistorical: boolean;
}

export function WeatherHeader({ location, selectedDate, isHistorical }: WeatherHeaderProps) {
  // Format the selected date for display
  const formatSelectedDate = () => {
    if (!selectedDate) return 'Current Weather';
    const date = new Date(selectedDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Current Weather';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday\'s Weather';
    return `${date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} Weather`;
  };

  return (
    <div className="mb-6">
      <div className="mb-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
          {location?.city || 'Unknown Location'}
          {location?.state && (
            <span className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 ml-2 sm:ml-3 drop-shadow-sm">
              , {location.state}
            </span>
          )}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
            {formatSelectedDate()}
          </span>
          {isHistorical && (
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs">
              Historical
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
