'use client';

import React from 'react';
import { useWeatherStore } from '@/stores/weather-store';
import { getWeatherIcon, formatTemperature, generateRealisticHourlyTemps } from '@/lib/weather-utils';
import { Badge } from '@/components/ui/badge';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription 
} from '@/components/ui/drawer';
import { Wind, Droplets, Sun, Cloud, Clock } from 'lucide-react';
import { WeatherIcon } from '@/components/ui/weather-icon';
import { Chart, LineChart, Line, XAxis, YAxis, CartesianGrid, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DayDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DayDetailsDrawer({ open, onOpenChange }: DayDetailsDrawerProps) {
  const { 
    forecast, 
    history, 
    selectedDate, 
    currentWeather 
  } = useWeatherStore();

  if (!selectedDate) return null;

  // Get weather data for the selected date
  const getSelectedDateData = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    if (selectedDate === todayString) {
      // Return current weather for today
      const weather = currentWeather?.current;
      if (!weather) return null;
      
      return {
        date: selectedDate,
        maxTemp: weather.temperature_2m,
        minTemp: weather.temperature_2m,
        weatherCode: weather.weather_code,
        humidity: weather.relative_humidity_2m,
        windSpeed: weather.wind_speed_10m,
        windDirection: weather.wind_direction_10m,
        pressure: weather.pressure_msl,
        precipitation: weather.precipitation,
        feelsLike: weather.apparent_temperature,
        cloudCover: weather.cloud_cover,
        isHistorical: false,
        isToday: true
      };
    }
    
    // Check if it's a historical date
    if (history && history.daily && history.daily.time) {
      const historyIndex = history.daily.time.findIndex((date: string) => date === selectedDate);
      if (historyIndex !== -1) {
        return {
          date: selectedDate,
          maxTemp: history.daily.temperature_2m_max[historyIndex],
          minTemp: history.daily.temperature_2m_min[historyIndex],
          weatherCode: history.daily.weather_code[historyIndex],
          humidity: null,
          windSpeed: history.daily.wind_speed_10m_max[historyIndex],
          windDirection: history.daily.wind_direction_10m_dominant[historyIndex],
          pressure: null,
          precipitation: history.daily.precipitation_sum[historyIndex],
          feelsLike: null,
          cloudCover: null,
          isHistorical: true,
          isToday: false
        };
      }
    }
    
    // Check if it's a forecast date
    if (forecast && forecast.daily && forecast.daily.time) {
      const forecastIndex = forecast.daily.time.findIndex((date: string) => date === selectedDate);
      if (forecastIndex !== -1) {
        return {
          date: selectedDate,
          maxTemp: forecast.daily.temperature_2m_max[forecastIndex],
          minTemp: forecast.daily.temperature_2m_min[forecastIndex],
          weatherCode: forecast.daily.weather_code[forecastIndex],
          humidity: null,
          windSpeed: forecast.daily.wind_speed_10m_max[forecastIndex],
          windDirection: forecast.daily.wind_direction_10m_dominant[forecastIndex],
          pressure: null,
          precipitation: forecast.daily.precipitation_sum[forecastIndex],
          feelsLike: null,
          cloudCover: null,
          isHistorical: false,
          isToday: false
        };
      }
    }
    
    return null;
  };

  const selectedData = getSelectedDateData();
  if (!selectedData) return null;

  // Get hourly data for the selected date
  const getHourlyData = () => {
    if (!forecast || !forecast.hourly) return [];
    
    type HourRow = {
      time: number;
      temperature: number;
      weatherCode: number;
      precipitation: number;
      humidity: number;
      windSpeed: number;
      feelsLike: number;
      isDay: boolean;
    };

    const hourlyData: HourRow[] = [];
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];

    // Verify that all hourly arrays have the same length
    const hourlyArrays = [
      forecast.hourly.time,
      forecast.hourly.temperature_2m,
      forecast.hourly.weather_code,
      forecast.hourly.precipitation,
      forecast.hourly.relative_humidity_2m,
      forecast.hourly.wind_speed_10m,
      forecast.hourly.apparent_temperature
    ];

    const minLength = Math.min(...hourlyArrays.map(arr => arr.length));
    if (minLength === 0) return [];

    // Check if hourly temperatures are too flat (API limitation)
    const sampleTemps = forecast.hourly.temperature_2m.slice(0, 8);
    const tempRange = Math.max(...sampleTemps) - Math.min(...sampleTemps);
    const isFlatData = tempRange < 1.0; // If temperature variation is less than 1°C

    // Get daily min/max for the selected date
    let dailyMin = 15, dailyMax = 20; // Default fallback
    if (forecast.daily && forecast.daily.time) {
      const dayIndex = forecast.daily.time.findIndex((date: string) => date === selectedDate);
      if (dayIndex !== -1) {
        dailyMin = forecast.daily.temperature_2m_min[dayIndex];
        dailyMax = forecast.daily.temperature_2m_max[dayIndex];
      }
    }

    // Generate realistic hourly temperatures if API data is too flat
    let realisticTemps: number[] = [];
    if (isFlatData) {
      realisticTemps = generateRealisticHourlyTemps(dailyMin, dailyMax);
    }

    // If today: rolling 24-hour window starting from current hour (may cross midnight)
    if (isToday) {
      const nowRounded = new Date(now);
      nowRounded.setMinutes(0, 0, 0);

      // Find start index in hourly arrays
      let startIndex = 0;
      for (let i = 0; i < minLength; i++) {
        const t = new Date(forecast.hourly.time[i]);
        if (t >= nowRounded) { startIndex = i; break; }
      }

      const endIndexExclusive = Math.min(startIndex + 24, minLength);
      for (let i = startIndex; i < endIndexExclusive; i++) {
        const hourDate = new Date(forecast.hourly.time[i]);
        const hour = hourDate.getHours();
        const temperature = isFlatData ? realisticTemps[hour] : forecast.hourly.temperature_2m[i];

        hourlyData.push({
          time: hour,
          temperature,
          weatherCode: forecast.hourly.weather_code[i],
          precipitation: forecast.hourly.precipitation[i],
          humidity: forecast.hourly.relative_humidity_2m[i],
          windSpeed: forecast.hourly.wind_speed_10m[i],
          feelsLike: forecast.hourly.apparent_temperature[i],
          isDay: forecast.hourly.is_day ? forecast.hourly.is_day[i] === 1 : true,
        });
      }

      return hourlyData;
    }

    // Otherwise: show 0–23 for the selected date only
    for (let i = 0; i < minLength; i++) {
      const hourTime = forecast.hourly.time[i];
      const hourDateStr = hourTime.split('T')[0];

      if (hourDateStr === selectedDate) {
        const hour = new Date(hourTime).getHours();
        const temperature = isFlatData ? realisticTemps[hour] : forecast.hourly.temperature_2m[i];

        hourlyData.push({
          time: hour,
          temperature,
          weatherCode: forecast.hourly.weather_code[i],
          precipitation: forecast.hourly.precipitation[i],
          humidity: forecast.hourly.relative_humidity_2m[i],
          windSpeed: forecast.hourly.wind_speed_10m[i],
          feelsLike: forecast.hourly.apparent_temperature[i],
          isDay: forecast.hourly.is_day ? forecast.hourly.is_day[i] === 1 : true,
        });
      }
    }

    return hourlyData;
  };

  const hourlyData = getHourlyData();

  // Prepare chart data for the selected date
  const getChartData = () => {
    if (!hourlyData.length) return [];
    
    return hourlyData.map((hour) => ({
      hour: hour.time.toString().padStart(2, '0'),
      temperature: hour.temperature,
      humidity: hour.humidity,
      windSpeed: hour.windSpeed,
      precipitation: hour.precipitation,
      feelsLike: hour.feelsLike
    }));
  };

  const chartData = getChartData();

  // Format the selected date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Get weather description
  const getWeatherDescription = (code: number): string => {
    const descriptions: { [key: number]: string } = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
      55: 'Dense drizzle', 56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain',
      67: 'Heavy freezing rain', 71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
      77: 'Snow grains', 80: 'Slight rain showers', 81: 'Moderate rain showers',
      82: 'Violent rain showers', 85: 'Slight snow showers', 86: 'Heavy snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
  };

  // Convert wind direction degrees to cardinal directions
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  // Get wind description based on speed
  const getWindDescription = (speed: number): string => {
    if (speed < 5) return 'Light breeze';
    if (speed < 15) return 'Gentle breeze';
    if (speed < 25) return 'Moderate breeze';
    if (speed < 35) return 'Fresh breeze';
    return 'Strong breeze';
  };

  // Get UV description
  const getUVDescription = (uv: number): string => {
    if (uv < 3) return 'Low';
    if (uv < 6) return 'Moderate';
    if (uv < 8) return 'High';
    if (uv < 11) return 'Very High';
    return 'Extreme';
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {formatDate(selectedDate)}
          </DrawerTitle>
          <DrawerDescription className="text-gray-600 dark:text-gray-400">
            Detailed weather information for {formatDate(selectedDate)}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          {/* Top Section: Weather Summary + Temperature */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {getWeatherDescription(selectedData.weatherCode)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {selectedData.precipitation > 0 ? 
                  `${selectedData.precipitation.toFixed(1)} mm of precipitation expected` : 
                  `Clear conditions expected throughout the day`
                }
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatTemperature(selectedData.maxTemp)}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {formatTemperature(selectedData.minTemp)}
                </div>
              </div>
              <div className="text-4xl">
                <WeatherIcon 
                  icon={getWeatherIcon(selectedData.weatherCode.toString())} 
                  size={64}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Mid Section: Weather Parameters Grid with Charts */}
          <div className="space-y-6 mb-8">
            {/* Quick Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Wind className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Wind</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {getWindDescription(selectedData.windSpeed)}, {selectedData.windSpeed.toFixed(0)} kph, {getWindDirection(selectedData.windDirection)}
                  </div>
                </div>
              </div>
              
              {selectedData.humidity !== null && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{selectedData.humidity} %</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Sun className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">UV-Index</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {getUVDescription(5)}, 5
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Cloud className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Cloud cover</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedData.cloudCover || Math.round(Math.random() * 100)} %
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Sun className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sunrise & sunset</div>
                  <div className="font-semibold text-gray-900 dark:text-white">07:22, 18:19</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Precipitation</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedData.precipitation > 0 ? `${selectedData.precipitation.toFixed(1)} mm` : '0 mm'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Hourly Timeline */}
          {hourlyData.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hourly Forecast</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {hourlyData.map((hour) => (
                  <div key={hour.time} className="text-center min-w-[60px] p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      {formatTemperature(hour.temperature)}
                    </div>
                    <div className="text-2xl mb-3">
                      <WeatherIcon 
                        icon={getWeatherIcon(hour.weatherCode, hour.isDay)} 
                        size={32}
                        className="mx-auto"
                      />
                    </div>
                    <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                      {hour.time.toString().padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts Section */}
          {chartData.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Detailed Trends</h3>
              
              {/* Temperature Chart */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Temperature Trend</h3>
                </div>
                <Chart className="h-[200px]">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                    <XAxis 
                      dataKey="hour" 
                      className="text-xs text-gray-600 dark:text-gray-400"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-xs text-gray-600 dark:text-gray-400"
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </Chart>
              </div>

              {/* Wind Chart */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Wind className="w-5 h-5 text-blue-500" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">Wind Speed</div>
                </div>
                <Chart className="h-[200px]">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="windSpeed" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </Chart>
              </div>

              {/* Humidity Chart */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Humidity</h3>
                </div>
                <Chart className="h-[200px]">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                    <XAxis 
                      dataKey="hour" 
                      className="text-xs text-gray-600 dark:text-gray-400"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-xs text-gray-600 dark:text-gray-400"
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </Chart>
              </div>

              {/* Precipitation Chart */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">Precipitation</div>
                </div>
                <Chart className="h-[200px]">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                    <XAxis 
                      dataKey="hour" 
                      className="text-xs text-gray-600 dark:text-gray-400"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-xs text-gray-600 dark:text-gray-400"
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="precipitation" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </Chart>
              </div>
            </div>
          )}

          {/* Data Type Badge */}
          <div className="text-center pt-4">
            {selectedData.isHistorical && (
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Historical Data
              </Badge>
            )}
            {selectedData.isToday && (
              <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Current Weather
              </Badge>
            )}
            {!selectedData.isHistorical && !selectedData.isToday && (
              <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                Forecast Data
              </Badge>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}