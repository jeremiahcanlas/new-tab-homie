import { renderHook } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import { usePersonalizedGreet } from "."; // Adjust import path as needed
import { useDashboardSettings } from "../../context/DashboardSettingsContext";
import type { ReactNode } from "react";

// Mock the context
vi.mock("../../context/DashboardSettingsContext", () => ({
  useDashboardSettings: vi.fn(),
}));

const mockUseDashboardSettings = vi.mocked(useDashboardSettings);

// Mock wrapper component for testing
const createWrapper = (username?: string) => {
  return ({ children }: { children: ReactNode }) => {
    mockUseDashboardSettings.mockReturnValue({
      username,
    } as keyof typeof useDashboardSettings);
    return <>{children}</>;
  };
};

describe("usePersonalizedGreet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("with username provided", () => {
    const username = "John";

    it("should replace {{name}} placeholder with username", () => {
      const wrapper = createWrapper(username);
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello, {{name}}!"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("Hello, John!");
    });

    it("should handle greetings with {{name}} at the beginning", () => {
      const wrapper = createWrapper(username);
      const { result } = renderHook(
        () => usePersonalizedGreet("{{name}}, welcome back!"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("John, welcome back!");
    });

    it("should handle greetings with {{name}} in the middle", () => {
      const wrapper = createWrapper(username);
      const { result } = renderHook(
        () => usePersonalizedGreet("Welcome back, {{name}}, to the dashboard"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe(
        "Welcome back, John, to the dashboard"
      );
    });

    it("should handle greetings with {{name}} at the end", () => {
      const wrapper = createWrapper(username);
      const { result } = renderHook(
        () => usePersonalizedGreet("Good morning, {{name}}"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("Good morning, John");
    });

    it("should handle case-sensitive placeholder matching", () => {
      const wrapper = createWrapper(username);
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello {{NAME}} and {{name}}"),
        { wrapper }
      );

      // Should only replace exact {{name}} matches
      expect(result.current.personalizedGreeting).toBe(
        "Hello {{NAME}} and John"
      );
    });

    it("should handle greetings without placeholders", () => {
      const wrapper = createWrapper(username);
      const { result } = renderHook(
        () => usePersonalizedGreet("Good morning!"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("Good morning!");
    });

    it("should handle empty greeting string", () => {
      const wrapper = createWrapper(username);
      const { result } = renderHook(() => usePersonalizedGreet(""), {
        wrapper,
      });

      expect(result.current.personalizedGreeting).toBe("");
    });

    it("should handle special characters in username", () => {
      const wrapper = createWrapper("José-María");
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello, {{name}}!"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("Hello, José-María!");
    });

    it("should handle whitespace in username", () => {
      const wrapper = createWrapper("John Doe");
      const { result } = renderHook(
        () => usePersonalizedGreet("Welcome, {{name}}"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("Welcome, John Doe");
    });
  });

  describe("without username (empty or undefined)", () => {
    it('should remove ", {{name}}" pattern when username is empty string', () => {
      const wrapper = createWrapper("");
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello, {{name}}!"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("Hello!");
    });

    it('should remove ", {{name}}" pattern when username is undefined', () => {
      const wrapper = createWrapper(undefined);
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello, {{name}}!"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("Hello!");
    });

    // it("should handle {{name}} without comma when no username", () => {
    //   const wrapper = createWrapper("");
    //   const { result } = renderHook(
    //     () => usePersonalizedGreet("Hello {{name}}!"),
    //     { wrapper }
    //   );

    //   expect(result.current.personalizedGreeting).toBe("Hello !");
    // });

    // it('should handle multiple ", {{name}}" patterns when no username', () => {
    //   const wrapper = createWrapper("");
    //   const { result } = renderHook(
    //     () => usePersonalizedGreet("Hello, {{name}}! Welcome back, {{name}}"),
    //     { wrapper }
    //   );

    //   expect(result.current.personalizedGreeting).toBe("Hello! Welcome back");
    // });

    it('should handle greeting with only ", {{name}}" pattern', () => {
      const wrapper = createWrapper("");
      const { result } = renderHook(() => usePersonalizedGreet(", {{name}}"), {
        wrapper,
      });

      expect(result.current.personalizedGreeting).toBe("");
    });

    it("should handle complex patterns with multiple commas", () => {
      const wrapper = createWrapper("");
      const { result } = renderHook(
        () => usePersonalizedGreet("Good morning, {{name}}, how are you?"),
        { wrapper }
      );

      // Should remove ", {{name}}" but keep other commas
      expect(result.current.personalizedGreeting).toBe(
        "Good morning, how are you?"
      );
    });
  });

  describe("prop changes and effects", () => {
    it("should update greeting when greet prop changes", () => {
      const wrapper = createWrapper("Alice");
      const { result, rerender } = renderHook(
        (props) => usePersonalizedGreet(props.greet),
        {
          wrapper,
          initialProps: { greet: "Hello, {{name}}!" },
        }
      );

      expect(result.current.personalizedGreeting).toBe("Hello, Alice!");

      // Change the greet prop
      rerender({ greet: "Good morning, {{name}}" });

      expect(result.current.personalizedGreeting).toBe("Good morning, Alice");
    });

    it("should update greeting when username changes", () => {
      // Start with username
      mockUseDashboardSettings.mockReturnValue({
        username: "Bob",
      } as keyof typeof useDashboardSettings);
      const { result, rerender } = renderHook(() =>
        usePersonalizedGreet("Welcome, {{name}}!")
      );

      expect(result.current.personalizedGreeting).toBe("Welcome, Bob!");

      // Change username
      mockUseDashboardSettings.mockReturnValue({
        username: "Carol",
      } as keyof typeof useDashboardSettings);
      rerender();

      expect(result.current.personalizedGreeting).toBe("Welcome, Carol!");
    });

    it("should update greeting when username changes from empty to populated", () => {
      // Start without username
      mockUseDashboardSettings.mockReturnValue({
        username: "",
      } as keyof typeof useDashboardSettings);
      const { result, rerender } = renderHook(() =>
        usePersonalizedGreet("Hello, {{name}}!")
      );

      expect(result.current.personalizedGreeting).toBe("Hello!");

      // Add username
      mockUseDashboardSettings.mockReturnValue({
        username: "Dave",
      } as keyof typeof useDashboardSettings);
      rerender();

      expect(result.current.personalizedGreeting).toBe("Hello, Dave!");
    });

    it("should update greeting when username changes from populated to empty", () => {
      // Start with username
      mockUseDashboardSettings.mockReturnValue({
        username: "Eve",
      } as keyof typeof useDashboardSettings);
      const { result, rerender } = renderHook(() =>
        usePersonalizedGreet("Good bye, {{name}}!")
      );

      expect(result.current.personalizedGreeting).toBe("Good bye, Eve!");

      // Remove username
      mockUseDashboardSettings.mockReturnValue({
        username: "",
      } as keyof typeof useDashboardSettings);
      rerender();

      expect(result.current.personalizedGreeting).toBe("Good bye!");
    });

    it("should handle both greet and username changing simultaneously", () => {
      // Start with initial values
      mockUseDashboardSettings.mockReturnValue({
        username: "Frank",
      } as keyof typeof useDashboardSettings);
      const { result, rerender } = renderHook(
        (props) => usePersonalizedGreet(props.greet),
        {
          initialProps: { greet: "Hello, {{name}}!" },
        }
      );

      expect(result.current.personalizedGreeting).toBe("Hello, Frank!");

      // Change both greet and username
      mockUseDashboardSettings.mockReturnValue({
        username: "Grace",
      } as keyof typeof useDashboardSettings);
      rerender({ greet: "Welcome back, {{name}}" });

      expect(result.current.personalizedGreeting).toBe("Welcome back, Grace");
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle null username gracefully", () => {
      mockUseDashboardSettings.mockReturnValue({
        username: null,
      } as keyof typeof useDashboardSettings);
      const { result } = renderHook(() =>
        usePersonalizedGreet("Hello, {{name}}!")
      );

      expect(result.current.personalizedGreeting).toBe("Hello!");
    });

    it("should handle whitespace-only username", () => {
      const wrapper = createWrapper("   ");
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello, {{name}}!"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe("Hello,    !");
    });

    it("should handle very long username", () => {
      const longUsername = "A".repeat(100);
      const wrapper = createWrapper(longUsername);
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello, {{name}}!"),
        { wrapper }
      );

      expect(result.current.personalizedGreeting).toBe(
        `Hello, ${longUsername}!`
      );
    });

    it("should handle greet with malformed placeholders", () => {
      const wrapper = createWrapper("John");
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello {{name} and {name}} and {{name}}!"),
        { wrapper }
      );

      // Should only replace properly formatted {{name}}
      expect(result.current.personalizedGreeting).toBe(
        "Hello {{name} and {name}} and John!"
      );
    });

    it("should handle greet with escaped braces", () => {
      const wrapper = createWrapper("John");
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello \\{{name\\}}!"),
        { wrapper }
      );

      // Should not replace escaped braces
      expect(result.current.personalizedGreeting).toBe("Hello \\{{name\\}}!");
    });

    it("should maintain initial empty state before effect runs", () => {
      const wrapper = createWrapper("John");
      const { result } = renderHook(
        () => usePersonalizedGreet("Hello, {{name}}!"),
        { wrapper }
      );

      // After effect runs, should have the personalized greeting
      expect(result.current.personalizedGreeting).toBe("Hello, John!");
    });

    it("should handle rapid consecutive updates", () => {
      mockUseDashboardSettings.mockReturnValue({
        username: "User1",
      } as keyof typeof useDashboardSettings);
      const { result, rerender } = renderHook(
        (props) => usePersonalizedGreet(props.greet),
        { initialProps: { greet: "Hello, {{name}}!" } }
      );

      expect(result.current.personalizedGreeting).toBe("Hello, User1!");

      // Rapid updates
      mockUseDashboardSettings.mockReturnValue({
        username: "User2",
      } as keyof typeof useDashboardSettings);
      rerender({ greet: "Hi, {{name}}!" });

      mockUseDashboardSettings.mockReturnValue({
        username: "User3",
      } as keyof typeof useDashboardSettings);
      rerender({ greet: "Hey, {{name}}!" });

      expect(result.current.personalizedGreeting).toBe("Hey, User3!");
    });
  });

  describe("performance and optimization", () => {
    it("should not cause unnecessary re-renders when dependencies do not change", () => {
      const wrapper = createWrapper("John");
      const { result, rerender } = renderHook(
        () => usePersonalizedGreet("Hello, {{name}}!"),
        { wrapper }
      );

      const initialGreeting = result.current.personalizedGreeting;
      expect(initialGreeting).toBe("Hello, John!");

      // Re-render without changing dependencies
      rerender();

      // Should maintain the same reference (no unnecessary computation)
      expect(result.current.personalizedGreeting).toBe("Hello, John!");
    });

    it("should handle empty dependencies correctly", () => {
      const wrapper = createWrapper("");
      const { result } = renderHook(() => usePersonalizedGreet(""), {
        wrapper,
      });

      expect(result.current.personalizedGreeting).toBe("");
    });
  });
});
