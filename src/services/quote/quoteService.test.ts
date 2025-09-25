import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance,
} from "vitest";
import quotesService from "./quoteService";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("quotesService", () => {
  let mockConsoleLog: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    // Create fresh console.log mock for each test
    mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return formatted quote data on successful API call", async () => {
    const mockApiResponse = {
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      tags: ["inspirational", "work"],
      _id: "12345",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await quotesService.getQuote();

    expect(result).toEqual({
      author: "Steve Jobs",
      text: "The only way to do great work is to love what you do.",
    });

    expect(mockFetch).toHaveBeenCalledWith("https://api.quotable.io/random");
  });

  it("should return null when API response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await quotesService.getQuote();

    expect(result).toBeNull();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "API Error: 404",
      })
    );
  });

  it("should return null when API response is 500", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await quotesService.getQuote();

    expect(result).toBeNull();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "API Error: 500",
      })
    );
  });

  it("should return null when fetch throws a network error", async () => {
    const mockError = new Error("Network error");
    mockFetch.mockRejectedValueOnce(mockError);

    const result = await quotesService.getQuote();

    expect(result).toBeNull();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Network error",
      })
    );
  });

  it("should return null when JSON parsing fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    });

    const result = await quotesService.getQuote();

    expect(result).toBeNull();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid JSON",
      })
    );
  });

  it("should handle quote with missing author", async () => {
    const mockApiResponse = {
      content: "A quote without an author.",
      author: null,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await quotesService.getQuote();

    expect(result).toEqual({
      author: null,
      text: "A quote without an author.",
    });
  });

  it("should handle quote with missing content", async () => {
    const mockApiResponse = {
      content: null,
      author: "Anonymous",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await quotesService.getQuote();

    expect(result).toEqual({
      author: "Anonymous",
      text: null,
    });
  });

  it("should handle empty API response", async () => {
    const mockApiResponse = {};

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await quotesService.getQuote();

    expect(result).toEqual({
      author: undefined,
      text: undefined,
    });
  });

  it("should handle very long quote", async () => {
    const longQuote = "A".repeat(1000);
    const mockApiResponse = {
      content: longQuote,
      author: "Test Author",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await quotesService.getQuote();

    expect(result).toEqual({
      author: "Test Author",
      text: longQuote,
    });
  });

  it("should handle special characters in quote", async () => {
    const mockApiResponse = {
      content: 'Quote with "special" characters & symbols!',
      author: "Tëst Authør",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await quotesService.getQuote();

    expect(result).toEqual({
      author: "Tëst Authør",
      text: 'Quote with "special" characters & symbols!',
    });
  });
});
