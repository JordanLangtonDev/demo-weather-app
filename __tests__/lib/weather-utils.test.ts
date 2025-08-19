import { getWeatherIcon, formatTemperature, formatWindSpeed, formatDate } from '@/lib/weather-utils'

describe('Weather Utils - Core Functions', () => {
  describe('formatTemperature', () => {
    it('should format temperature correctly', () => {
      expect(formatTemperature(22.5)).toBe('23°C')
      expect(formatTemperature(0)).toBe('0°C')
      expect(formatTemperature(-5.7)).toBe('-6°C')
    })

    it('should handle invalid input gracefully', () => {
      expect(formatTemperature(undefined as any)).toBe('NaN°C')
      expect(formatTemperature(null as any)).toBe('0°C')
    })
  })

  describe('getWeatherIcon', () => {
    it('should return correct icons for different weather conditions', () => {
      expect(getWeatherIcon(0, true)).toBe('sun') // Clear day
      expect(getWeatherIcon(0, false)).toBe('moon') // Clear night
      expect(getWeatherIcon(61, true)).toBe('cloud-rain') // Rain
      expect(getWeatherIcon(71, true)).toBe('cloud-snow') // Snow
      expect(getWeatherIcon(95, true)).toBe('zap') // Thunderstorm
    })

    it('should handle unknown weather codes', () => {
      expect(getWeatherIcon(999, true)).toBe('cloud-sun')
      expect(getWeatherIcon(999, false)).toBe('cloud-moon')
    })
  })

  describe('formatWindSpeed', () => {
    it('should format wind speed correctly', () => {
      expect(formatWindSpeed(15.2)).toBe('15.2 m/s')
      expect(formatWindSpeed(0)).toBe('0.0 m/s')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      expect(formatDate('2024-01-15')).toBe('Jan 15')
    })
  })
})