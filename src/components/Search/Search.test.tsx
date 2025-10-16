import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import Search from ".";
import userEvent from "@testing-library/user-event";
import { useSearch } from "../../hooks/search";

vi.mock("../../hooks/search", () => ({
  useSearch: vi.fn(),
}));

const mockUseSearch = vi.mocked(useSearch);

describe("Search", () => {
  const mockSetQuery = vi.fn();
  const mockHandleAnimationEnd = vi.fn();
  const mockHandleSubmit = vi.fn();

  const defaultMockReturn = {
    query: "",
    setQuery: mockSetQuery,
    handleAnimationEnd: mockHandleAnimationEnd,
    handleSubmit: mockHandleSubmit,
    shouldRender: true,
    isSearchToggled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearch.mockReturnValue(defaultMockReturn);
  });

  describe("Rendering", () => {
    it("renders the search form when shouldRender is true", () => {
      const { getByRole } = render(<Search />);

      expect(getByRole("search-form")).toBeInTheDocument();
      expect(getByRole("textbox")).toBeInTheDocument();
      expect(getByRole("button", { name: /search/i })).toBeInTheDocument();
    });

    it("does not render when shouldRender is false", () => {
      mockUseSearch.mockReturnValue({
        ...defaultMockReturn,
        shouldRender: false,
      });

      const { container } = render(<Search />);

      expect(container.firstChild).toBeNull();
    });

    it("renders with correct input value from query", () => {
      const testQuery = "test search query";
      mockUseSearch.mockReturnValue({
        ...defaultMockReturn,
        query: testQuery,
      });

      const { getByRole } = render(<Search />);

      const input = getByRole("textbox");
      expect(input).toHaveValue(testQuery);
    });
  });

  describe("CSS Classes and Animation", () => {
    it("applies fade in animation class when isSearchToggled is true", () => {
      mockUseSearch.mockReturnValue({
        ...defaultMockReturn,
        isSearchToggled: true,
      });

      const { getByRole } = render(<Search />);

      const form = getByRole("search-form");
      expect(form).toHaveClass("animate-fade-in");
      expect(form).not.toHaveClass("animate-slide-out-right");
    });

    it("applies slide-out-right animation class when isSearchToggled is false", () => {
      mockUseSearch.mockReturnValue({
        ...defaultMockReturn,
        isSearchToggled: false,
      });

      const { getByRole } = render(<Search />);

      const form = getByRole("search-form");
      expect(form).toHaveClass("animate-slide-out-right");
      expect(form).not.toHaveClass("animate-slide-in-right");
    });

    it("applies base CSS classes correctly", () => {
      const { getByRole } = render(<Search />);

      const form = getByRole("search-form");
      expect(form).toHaveClass(
        "relative",
        "max-w-2xl",
        "mt-20",
        "shadow-outline",
        "mx-auto"
      );
    });
  });

  describe("User Interactions", () => {
    it("calls setQuery when input value changes", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Search />);

      const input = getByRole("textbox");
      await user.type(input, "test");

      expect(mockSetQuery).toHaveBeenCalledTimes(4);
      expect(mockSetQuery).toHaveBeenNthCalledWith(1, "t");
      expect(mockSetQuery).toHaveBeenNthCalledWith(2, "e");
      expect(mockSetQuery).toHaveBeenNthCalledWith(3, "s");
      expect(mockSetQuery).toHaveBeenNthCalledWith(4, "t");
    });

    it("calls setQuery when input value changes (single change)", () => {
      const { getByRole } = render(<Search />);

      const input = getByRole("textbox");
      fireEvent.change(input, { target: { value: "new search" } });

      expect(mockSetQuery).toHaveBeenCalledTimes(1);
      expect(mockSetQuery).toHaveBeenCalledWith("new search");
    });

    it("calls handleSubmit when form is submitted via button click", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Search />);

      const submitButton = getByRole("button", { name: /search/i });
      await user.click(submitButton);

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it("calls handleSubmit when form is submitted via Enter key", async () => {
      const user = userEvent.setup();
      const { getByRole } = render(<Search />);

      const input = getByRole("textbox");
      await user.type(input, "test{enter}");

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it("calls handleAnimationEnd when animation ends", () => {
      const { getByRole } = render(<Search />);

      const form = getByRole("search-form");
      fireEvent.animationEnd(form);

      expect(mockHandleAnimationEnd).toHaveBeenCalledTimes(1);
    });
  });
});
