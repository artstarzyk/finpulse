import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useLiveTicker } from "../hooks/useLiveTicker";
import { useMarketStore } from "@/store/marketStore";
import type { KrakenTickerClientCallbacks } from "../services/krakenTickerClient";

const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
let capturedCallbacks: KrakenTickerClientCallbacks = {};

vi.mock("../services/krakenTickerClient", () => ({
  createKrakenTickerClient: (_symbol: string, callbacks: KrakenTickerClientCallbacks) => {
    capturedCallbacks = callbacks;
    return { connect: mockConnect, disconnect: mockDisconnect };
  },
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

describe("useLiveTicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useMarketStore.setState(INITIAL_STATE);
    capturedCallbacks = {};
    mockConnect.mockClear();
    mockDisconnect.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sets status to connecting on mount and calls connect", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    expect(useMarketStore.getState().status).toBe("connecting");
    expect(mockConnect).toHaveBeenCalledOnce();
  });

  it("sets status to connected when onOpen fires", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    capturedCallbacks.onOpen?.();
    expect(useMarketStore.getState().status).toBe("connected");
  });

  it("updates lastMessageAt when a ticker message arrives", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    const before = Date.now();
    capturedCallbacks.onTicker?.({
      symbol: "BTC/USD",
      lastPrice: 67500,
      bid: 67499,
      ask: 67501,
      lastTickerMessageAt: Date.now(),
    });
    expect(useMarketStore.getState().lastMessageAt).toBeGreaterThanOrEqual(before);
  });

  it("updates lastMessageAt on heartbeat", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    const before = Date.now();
    capturedCallbacks.onHeartbeat?.();
    expect(useMarketStore.getState().lastMessageAt).toBeGreaterThanOrEqual(before);
  });

  it("marks connection as stale after 30s of no messages while connected", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    useMarketStore.setState({ status: "connected", lastMessageAt: Date.now() });

    vi.advanceTimersByTime(31_000);

    expect(useMarketStore.getState().status).toBe("stale");
  });

  it("does not mark stale if not connected (e.g. reconnecting)", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    useMarketStore.setState({ status: "reconnecting", lastMessageAt: Date.now() });

    vi.advanceTimersByTime(31_000);

    expect(useMarketStore.getState().status).toBe("reconnecting");
  });

  it("recovers from stale when a heartbeat arrives", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    useMarketStore.setState({ status: "stale" });

    capturedCallbacks.onHeartbeat?.();

    expect(useMarketStore.getState().status).toBe("connected");
  });

  it("recovers from stale when a ticker message arrives", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    useMarketStore.setState({ status: "stale" });

    capturedCallbacks.onTicker?.({
      symbol: "BTC/USD",
      lastPrice: 67500,
      bid: 67499,
      ask: 67501,
      lastTickerMessageAt: Date.now(),
    });

    expect(useMarketStore.getState().status).toBe("connected");
  });

  it("sets status to reconnecting and increments reconnectAttempts", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    capturedCallbacks.onReconnecting?.();

    expect(useMarketStore.getState().status).toBe("reconnecting");
    expect(useMarketStore.getState().reconnectAttempts).toBe(1);
  });

  it("resets reconnectAttempts to 0 on successful reconnect (onOpen)", () => {
    renderHook(() => useLiveTicker("BTC/USD"));
    useMarketStore.setState({ reconnectAttempts: 3 });

    capturedCallbacks.onOpen?.();

    expect(useMarketStore.getState().status).toBe("connected");
    expect(useMarketStore.getState().reconnectAttempts).toBe(0);
  });

  it("calls disconnect and clears timer on unmount", () => {
    const { unmount } = renderHook(() => useLiveTicker("BTC/USD"));
    unmount();
    expect(mockDisconnect).toHaveBeenCalledOnce();
  });
});
