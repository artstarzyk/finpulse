export type MarketSymbol = "BTC/USD";

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface TickerData {
  symbol: MarketSymbol;
  lastPrice: number;
  bid: number;
  ask: number;
  lastUpdate: number; // Unix ms
}
