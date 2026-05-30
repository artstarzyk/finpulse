import { create } from "zustand";
import type { Instrument, PriceTick } from "@/types/market";

interface MarketState {
  /** Currently selected instrument */
  selectedInstrument: Instrument | null;
  /** Latest price ticks keyed by symbol */
  ticks: Record<string, PriceTick>;
  /** Whether the live feed is active */
  isConnected: boolean;

  // Actions
  setSelectedInstrument: (instrument: Instrument) => void;
  updateTick: (tick: PriceTick) => void;
  setConnected: (connected: boolean) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  selectedInstrument: null,
  ticks: {},
  isConnected: false,

  setSelectedInstrument: (instrument) =>
    set({ selectedInstrument: instrument }),

  updateTick: (tick) =>
    set((state) => ({
      ticks: { ...state.ticks, [tick.symbol]: tick },
    })),

  setConnected: (connected) => set({ isConnected: connected }),
}));
