import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useWeather } from ".";
import coordinatesService from "../../services/coordinates/coordinatesService";
import weatherService from "../../services/weather/weatherService";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

// Mock fetch globally
global.fetch = vi.fn();

vi.mock("../../services/coordinates/coordinatesService");
vi.mock("../../services/weather/weatherService");
vi.mock("../../context/DashboardSettingsContext");

const mockCoordinatesService = vi.mocked(coordinatesService);
const mockWeatherService = vi.mocked(weatherService);
const mockUseDashboardSettings = vi.mocked(useDashboardSettings);

describe("useWeather", () => {
  const mockCoords = { lat: 43.65107, lon: -79.347015 };
  const mockWeatherData = {
    temperature: 22,
    condition: "sunny",
    humidity: 65,
  };

  const mockLocalStorage = {
    isCelsius: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mockUseDashboardSettings.mockReturnValue(mockLocalStorage);
    mockCoordinatesService.getCoords.mockResolvedValue(mockCoords);
    mockWeatherService.getCurrentWeather.mockResolvedValue(mockWeatherData);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches weather data successfully", async () => {
    const { result } = renderHook(() => useWeather());

    // Initial loading state
    expect(result.current.loading).toBe(true);
    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify final state
    expect(result.current.weather).toEqual(mockWeatherData);
    expect(result.current.error).toBeNull();

    // Verify services were called correctly
    expect(mockCoordinatesService.getCoords).toHaveBeenCalledTimes(1);
    expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith(
      mockCoords,
      true
    );
  });

  it("handles coordinates service failure", async () => {
    mockCoordinatesService.getCoords.mockResolvedValue(null);

    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe("Could not get coordinates");
    expect(mockWeatherService.getCurrentWeather).not.toHaveBeenCalled();
  });

  it("handles weather service failure", async () => {
    mockWeatherService.getCurrentWeather.mockRejectedValue(
      new Error("Weather API failed")
    );
    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe("Weather API failed");
  });

  it("handles weather service failure if no error returned", async () => {
    mockWeatherService.getCurrentWeather.mockRejectedValue();
    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe("Unknown error");
  });
});
