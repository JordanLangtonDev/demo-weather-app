import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';

// WMO weather codes for Open-Meteo
export const weatherConditions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

// Day/night-aware icon selection for WMO codes
export function getWeatherIcon(code: number | string, isDay: boolean = true): string {
  const c = typeof code === 'string' ? Number(code) : code;

  switch (c) {
    case 0:
      return isDay ? 'sun' : 'moon';
    case 1:
    case 2:
      return isDay ? 'cloud-sun' : 'cloud-moon';
    case 3:
      return 'cloud';
    case 45:
    case 48:
      return 'cloud-fog';
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return 'cloud-rain';
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return 'cloud-snow';
    case 95:
    case 96:
    case 99:
      return 'zap';
    default:
      return isDay ? 'cloud-sun' : 'cloud-moon';
  }
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
  let feelsLike = temp;
  if (temp < 10 && windSpeed > 3) {
    feelsLike = temp - (windSpeed * 0.5);
  }
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

// Generate realistic hourly temperatures based on daily min/max
export function generateRealisticHourlyTemps(
  dailyMin: number, 
  dailyMax: number, 
  sunriseHour: number = 6, 
  sunsetHour: number = 18
): number[] {
  const hourlyTemps: number[] = [];
  
  // Typical diurnal pattern: coolest at sunrise, warmest mid-afternoon, cooler in evening
  for (let hour = 0; hour < 24; hour++) {
    let temp: number;
    
    if (hour >= sunriseHour && hour <= sunsetHour) {
      // Daytime: temperature rises from min to max
      const dayProgress = (hour - sunriseHour) / (sunsetHour - sunriseHour);
      const peakHour = 14; // Usually warmest around 2 PM
      const peakProgress = (peakHour - sunriseHour) / (sunsetHour - sunriseHour);
      
      if (dayProgress <= peakProgress) {
        // Morning: rising temperature
        const morningProgress = dayProgress / peakProgress;
        temp = dailyMin + (dailyMax - dailyMin) * morningProgress;
      } else {
        // Afternoon: falling temperature
        const afternoonProgress = (dayProgress - peakProgress) / (1 - peakProgress);
        temp = dailyMax - (dailyMax - dailyMin) * afternoonProgress * 0.3; // Gentle decline
      }
    } else {
      // Nighttime: temperature falls from evening to morning
      if (hour > sunsetHour) {
        // Evening: gradual cooling
        const eveningProgress = (hour - sunsetHour) / (24 - sunsetHour + sunriseHour);
        temp = dailyMax - (dailyMax - dailyMin) * eveningProgress * 0.8;
      } else {
        // Early morning: coldest before sunrise
        const morningProgress = hour / sunriseHour;
        temp = dailyMin + (dailyMax - dailyMin) * morningProgress * 0.2;
      }
    }
    
    // Add some natural variation (±0.5°C)
    const variation = (Math.random() - 0.5) * 1;
    temp += variation;
    
    hourlyTemps.push(Math.round(temp * 10) / 10); // Round to 1 decimal place
  }
  
  return hourlyTemps;
}
