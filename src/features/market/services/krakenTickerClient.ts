import type { MarketSymbol, TickerData } from "../types";

const KRAKEN_WS_URL = "wss://ws.kraken.com/v2";
const RECONNECT_DELAY_MS = 3_000;

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

export interface KrakenTickerClientCallbacks {
  onOpen?: () => void;
  onClose?: () => void;
  onReconnecting?: () => void;
  onError?: (error: Event) => void;
  onTicker?: (data: TickerData) => void;
  onHeartbeat?: () => void;
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
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

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
      if (ws === null) {
        return; // intentional disconnect — ignore
      }
      callbacks.onReconnecting?.();
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, RECONNECT_DELAY_MS);
    };

    ws.onerror = (event) => {
      if (ws === null) {
        return; // intentional disconnect — ignore
      }
      callbacks.onError?.(event);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: KrakenTickerMessage = JSON.parse(event.data);

        if (msg.channel === "heartbeat") {
          callbacks.onHeartbeat?.();
          return;
        }

        if (msg.channel !== "ticker") {
          return;
        }

        callbacks.onTicker?.({
          symbol,
          lastPrice: msg.data[0].last,
          bid: msg.data[0].bid,
          ask: msg.data[0].ask,
          lastTickerMessageAt: Date.now(),
        });
      } catch (error) {
        console.error("[KrakenTickerClient] Failed to parse message", error);
      }
    };
  }

  function disconnect() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    const socket = ws;
    ws = null; // null first so callbacks know this close is intentional
    socket?.close();
  }

  return { connect, disconnect };
}
