"use client";

import { useLiveTicker } from "../hooks/useLiveTicker";
import { useMarketStore } from "@/store/marketStore";
import type { ConnectionStatus } from "../types";

const STATUS_BADGE: Record<ConnectionStatus, { label: string; dot: string; text: string }> = {
  idle: { label: "Idle", dot: "bg-zinc-500", text: "text-zinc-400" },
  connecting: { label: "Connecting", dot: "bg-yellow-400 animate-pulse", text: "text-yellow-400" },
  connected: { label: "Live", dot: "bg-emerald-400 animate-pulse", text: "text-emerald-400" },
  reconnecting: {
    label: "Reconnecting",
    dot: "bg-yellow-400 animate-pulse",
    text: "text-yellow-400",
  },
  stale: { label: "Stale", dot: "bg-orange-400", text: "text-orange-400" },
  disconnected: { label: "Disconnected", dot: "bg-zinc-500", text: "text-zinc-400" },
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

export function TickerStrip() {
  useLiveTicker("BTC/USD");

  const { symbol, lastPrice, bid, ask, status } = useMarketStore();
  const badge = STATUS_BADGE[status];

  return (
    <div
      className="flex items-center gap-5 px-4 py-2.5 text-sm"
      data-testid="ticker-strip"
    >
      <span className="font-semibold text-zinc-300" data-testid="ticker-symbol">
        {symbol}
      </span>

      <span className="font-semibold text-white tabular-nums" data-testid="ticker-last-price">
        ${formatPrice(lastPrice)}
      </span>

      <span className="text-zinc-500">
        Bid{" "}
        <span className="text-emerald-400 tabular-nums" data-testid="ticker-bid">
          ${formatPrice(bid)}
        </span>
      </span>

      <span className="text-zinc-500">
        Ask{" "}
        <span className="text-red-400 tabular-nums" data-testid="ticker-ask">
          ${formatPrice(ask)}
        </span>
      </span>

      <span
        className={`inline-flex items-center gap-1.5 ${badge.text}`}
        data-testid="ticker-status"
      >
        <span className={`size-1.5 rounded-full ${badge.dot}`} />
        {badge.label}
      </span>
    </div>
  );
}
