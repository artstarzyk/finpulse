import { TickerStrip } from "@/features/market/components/TickerStrip";
import { CandleChart } from "@/features/market/components/CandleChart";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <TickerStrip />
      </header>
      <main className="flex flex-1 flex-col p-6">
        <CandleChart interval={60} />
      </main>
    </div>
  );
}
