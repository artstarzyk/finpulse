import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createKrakenTickerClient } from "../services/krakenTickerClient";

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  onopen: ((e: Event) => void) | null = null;
  onclose: ((e: CloseEvent) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;
  readyState = 0; // CONNECTING

  send = vi.fn();
  close = vi.fn();

  constructor(public url: string) {
    MockWebSocket.instances.push(this);
  }

  simulateOpen() {
    this.readyState = 1; // OPEN
    this.onopen?.(new Event("open"));
  }

  simulateMessage(data: unknown) {
    this.onmessage?.(new MessageEvent("message", { data: JSON.stringify(data) }));
  }

  simulateClose() {
    this.readyState = 3; // CLOSED
    this.onclose?.(new CloseEvent("close"));
  }
}

describe("createKrakenTickerClient", () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal("WebSocket", MockWebSocket);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("sends subscription and fires onOpen when connection opens", () => {
    const onOpen = vi.fn();
    const client = createKrakenTickerClient("BTC/USD", { onOpen });
    client.connect();

    const ws = MockWebSocket.instances[0];
    ws.simulateOpen();

    expect(onOpen).toHaveBeenCalledOnce();
    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({
        method: "subscribe",
        params: { channel: "ticker", symbol: ["BTC/USD"] },
      }),
    );
  });

  it("calls onTicker with parsed data for ticker messages", () => {
    const onTicker = vi.fn();
    const client = createKrakenTickerClient("BTC/USD", { onTicker });
    client.connect();

    MockWebSocket.instances[0].simulateOpen();
    MockWebSocket.instances[0].simulateMessage({
      channel: "ticker",
      type: "update",
      data: [{ symbol: "BTC/USD", last: 67500, bid: 67499, ask: 67501 }],
    });

    expect(onTicker).toHaveBeenCalledOnce();
    expect(onTicker.mock.calls[0][0]).toMatchObject({
      lastPrice: 67500,
      bid: 67499,
      ask: 67501,
    });
  });

  it("calls onHeartbeat for heartbeat messages and does not call onTicker", () => {
    const onTicker = vi.fn();
    const onHeartbeat = vi.fn();
    const client = createKrakenTickerClient("BTC/USD", { onTicker, onHeartbeat });
    client.connect();

    MockWebSocket.instances[0].simulateOpen();
    MockWebSocket.instances[0].simulateMessage({ channel: "heartbeat" });

    expect(onHeartbeat).toHaveBeenCalledOnce();
    expect(onTicker).not.toHaveBeenCalled();
  });

  it("calls onReconnecting and creates a new socket after 3s on unexpected close", () => {
    const onReconnecting = vi.fn();
    const onOpen = vi.fn();
    const client = createKrakenTickerClient("BTC/USD", { onReconnecting, onOpen });
    client.connect();

    MockWebSocket.instances[0].simulateOpen();
    expect(onOpen).toHaveBeenCalledOnce();

    MockWebSocket.instances[0].simulateClose();
    expect(onReconnecting).toHaveBeenCalledOnce();
    expect(MockWebSocket.instances).toHaveLength(1); // not yet

    vi.advanceTimersByTime(3_000);
    expect(MockWebSocket.instances).toHaveLength(2); // new socket

    MockWebSocket.instances[1].simulateOpen();
    expect(onOpen).toHaveBeenCalledTimes(2); // fired for new connection too
  });

  it("does not reconnect after intentional disconnect", () => {
    const onReconnecting = vi.fn();
    const client = createKrakenTickerClient("BTC/USD", { onReconnecting });
    client.connect();

    MockWebSocket.instances[0].simulateOpen();
    client.disconnect();

    vi.advanceTimersByTime(5_000);

    expect(onReconnecting).not.toHaveBeenCalled();
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it("cancels a pending reconnect when disconnect is called", () => {
    const onReconnecting = vi.fn();
    const client = createKrakenTickerClient("BTC/USD", { onReconnecting });
    client.connect();

    MockWebSocket.instances[0].simulateOpen();
    MockWebSocket.instances[0].simulateClose(); // schedules reconnect
    expect(onReconnecting).toHaveBeenCalledOnce();

    client.disconnect(); // should cancel the timer
    vi.advanceTimersByTime(5_000);

    expect(MockWebSocket.instances).toHaveLength(1); // no new socket
  });
});
