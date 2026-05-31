"use client";

import { useEffect } from "react";
import { createKrakenTickerClient } from "../services/krakenTickerClient";
import { useMarketStore } from "@/store/marketStore";
import type { MarketSymbol } from "../types";

export function useLiveTicker(symbol: MarketSymbol) {
  const setStatus = useMarketStore((s) => s.setStatus);
  const setTicker = useMarketStore((s) => s.setTicker);
  const setError = useMarketStore((s) => s.setError);

  useEffect(() => {
    setStatus("connecting");

    const client = createKrakenTickerClient(symbol, {
      onOpen: () => setStatus("connected"),
      onClose: () => setStatus("disconnected"),
      onError: (event) => {
        console.error("[useLiveTicker] WebSocket error", event);
        setError("WebSocket connection error");
        setStatus("error");
      },
      onTicker: (data) => setTicker(data),
    });

    client.connect();

    return () => {
      client.disconnect();
    };
  }, [symbol, setStatus, setTicker, setError]);
}
