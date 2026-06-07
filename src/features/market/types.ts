export type MarketSymbol = "BTC/USD";

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "stale"
  | "disconnected"
  | "error";

export interface TickerData {
  symbol: MarketSymbol;
  lastPrice: number;
  bid: number;
  ask: number;
  lastTickerMessageAt: number; // Unix ms
}

export type CandleInterval = 60 | 1440;

export interface Candle {
  time: number; // Unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
}
