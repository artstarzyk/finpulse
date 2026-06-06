"use client";

import { useEffect } from "react";
import { createKrakenTickerClient } from "../services/krakenTickerClient";
import { useMarketStore } from "@/store/marketStore";
import type { MarketSymbol } from "../types";

const STALE_THRESHOLD_MS = 30_000;

export function useLiveTicker(symbol: MarketSymbol) {
  const setStatus = useMarketStore((state) => state.setStatus);
  const setTicker = useMarketStore((state) => state.setTicker);
  const setError = useMarketStore((state) => state.setError);
  const setLastMessageAt = useMarketStore((state) => state.setLastMessageAt);
  const incrementReconnectAttempts = useMarketStore((state) => state.incrementReconnectAttempts);

  useEffect(() => {
    setStatus("connecting");

    const client = createKrakenTickerClient(symbol, {
      onOpen: () => setStatus("connected"),
      onClose: () => setStatus("disconnected"),
      onReconnecting: () => {
        setStatus("reconnecting");
        incrementReconnectAttempts();
      },
      onError: (event) => {
        console.error("[useLiveTicker] WebSocket error", event);
        setError("WebSocket connection error");
        setStatus("error");
      },
      onTicker: (data) => {
        setTicker(data);
        setLastMessageAt(Date.now());
        if (useMarketStore.getState().status === "stale") {
          setStatus("connected");
        }
      },
      onHeartbeat: () => {
        setLastMessageAt(Date.now());
        if (useMarketStore.getState().status === "stale") {
          setStatus("connected");
        }
      },
    });

    client.connect();

    const staleTimer = setInterval(() => {
      const { lastMessageAt, status } = useMarketStore.getState();
      if (status !== "connected") {
        return;
      }
      if (lastMessageAt === null) {
        return;
      }
      if (Date.now() - lastMessageAt > STALE_THRESHOLD_MS) {
        setStatus("stale");
      }
    }, 1_000);

    return () => {
      clearInterval(staleTimer);
      client.disconnect();
    };
  }, [symbol, setStatus, setTicker, setError, setLastMessageAt, incrementReconnectAttempts]);
}
