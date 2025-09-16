import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { usePersonalizedGreet } from "../../hooks/greet";
import Greet from ".";

vi.mock("../../hooks/greet");

const mockUsePersonalizedGreet = vi.mocked(usePersonalizedGreet);

describe("Greet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders personalized greeting from hook", () => {
    // Arrange
    const mockMessage = "Hello";
    const mockPersonalizedGreeting = "Hello, John!";

    mockUsePersonalizedGreet.mockReturnValue({
      personalizedGreeting: mockPersonalizedGreeting,
    });

    // Act
    const { getByRole } = render(<Greet message={mockMessage} />);

    // Assert
    const heading = getByRole("heading", { level: 1 });

    expect(heading).toHaveTextContent(mockPersonalizedGreeting);
  });

  it("passes message prop to usePersonalizedGreet hook", () => {
    // Arrange
    const mockMessage = "Good morning";
    mockUsePersonalizedGreet.mockReturnValue({
      personalizedGreeting: "Good morning, Sarah!",
    });

    // Act
    render(<Greet message={mockMessage} />);

    // Assert
    expect(mockUsePersonalizedGreet).toHaveBeenCalledWith(mockMessage);
    expect(mockUsePersonalizedGreet).toHaveBeenCalledTimes(1);
  });

  it("handles empty personalized greeting", () => {
    // Arrange
    mockUsePersonalizedGreet.mockReturnValue({
      personalizedGreeting: "",
    });

    // Act
    const { getByRole } = render(<Greet message="" />);

    // Assert
    const heading = getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("");
  });
});
