import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { MockedFunction } from "vitest";
import {
  DashboardSettingsProvider,
  useDashboardSettings,
} from "./DashboardSettingsContext";

describe("DashboardSettingsContext", () => {
  beforeEach(() => {
    const mockGetItem = vi.fn(() => null);
    const mockSetItem = vi.fn(() => {});

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
      writable: true,
    });

    // Mock event listeners
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();

    // Mock document.documentElement.classList.toggle
    const mockToggle = vi.fn();
    Object.defineProperty(document.documentElement.classList, "toggle", {
      value: mockToggle,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Simple test component
  const TestComponent = () => {
    const context = useDashboardSettings();

    return (
      <div>
        <div data-testid="unit">{context.unit}</div>
        <div data-testid="username">{context.username}</div>
        <div data-testid="clock">{context.clockFormat}</div>
        <div data-testid="dark">{context.darkToggled.toString()}</div>
        <div data-testid="search">{context.isSearchToggled.toString()}</div>
        <button
          data-testid="set-fahrenheit"
          onClick={() => context.setUnit("fahrenheit")}
        >
          Set Fahrenheit
        </button>
        <button
          data-testid="toggle-dark"
          onClick={() => context.setDarkToggled(!context.darkToggled)}
        >
          Toggle Dark
        </button>
      </div>
    );
  };

  it("should initialize with default values", () => {
    const mockGetItem = window.localStorage.getItem as MockedFunction<
      typeof localStorage.getItem
    >;
    mockGetItem.mockReturnValue(null);

    render(
      <DashboardSettingsProvider>
        <TestComponent />
      </DashboardSettingsProvider>
    );

    expect(screen.getByTestId("unit")).toHaveTextContent("celsius");
    expect(screen.getByTestId("username")).toHaveTextContent("");
    expect(screen.getByTestId("dark")).toHaveTextContent("false");
  });

  it("should update unit when button is clicked", () => {
    const mockGetItem = window.localStorage.getItem as MockedFunction<
      typeof localStorage.getItem
    >;
    const mockSetItem = window.localStorage.setItem as MockedFunction<
      typeof localStorage.setItem
    >;

    mockGetItem.mockReturnValue(null);

    render(
      <DashboardSettingsProvider>
        <TestComponent />
      </DashboardSettingsProvider>
    );

    fireEvent.click(screen.getByTestId("set-fahrenheit"));

    expect(screen.getByTestId("unit")).toHaveTextContent("fahrenheit");
    expect(mockSetItem).toHaveBeenCalledWith("temp_unit", "fahrenheit");
  });

  it("should toggle dark mode", () => {
    const mockGetItem = window.localStorage.getItem as MockedFunction<
      typeof localStorage.getItem
    >;
    mockGetItem.mockReturnValue(null);

    render(
      <DashboardSettingsProvider>
        <TestComponent />
      </DashboardSettingsProvider>
    );

    fireEvent.click(screen.getByTestId("toggle-dark"));

    expect(screen.getByTestId("dark")).toHaveTextContent("true");
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith(
      "dark",
      true
    );
  });
});
