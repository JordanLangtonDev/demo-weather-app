'use client';

import React from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { getWeatherIcon, formatTemperature, calculateFeelsLike } from '@/lib/weather-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CurrentWeather() {
  const { state } = useWeather();
  const { currentWeather, location } = state;

  const weather = currentWeather?.data[0];
  const feelsLike = weather ? calculateFeelsLike(weather.temp, weather.rh, weather.wind_spd) : null;

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {location?.city || '-.-'}
                {location?.state && (
                  <span className="text-2xl text-gray-600 ml-3">, {location.state}</span>
                )}
              </h1>
              
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-3 py-1">
                  Chance of rain: {weather ? (weather.precip > 0 ? Math.round(weather.precip * 100) : 0) : '-.-'}%
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-bold text-gray-900">
                  {weather ? formatTemperature(weather.temp) : '-.-'}
                </span>
                <span className="text-3xl text-gray-600">°C</span>
              </div>
              
              <div className="text-center">
                <div className="text-7xl mb-3">
                  {weather ? getWeatherIcon(weather.weather.icon) : '🌤️'}
                </div>
                <p className="text-lg text-gray-600 font-medium">
                  {weather ? weather.weather.description : '-.-'}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Feels like:</span> {feelsLike ? `${formatTemperature(feelsLike)}°C` : '-.-°C'}
              </div>
              <div>
                <span className="font-medium">Humidity:</span> {weather ? `${weather.rh}%` : '-.-%'}
              </div>
              <div>
                <span className="font-medium">Wind:</span> {weather ? `${weather.wind_spd.toFixed(1)} m/s ${weather.wind_cdir}` : '-.- m/s -.-'}
              </div>
              <div>
                <span className="font-medium">Pressure:</span> {weather ? `${weather.pres} mb` : '-.- mb'}
              </div>
            </div>
          </div>

          <div className="text-right text-sm text-gray-500">
            <div>Last updated</div>
            <div className="font-medium">
              {weather ? new Date(weather.ob_time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : '-.-'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
