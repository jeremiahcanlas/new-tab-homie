import { useCallback, useEffect, useRef, useState } from "react";
import LocationService from "../../services/location/locationService";
import CoordinatesService from "../../services/coordinates/coordinatesService";
import type { LocationData } from "../../types";

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  const fetchLocation = useCallback(async () => {
    try {
      hasFetched.current = false;

      setLoading(true);
      setError(null);

      const coords = await CoordinatesService.getCoords();
      if (!coords) {
        throw new Error("Could not get coordinates");
      }

      const weatherData = await LocationService.getLocation(coords);
      setLocation(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchLocation();
  }, [fetchLocation]);

  return { location, loading, error };
};
