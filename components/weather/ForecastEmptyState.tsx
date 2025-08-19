'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function ForecastEmptyState() {
  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            7-Day Weather
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Search for a location to see forecast and history
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
