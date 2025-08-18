'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OpenMeteoCurrentWeather, OpenMeteoForecast, OpenMeteoHistorical } from '@/lib/weather-api';

interface Location {
  city: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
}

interface WeatherState {
  currentWeather: OpenMeteoCurrentWeather | null;
  forecast: OpenMeteoForecast | null;
  history: OpenMeteoHistorical | null;
  location: Location | null;
  selectedDate: string;
  loading: boolean;
  error: string | null;
}

type WeatherAction =
  | { type: 'SET_CURRENT_WEATHER'; payload: OpenMeteoCurrentWeather }
  | { type: 'SET_FORECAST'; payload: OpenMeteoForecast }
  | { type: 'SET_HISTORY'; payload: OpenMeteoHistorical }
  | { type: 'SET_LOCATION'; payload: Location }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_WEATHER' };

const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  history: null,
  location: null,
  selectedDate: new Date().toISOString().split('T')[0],
  loading: false,
  error: null,
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_CURRENT_WEATHER':
      return { ...state, currentWeather: action.payload, error: null };
    case 'SET_FORECAST':
      return { ...state, forecast: action.payload, error: null };
    case 'SET_HISTORY':
      return { ...state, history: action.payload, error: null };
    case 'SET_LOCATION':
      return { ...state, location: action.payload, error: null };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_WEATHER':
      return { ...state, currentWeather: null, forecast: null, history: null };
    default:
      return state;
  }
}

const WeatherContext = createContext<{
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
} | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
