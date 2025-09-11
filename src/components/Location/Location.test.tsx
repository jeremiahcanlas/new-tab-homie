import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Location from ".";

describe("Location", () => {
  const mockLocationData = {
    city: "Toronto",
    stateProvince: "Ontario",
    country: "",
    locationDisabled: false,
  };

  it("should display location data correctly", () => {
    const { getByRole } = render(<Location location={mockLocationData} />);

    const locationHeading = getByRole("heading", { level: 2 });

    expect(locationHeading).toHaveTextContent("Toronto, Ontario");
  });

  it("should render city-only if stateProvince is missing from response", () => {
    mockLocationData.stateProvince = "";

    const { getByRole } = render(<Location location={mockLocationData} />);

    const locationHeading = getByRole("heading", { level: 2 });

    expect(locationHeading).toHaveTextContent("Toronto");
  });

  it("should show error message if error is passed as props", () => {
    const { getByRole } = render(
      <Location error="Error" location={mockLocationData} />
    );

    const errorText = getByRole("paragraph");

    expect(errorText).toHaveTextContent("Error retrieving location.");
  });
});
