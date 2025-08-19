export interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number | null;
  windSpeed: number;
  windDirection: number;
  pressure: number | null;
  precipitation: number;
  isHistorical: boolean;
  time: string;
}

export function getSelectedDateWeather(
  selectedDate: string | undefined,
  forecastData: any,
  historyData: any,
  currentWeather: any
): WeatherData | null {
  if (!selectedDate || !forecastData) return null;
  
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  if (selectedDate === todayString) {
    // Return current weather for today
    return {
      temperature: currentWeather?.temperature_2m,
      weatherCode: currentWeather?.weather_code,
      humidity: currentWeather?.relative_humidity_2m,
      windSpeed: currentWeather?.wind_speed_10m,
      windDirection: currentWeather?.wind_direction_10m,
      pressure: currentWeather?.pressure_msl,
      precipitation: currentWeather?.precipitation,
      isHistorical: false,
      time: currentWeather?.time
    };
  }
  
  // Check if it's a historical date
  if (historyData && historyData.daily && historyData.daily.time) {
    const historyIndex = historyData.daily.time.findIndex((date: string) => date === selectedDate);
    if (historyIndex !== -1) {
      return {
        temperature: (historyData.daily.temperature_2m_max[historyIndex] + historyData.daily.temperature_2m_min[historyIndex]) / 2,
        weatherCode: historyData.daily.weather_code[historyIndex],
        humidity: null, // Historical data doesn't include humidity
        windSpeed: historyData.daily.wind_speed_10m_max[historyIndex],
        windDirection: historyData.daily.wind_direction_10m_dominant[historyIndex],
        pressure: null, // Historical data doesn't include pressure
        precipitation: historyData.daily.precipitation_sum[historyIndex],
        isHistorical: true,
        time: selectedDate
      };
    }
  }
  
  // Check if it's a forecast date
  if (forecastData.daily && forecastData.daily.time) {
    const forecastIndex = forecastData.daily.time.findIndex((date: string) => date === selectedDate);
    if (forecastIndex !== -1) {
      return {
        temperature: (forecastData.daily.temperature_2m_max[forecastIndex] + forecastData.daily.temperature_2m_min[forecastIndex]) / 2,
        weatherCode: forecastData.daily.weather_code[forecastIndex],
        humidity: null, // Forecast daily data doesn't include humidity
        windSpeed: forecastData.daily.wind_speed_10m_max[forecastIndex],
        windDirection: forecastData.daily.wind_direction_10m_dominant[forecastIndex],
        pressure: null, // Forecast daily data doesn't include pressure
        precipitation: forecastData.daily.precipitation_sum[forecastIndex],
        isHistorical: false,
        time: selectedDate
      };
    }
  }
  
  return null;
}

export function getWeatherGradient(weatherCode: number, isDay: boolean): string {
  // WMO Weather codes: https://open-meteo.com/en/docs
  if (weatherCode >= 0 && weatherCode <= 3) {
    // Clear sky
    return isDay ? 'weather-gradient-sunny' : 'weather-gradient-night';
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    // Foggy
    return 'weather-gradient-cloudy';
  } else if (weatherCode >= 51 && weatherCode <= 67) {
    // Drizzle and rain
    return 'weather-gradient-rainy';
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    // Snow
    return 'weather-gradient-snowy';
  } else if (weatherCode >= 80 && weatherCode <= 82) {
    // Rain showers
    return 'weather-gradient-rainy';
  } else if (weatherCode >= 85 && weatherCode <= 86) {
    // Snow showers
    return 'weather-gradient-snowy';
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    // Thunderstorm
    return 'weather-gradient-stormy';
  } else {
    // Default cloudy
    return 'weather-gradient-cloudy';
  }
}
