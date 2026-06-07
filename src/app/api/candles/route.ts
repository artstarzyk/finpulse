import { NextRequest, NextResponse } from "next/server";
import type { Candle } from "@/features/market/types";

const SUPPORTED_INTERVALS = new Set([60, 1440]);
const KRAKEN_OHLC_URL = "https://api.kraken.com/0/public/OHLC";

type KrakenOhlcEntry = [number, string, string, string, string, string, string, number];

interface KrakenOhlcResponse {
  error: string[];
  result: Record<string, KrakenOhlcEntry[] | number>;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const pair = searchParams.get("pair") ?? "";
  const interval = Number(searchParams.get("interval"));

  if (!SUPPORTED_INTERVALS.has(interval)) {
    return NextResponse.json(
      { error: `Unsupported interval. Supported values: ${[...SUPPORTED_INTERVALS].join(", ")}` },
      { status: 400 },
    );
  }

  const response = await fetch(`${KRAKEN_OHLC_URL}?pair=${pair}&interval=${interval}`);
  const data: KrakenOhlcResponse = await response.json();

  if (data.error.length > 0) {
    return NextResponse.json({ error: data.error[0] }, { status: 502 });
  }

  const candleKey = Object.keys(data.result).find((key) => key !== "last");
  if (!candleKey) {
    return NextResponse.json({ error: "Unexpected Kraken response format" }, { status: 502 });
  }

  const rawCandles = data.result[candleKey] as KrakenOhlcEntry[];
  const candles: Candle[] = rawCandles.map(([time, open, high, low, close]) => ({
    time,
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
  }));

  return NextResponse.json(candles);
}
