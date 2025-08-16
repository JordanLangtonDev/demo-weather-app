import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';

// Weather condition mapping for better display
export const weatherConditions: Record<string, string> = {
  'c01d': 'Clear sky',
  'c01n': 'Clear sky',
  'c02d': 'Few clouds',
  'c02n': 'Few clouds',
  'c03d': 'Scattered clouds',
  'c03n': 'Scattered clouds',
  'c04d': 'Broken clouds',
  'c04n': 'Broken clouds',
  'c09d': 'Shower rain',
  'c09n': 'Shower rain',
  'c10d': 'Rain',
  'c10n': 'Rain',
  'c11d': 'Thunderstorm',
  'c11n': 'Thunderstorm',
  'c13d': 'Snow',
  'c13n': 'Snow',
  'c50d': 'Mist',
  'c50n': 'Mist',
};

// Get weather icon based on condition code
export function getWeatherIcon(iconCode: string): string {
  // Map Weatherbit icon codes to appropriate icons
  // You can replace these with actual icon components or SVG paths
  const iconMap: Record<string, string> = {
    'c01d': '☀️', // Clear sky day
    'c01n': '🌙', // Clear sky night
    'c02d': '⛅', // Few clouds day
    'c02n': '☁️', // Few clouds night
    'c03d': '☁️', // Scattered clouds
    'c03n': '☁️',
    'c04d': '☁️', // Broken clouds
    'c04n': '☁️',
    'c09d': '🌦️', // Shower rain
    'c09n': '🌧️',
    'c10d': '🌧️', // Rain
    'c10n': '🌧️',
    'c11d': '⛈️', // Thunderstorm
    'c11n': '⛈️',
    'c13d': '❄️', // Snow
    'c13n': '❄️',
    'c50d': '🌫️', // Mist
    'c50n': '🌫️',
  };
  
  return iconMap[iconCode] || '🌤️';
}

// Format temperature with units
export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    const fahrenheit = (temp * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

// Format wind speed with units
export function formatWindSpeed(speed: number, unit: 'm/s' | 'mph' = 'm/s'): string {
  if (unit === 'mph') {
    const mph = speed * 2.237;
    return `${Math.round(mph)} mph`;
  }
  return `${speed.toFixed(1)} m/s`;
}

// Format date for display
export function formatDate(dateString: string, formatString: string = 'MMM dd'): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch {
    return dateString;
  }
}

// Get relative date description
export function getRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    
    return format(date, 'EEEE');
  } catch {
    return dateString;
  }
}

// Get time from date string
export function getTimeFromDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'HH:mm');
  } catch {
    return dateString;
  }
}

// Calculate feels like temperature (simplified)
export function calculateFeelsLike(temp: number, humidity: number, windSpeed: number): number {
  // Simplified wind chill and heat index calculation
  let feelsLike = temp;
  
  // Wind chill effect (simplified)
  if (temp < 10 && windSpeed > 3) {
    feelsLike = temp - (windSpeed * 0.5);
  }
  
  // Humidity effect (simplified)
  if (temp > 25 && humidity > 60) {
    feelsLike = temp + (humidity * 0.01);
  }
  
  return Math.round(feelsLike);
}

// Get UV index description
export function getUVDescription(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

// Get air quality description
export function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

// Get precipitation probability description
export function getPrecipitationDescription(pop: number): string {
  if (pop < 20) return 'Low';
  if (pop < 40) return 'Moderate';
  if (pop < 60) return 'High';
  return 'Very High';
}
