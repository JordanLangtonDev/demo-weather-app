'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WeatherData, ForecastData, HistoricalData } from '@/lib/weather-api';

export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  history: HistoricalData | null;
  selectedDate: string | null;
  loading: boolean;
  error: string | null;
  location: {
    city: string;
    state?: string;
    country?: string;
    lat?: number;
    lon?: number;
  } | null;
}

type WeatherAction =
  | { type: 'SET_CURRENT_WEATHER'; payload: WeatherData }
  | { type: 'SET_FORECAST'; payload: ForecastData }
  | { type: 'SET_HISTORY'; payload: HistoricalData }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOCATION'; payload: WeatherState['location'] }
  | { type: 'RESET_STATE' };

const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  history: null,
  selectedDate: null,
  loading: false,
  error: null,
  location: null,
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_CURRENT_WEATHER':
      return { ...state, currentWeather: action.payload, error: null };
    case 'SET_FORECAST':
      return { ...state, forecast: action.payload, error: null };
    case 'SET_HISTORY':
      return { ...state, history: action.payload, error: null };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

interface WeatherContextType {
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

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
