import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import greetService from "./greetingService";

// Mock the greetings data
vi.mock("../../data/greetings.json", () => ({
  default: [
    {
      range: { start: 0, end: 12 },
      messages: ["Good morning!", "Rise and shine!"],
    },
    {
      range: { start: 12, end: 18 },
      messages: ["Good afternoon!", "Hope your day is going well!"],
    },
    {
      range: { start: 18, end: 24 },
      messages: ["Good evening!", "How was your day?"],
    },
  ],
}));

describe("greetService", () => {
  let originalDate: typeof Date;
  let mockMathRandom: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock Math.random to make tests predictable
    mockMathRandom = vi.spyOn(Math, "random").mockReturnValue(0); // Always return first message

    // Store original Date
    originalDate = global.Date;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.Date = originalDate;
  });

  const mockCurrentHour = (hour: number) => {
    const mockDate = new Date();
    mockDate.getHours = vi.fn().mockReturnValue(hour);
    global.Date = vi.fn(() => mockDate) as unknown as DateConstructor;
  };

  it("should return morning greeting for morning hours", async () => {
    mockCurrentHour(9); // 9 AM

    const greeting = await greetService.getGreeting();

    expect(greeting).toBe("Good morning!");
  });

  it("should return afternoon greeting for afternoon hours", async () => {
    mockCurrentHour(15); // 3 PM

    const greeting = await greetService.getGreeting();

    expect(greeting).toBe("Good afternoon!");
  });

  it("should return evening greeting for evening hours", async () => {
    mockCurrentHour(20); // 8 PM

    const greeting = await greetService.getGreeting();

    expect(greeting).toBe("Good evening!");
  });

  it("should return different messages randomly", async () => {
    mockCurrentHour(9);

    // First call - Math.random returns 0 (first message)
    mockMathRandom.mockReturnValueOnce(0);
    const greeting1 = await greetService.getGreeting();

    // Second call - Math.random returns 0.9 (second message)
    mockMathRandom.mockReturnValueOnce(0.9);
    const greeting2 = await greetService.getGreeting();

    expect(greeting1).toBe("Good morning!");
    expect(greeting2).toBe("Rise and shine!");
  });

  it("should return empty string when no period matches", async () => {
    // Mock greetings data with gap (no period covers hour 25)
    vi.doMock("../../data/greetings.json", () => ({
      default: [{ range: { start: 0, end: 10 }, messages: ["Hello"] }],
    }));

    mockCurrentHour(25); // Invalid hour to test edge case

    const greeting = await greetService.getGreeting();

    expect(greeting).toBe("");
  });

  it("should handle boundary hours correctly", async () => {
    // Test start boundary
    mockCurrentHour(12); // Exactly 12 PM (start of afternoon)

    const greeting = await greetService.getGreeting();

    expect(greeting).toBe("Good afternoon!");
  });

  it("should handle end boundary correctly", async () => {
    // Test end boundary - hour 12 should NOT match morning (end: 12)
    mockCurrentHour(11); // 11 AM should still be morning

    const greeting = await greetService.getGreeting();

    expect(greeting).toBe("Good morning!");
  });
});
