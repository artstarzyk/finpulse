"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useCandles } from "../hooks/useCandles";
import { useMarketStore } from "@/store/marketStore";
import type { Candle, CandleInterval } from "../types";

interface CandleChartProps {
  interval: CandleInterval;
}

export function CandleChart({ interval }: CandleChartProps) {
  const { data: candles, isLoading, isError } = useCandles(interval);
  const lastPrice = useMarketStore((state) => state.lastPrice);
  const lastTickerMessageAt = useMarketStore((state) => state.lastTickerMessageAt);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const currentCandleRef = useRef<Candle | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#09090b" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      crosshair: {
        vertLine: { labelBackgroundColor: "#3f3f46" },
        horzLine: { labelBackgroundColor: "#3f3f46" },
      },
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#27272a",
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#34d399",
      downColor: "#f87171",
      borderUpColor: "#34d399",
      borderDownColor: "#f87171",
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !candles) {
      return;
    }
    currentCandleRef.current = null;
    seriesRef.current.setData(
      candles.map((candle) => ({ ...candle, time: candle.time as UTCTimestamp })),
    );
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  useEffect(() => {
    currentCandleRef.current = null;
    seriesRef.current?.setData([]);
  }, [interval]);

  useEffect(() => {
    if (!seriesRef.current || !lastPrice || !lastTickerMessageAt) {
      return;
    }

    const intervalSeconds = interval * 60;
    const candleTime = Math.floor(lastTickerMessageAt / 1000 / intervalSeconds) * intervalSeconds;
    const current = currentCandleRef.current;

    if (!current || current.time !== candleTime) {
      currentCandleRef.current = {
        time: candleTime,
        open: lastPrice,
        high: lastPrice,
        low: lastPrice,
        close: lastPrice,
      };
    } else {
      currentCandleRef.current = {
        time: candleTime,
        open: current.open,
        high: Math.max(current.high, lastPrice),
        low: Math.min(current.low, lastPrice),
        close: lastPrice,
      };
    }

    seriesRef.current.update({
      ...currentCandleRef.current,
      time: candleTime as UTCTimestamp,
    });
  }, [lastTickerMessageAt, lastPrice, interval]);

  return (
    <div className="relative w-full h-[500px]" data-testid="candle-chart">
      <div ref={containerRef} className="absolute inset-0" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90">
          <span className="text-sm text-zinc-500">Loading chart data…</span>
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90">
          <span className="text-sm text-red-400">Failed to load chart data. Please try again.</span>
        </div>
      )}
    </div>
  );
}
