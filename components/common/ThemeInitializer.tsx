'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function ThemeInitializer() {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme immediately when component mounts
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // This component doesn't render anything
  return null;
}
