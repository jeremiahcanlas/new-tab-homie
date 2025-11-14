import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import coordinatesService from "./coordinatesService";

// Mock console methods
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

describe("coordinatesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(global, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    // Mock navigator.geolocation
    const mockGetCurrentPosition = vi.fn();
    Object.defineProperty(global, "navigator", {
      value: {
        geolocation: {
          getCurrentPosition: mockGetCurrentPosition,
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null when geolocation is not supported", async () => {
    // Remove geolocation support
    Object.defineProperty(global, "navigator", {
      value: {},
      writable: true,
    });

    const result = await coordinatesService.getCoords();

    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalledWith("Geolocation not supported");
  });

  it("should return coordinates on successful geolocation", async () => {
    const mockPosition = {
      coords: {
        latitude: 43.653226,
        longitude: -79.383184,
      },
    };

    mockLocalStorage.getItem.mockReturnValue(null);

    // Mock successful geolocation
    const mockGetCurrentPosition = navigator.geolocation
      .getCurrentPosition as ReturnType<typeof vi.fn>;
    mockGetCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const result = await coordinatesService.getCoords();

    expect(result).toEqual({
      lat: 43.65323,
      lon: -79.38318,
    });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "user_coords",
      JSON.stringify({ lat: 43.65323, lon: -79.38318 })
    );
  });

  it("should return null on geolocation error", async () => {
    const mockError = new Error("Permission denied");

    // Mock geolocation error
    const mockGetCurrentPosition = navigator.geolocation
      .getCurrentPosition as ReturnType<typeof vi.fn>;
    mockGetCurrentPosition.mockImplementation((_success, error) => {
      error(mockError);
    });

    const result = await coordinatesService.getCoords();

    expect(result).toBeNull();
  });

  it("should not update localStorage when coordinates haven't changed", async () => {
    const mockPosition = {
      coords: {
        latitude: 43.653226,
        longitude: -79.383184,
      },
    };

    const cachedCoords = { lat: 43.65323, lon: -79.38318 };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cachedCoords));

    const mockGetCurrentPosition = navigator.geolocation
      .getCurrentPosition as ReturnType<typeof vi.fn>;
    mockGetCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const result = await coordinatesService.getCoords();

    expect(result).toEqual(cachedCoords);
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    expect(mockConsoleLog).not.toHaveBeenCalledWith(
      "Coords changed, updating..."
    );
  });

  //   it("should update localStorage when coordinates have changed", async () => {
  //     const mockPosition = {
  //       coords: {
  //         latitude: 40.712776,
  //         longitude: -74.005974,
  //       },
  //     };

  //     const cachedCoords = { lat: 43.65323, lon: -79.38318 };
  //     mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cachedCoords));

  //     const mockGetCurrentPosition = navigator.geolocation
  //       .getCurrentPosition as ReturnType<typeof vi.fn>;

  //     mockGetCurrentPosition.mockImplementation((success) => {
  //       success(mockPosition);
  //     });

  //     const result = await coordinatesService.getCoords();

  //     const expectedCoords = { lat: 40.71278, lon: -74.00597 };

  //     expect(result).toEqual(expectedCoords);
  //     expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
  //       "user_coords",
  //       JSON.stringify(expectedCoords)
  //     );
  //     expect(mockConsoleLog).toHaveBeenCalledWith("Coords changed, updating...");
  //   });

  it("should round coordinates to 5 decimal places", async () => {
    const mockPosition = {
      coords: {
        latitude: 43.6532261234567,
        longitude: -79.3831841234567,
      },
    };

    mockLocalStorage.getItem.mockReturnValue(null);

    const mockGetCurrentPosition = navigator.geolocation
      .getCurrentPosition as ReturnType<typeof vi.fn>;
    mockGetCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const result = await coordinatesService.getCoords();

    expect(result).toEqual({
      lat: 43.65323,
      lon: -79.38318,
    });
  });

  it("should call getCurrentPosition with correct options", async () => {
    const mockPosition = {
      coords: { latitude: 43.653226, longitude: -79.383184 },
    };

    mockLocalStorage.getItem.mockReturnValue(null);

    const mockGetCurrentPosition = navigator.geolocation
      .getCurrentPosition as ReturnType<typeof vi.fn>;
    mockGetCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    await coordinatesService.getCoords();

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  });
});
