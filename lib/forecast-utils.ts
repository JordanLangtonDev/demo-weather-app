export interface DayData {
  date: string;
  dayName: string;
  dayNumber: number;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitation: number;
  windSpeed: number;
  isHistorical: boolean;
  isToday: boolean;
}

export function generateSevenDayData(
  forecast: any,
  historyData: any,
  currentWeather: any
): DayData[] {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const data: DayData[] = [];
  
  // Add historical days (past 3 days) in chronological order (oldest -> newest)
  if (historyData && historyData.daily && historyData.daily.time && historyData.daily.time.length > 0) {
    for (let i = 0; i < historyData.daily.time.length; i++) {
      const date = historyData.daily.time[i];
      const dayDate = new Date(date);
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = dayDate.getDate();
      
      data.push({
        date: date,
        dayName: dayName,
        dayNumber: dayNumber,
        maxTemp: historyData.daily.temperature_2m_max[i],
        minTemp: historyData.daily.temperature_2m_min[i],
        weatherCode: historyData.daily.weather_code[i],
        precipitation: historyData.daily.precipitation_sum[i],
        windSpeed: historyData.daily.wind_speed_10m_max[i],
        isHistorical: true,
        isToday: false
      });
    }
  }
  
  // Add today
  const todayIndex = forecast.daily.time.findIndex((date: string) => date === todayString);
  if (todayIndex !== -1) {
    const todayDate = new Date(forecast.daily.time[todayIndex]);
    const todayName = todayDate.toLocaleDateString('en-US', { weekday: 'short' });
    const todayNumber = todayDate.getDate();
    
    data.push({
      date: forecast.daily.time[todayIndex],
      dayName: todayName,
      dayNumber: todayNumber,
      maxTemp: forecast.daily.temperature_2m_max[todayIndex],
      minTemp: forecast.daily.temperature_2m_min[todayIndex],
      weatherCode: currentWeather?.current.weather_code ?? forecast.daily.weather_code[todayIndex],
      precipitation: forecast.daily.precipitation_sum[todayIndex],
      windSpeed: forecast.daily.wind_speed_10m_max[todayIndex],
      isHistorical: false,
      isToday: true
    });
  }
  
  // Add forecast days (next 3 days)
  for (let i = 0; i < forecast.daily.time.length; i++) {
    const date = forecast.daily.time[i];
    if (date === todayString) continue; // Skip today if already added
    
    const dayDate = new Date(date);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = dayDate.getDate();
    
    data.push({
      date: date,
      dayName: dayName,
      dayNumber: dayNumber,
      maxTemp: forecast.daily.temperature_2m_max[i],
      minTemp: forecast.daily.temperature_2m_min[i],
      weatherCode: forecast.daily.weather_code[i],
      precipitation: forecast.daily.precipitation_sum[i],
      windSpeed: forecast.daily.wind_speed_10m_max[i],
      isHistorical: false,
      isToday: false
    });
    
    // Stop after we have 3 forecast days
    if (data.filter(d => !d.isHistorical && !d.isToday).length >= 3) break;
  }
  
  return data;
}

export function isToday(date: string): boolean {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  return date === todayString;
}
