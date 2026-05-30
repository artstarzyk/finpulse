/** Supported asset classes */
export type AssetClass = "crypto" | "equity" | "forex" | "commodity";

/** A tradable instrument, e.g. BTC/USD */
export interface Instrument {
  symbol: string; // e.g. "BTC/USD"
  baseAsset: string; // e.g. "BTC"
  quoteAsset: string; // e.g. "USD"
  assetClass: AssetClass;
  displayName: string;
}

/** A single price tick received from the market data feed */
export interface PriceTick {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number; // Unix ms
}

/** Order book level */
export interface OrderBookLevel {
  price: number;
  quantity: number;
}

/** Full order book snapshot */
export interface OrderBook {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}
