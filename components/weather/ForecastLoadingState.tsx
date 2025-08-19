'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function ForecastLoadingState() {
  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-2xl">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="w-full p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="min-w-[60px]">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
