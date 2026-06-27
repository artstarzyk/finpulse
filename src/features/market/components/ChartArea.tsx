"use client";

import { useState } from "react";
import { CandleChart } from "./CandleChart";
import type { CandleInterval } from "../types";

const INTERVALS: { label: string; value: CandleInterval }[] = [
  { label: "1H", value: 60 },
  { label: "1D", value: 1440 },
];

export function ChartArea() {
  const [activeInterval, setActiveInterval] = useState<CandleInterval>(60);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-start">
        <div role="tablist" aria-label="Candle interval">
          {INTERVALS.map(({ label, value }) => (
            <button
              key={value}
              role="tab"
              aria-selected={activeInterval === value}
              onClick={() => setActiveInterval(value)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                activeInterval === value
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <CandleChart interval={activeInterval} />
    </div>
  );
}
