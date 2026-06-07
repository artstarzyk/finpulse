import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "../page";

vi.mock("@/features/market/hooks/useLiveTicker", () => ({
  useLiveTicker: vi.fn(),
}));

vi.mock("@/features/market/components/CandleChart", () => ({
  CandleChart: () => <div data-testid="candle-chart" />,
}));

describe("HomePage", () => {
  it("renders the ticker strip", () => {
    render(<HomePage />);
    expect(screen.getByTestId("ticker-strip")).toBeDefined();
  });

  it("renders the BTC/USD symbol", () => {
    render(<HomePage />);
    expect(screen.getByTestId("ticker-symbol").textContent).toBe("BTC/USD");
  });
});
