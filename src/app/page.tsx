import { LivePriceCard } from "@/features/market/components/LivePriceCard";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen px-6 py-24 gap-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1
          className="text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          data-testid="app-title"
        >
          FinPulse
        </h1>
        <p className="text-lg text-zinc-400 font-medium">
          Real-time market intelligence
        </p>
      </div>

      {/* Live ticker card */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
          BTC/USD Live Ticker
        </h2>
        <LivePriceCard />
      </div>
    </main>
  );
}
