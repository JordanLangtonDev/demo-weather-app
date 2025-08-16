'use client';

import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { formatTemperature, getUVDescription } from '@/lib/weather-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, Droplets, Wind, Sun } from 'lucide-react';

export function AirConditions() {
  const { state } = useWeather();
  const { currentWeather } = state;

  if (!currentWeather) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              AIR CONDITIONS
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              See more
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Real Feel', icon: Thermometer, color: 'text-orange-600' },
              { label: 'Chance of Rain', icon: Droplets, color: 'text-blue-600' },
              { label: 'Wind', icon: Wind, color: 'text-gray-600' },
              { label: 'UV Index', icon: Sun, color: 'text-yellow-600' }
            ].map((condition, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${condition.color}`}>
                  <condition.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">{condition.label}</div>
                  <div className="font-semibold text-gray-400">-.-</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const weather = currentWeather.data[0];

  const conditions = [
    {
      label: 'Real Feel',
      value: `${formatTemperature(weather.app_temp)}°C`,
      icon: Thermometer,
      color: 'text-orange-600'
    },
    {
      label: 'Chance of Rain',
      value: `${weather.precip > 0 ? Math.round(weather.precip * 100) : 0}%`,
      icon: Droplets,
      color: 'text-blue-600'
    },
    {
      label: 'Wind',
      value: `${(weather.wind_spd * 3.6).toFixed(1)} km/h`,
      icon: Wind,
      color: 'text-gray-600'
    },
    {
      label: 'UV Index',
      value: `${weather.uv} (${getUVDescription(weather.uv)})`,
      icon: Sun,
      color: 'text-yellow-600'
    }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            AIR CONDITIONS
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            See more
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100 ${condition.color}`}>
                <condition.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-600">{condition.label}</div>
                <div className="font-semibold text-gray-900">{condition.value}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
