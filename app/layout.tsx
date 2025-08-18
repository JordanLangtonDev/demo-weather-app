import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WeatherProvider } from '@/contexts/WeatherContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'A modern weather application with real-time data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <WeatherProvider>
            {children}
          </WeatherProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
