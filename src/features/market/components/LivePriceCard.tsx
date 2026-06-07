"use client";

import { useLiveTicker } from "../hooks/useLiveTicker";
import { useMarketStore } from "@/store/marketStore";
import type { ConnectionStatus } from "../types";

const STATUS_BADGE: Record<
  ConnectionStatus,
  { label: string; dot: string; text: string }
> = {
  idle: { label: "Idle", dot: "bg-zinc-500", text: "text-zinc-400" },
  connecting: {
    label: "Connecting",
    dot: "bg-yellow-400 animate-pulse",
    text: "text-yellow-400",
  },
  connected: {
    label: "Live",
    dot: "bg-emerald-400 animate-pulse",
    text: "text-emerald-400",
  },
  reconnecting: {
    label: "Reconnecting",
    dot: "bg-yellow-400 animate-pulse",
    text: "text-yellow-400",
  },
  stale: {
    label: "Stale",
    dot: "bg-orange-400",
    text: "text-orange-400",
  },
  disconnected: {
    label: "Disconnected",
    dot: "bg-zinc-500",
    text: "text-zinc-400",
  },
  error: { label: "Error", dot: "bg-red-500", text: "text-red-400" },
};

function formatPrice(value: number | null): string {
  if (value === null) {
    return "—";
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatTime(ms: number | null): string {
  if (ms === null) {
    return "—";
  }
  return new Date(ms).toLocaleTimeString();
}

export function LivePriceCard() {
  useLiveTicker("BTC/USD");

  const { symbol, lastPrice, bid, ask, lastTickerMessageAt, status } = useMarketStore();
  const isStale = status === "stale";
  const badge = STATUS_BADGE[status];
  const hasData = lastPrice !== null;

  return (
    <div
      className="rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-6 w-full max-w-sm flex flex-col gap-4 shadow-lg"
      data-testid="live-price-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-300">{symbol}</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-1 text-xs ${badge.text}`}
          data-testid="connection-status"
        >
          <span className={`size-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500 uppercase tracking-wide">Last Price</span>
        {hasData ? (
          <span
            className="text-4xl font-bold text-white tabular-nums"
            data-testid="last-price"
          >
            ${formatPrice(lastPrice)}
          </span>
        ) : (
          <span className="text-4xl font-bold text-zinc-600 tabular-nums">$—</span>
        )}
      </div>

      {/* Bid / Ask */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-lg bg-zinc-800/60 px-3 py-2">
          <span className="text-xs text-zinc-500 uppercase tracking-wide">Bid</span>
          <span
            className="text-sm font-semibold text-emerald-400 tabular-nums"
            data-testid="bid"
          >
            ${formatPrice(bid)}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg bg-zinc-800/60 px-3 py-2">
          <span className="text-xs text-zinc-500 uppercase tracking-wide">Ask</span>
          <span
            className="text-sm font-semibold text-red-400 tabular-nums"
            data-testid="ask"
          >
            ${formatPrice(ask)}
          </span>
        </div>
      </div>

      {/* Connection info */}
      <div className="flex flex-col gap-1 text-xs text-zinc-500" data-testid="connection-info">
        {isStale ? (
          <p className="text-orange-400" data-testid="stale-message">
            No market data received for 30 seconds
          </p>
        ) : (
          <p>
            Last update:{" "}
            <span className="text-zinc-400" data-testid="last-update">
              {formatTime(lastTickerMessageAt)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
