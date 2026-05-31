import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LivePriceCard } from "../components/LivePriceCard";
import { useMarketStore } from "@/store/marketStore";

// Prevent real WebSocket connections in unit tests
vi.mock("../hooks/useLiveTicker", () => ({
  useLiveTicker: vi.fn(),
}));

describe("LivePriceCard", () => {
  beforeEach(() => {
    useMarketStore.setState({
      symbol: "BTC/USD",
      lastPrice: null,
      bid: null,
      ask: null,
      lastUpdate: null,
      status: "idle",
      error: null,
    });
  });

  it("renders the card with idle status and no price", () => {
    render(<LivePriceCard />);
    expect(screen.getByTestId("live-price-card")).toBeDefined();
    expect(screen.getByTestId("connection-status").textContent).toContain(
      "Idle",
    );
    expect(screen.getByText("BTC/USD")).toBeDefined();
  });

  it("shows connecting status", () => {
    useMarketStore.setState({ status: "connecting" });
    render(<LivePriceCard />);
    expect(screen.getByTestId("connection-status").textContent).toContain(
      "Connecting",
    );
  });

  it("shows live price data when connected", () => {
    useMarketStore.setState({
      status: "connected",
      lastPrice: 67500.5,
      bid: 67499.0,
      ask: 67501.0,
      lastUpdate: 1700000000000,
    });
    render(<LivePriceCard />);

    expect(screen.getByTestId("connection-status").textContent).toContain(
      "Live",
    );
    expect(screen.getByTestId("last-price").textContent).toContain("67,500.50");
    expect(screen.getByTestId("bid").textContent).toContain("67,499.00");
    expect(screen.getByTestId("ask").textContent).toContain("67,501.00");
  });

  it("shows disconnected status", () => {
    useMarketStore.setState({ status: "disconnected" });
    render(<LivePriceCard />);
    expect(screen.getByTestId("connection-status").textContent).toContain(
      "Disconnected",
    );
  });

  it("shows error status", () => {
    useMarketStore.setState({ status: "error" });
    render(<LivePriceCard />);
    expect(screen.getByTestId("connection-status").textContent).toContain(
      "Error",
    );
  });
});
