export interface LocationSuggestion {
  name: string;
  region?: string;
  country?: string;
  lat: number;
  lon: number;
  display_name: string;
}

interface NominatimAddress {
  state?: string;
  province?: string;
  region?: string;
  county?: string;
  country?: string;
}

interface NominatimSearchResult {
  name: string;
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
}

interface NominatimReverseResult {
  name: string;
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
}

export class LocationService {
  private readonly baseURL = 'https://nominatim.openstreetmap.org';
  private readonly userAgent = 'WeatherApp/1.0';

  /**
   * Search for location suggestions based on query
   * @param query Search query (city name, etc.)
   * @param limit Maximum number of results
   * @returns Array of location suggestions
   */
  async searchLocations(query: string, limit: number = 8): Promise<LocationSuggestion[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: limit.toString(),
        addressdetails: '1',
        'accept-language': 'en'
      });

      const response = await fetch(`${this.baseURL}/search?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Location search failed: ${response.status}`);
      }

      const data = await response.json() as NominatimSearchResult[];
      
      return data.map((item) => ({
        name: item.name || item.display_name.split(',')[0],
        region: this.extractRegion(item.address),
        country: item.address?.country,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        display_name: item.display_name
      }));

    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  /**
   * Get location details from coordinates (reverse geocoding)
   * @param lat Latitude
   * @param lon Longitude
   * @returns Location details
   */
  async getLocationFromCoords(lat: number, lon: number): Promise<LocationSuggestion | null> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
        addressdetails: '1',
        'accept-language': 'en'
      });

      const response = await fetch(`${this.baseURL}/reverse?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }

      const data = await response.json() as NominatimReverseResult;
      
      return {
        name: data.name || data.display_name.split(',')[0],
        region: this.extractRegion(data.address),
        country: data.address?.country,
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
        display_name: data.display_name
      };

    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Extract region/state from address object
   */
  private extractRegion(address: NominatimAddress): string | undefined {
    return address?.state || address?.province || address?.region || address?.county;
  }
}

// Export singleton instance
export const locationService = new LocationService();
