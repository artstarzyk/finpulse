import { TickerStrip } from "@/features/market/components/TickerStrip";
import { ChartArea } from "@/features/market/components/ChartArea";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800">
        <TickerStrip />
      </header>
      <main className="flex flex-1 flex-col p-6">
        <ChartArea />
      </main>
    </div>
  );
}
