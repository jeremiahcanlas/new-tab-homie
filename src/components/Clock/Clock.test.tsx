import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { useClock } from "../../hooks/clock";
import Clock from ".";

vi.mock("../../hooks/clock");

const mockUseClock = vi.mocked(useClock);

describe("Clock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockDateTime = {
    currentTime: "11:07",
    currentDate: "Thursday, September 11",
  };

  it("renders current date & time from hook", () => {
    // Arrange

    mockUseClock.mockReturnValue({
      dateTime: mockDateTime,
    });

    // Act
    const { getByRole } = render(<Clock />);

    // Assert
    const clock = getByRole("heading", { level: 1 });
    const date = getByRole("heading", { level: 2 });

    expect(mockUseClock).toHaveBeenCalledTimes(1);
    expect(clock).toHaveTextContent(mockDateTime.currentTime);
    expect(date).toHaveTextContent(mockDateTime.currentDate);
  });

  it("time updates when hook returns different value", () => {
    mockUseClock.mockReturnValue({
      dateTime: mockDateTime,
    });

    // Act
    const { getByRole, rerender } = render(<Clock />);

    // Assert
    const clock = getByRole("heading", { level: 1 });

    expect(clock).toHaveTextContent("11:07");

    mockDateTime.currentTime = "11:08";

    mockUseClock.mockReturnValue({
      dateTime: mockDateTime,
    });

    rerender(<Clock />);

    expect(clock).toHaveTextContent("11:08");
  });

  it("date updates when hook returns different value", () => {
    mockUseClock.mockReturnValue({
      dateTime: mockDateTime,
    });

    // Act
    const { getByRole, rerender } = render(<Clock />);

    // Assert
    const date = getByRole("heading", { level: 2 });

    expect(date).toHaveTextContent("Thursday, September 11");

    mockDateTime.currentDate = "Thursday, September 12";

    mockUseClock.mockReturnValue({
      dateTime: mockDateTime,
    });

    rerender(<Clock />);

    expect(date).toHaveTextContent("Thursday, September 12");
  });

  it("handles empty string from custom hook", () => {
    // Arrange
    mockDateTime.currentDate = "";
    mockDateTime.currentTime = "";

    mockUseClock.mockReturnValue({
      dateTime: mockDateTime,
    });

    // Act
    const { getByRole } = render(<Clock />);

    // Assert
    const clock = getByRole("heading", { level: 1 });
    const date = getByRole("heading", { level: 2 });

    expect(clock).toHaveTextContent(mockDateTime.currentTime);
    expect(date).toHaveTextContent(mockDateTime.currentDate);
  });
});
