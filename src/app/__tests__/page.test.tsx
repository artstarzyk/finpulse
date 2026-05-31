import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "../page";

// Prevent real WebSocket in unit tests
vi.mock("@/features/market/hooks/useLiveTicker", () => ({
  useLiveTicker: vi.fn(),
}));

describe("HomePage", () => {
  it("renders the FinPulse app title", () => {
    render(<HomePage />);
    const title = screen.getByTestId("app-title");
    expect(title).toBeDefined();
    expect(title.textContent).toBe("FinPulse");
  });

  it("renders the subtitle", () => {
    render(<HomePage />);
    expect(screen.getByText("Real-time market intelligence")).toBeDefined();
  });

  it("renders the BTC/USD live ticker section", () => {
    render(<HomePage />);
    expect(screen.getByText("BTC/USD Live Ticker")).toBeDefined();
    expect(screen.getByTestId("live-price-card")).toBeDefined();
  });
});
