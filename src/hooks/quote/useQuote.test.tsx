import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useQuote } from ".";

// Mock the quotes data
vi.mock("../../data/quotes.json", () => ({
  default: [
    { text: "First quote", author: "Author One" },
    { text: "Second quote", author: "Author Two" },
    { text: "Third quote", author: "Author Three" },
  ],
}));

describe("useQuote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("returns loading true and null quote initially", () => {
      const { result } = renderHook(() => useQuote());

      expect(result.current.loading).toBe(true);
      expect(result.current.quote).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe("Fetching Quote", () => {
    it("fetches and returns a quote after loading", async () => {
      const { result } = renderHook(() => useQuote());

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 1000 }
      );

      expect(result.current.quote).not.toBeNull();
      expect(result.current.quote).toHaveProperty("text");
      expect(result.current.quote).toHaveProperty("author");
      expect(result.current.error).toBeNull();
    });

    it("returns a valid quote from the quotes array", async () => {
      const { result } = renderHook(() => useQuote());

      await waitFor(
        () => {
          expect(result.current.quote).not.toBeNull();
        },
        { timeout: 1000 }
      );

      const quote = result.current.quote!;
      expect(typeof quote.text).toBe("string");
      expect(typeof quote.author).toBe("string");
      expect(quote.text.length).toBeGreaterThan(0);
      expect(quote.author.length).toBeGreaterThan(0);
    });
  });

  describe("Single Fetch", () => {
    it("only fetches once on mount", async () => {
      const { result, rerender } = renderHook(() => useQuote());

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 1000 }
      );

      const firstQuote = result.current.quote;

      // Rerender should not trigger another fetch
      rerender();

      expect(result.current.quote).toBe(firstQuote);
      expect(result.current.loading).toBe(false);
    });
  });

  describe("Return Value", () => {
    it("returns correct structure with quote, loading, and error", async () => {
      const { result } = renderHook(() => useQuote());

      expect(result.current).toHaveProperty("quote");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("error");

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 1000 }
      );

      expect(result.current).toMatchObject({
        quote: expect.any(Object),
        loading: false,
        error: null,
      });
    });
  });
});
