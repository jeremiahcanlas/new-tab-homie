import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from ".";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

vi.mock("../../context/DashboardSettingsContext", () => ({
  useDashboardSettings: vi.fn(),
}));

const mockUseDashboardSettings = vi.mocked(useDashboardSettings);

describe("Menu Component", () => {
  const mockSetUnit = vi.fn();
  const mockSetUsername = vi.fn();
  const mockSetClockFormat = vi.fn();
  const mockSetDarkToggled = vi.fn();
  const mockToggleSearch = vi.fn();
  const mockToggleQuote = vi.fn();

  const defaultMockReturn = {
    unit: "celsius" as "celsius" | "fahrenheit",
    setUnit: mockSetUnit,
    username: "",
    setUsername: mockSetUsername,
    clockFormat: "12" as "12" | "24",
    setClockFormat: mockSetClockFormat,
    darkToggled: false,
    setDarkToggled: mockSetDarkToggled,
    isSearchToggled: false,
    toggleSearch: mockToggleSearch,
    isQuoteToggled: false,
    toggleQuote: mockToggleQuote,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDashboardSettings.mockReturnValue(defaultMockReturn);
  });

  describe("Rendering and Visibility", () => {
    it("renders when isOpen is true", () => {
      const { getByText } = render(<Menu isOpen={true} />);

      expect(getByText("Dashboard Settings")).toBeInTheDocument();
    });

    it("renders after isOpen changes from false to true", async () => {
      const { rerender, getByText } = render(<Menu isOpen={false} />);

      rerender(<Menu isOpen={true} />);

      await waitFor(() => {
        expect(getByText("Dashboard Settings")).toBeInTheDocument();
      });
    });

    it("not have open class when isOpen is false but still rendering", async () => {
      const { rerender, getByText } = render(<Menu isOpen={true} />);

      rerender(<Menu isOpen={false} />);

      const menuContainer = getByText("Dashboard Settings").parentElement;
      expect(menuContainer).not.toHaveClass("open");
    });
  });

  describe("Username Input", () => {
    it("renders username input with correct attributes", () => {
      const { getByLabelText } = render(<Menu isOpen={true} />);

      const usernameInput = getByLabelText(/username/i);
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute("type", "text");
      expect(usernameInput).toHaveAttribute("placeholder", "Enter username");
      expect(usernameInput).toHaveAttribute("id", "username");
    });

    it("displays current username value", () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        username: "testuser",
      });

      const { getByLabelText } = render(<Menu isOpen={true} />);

      const usernameInput = getByLabelText(/username/i);
      expect(usernameInput).toHaveValue("testuser");
    });

    it("calls setUsername when input changes", async () => {
      const user = userEvent.setup();
      const { getByLabelText } = render(<Menu isOpen={true} />);

      const usernameInput = getByLabelText(/username/i);
      await user.clear(usernameInput);
      await user.type(usernameInput, "newuser");

      expect(mockSetUsername).toHaveBeenCalledWith("r");
    });
  });

  describe("Clock Format Radio Buttons", () => {
    it("renders clock format options correctly", () => {
      const { getByText, getByLabelText } = render(<Menu isOpen={true} />);

      expect(getByText("Clock Format:")).toBeInTheDocument();
      expect(getByLabelText("12-hr")).toBeInTheDocument();
      expect(getByLabelText("24-hr")).toBeInTheDocument();
    });

    it('selects 12-hour format when clockFormat is "12"', () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        clockFormat: "12",
      });

      const { getByLabelText } = render(<Menu isOpen={true} />);

      const radio12 = getByLabelText("12-hr");
      const radio24 = getByLabelText("24-hr");

      expect(radio12).toBeChecked();
      expect(radio24).not.toBeChecked();
    });

    it('selects 24-hour format when clockFormat is "24"', () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        clockFormat: "24",
      });

      const { getByLabelText } = render(<Menu isOpen={true} />);

      const radio12 = getByLabelText("12-hr");
      const radio24 = getByLabelText("24-hr");

      expect(radio12).not.toBeChecked();
      expect(radio24).toBeChecked();
    });

    it("calls setClockFormat when 12-hour option is selected", async () => {
      mockUseDashboardSettings.mockReturnValueOnce({
        ...defaultMockReturn,
        clockFormat: "24",
      });

      const user = userEvent.setup();
      const { getByLabelText } = render(<Menu isOpen={true} />);

      const radio12 = getByLabelText("12-hr");
      await user.click(radio12);

      expect(mockSetClockFormat).toHaveBeenCalledWith("12");
    });

    it("calls setClockFormat when 24-hour option is selected", async () => {
      mockUseDashboardSettings.mockReturnValueOnce({
        ...defaultMockReturn,
        clockFormat: "12",
      });

      const user = userEvent.setup();
      const { getByLabelText } = render(<Menu isOpen={true} />);

      const radio24 = getByLabelText("24-hr");
      await user.click(radio24);

      expect(mockSetClockFormat).toHaveBeenCalledWith("24");
    });
  });

  describe("Temperature Unit Radio Buttons", () => {
    it("renders temperature unit options correctly", () => {
      const { getByText, getByLabelText } = render(<Menu isOpen={true} />);

      expect(getByText("Temperature Unit:")).toBeInTheDocument();
      expect(getByLabelText("°C")).toBeInTheDocument();
      expect(getByLabelText("°F")).toBeInTheDocument();
    });

    it('selects celsius when unit is "celsius"', () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        unit: "celsius",
      });

      const { getByLabelText } = render(<Menu isOpen={true} />);

      const celsiusRadio = getByLabelText("°C");
      const fahrenheitRadio = getByLabelText("°F");

      expect(celsiusRadio).toBeChecked();
      expect(fahrenheitRadio).not.toBeChecked();
    });

    it('selects fahrenheit when unit is "fahrenheit"', () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        unit: "fahrenheit",
      });

      const { getByLabelText } = render(<Menu isOpen={true} />);

      const celsiusRadio = getByLabelText("°C");
      const fahrenheitRadio = getByLabelText("°F");

      expect(celsiusRadio).not.toBeChecked();
      expect(fahrenheitRadio).toBeChecked();
    });

    it("calls setUnit when celsius option is selected", async () => {
      mockUseDashboardSettings.mockReturnValueOnce({
        ...defaultMockReturn,
        unit: "fahrenheit",
      });
      const user = userEvent.setup();
      const { getByLabelText } = render(<Menu isOpen={true} />);

      const celsiusRadio = getByLabelText("°C");
      await user.click(celsiusRadio);

      expect(mockSetUnit).toHaveBeenCalledWith("celsius");
    });

    it("calls setUnit when fahrenheit option is selected", async () => {
      const user = userEvent.setup();
      const { getByLabelText } = render(<Menu isOpen={true} />);

      const fahrenheitRadio = getByLabelText("°F");
      await user.click(fahrenheitRadio);

      expect(mockSetUnit).toHaveBeenCalledWith("fahrenheit");
    });
  });

  describe("Dark Mode Toggle", () => {
    it("renders dark mode toggle correctly", () => {
      const { getByText, getByRole } = render(<Menu isOpen={true} />);

      expect(getByText("dark mode")).toBeInTheDocument();
      expect(getByRole("checkbox", { name: /dark mode/i })).toBeInTheDocument();
    });

    it("shows toggle as unchecked when darkToggled is false", () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        darkToggled: false,
      });

      const { getByRole } = render(<Menu isOpen={true} />);

      const darkToggle = getByRole("checkbox", { name: /dark mode/i });
      expect(darkToggle).not.toBeChecked();
    });

    it("shows toggle as checked when darkToggled is true", () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        darkToggled: true,
      });

      const { getByRole } = render(<Menu isOpen={true} />);

      const darkToggle = getByRole("checkbox", { name: /dark mode/i });
      expect(darkToggle).toBeChecked();
    });

    it("calls setDarkToggled with opposite value when clicked", async () => {
      const user = userEvent.setup();
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        darkToggled: false,
      });

      const { getByRole } = render(<Menu isOpen={true} />);

      const darkToggle = getByRole("checkbox", { name: /dark mode/i });
      await user.click(darkToggle);

      expect(mockSetDarkToggled).toHaveBeenCalledWith(true);
    });

    it("applies correct transform class when darkToggled is true", () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        darkToggled: true,
      });

      const { container } = render(<Menu isOpen={true} />);

      // TODO
      const slider = container.querySelector(".translate-x-5");
      expect(slider).toBeInTheDocument();
    });

    it("does not apply transform class when darkToggled is false", () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        darkToggled: false,
      });

      const { container } = render(<Menu isOpen={true} />);

      // TODO
      const slider = container.querySelector(".absolute.left-1.top-1");
      expect(slider).not.toHaveClass("translate-x-5");
    });
  });

  describe("Search Toggle", () => {
    it("renders search toggle correctly", () => {
      const { getByText, getByRole } = render(<Menu isOpen={true} />);

      expect(getByText("show search")).toBeInTheDocument();
      expect(
        getByRole("checkbox", { name: /show search/i })
      ).toBeInTheDocument();
    });

    it("shows toggle as unchecked when isSearchToggled is false", () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        isSearchToggled: false,
      });

      const { getByRole } = render(<Menu isOpen={true} />);

      const searchToggle = getByRole("checkbox", { name: /show search/i });
      expect(searchToggle).not.toBeChecked();
    });

    it("shows toggle as checked when isSearchToggled is true", () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        isSearchToggled: true,
      });

      const { getByRole } = render(<Menu isOpen={true} />);

      const searchToggle = getByRole("checkbox", { name: /show search/i });
      expect(searchToggle).toBeChecked();
    });

    it("calls toggleSearch with opposite value when clicked", async () => {
      const user = userEvent.setup();
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        isSearchToggled: false,
      });

      const { getByRole } = render(<Menu isOpen={true} />);

      const searchToggle = getByRole("checkbox", { name: /show search/i });
      await user.click(searchToggle);

      expect(mockToggleSearch).toHaveBeenCalledWith(true);
    });

    it("applies correct transform class when isSearchToggled is true", () => {
      mockUseDashboardSettings.mockReturnValue({
        ...defaultMockReturn,
        isSearchToggled: true,
      });

      const { getByText } = render(<Menu isOpen={true} />);

      // Since both toggles have the same structure, we need to find the search toggle specifically
      const searchSection = getByText("show search").closest("div");
      const slider = searchSection?.querySelector(".translate-x-5");
      expect(slider).toBeInTheDocument();
    });
  });

  //   describe('Accessibility', () => {
  //     it('has proper label association for username input', () => {
  //       const { getByLabelText, getByText } = render(<Menu isOpen={true} />);

  //       const usernameInput = getByLabelText(/username/i);
  //       expect(usernameInput).toHaveAttribute('id', 'username');

  //       const label = getByText('Username:').parentElement;
  //       expect(label).toHaveAttribute('for', 'username');
  //     });

  //     it('has proper radio button grouping for clock format', () => {
  //       const { getByLabelText } = render(<Menu isOpen={true} />);

  //       const radio12 = getByLabelText('12-hr');
  //       const radio24 = getByLabelText('24-hr');

  //       expect(radio12).toHaveAttribute('type', 'radio');
  //       expect(radio24).toHaveAttribute('type', 'radio');
  //       expect(radio12).toHaveAttribute('value', '12');
  //       expect(radio24).toHaveAttribute('value', '24');
  //     });

  //     it('has proper radio button grouping for temperature unit', () => {
  //       const { getByLabelText } = render(<Menu isOpen={true} />);

  //       const celsiusRadio = getByLabelText('°C');
  //       const fahrenheitRadio = getByLabelText('°F');

  //       expect(celsiusRadio).toHaveAttribute('type', 'radio');
  //       expect(fahrenheitRadio).toHaveAttribute('type', 'radio');
  //       expect(celsiusRadio).toHaveAttribute('value', 'c');
  //       expect(fahrenheitRadio).toHaveAttribute('value', 'f');
  //     });

  //     it('has proper checkbox attributes for toggles', () => {
  //       const { getByRole } = render(<Menu isOpen={true} />);

  //       const darkToggle = getByRole('checkbox', { name: /dark mode/i });
  //       const searchToggle = getByRole('checkbox', { name: /show search bar/i });

  //       expect(darkToggle).toHaveAttribute('type', 'checkbox');
  //       expect(searchToggle).toHaveAttribute('type', 'checkbox');
  //       expect(darkToggle).toHaveAttribute('name', 'darkToggle');
  //       expect(searchToggle).toHaveAttribute('name', 'searchToggle');
  //     });

  //     it('uses sr-only class for checkbox accessibility', () => {
  //       const { getByRole } = render(<Menu isOpen={true} />);

  //       const darkToggle = getByRole('checkbox', { name: /dark mode/i });
  //       const searchToggle = getByRole('checkbox', { name: /show search bar/i });

  //       expect(darkToggle).toHaveClass('sr-only');
  //       expect(searchToggle).toHaveClass('sr-only');
  //     });
  //   });

  //   describe('Edge Cases', () => {
  //     it('handles undefined username gracefully', () => {
  //       mockUseDashboardSettings.mockReturnValue({
  //         ...defaultMockReturn,
  //         username: undefined as any,
  //       });

  //       const { getByLabelText } = render(<Menu isOpen={true} />);

  //       const usernameInput = getByLabelText(/username/i);
  //       expect(usernameInput).toHaveValue('');
  //     });

  //     it('handles empty string values correctly', () => {
  //       mockUseDashboardSettings.mockReturnValue({
  //         ...defaultMockReturn,
  //         username: '',
  //         unit: 'celsius',
  //         clockFormat: '12',
  //       });

  //       const { getByLabelText } = render(<Menu isOpen={true} />);

  //       const usernameInput = getByLabelText(/username/i);
  //       expect(usernameInput).toHaveValue('');

  //       const celsiusRadio = getByLabelText('°C');
  //       const radio12 = getByLabelText('12-hr');

  //       expect(celsiusRadio).toBeChecked();
  //       expect(radio12).toBeChecked();
  //     });
  //   });
});
