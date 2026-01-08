import type LocationProvider from "./LocationProvider";
import type { LocationData } from "../../types";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_PREFIX = "location_cache_";
const MIN_REQUEST_INTERVAL = 1000; // 1 second in milliseconds (rate limit requirement)

let lastRequestTime = 0;

interface CachedLocationData {
  data: LocationData;
  timestamp: number;
}

const getCacheKey = (lat: number, lon: number): string => {
  const roundedLat = parseFloat(lat.toFixed(4));
  const roundedLon = parseFloat(lon.toFixed(4));
  return `${CACHE_PREFIX}${roundedLat}_${roundedLon}`;
};

const getCachedLocation = (cacheKey: string): LocationData | null => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, timestamp }: CachedLocationData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < CACHE_TTL) {
      return data;
    }

    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error("Error reading location cache:", error);
    return null;
  }
};

const setCachedLocation = (cacheKey: string, data: LocationData): void => {
  try {
    const cached: CachedLocationData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (error) {
    console.error("Error setting location cache:", error);
  }
};

const locationService: LocationProvider = {
  async getLocation(geolocation) {
    const isLocationDisabled = !geolocation;

    if (!geolocation) {
      geolocation = {
        lat: 43.65107,
        lon: -79.347015,
      };
    }

    const { lat, lon } = geolocation;

    const cacheKey = getCacheKey(lat, lon);
    const cachedData = getCachedLocation(cacheKey);
    if (cachedData) {
      return {
        ...cachedData,
        locationDisabled: isLocationDisabled,
      };
    }

    // Rate limiting: ensure at least 1 second between API requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise((resolve) =>
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    lastRequestTime = Date.now();

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=jsonv2`,

        {
          headers: {
            "User-Agent": "homie-app/0.12.1 (contact: jjmcanlas@gmail.com)",
          },
        }
      );
      if (!res.ok) return null;

      let data = await res.json();

      const { name, address } = data;

      data = {
        city: name,
        stateProvince: address.state,
        locationDisabled: isLocationDisabled,
      };

      const dataToCache = {
        city: data.city,
        stateProvince: data.stateProvince,
        locationDisabled: false,
      };
      setCachedLocation(cacheKey, dataToCache);

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default locationService;
