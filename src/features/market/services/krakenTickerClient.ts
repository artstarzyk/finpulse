import type { MarketSymbol, TickerData } from "../types";

const KRAKEN_WS_URL = "wss://ws.kraken.com/v2";

// Kraken v2 ticker message shapes
interface KrakenTickerItem {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
}

interface KrakenTickerMessage {
  channel: "ticker" | "heartbeat";
  type: "snapshot" | "update";
  data: KrakenTickerItem[];
}

interface KrakenTickerClientCallbacks {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onTicker?: (data: TickerData) => void;
}

export interface KrakenTickerClient {
  connect(): void;
  disconnect(): void;
}

export function createKrakenTickerClient(
  symbol: MarketSymbol,
  callbacks: KrakenTickerClientCallbacks,
): KrakenTickerClient {
  let ws: WebSocket | null = null;

  function connect() {
    ws = new WebSocket(KRAKEN_WS_URL);

    ws.onopen = () => {
      ws!.send(
        JSON.stringify({
          method: "subscribe",
          params: { channel: "ticker", symbol: [symbol] },
        }),
      );
      callbacks.onOpen?.();
    };

    ws.onclose = () => {
      if (ws === null) return; // intentional disconnect — ignore
      callbacks.onClose?.();
    };

    ws.onerror = (event) => {
      if (ws === null) return; // intentional disconnect — ignore
      callbacks.onError?.(event);
    };

    ws.onmessage = (event: MessageEvent) => {
      let msg: KrakenTickerMessage;
      try {
        msg = JSON.parse(event.data);
        if (msg.channel !== "ticker") return;

        callbacks.onTicker?.({
          symbol,
          lastPrice: msg.data[0].last,
          bid: msg.data[0].bid,
          ask: msg.data[0].ask,
          lastUpdate: Date.now(),
        });
      } catch {
        console.error("[KrakenTickerClient] Failed to parse message", event.data);
      }
    };
  }

  function disconnect() {
    const socket = ws;
    ws = null; // null first so callbacks know this close is intentional
    socket?.close();
  }

  return { connect, disconnect };
}
