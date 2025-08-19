'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface WeatherSidebarProps {
  time: string;
  isHistorical: boolean;
  onShowDetails?: () => void;
}

export function WeatherSidebar({ time, isHistorical, onShowDetails }: WeatherSidebarProps) {
  return (
    <div className="text-center lg:text-right text-sm text-gray-500 dark:text-gray-400 w-full lg:w-auto">
      <div className="flex items-center gap-2 mb-2 justify-center lg:justify-end">
        <Clock className="w-4 h-4" />
        <span>{isHistorical ? 'Date' : 'Last updated'}</span>
      </div>
      <div className="font-medium mb-4">
        {isHistorical 
          ? new Date(time).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
          : new Date(time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
        }
      </div>
      {onShowDetails && (
        <Button variant="outline" size="sm" onClick={onShowDetails}>
          See more details
        </Button>
      )}
    </div>
  );
}
