import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { useQuote } from "../../hooks/quote";
import Quote from ".";

vi.mock("../../hooks/quote");

const mockUseQuote = vi.mocked(useQuote);

describe("Quote", () => {
  it("should display quote data correctly", () => {
    mockUseQuote.mockReturnValue({
      quote: {
        text: "Try and try until you succeed.",
        author: "unknown",
      },
      loading: false,
      error: null,
    });

    const { getByRole } = render(<Quote />);

    const textParagraph = getByRole("quote-text");
    const authorParagraph = getByRole("quote-author");

    expect(textParagraph).toHaveTextContent("Try and try until you succeed.");
    expect(authorParagraph).toHaveTextContent("unknown");
  });

  it("should render nothing if quote is missing", () => {
    mockUseQuote.mockReturnValue({
      quote: null,
      loading: false,
      error: "error",
    });

    const { container } = render(<Quote />);

    expect(container).toBeEmptyDOMElement();
  });
});
