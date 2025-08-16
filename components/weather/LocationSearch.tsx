'use client';

import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWeather } from '@/contexts/WeatherContext';
import { weatherAPI } from '@/lib/weather-api';

export function LocationSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { dispatch } = useWeather();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Try to get weather by city name first
      const currentWeather = await weatherAPI.getCurrentWeatherByCity(searchQuery);
      
      if (currentWeather.data.length > 0) {
        const location = currentWeather.data[0];
        
        // Set location in context
        dispatch({
          type: 'SET_LOCATION',
          payload: {
            city: location.city_name,
            state: location.state_code,
            country: location.country_code,
            lat: location.lat,
            lon: location.lon,
          }
        });

        // Set current weather
        dispatch({ type: 'SET_CURRENT_WEATHER', payload: currentWeather });

        // Get forecast for the next 3 days
        if (location.lat && location.lon) {
          const forecast = await weatherAPI.getForecast(location.lat, location.lon);
          dispatch({ type: 'SET_FORECAST', payload: forecast });

          // Get historical data for the past 3 days
          const today = new Date();
          const threeDaysAgo = new Date(today);
          threeDaysAgo.setDate(today.getDate() - 3);
          
          const startDate = threeDaysAgo.toISOString().split('T')[0];
          const endDate = today.toISOString().split('T')[0];
          
          const history = await weatherAPI.getHistoricalWeather(
            location.lat,
            location.lon,
            startDate,
            endDate
          );
          dispatch({ type: 'SET_HISTORY', payload: history });

          // Set today as selected date
          dispatch({ type: 'SET_SELECTED_DATE', payload: today.toISOString().split('T')[0] });
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Location not found. Please try a different city name.' 
      });
    } finally {
      setIsSearching(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="relative flex gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-12 pr-4 py-4 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm"
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
