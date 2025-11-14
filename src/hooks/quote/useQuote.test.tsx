import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useQuote } from ".";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";
import type { DashboardSettingsContextType } from "../../types";

// Mock the dependencies
vi.mock("../../context/DashboardSettingsContext", () => ({
  useDashboardSettings: vi.fn(),
}));

vi.mock("../../data/quotes.json", () => ({
  default: [
    { text: "First quote", author: "Author One" },
    { text: "Second quote", author: "Author Two" },
    { text: "Third quote", author: "Author Three" },
  ],
}));

// type DashboardSettingsContextType = {
//   isQuoteToggled: boolean;
//   unit?: string;
//   setUnit?: (unit: string) => void;
//   username?: string;
//   setUsername?: (username: string) => void;
//   clockFormat?: string;
//   setClockFormat?: (format: string) => void;
//   darkToggled?: boolean;
//   setDarkToggled?: (toggled: boolean) => void;
//   isSearchToggled?: boolean;
//   toggleSearch?: (toggled: boolean) => void;
// };

const mockUseDashboardSettings = vi.mocked(useDashboardSettings);

describe("useQuote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("returns initial state with loading true and null quote", () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      expect(result.current.loading).toBe(true);
      expect(result.current.quote).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("sets shouldRender based on isQuoteToggled", () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      expect(result.current.shouldRender).toBe(true);
    });

    it("returns isQuoteToggled from context", () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: false,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      expect(result.current.isQuoteToggled).toBe(false);
    });
  });

  describe("Fetching Quote When Toggled On", () => {
    it("fetches quote when isQuoteToggled is true", async () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

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
    });

    it("sets shouldRender to true when fetching", async () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      expect(result.current.shouldRender).toBe(true);

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 1000 }
      );

      expect(result.current.shouldRender).toBe(true);
    });
  });

  describe("Not Fetching When Toggled Off", () => {
    it("does not fetch quote when isQuoteToggled is false", async () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: false,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      // Wait a bit to ensure no fetch happens
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(result.current.quote).toBeNull();
      expect(result.current.loading).toBe(true);
    });

    it("sets shouldRender to false initially when toggled off", () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: false,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      expect(result.current.shouldRender).toBe(false);
    });
  });

  describe("Toggle Changes", () => {
    it("fetches quote when isQuoteToggled changes from false to true", async () => {
      const { result, rerender } = renderHook(
        ({ isQuoteToggled }) => {
          mockUseDashboardSettings.mockReturnValue({
            isQuoteToggled,
          } as DashboardSettingsContextType);
          return useQuote();
        },
        { initialProps: { isQuoteToggled: false } }
      );

      expect(result.current.quote).toBeNull();

      // Change toggle to true
      rerender({ isQuoteToggled: true });

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 1000 }
      );

      expect(result.current.quote).not.toBeNull();
    });

    it("sets shouldRender to true when toggle changes to true", async () => {
      const { result, rerender } = renderHook(
        ({ isQuoteToggled }) => {
          mockUseDashboardSettings.mockReturnValue({
            isQuoteToggled,
          } as DashboardSettingsContextType);
          return useQuote();
        },
        { initialProps: { isQuoteToggled: false } }
      );

      expect(result.current.shouldRender).toBe(false);

      // Change toggle to true
      rerender({ isQuoteToggled: true });

      await waitFor(() => {
        expect(result.current.shouldRender).toBe(true);
      });
    });
  });

  describe("handleAnimationEnd", () => {
    it("sets shouldRender to false when isQuoteToggled is false", () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: false,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      result.current.handleAnimationEnd();

      expect(result.current.shouldRender).toBe(false);
    });

    it("does not change shouldRender when isQuoteToggled is true", async () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 1000 }
      );

      const initialShouldRender = result.current.shouldRender;

      result.current.handleAnimationEnd();

      expect(result.current.shouldRender).toBe(initialShouldRender);
    });
  });

  describe("Single Fetch Behavior", () => {
    it("only fetches once even with multiple rerenders", async () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

      const { result, rerender } = renderHook(() => useQuote());

      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 1000 }
      );

      const firstQuote = result.current.quote;

      // Multiple rerenders
      rerender();
      rerender();
      rerender();

      expect(result.current.quote).toBe(firstQuote);
    });
  });

  describe("Return Values", () => {
    it("returns all expected properties", () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      expect(result.current).toHaveProperty("quote");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("isQuoteToggled");
      expect(result.current).toHaveProperty("shouldRender");
      expect(result.current).toHaveProperty("handleAnimationEnd");
    });

    it("handleAnimationEnd is a function", () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

      const { result } = renderHook(() => useQuote());

      expect(typeof result.current.handleAnimationEnd).toBe("function");
    });
  });

  describe("Quote Data", () => {
    it("returns valid quote with text and author", async () => {
      mockUseDashboardSettings.mockReturnValue({
        isQuoteToggled: true,
      } as DashboardSettingsContextType);

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
});
