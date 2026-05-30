/**
 * WebSocket market data client – skeleton only.
 * Wire up a real exchange feed (e.g. Binance, Coinbase) here in a future iteration.
 */

export type WsMessageHandler<T> = (data: T) => void;

export interface MarketWsClient {
  connect(): void;
  disconnect(): void;
  subscribe(symbol: string): void;
  unsubscribe(symbol: string): void;
  onMessage<T>(handler: WsMessageHandler<T>): void;
}

/**
 * Creates a WebSocket client stub.
 * Replace the body with a real implementation backed by an exchange API.
 */
export function createMarketWsClient(_url: string): MarketWsClient {
  // TODO: implement real WebSocket connection
  return {
    connect() {
      console.warn("[MarketWsClient] connect() – not yet implemented");
    },
    disconnect() {
      console.warn("[MarketWsClient] disconnect() – not yet implemented");
    },
    subscribe(symbol: string) {
      console.warn(
        `[MarketWsClient] subscribe(${symbol}) – not yet implemented`,
      );
    },
    unsubscribe(symbol: string) {
      console.warn(
        `[MarketWsClient] unsubscribe(${symbol}) – not yet implemented`,
      );
    },
    onMessage<T>(_handler: WsMessageHandler<T>) {
      console.warn("[MarketWsClient] onMessage() – not yet implemented");
    },
  };
}
