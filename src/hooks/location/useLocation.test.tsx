import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLocation } from ".";
import locationService from "../../services/location/locationService";
import coordinatesService from "../../services/coordinates/coordinatesService";

// Mock the services
vi.mock("../../services/location/locationService");
vi.mock("../../services/coordinates/coordinatesService");

const mockLocationService = vi.mocked(locationService);
const mockCoordinatesService = vi.mocked(coordinatesService);

describe("useLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading true and no data", () => {
    const { result } = renderHook(() => useLocation());

    expect(result.current.location).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fetch location successfully", async () => {
    const mockCoords = { lat: 43.6532, lon: -79.3832 };
    const mockLocation = {
      city: "Toronto",
      stateProvince: "Ontario",
      country: "Canada",
      locationDisabled: false,
    };

    mockCoordinatesService.getCoords.mockResolvedValue(mockCoords);
    mockLocationService.getLocation.mockResolvedValue(mockLocation);

    const { result } = renderHook(() => useLocation());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.location).toEqual(mockLocation);
    expect(result.current.error).toBeNull();
  });

  it("should handle error when coordinates fail", async () => {
    mockCoordinatesService.getCoords.mockResolvedValue(null);

    const { result } = renderHook(() => useLocation());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe("Could not get coordinates");
  });

  it("should handle unknown error types", async () => {
    const mockCoords = { lat: 43.6532, lon: -79.3832 };

    mockCoordinatesService.getCoords.mockResolvedValue(mockCoords);
    // Reject with a non-Error object (like a string or object)
    mockLocationService.getLocation.mockRejectedValue("Some string error");

    const { result } = renderHook(() => useLocation());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe("Unknown error");
  });
});
