import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSearch } from ".";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

// Mock the context
vi.mock("../../context/DashboardSettingsContext");
const mockUseDashboardSettings = vi.mocked(useDashboardSettings);

describe("useSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(global, "window", {
      value: { location: { href: "" } },
      writable: true,
    });
  });

  it("should initialize with correct values", () => {
    mockUseDashboardSettings.mockReturnValue({
      isSearchToggled: false,
    } as keyof typeof useDashboardSettings);

    const { result } = renderHook(() => useSearch());

    expect(result.current.query).toBe("");
    expect(result.current.shouldRender).toBe(false);
  });

  it("should update query", () => {
    mockUseDashboardSettings.mockReturnValue({
      isSearchToggled: false,
    } as keyof typeof useDashboardSettings);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("test");
    });

    expect(result.current.query).toBe("test");
  });

  it("should handle form submit with fallback search", async () => {
    mockUseDashboardSettings.mockReturnValue({
      isSearchToggled: false,
    } as keyof typeof useDashboardSettings);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("test search");
    });

    const mockEvent = { preventDefault: vi.fn() };

    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current.handleSubmit(mockEvent as any);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(window.location.href).toBe(
      "https://www.google.com/search?q=test%20search"
    );
  });

  it("should not submit empty query", async () => {
    mockUseDashboardSettings.mockReturnValue({
      isSearchToggled: false,
    } as keyof typeof useDashboardSettings);

    const { result } = renderHook(() => useSearch());

    const mockEvent = { preventDefault: vi.fn() };

    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current.handleSubmit(mockEvent as any);
    });

    expect(window.location.href).toBe("");
  });

  it("should handle animation end when search is toggled off", () => {
    mockUseDashboardSettings.mockReturnValue({
      isSearchToggled: true,
    } as keyof typeof useDashboardSettings);

    const { result, rerender } = renderHook(() => useSearch());

    mockUseDashboardSettings.mockReturnValue({
      isSearchToggled: false,
    } as keyof typeof useDashboardSettings);
    rerender();

    act(() => {
      result.current.handleAnimationEnd();
    });

    expect(result.current.shouldRender).toBe(false);
  });

  it("should use chrome search API when available", async () => {
    mockUseDashboardSettings.mockReturnValue({
      isSearchToggled: false,
    } as keyof typeof useDashboardSettings);

    const mockChrome = {
      search: {
        query: vi.fn().mockResolvedValue(undefined),
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).chrome = mockChrome;

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("test chrome");
    });

    const mockEvent = { preventDefault: vi.fn() };

    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current.handleSubmit(mockEvent as any);
    });

    expect(mockChrome.search.query).toHaveBeenCalledWith({
      text: "test chrome",
      disposition: "CURRENT_TAB",
    });
    expect(window.location.href).toBe(""); // Should not use fallback
  });
});
