import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePersonalizedGreet } from ".";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";
import greetService from "../../services/greet/greetingService";
import type { DashboardSettingsContextType } from "../../types";

// Mock the dependencies
vi.mock("../../context/DashboardSettingsContext", () => ({
  useDashboardSettings: vi.fn(),
}));

vi.mock("../../services/greet/greetingService", () => ({
  default: {
    getGreeting: vi.fn(),
  },
}));

const mockUseDashboardSettings = vi.mocked(useDashboardSettings);
const mockGetGreeting = vi.mocked(greetService.getGreeting);

describe("usePersonalizedGreet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Functionality", () => {
    it("fetches greeting on mount", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Hello, {{name}}");

      renderHook(() => usePersonalizedGreet());

      expect(mockGetGreeting).toHaveBeenCalledTimes(1);
    });

    it("returns empty string initially", () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Hello, {{name}}");

      const { result } = renderHook(() => usePersonalizedGreet());

      expect(result.current.personalizedGreeting).toBe("");
    });

    it("updates personalizedGreeting after fetching greeting", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Hello, {{name}}");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("Hello");
      });
    });
  });

  describe("With Username", () => {
    it("replaces {{name}} with username when username is provided", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "John",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Hello, {{name}}");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("Hello, John");
      });
    });

    it("handles username with special characters", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "O'Brien",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Welcome, {{name}}!");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("Welcome, O'Brien!");
      });
    });

    it("handles long usernames", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "VeryLongUsernameThatIsQuiteLengthy",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Hi, {{name}}");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe(
          "Hi, VeryLongUsernameThatIsQuiteLengthy"
        );
      });
    });
  });

  describe("Without Username", () => {
    it('removes ", {{name}}" when username is empty', async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Good morning, {{name}}");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("Good morning");
      });
    });

    it('removes ", {{name}}" when username is undefined', async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: undefined,
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Welcome back, {{name}}");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("Welcome back");
      });
    });

    it("handles greeting without placeholder", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Hello there");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("Hello there");
      });
    });
  });

  describe("Different Greeting Formats", () => {
    it("handles greeting with multiple placeholders (only replaces first)", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "David",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue(
        "Hello, {{name}}! Nice to see you, {{name}}"
      );

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe(
          "Hello, David! Nice to see you, {{name}}"
        );
      });
    });

    it("handles greeting with placeholder at the end", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "Emma",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Welcome {{name}}");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("Welcome Emma");
      });
    });

    it("handles greeting with placeholder at the start", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "Frank",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("{{name}}, welcome back");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("Frank, welcome back");
      });
    });
  });

  describe("Error Handling", () => {
    it("handles empty greeting from service", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "Henry",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("");

      const { result } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(result.current.personalizedGreeting).toBe("");
      });
    });
  });

  describe("Service Call Behavior", () => {
    it("only calls getGreeting once on mount", async () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "Ivy",
      } as DashboardSettingsContextType);
      mockGetGreeting.mockResolvedValue("Hello, {{name}}");

      const { rerender } = renderHook(() => usePersonalizedGreet());

      await waitFor(() => {
        expect(mockGetGreeting).toHaveBeenCalledTimes(1);
      });

      // Rerender should not call getGreeting again
      rerender();

      expect(mockGetGreeting).toHaveBeenCalledTimes(1);
    });

    it("does not call getGreeting when username changes", async () => {
      const { rerender } = renderHook(
        ({ username }) => {
          mockUseDashboardSettings.mockReturnValue({
            username,
          } as DashboardSettingsContextType);
          return usePersonalizedGreet();
        },
        { initialProps: { username: "Jack" } }
      );

      mockGetGreeting.mockResolvedValue("Hi, {{name}}");

      await waitFor(() => {
        expect(mockGetGreeting).toHaveBeenCalledTimes(1);
      });

      // Change username
      rerender({ username: "Kate" });

      // Should still only be called once
      expect(mockGetGreeting).toHaveBeenCalledTimes(1);
    });
  });
});
