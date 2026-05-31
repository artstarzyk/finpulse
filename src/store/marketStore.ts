import { create } from "zustand";
import type { ConnectionStatus, MarketSymbol, TickerData } from "@/features/market/types";

interface MarketState {
  symbol: MarketSymbol;
  lastPrice: number | null;
  bid: number | null;
  ask: number | null;
  lastUpdate: number | null;
  status: ConnectionStatus;
  error: string | null;

  // Actions
  setStatus: (status: ConnectionStatus) => void;
  setTicker: (data: TickerData) => void;
  setError: (error: string) => void;
}

export const useMarketStore = create<MarketState>(() => ({
  symbol: "BTC/USD",
  lastPrice: null,
  bid: null,
  ask: null,
  lastUpdate: null,
  status: "idle",
  error: null,

  setStatus: (status) => useMarketStore.setState({ status }),

  setTicker: (data) =>
    useMarketStore.setState({
      lastPrice: data.lastPrice,
      bid: data.bid,
      ask: data.ask,
      lastUpdate: data.lastUpdate,
    }),

  setError: (error) => useMarketStore.setState({ error }),
}));
