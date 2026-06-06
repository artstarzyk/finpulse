import { create } from "zustand";
import type { ConnectionStatus, MarketSymbol, TickerData } from "@/features/market/types";

interface MarketState {
  /** The trading pair being tracked. */
  symbol: MarketSymbol;
  /** Most recent trade price from Kraken, or null before the first ticker arrives. */
  lastPrice: number | null;
  /** Current best bid price, or null before the first ticker arrives. */
  bid: number | null;
  /** Current best ask price, or null before the first ticker arrives. */
  ask: number | null;
  /** Local timestamp (Unix ms) of when the last ticker message was received. Null before first ticker. */
  lastTickerMessageAt: number | null;
  /** Local timestamp (Unix ms) of when any WebSocket message (ticker or heartbeat) was last received. Used to detect stale connections. */
  lastMessageAt: number | null;
  /** Current state of the WebSocket connection lifecycle. */
  status: ConnectionStatus;
  /** Number of reconnect attempts since the last successful connection. Reset to 0 on connect. */
  reconnectAttempts: number;
  /** Last WebSocket error message, or null when there is no active error. */
  error: string | null;

  // Actions
  setStatus: (status: ConnectionStatus) => void;
  setTicker: (data: TickerData) => void;
  setLastMessageAt: (ts: number) => void;
  setError: (error: string) => void;
  incrementReconnectAttempts: () => void;
}

export const useMarketStore = create<MarketState>(() => ({
  symbol: "BTC/USD",
  lastPrice: null,
  bid: null,
  ask: null,
  lastTickerMessageAt: null,
  lastMessageAt: null,
  status: "idle",
  reconnectAttempts: 0,
  error: null,

  setStatus: (status) =>
    useMarketStore.setState({
      status,
      ...(status === "connected" ? { reconnectAttempts: 0, error: null } : {}),
    }),

  setTicker: (data) =>
    useMarketStore.setState({
      lastPrice: data.lastPrice,
      bid: data.bid,
      ask: data.ask,
      lastTickerMessageAt: data.lastTickerMessageAt,
    }),

  setLastMessageAt: (timestamp) => useMarketStore.setState({ lastMessageAt: timestamp }),

  setError: (error) => useMarketStore.setState({ error }),

  incrementReconnectAttempts: () =>
    useMarketStore.setState((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),
}));
