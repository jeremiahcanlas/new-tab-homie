import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useClock } from ".";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";
import type { ReactNode } from "react";

// Mock the context
vi.mock("../../context/DashboardSettingsContext");

const mockUseDashboardSettings = vi.mocked(useDashboardSettings);

// Mock wrapper component for testing
const createWrapper = (twelveHourMode: boolean) => {
  return ({ children }: { children: ReactNode }) => {
    // Mock the context value

    mockUseDashboardSettings.mockReturnValue({
      twelveHourMode,
    } as keyof typeof useDashboardSettings);
    return <>{children}</>;
  };
};

describe("useClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set a fixed date for consistent testing
    vi.setSystemTime(new Date("2024-01-15 14:30:45"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("12-hour format", () => {
    it("should return correct date and time in 12-hour format", () => {
      const wrapper = createWrapper(true);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentDate).toBe("Monday, January 15");
      expect(result.current.dateTime.currentTime).toBe("02:30");
    });

    it("should format AM times correctly", () => {
      vi.setSystemTime(new Date("2024-01-15 09:15:30"));
      const wrapper = createWrapper(true);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentTime).toBe("09:15");
    });

    it("should format PM times correctly", () => {
      vi.setSystemTime(new Date("2024-01-15 15:45:30"));
      const wrapper = createWrapper(true);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentTime).toBe("03:45");
    });

    it("should format midnight correctly", () => {
      vi.setSystemTime(new Date("2024-01-15 00:00:00"));
      const wrapper = createWrapper(true);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentTime).toBe("12:00");
    });

    it("should format noon correctly", () => {
      vi.setSystemTime(new Date("2024-01-15 12:00:00"));
      const wrapper = createWrapper(true);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentTime).toBe("12:00");
    });
  });

  describe("24-hour format", () => {
    it("should return correct date and time in 24-hour format", () => {
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentDate).toBe("Monday, January 15");
      expect(result.current.dateTime.currentTime).toBe("14:30");
    });

    it("should format morning times correctly", () => {
      vi.setSystemTime(new Date("2024-01-15 09:15:30"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentTime).toBe("09:15");
    });

    it("should format evening times correctly", () => {
      vi.setSystemTime(new Date("2024-01-15 21:45:30"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentTime).toBe("21:45");
    });

    it("should format midnight correctly", () => {
      vi.setSystemTime(new Date("2024-01-15 00:00:00"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      // Note: Some locales/environments may return '24:00' instead of '00:00' for midnight
      // The actual behavior depends on the browser/Node.js locale implementation
      expect(["00:00", "24:00"]).toContain(result.current.dateTime.currentTime);
    });
  });

  describe("interval functionality", () => {
    it("should update time every second", () => {
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      const initialTime = result.current.dateTime.currentTime;
      expect(initialTime).toBe("14:30");

      // Advance time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.dateTime.currentTime).toBe("14:30");

      // Advance time by 30 more seconds to see minute change
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      expect(result.current.dateTime.currentTime).toBe("14:31");
    });

    it("should clear interval on unmount", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      const wrapper = createWrapper(false);
      const { unmount } = renderHook(() => useClock(), { wrapper });

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    it("should restart interval when twelveHourMode changes", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      // Start with 12-hour format
      mockUseDashboardSettings.mockReturnValue({
        twelveHourMode: true,
      } as keyof typeof useDashboardSettings);
      const { rerender } = renderHook(() => useClock());

      const initialCallCount = setIntervalSpy.mock.calls.length;

      // Change to 24-hour format
      mockUseDashboardSettings.mockReturnValue({
        twelveHourMode: false,
      } as keyof typeof useDashboardSettings);
      rerender();

      // Should have cleared the old interval and created a new one
      expect(clearIntervalSpy).toHaveBeenCalled();
      expect(setIntervalSpy.mock.calls.length).toBeGreaterThan(
        initialCallCount
      );

      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
    });
  });

  describe("date formatting", () => {
    it("should format different weekdays correctly", () => {
      // Test Tuesday
      vi.setSystemTime(new Date("2024-01-16 14:30:45"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentDate).toBe("Tuesday, January 16");
    });

    it("should format different months correctly", () => {
      // Test December
      vi.setSystemTime(new Date("2024-12-25 14:30:45"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentDate).toBe(
        "Wednesday, December 25"
      );
    });

    it("should format single digit days correctly", () => {
      // Test single digit day
      vi.setSystemTime(new Date("2024-01-05 14:30:45"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentDate).toBe("Friday, January 5");
    });
  });

  describe("edge cases", () => {
    it("should handle seconds rollover correctly", () => {
      // Set time to 59 seconds
      vi.setSystemTime(new Date("2024-01-15 14:30:59"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentTime).toBe("14:30");

      // Advance by 2 seconds to cross minute boundary
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.dateTime.currentTime).toBe("14:31");
    });

    it("should handle hour rollover correctly", () => {
      // Set time to 59 minutes
      vi.setSystemTime(new Date("2024-01-15 14:59:30"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentTime).toBe("14:59");

      // Advance by 1 minute to cross hour boundary
      act(() => {
        vi.advanceTimersByTime(60000);
      });

      expect(result.current.dateTime.currentTime).toBe("15:00");
    });

    it("should handle day rollover correctly", () => {
      // Set time to 23:59
      vi.setSystemTime(new Date("2024-01-15 23:59:30"));
      const wrapper = createWrapper(false);
      const { result } = renderHook(() => useClock(), { wrapper });

      expect(result.current.dateTime.currentDate).toBe("Monday, January 15");
      expect(result.current.dateTime.currentTime).toBe("23:59");

      // Advance by 1 minute to cross day boundary
      act(() => {
        vi.advanceTimersByTime(60000);
      });

      expect(result.current.dateTime.currentDate).toBe("Tuesday, January 16");
      // Some locales may return '24:00' instead of '00:00' for midnight
      expect(["00:00", "24:00"]).toContain(result.current.dateTime.currentTime);
    });
  });
});
