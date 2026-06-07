import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TickerStrip } from "../components/TickerStrip";
import { useMarketStore } from "@/store/marketStore";

vi.mock("../hooks/useLiveTicker", () => ({
  useLiveTicker: vi.fn(),
}));

const INITIAL_STATE = {
  symbol: "BTC/USD" as const,
  lastPrice: null,
  bid: null,
  ask: null,
  lastTickerMessageAt: null,
  lastMessageAt: null,
  status: "idle" as const,
  reconnectAttempts: 0,
  error: null,
};

describe("TickerStrip", () => {
  beforeEach(() => {
    useMarketStore.setState(INITIAL_STATE);
  });

  it("renders the strip with symbol and idle status", () => {
    render(<TickerStrip />);
    expect(screen.getByTestId("ticker-strip")).toBeDefined();
    expect(screen.getByTestId("ticker-symbol").textContent).toBe("BTC/USD");
    expect(screen.getByTestId("ticker-status").textContent).toContain("Idle");
  });

  it("shows dash placeholders before first tick", () => {
    render(<TickerStrip />);
    expect(screen.getByTestId("ticker-last-price").textContent).toContain("—");
    expect(screen.getByTestId("ticker-bid").textContent).toContain("—");
    expect(screen.getByTestId("ticker-ask").textContent).toContain("—");
  });

  it("shows live price data when connected", () => {
    useMarketStore.setState({
      status: "connected",
      lastPrice: 67500.5,
      bid: 67499.0,
      ask: 67501.0,
    });
    render(<TickerStrip />);
    expect(screen.getByTestId("ticker-status").textContent).toContain("Live");
    expect(screen.getByTestId("ticker-last-price").textContent).toContain("67,500.50");
    expect(screen.getByTestId("ticker-bid").textContent).toContain("67,499.00");
    expect(screen.getByTestId("ticker-ask").textContent).toContain("67,501.00");
  });

  it("shows connecting status", () => {
    useMarketStore.setState({ status: "connecting" });
    render(<TickerStrip />);
    expect(screen.getByTestId("ticker-status").textContent).toContain("Connecting");
  });

  it("shows reconnecting status", () => {
    useMarketStore.setState({ status: "reconnecting", reconnectAttempts: 1 });
    render(<TickerStrip />);
    expect(screen.getByTestId("ticker-status").textContent).toContain("Reconnecting");
  });

  it("shows stale status", () => {
    useMarketStore.setState({ status: "stale" });
    render(<TickerStrip />);
    expect(screen.getByTestId("ticker-status").textContent).toContain("Stale");
  });

  it("shows disconnected status", () => {
    useMarketStore.setState({ status: "disconnected" });
    render(<TickerStrip />);
    expect(screen.getByTestId("ticker-status").textContent).toContain("Disconnected");
  });

  it("shows error status", () => {
    useMarketStore.setState({ status: "error" });
    render(<TickerStrip />);
    expect(screen.getByTestId("ticker-status").textContent).toContain("Error");
  });
});
