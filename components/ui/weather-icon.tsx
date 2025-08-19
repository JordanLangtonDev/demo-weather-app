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
  // Get color and animation classes based on weather icon type
  const getIconStyles = (iconName: string) => {
    const icon = iconName.toLowerCase();
    
    if (icon.includes('sun')) {
      return {
        color: 'text-yellow-500 dark:text-yellow-400',
        animation: 'animate-sun-pulse'
      };
    }
    if (icon.includes('moon')) {
      return {
        color: 'text-indigo-400 dark:text-indigo-300',
        animation: 'animate-moon-glow'
      };
    }
    if (icon.includes('cloud-sun') || icon.includes('cloud-moon')) {
      return {
        color: 'text-orange-500 dark:text-orange-400',
        animation: 'animate-cloud-float'
      };
    }
    if (icon.includes('cloud') && !icon.includes('rain') && !icon.includes('snow') && !icon.includes('fog')) {
      return {
        color: 'text-gray-500 dark:text-gray-400',
        animation: 'animate-cloud-float'
      };
    }
    if (icon.includes('cloud-rain')) {
      return {
        color: 'text-blue-600 dark:text-blue-400',
        animation: 'animate-rain-fall'
      };
    }
    if (icon.includes('cloud-snow')) {
      return {
        color: 'text-sky-400 dark:text-sky-300',
        animation: 'animate-snow-fall'
      };
    }
    if (icon.includes('cloud-fog')) {
      return {
        color: 'text-gray-400 dark:text-gray-300',
        animation: 'animate-fog-drift'
      };
    }
    if (icon.includes('zap')) {
      return {
        color: 'text-yellow-500 dark:text-yellow-400',
        animation: 'animate-lightning-flash'
      };
    }
    
    return {
      color: 'text-gray-600 dark:text-gray-400',
      animation: ''
    };
  };
  
  const iconStyles = getIconStyles(icon);
  
  // Map icon names to components with animations
  switch (icon) {
    case 'sun':
      return <Sun className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    case 'moon':
      return <Moon className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    case 'cloud-sun':
      return <CloudSun className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    case 'cloud-moon':
      return <CloudMoon className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    case 'cloud':
      return <Cloud className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    case 'cloud-rain':
      return <CloudRain className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    case 'cloud-snow':
      return <CloudSnow className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    case 'cloud-fog':
      return <CloudFog className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    case 'zap':
      return <Zap className={`${iconStyles.color} ${iconStyles.animation} ${className}`} size={size} />;
    default:
      return <Cloud className={`${getIconStyles('cloud').color} ${getIconStyles('cloud').animation} ${className}`} size={size} />;
  }
}
