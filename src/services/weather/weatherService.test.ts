import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { MockInstance } from "vitest";
import weatherService from "./weatherService";

// Mock the weatherType JSON
vi.mock("../../data/weatherType.json", () => ({
  default: {
    "0": "Clear sky",
    "1": "Mainly clear",
    "2": "Partly cloudy",
    "3": "Overcast",
    "61": "Rain: Slight",
    "80": "Rain showers: Slight",
  },
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("weatherService", () => {
  let mockConsoleError: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return weather data for valid coordinates and unit", async () => {
    const mockGeolocation = {
      lat: 43.65107,
      lon: -79.347015,
    };

    const mockApiResponse = {
      current: {
        weather_code: 0,
        apparent_temperature: 22.5,
        temperature_2m: 20.3,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      true
    );

    expect(result).toEqual({
      temperature: 20,
      weatherStatus: "Clear sky",
      feelsLike: 23,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.open-meteo.com/v1/forecast?latitude=43.65107&longitude=-79.347015&temperature_unit=celsius&current=temperature_2m,apparent_temperature,weather_code"
    );
  });

  it("should use default coordinates when geolocation is null", async () => {
    const mockApiResponse = {
      current: {
        weather_code: 1,
        apparent_temperature: 18.7,
        temperature_2m: 16.2,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await weatherService.getCurrentWeather(null, false);

    expect(result).toEqual({
      temperature: 16,
      weatherStatus: "Mainly clear",
      feelsLike: 19,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.open-meteo.com/v1/forecast?latitude=43.65107&longitude=-79.347015&temperature_unit=fahrenheit&current=temperature_2m,apparent_temperature,weather_code"
    );
  });

  it("should use default coordinates when geolocation is undefined", async () => {
    const mockApiResponse = {
      current: {
        weather_code: 2,
        apparent_temperature: 25.1,
        temperature_2m: 24.8,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await weatherService.getCurrentWeather(null, true);

    expect(result).toEqual({
      temperature: 25,
      weatherStatus: "Partly cloudy",
      feelsLike: 25,
    });
  });

  it("should round temperatures correctly", async () => {
    const mockGeolocation = { lat: 40.7128, lon: -74.006 };

    const mockApiResponse = {
      current: {
        weather_code: 3,
        apparent_temperature: 15.4, // Should round to 15
        temperature_2m: 15.6, // Should round to 16
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      true
    );

    expect(result).toEqual({
      temperature: 16,
      weatherStatus: "Overcast",
      feelsLike: 15,
    });
  });

  it("should handle different weather codes", async () => {
    const mockGeolocation = { lat: 40.7128, lon: -74.006 };

    const mockApiResponse = {
      current: {
        weather_code: 61,
        apparent_temperature: 12.0,
        temperature_2m: 10.0,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      true
    );

    expect(result).toEqual({
      temperature: 10,
      weatherStatus: "Rain: Slight",
      feelsLike: 12,
    });
  });

  it("should handle unknown weather codes", async () => {
    const mockGeolocation = { lat: 40.7128, lon: -74.006 };

    const mockApiResponse = {
      current: {
        weather_code: 999, // Unknown weather code
        apparent_temperature: 20.0,
        temperature_2m: 18.0,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      true
    );

    expect(result).toEqual({
      temperature: 18,
      weatherStatus: undefined, // Unknown weather code
      feelsLike: 20,
    });
  });

  it("should return null when API response is not ok", async () => {
    const mockGeolocation = { lat: 40.7128, lon: -74.006 };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      true
    );

    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("should return null when fetch throws a network error", async () => {
    const mockGeolocation = { lat: 40.7128, lon: -74.006 };

    const mockError = new Error("Network error");
    mockFetch.mockRejectedValueOnce(mockError);

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      true
    );

    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("should return null when JSON parsing fails", async () => {
    const mockGeolocation = { lat: 40.7128, lon: -74.006 };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    });

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      true
    );

    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("should handle different temperature units", async () => {
    const mockGeolocation = { lat: 40.7128, lon: -74.006 };

    const mockApiResponse = {
      current: {
        weather_code: 0,
        apparent_temperature: 75.2,
        temperature_2m: 72.5,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      false
    );

    expect(result).toEqual({
      temperature: 73,
      weatherStatus: "Clear sky",
      feelsLike: 75,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("temperature_unit=fahrenheit")
    );
  });

  it("should handle missing weather data properties", async () => {
    const mockGeolocation = { lat: 40.7128, lon: -74.006 };

    const mockApiResponse = {
      current: {
        // Missing some properties
        weather_code: 0,
        // apparent_temperature and temperature_2m missing
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await weatherService.getCurrentWeather(
      mockGeolocation,
      true
    );

    expect(result).toEqual({
      temperature: NaN, // Math.round(undefined) = NaN
      weatherStatus: "Clear sky",
      feelsLike: NaN,
    });
  });
});
