import { useQuery } from "@tanstack/react-query";
import type { Candle, CandleInterval } from "../types";

async function fetchCandles(interval: CandleInterval): Promise<Candle[]> {
  const response = await fetch(`/api/candles?pair=XBTUSD&interval=${interval}`);
  if (!response.ok) {
    throw new Error("Failed to fetch candles");
  }
  return response.json() as Promise<Candle[]>;
}

export function useCandles(interval: CandleInterval) {
  return useQuery({
    queryKey: ["candles", interval],
    queryFn: () => fetchCandles(interval),
    staleTime: 60_000,
  });
}
