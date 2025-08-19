'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export function ForecastErrorState() {
  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Weather Data Unavailable
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Weather data is not available for this location
          </p>
          <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="w-4 h-4 mr-2" />
            Data Unavailable
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
