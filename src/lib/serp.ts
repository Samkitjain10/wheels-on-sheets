import { LocationSuggestion } from '@/lib/locations';

const SERP_API_ENDPOINT = 
  (typeof window !== 'undefined' && import.meta.env?.MODE === 'development')
    ? 'http://localhost:3001/api/search-locations'
    : '/api/search-locations';
const DEFAULT_LOCALE = 'en';

type RegionBBox = { minLat: number; maxLat: number; minLng: number; maxLng: number };

export class SerpService {
  static async searchLocations(
    query: string,
    country?: string,
    options?: { regionName?: string; bbox?: RegionBBox; nearCenter?: { lat: number; lng: number } }
  ): Promise<LocationSuggestion[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      // Avoid duplicating region name if it's already present
      let qParam = query.trim();
      if (options?.regionName && !qParam.toLowerCase().includes(options.regionName.toLowerCase())) {
        qParam = `${qParam} ${options.regionName}`.trim();
      }

      const params = new URLSearchParams({
        q: qParam,
        hl: DEFAULT_LOCALE,
      });

      if (country) {
        // gl expects a 2-letter country code like "IN"
        params.set('country', country);
      }

      // If a near-center is provided, bias the search around those coordinates
      if (options?.nearCenter) {
        const { lat, lng } = options.nearCenter;
        params.set('nearCenter', JSON.stringify({ lat, lng }));
      }

      const response = await fetch(`${SERP_API_ENDPOINT}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`SerpAPI error: HTTP ${response.status}`);
      }

      const data = await response.json();

      let suggestions: LocationSuggestion[] = [];

      // Prefer local_results when available
      if (Array.isArray(data.local_results) && data.local_results.length > 0) {
        for (const result of data.local_results) {
          const id: string = result.place_id || result.data_id || `${result.position || ''}-${result.title}`;
          const title: string = result.title || result.name || '';
          const address: string = result.address || result.full_address || result.description || '';
          const coords = result.gps_coordinates;

          suggestions.push({
            id,
            text: title,
            place_name: `${title}, ${address}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
            coordinates: coords ? [coords.longitude, coords.latitude] : undefined,
            address: address || undefined,
            source: 'serpapi',
          });
        }
      }

      // Fallback: map place_results if present (single place)
      if (suggestions.length === 0 && data.place_results) {
        const pr = data.place_results;
        const id: string = pr.place_id || pr.cid || pr.title || pr.name || query;
        const title: string = pr.title || pr.name || query;
        const address: string = pr.address || pr.formatted_address || '';
        const coords = pr.gps_coordinates;

        suggestions.push({
          id,
          text: title,
          place_name: `${title}, ${address}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
          coordinates: coords ? [coords.longitude, coords.latitude] : undefined,
          address: address || undefined,
          source: 'serpapi',
        });
      }

      // If a region filter is provided, keep results within that region
      if (options?.regionName || options?.bbox) {
        const bbox: RegionBBox | undefined = options?.bbox || {
          // Approximate Rajasthan bounding box
          minLat: 23.0,
          maxLat: 30.5,
          minLng: 69.0,
          maxLng: 78.9,
        };

        const isInBbox = (coords?: [number, number]) => {
          if (!coords || !bbox) return false;
          const [lng, lat] = coords;
          return lat >= bbox.minLat && lat <= bbox.maxLat && lng >= bbox.minLng && lng <= bbox.maxLng;
        };

        suggestions = suggestions.filter((s) => {
          const matchesName = options?.regionName
            ? (s.place_name?.toLowerCase().includes(options.regionName.toLowerCase()) ||
               s.text?.toLowerCase().includes(options.regionName.toLowerCase()))
            : false;
          return matchesName || isInBbox(s.coordinates);
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Error searching locations via SerpAPI:', error);
      return [];
    }
  }
}


