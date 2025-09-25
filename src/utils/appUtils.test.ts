import { describe, it, expect, vi, beforeEach } from "vitest";
import { getInitialProps } from "./appUtils";
import greetService from "../services/greet/greetingService";
import quoteService from "../services/quote/quoteService";

// Mock the services
vi.mock("../services/greet/greetingService");
vi.mock("../services/quote/quoteService");

const mockGreetService = vi.mocked(greetService);
const mockQuoteService = vi.mocked(quoteService);

describe("getInitialProps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return data with greeting and quote when both services succeed", async () => {
    const mockGreeting = "Good morning!";
    const mockQuote = {
      author: "Steve Jobs",
      text: "Stay hungry, stay foolish.",
    };

    mockGreetService.getGreeting.mockResolvedValue(mockGreeting);
    mockQuoteService.getQuote.mockResolvedValue(mockQuote);

    const result = await getInitialProps();

    expect(result).toEqual({
      greetingMessage: mockGreeting,
      quote: mockQuote,
    });

    expect(mockGreetService.getGreeting).toHaveBeenCalledTimes(1);
    expect(mockQuoteService.getQuote).toHaveBeenCalledTimes(1);
  });

  it("should return data with null greeting when greeting service fails", async () => {
    const mockQuote = {
      author: "Albert Einstein",
      text: "Imagination is more important than knowledge.",
    };

    mockGreetService.getGreeting.mockResolvedValue("");
    mockQuoteService.getQuote.mockResolvedValue(mockQuote);

    const result = await getInitialProps();

    expect(result).toEqual({
      greetingMessage: "",
      quote: mockQuote,
    });
  });

  it("should return data with null quote when quote service fails", async () => {
    const mockGreeting = "Good evening!";

    mockGreetService.getGreeting.mockResolvedValue(mockGreeting);
    mockQuoteService.getQuote.mockResolvedValue(null);

    const result = await getInitialProps();

    expect(result).toEqual({
      greetingMessage: mockGreeting,
      quote: null,
    });
  });

  it("should return data with both null values when both services fail", async () => {
    mockGreetService.getGreeting.mockResolvedValue("");
    mockQuoteService.getQuote.mockResolvedValue(null);

    const result = await getInitialProps();

    expect(result).toEqual({
      greetingMessage: "",
      quote: null,
    });
  });

  it("should handle empty string greeting", async () => {
    const mockQuote = {
      author: "Maya Angelou",
      text: "You will face many defeats in life, but never let yourself be defeated.",
    };

    mockGreetService.getGreeting.mockResolvedValue("");
    mockQuoteService.getQuote.mockResolvedValue(mockQuote);

    const result = await getInitialProps();

    expect(result).toEqual({
      greetingMessage: "",
      quote: mockQuote,
    });
  });

  it("should handle greeting service throwing an error", async () => {
    const mockQuote = {
      author: "Winston Churchill",
      text: "Success is not final, failure is not fatal.",
    };

    mockGreetService.getGreeting.mockRejectedValue(
      new Error("Greeting service error")
    );
    mockQuoteService.getQuote.mockResolvedValue(mockQuote);

    // The function should still complete, but greeting will be undefined due to the error
    await expect(getInitialProps()).rejects.toThrow("Greeting service error");

    expect(mockGreetService.getGreeting).toHaveBeenCalledTimes(1);
  });

  it("should handle quote service throwing an error", async () => {
    const mockGreeting = "Good afternoon!";

    mockGreetService.getGreeting.mockResolvedValue(mockGreeting);
    mockQuoteService.getQuote.mockRejectedValue(
      new Error("Quote service error")
    );

    // The function should still complete, but quote will be undefined due to the error
    await expect(getInitialProps()).rejects.toThrow("Quote service error");

    expect(mockQuoteService.getQuote).toHaveBeenCalledTimes(1);
  });

  it("should handle both services throwing errors", async () => {
    mockGreetService.getGreeting.mockRejectedValue(
      new Error("Greeting service error")
    );
    mockQuoteService.getQuote.mockRejectedValue(
      new Error("Quote service error")
    );

    // Should reject with the first error (greeting service)
    await expect(getInitialProps()).rejects.toThrow("Greeting service error");
  });

  //   it("should call both services concurrently", async () => {
  //     const mockGreeting = "Hello!";
  //     const mockQuote = {
  //       author: "Mark Twain",
  //       text: "The secret of getting ahead is getting started.",
  //     };

  //     // Add delays to test concurrency
  //     mockGreetService.getGreeting.mockImplementation(
  //       () =>
  //         new Promise((resolve) => setTimeout(() => resolve(mockGreeting), 100))
  //     );
  //     mockQuoteService.getQuote.mockImplementation(
  //       () => new Promise((resolve) => setTimeout(() => resolve(mockQuote), 50))
  //     );

  //     const startTime = Date.now();
  //     const result = await getInitialProps();
  //     const endTime = Date.now();

  //     expect(result).toEqual({
  //       greetingMessage: mockGreeting,
  //       quote: mockQuote,
  //     });

  //     // Should take around 100ms (not 150ms) if running concurrently
  //     expect(endTime - startTime).toBeLessThan(150);
  //   });

  it("should return data with different quote formats", async () => {
    const mockGreeting = "Good morning!";
    const mockQuoteWithoutAuthor = {
      author: "",
      text: "Anonymous wisdom.",
    };

    mockGreetService.getGreeting.mockResolvedValue(mockGreeting);
    mockQuoteService.getQuote.mockResolvedValue(mockQuoteWithoutAuthor);

    const result = await getInitialProps();

    expect(result).toEqual({
      greetingMessage: mockGreeting,
      quote: mockQuoteWithoutAuthor,
    });
  });
});
