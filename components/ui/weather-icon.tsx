'use client';

import React from 'react';
import { 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudFog, 
  Zap 
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ icon, size = 24, className = '' }: WeatherIconProps) {
  // Get color based on weather icon type
  const getIconColor = (iconName: string) => {
    const icon = iconName.toLowerCase();
    
    if (icon.includes('sun')) return 'text-yellow-500 dark:text-yellow-400';
    if (icon.includes('moon')) return 'text-indigo-400 dark:text-indigo-300';
    if (icon.includes('cloud-sun') || icon.includes('cloud-moon')) return 'text-orange-500 dark:text-orange-400';
    if (icon.includes('cloud') && !icon.includes('rain') && !icon.includes('snow') && !icon.includes('fog')) return 'text-gray-500 dark:text-gray-400';
    if (icon.includes('cloud-rain')) return 'text-blue-600 dark:text-blue-400';
    if (icon.includes('cloud-snow')) return 'text-sky-400 dark:text-sky-300';
    if (icon.includes('cloud-fog')) return 'text-gray-400 dark:text-gray-300';
    if (icon.includes('zap')) return 'text-yellow-500 dark:text-yellow-400';
    
    return 'text-gray-600 dark:text-gray-400'; // Default color
  };
  
  const iconColor = getIconColor(icon);
  
  // Map icon names to components
  switch (icon) {
    case 'sun':
      return <Sun className={`${iconColor} ${className}`} size={size} />;
    case 'moon':
      return <Moon className={`${iconColor} ${className}`} size={size} />;
    case 'cloud-sun':
      return <CloudSun className={`${iconColor} ${className}`} size={size} />;
    case 'cloud-moon':
      return <CloudMoon className={`${iconColor} ${className}`} size={size} />;
    case 'cloud':
      return <Cloud className={`${iconColor} ${className}`} size={size} />;
    case 'cloud-rain':
      return <CloudRain className={`${iconColor} ${className}`} size={size} />;
    case 'cloud-snow':
      return <CloudSnow className={`${iconColor} ${className}`} size={size} />;
    case 'cloud-fog':
      return <CloudFog className={`${iconColor} ${className}`} size={size} />;
    case 'zap':
      return <Zap className={`${iconColor} ${className}`} size={size} />;
    default:
      return <Cloud className={`${getIconColor('cloud')} ${className}`} size={size} />;
  }
}
