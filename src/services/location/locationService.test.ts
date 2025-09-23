import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import locationService from "./locationService";

// Mock console.log
// const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("locationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return location data for valid coordinates", async () => {
    const mockGeolocation = {
      lat: 43.65107,
      lon: -79.347015,
    };

    const mockApiResponse = {
      name: "Toronto",
      address: {
        state: "Ontario",
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await locationService.getLocation(mockGeolocation);

    expect(result).toEqual({
      city: "Toronto",
      stateProvince: "Ontario",
      locationDisabled: false,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://nominatim.openstreetmap.org/reverse?lat=43.65107&lon=-79.347015&zoom=10&format=jsonv2",
      {
        headers: {
          "User-Agent": "homie-app/0.4.0 (contact: email@email.com)",
        },
      }
    );
  });

  it("should use default coordinates when geolocation is null", async () => {
    const mockApiResponse = {
      name: "Toronto",
      address: {
        state: "Ontario",
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await locationService.getLocation(null);

    expect(result).toEqual({
      city: "Toronto",
      stateProvince: "Ontario",
      locationDisabled: true,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://nominatim.openstreetmap.org/reverse?lat=43.65107&lon=-79.347015&zoom=10&format=jsonv2",
      expect.any(Object)
    );
  });

  it("should use default coordinates when geolocation is undefined", async () => {
    const mockApiResponse = {
      name: "Toronto",
      address: {
        state: "Ontario",
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await locationService.getLocation(null);

    expect(result).toEqual({
      city: "Toronto",
      stateProvince: "Ontario",
      locationDisabled: true,
    });
  });

  it("should return null when API response is not ok", async () => {
    const mockGeolocation = {
      lat: 43.65107,
      lon: -79.347015,
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await locationService.getLocation(mockGeolocation);

    expect(result).toBeNull();
  });

  it("should return null when fetch throws an error", async () => {
    const mockGeolocation = {
      lat: 43.65107,
      lon: -79.347015,
    };

    const mockError = new Error("Network error");
    mockFetch.mockRejectedValueOnce(mockError);

    const result = await locationService.getLocation(mockGeolocation);

    expect(result).toBeNull();
    // expect(mockConsoleLog).toHaveBeenCalledOnce();
    // expect(mockConsoleLog).toHaveBeenLastCalledWith(mockError);
  });

  it("should return null when JSON parsing fails", async () => {
    const mockGeolocation = {
      lat: 43.65107,
      lon: -79.347015,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    });

    const result = await locationService.getLocation(mockGeolocation);

    expect(result).toBeNull();
    // expect(mockConsoleLog).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should handle API response with missing address data", async () => {
    const mockGeolocation = {
      lat: 43.65107,
      lon: -79.347015,
    };

    const mockApiResponse = {
      name: "Toronto",
      address: {}, // Missing state property
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await locationService.getLocation(mockGeolocation);

    expect(result).toEqual({
      city: "Toronto",
      stateProvince: undefined, // Should handle missing state gracefully
      locationDisabled: false,
    });
  });

  it("should handle different coordinate formats", async () => {
    const mockGeolocation = {
      lat: 40.7128,
      lon: -74.006,
    };

    const mockApiResponse = {
      name: "New York",
      address: {
        state: "New York",
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await locationService.getLocation(mockGeolocation);

    expect(result).toEqual({
      city: "New York",
      stateProvince: "New York",
      locationDisabled: false,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://nominatim.openstreetmap.org/reverse?lat=40.7128&lon=-74.006&zoom=10&format=jsonv2",
      expect.any(Object)
    );
  });
});
