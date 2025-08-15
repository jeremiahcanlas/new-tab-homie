import { useCallback, useEffect, useRef, useState } from "react";
import WeatherService from "../services/weather/weatherService";
import CoordinatesService from "../services/coordinates/coordinatesService";
import type { WeatherData } from "../types";

export const useWeather = (unit: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const coords = await CoordinatesService.getCoords();
      if (!coords) {
        throw new Error("Could not get coordinates");
      }

      const weatherData = await WeatherService.getWeather(coords, unit);
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchWeather();
  }, [fetchWeather]);

  return { weather, loading, error };
};
