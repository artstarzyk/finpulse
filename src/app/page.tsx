import { LiveFeedPlaceholder } from "@/components/LiveFeedPlaceholder";

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

      {/* Placeholder card */}
      <LiveFeedPlaceholder symbol="BTC/USD" />

      {/* Footer note */}
      <p className="text-xs text-zinc-600">
        Live data integration coming soon
      </p>
    </main>
  );
}
