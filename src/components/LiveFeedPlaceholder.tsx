interface LiveFeedPlaceholderProps {
  symbol: string;
}

export function LiveFeedPlaceholder({ symbol }: LiveFeedPlaceholderProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-6 w-full max-w-sm flex flex-col gap-3 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-300">{symbol}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
          <span className="size-1.5 rounded-full bg-zinc-500 animate-pulse" />
          Offline
        </span>
      </div>
      <p className="text-zinc-500 text-sm">{symbol} live feed coming soon</p>
      <div className="h-16 rounded-lg bg-zinc-800/60 flex items-center justify-center">
        <span className="text-xs text-zinc-600">Chart placeholder</span>
      </div>
    </div>
  );
}
