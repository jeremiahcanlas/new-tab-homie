import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Weather from ".";

describe("Weather", () => {
  const mockWeatherData = {
    temperature: 18,
    weatherStatus: "Sunny",
    feelsLike: 19,
    weatherCode: "0",
  };

  it("should display weather data correctly", () => {
    render(<Weather weather={mockWeatherData} />);
    expect(
      screen.getByRole("heading", { name: "18°", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "19°", level: 2 })
    ).toBeInTheDocument();
    expect(screen.getByText("feels")).toBeInTheDocument();
  });

  it("should display negative values correctly", () => {
    mockWeatherData.temperature = -18;
    mockWeatherData.feelsLike = -19;

    render(<Weather weather={mockWeatherData} />);
    expect(
      screen.getByRole("heading", { name: "-18°", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "-19°", level: 2 })
    ).toBeInTheDocument();
    expect(screen.getByText("feels")).toBeInTheDocument();
  });

  it("should show error", () => {
    render(<Weather error="Some error occurred" weather={mockWeatherData} />);

    const errorElement = screen.getByText(/Error retrieving weather data./i);

    expect(errorElement).toBeInTheDocument();
  });
});
