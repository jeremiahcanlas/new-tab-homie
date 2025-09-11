import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Quote from ".";

describe("Quote", () => {
  const mockQuote = {
    text: "Try and try until you succeed.",
    author: "unknown",
  };

  it("should display quote data correctly", () => {
    const { getByRole } = render(<Quote quote={mockQuote} />);

    const textParagraph = getByRole("quote-text");
    const authorParagraph = getByRole("quote-author");

    expect(textParagraph).toHaveTextContent("Try and try until you succeed.");
    expect(authorParagraph).toHaveTextContent("unknown");
  });

  it("should render nothing if quote is missing", () => {
    const { container } = render(<Quote quote={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
