# FinPulse

**Real-time market intelligence** — a trading terminal built with Next.js, TypeScript, and a WebSocket-ready architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| App state | Zustand |
| Server / API state | TanStack Query |
| Real-time data | WebSocket (planned) |
| Charts | TradingView Lightweight Charts (planned) |
| Unit tests | Vitest + React Testing Library |
| E2E tests | Playwright |
| Linting | ESLint (Next.js config) |
| Formatting | Prettier |
| CI | GitHub Actions |
| Deployment | Vercel |

---

## Local Setup

**Prerequisites:** Node.js 20+, pnpm 9+

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type-check (no emit) |
| `pnpm test` | Run Vitest unit tests (single run) |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:coverage` | Run Vitest with coverage report |
| `pnpm test:e2e` | Run Playwright e2e tests |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without writing |

---

## Project Structure

```
src/
  app/                  # Next.js App Router pages & layouts
    __tests__/          # Route-level unit tests
  components/           # Shared UI components
  features/
    market/             # Market overview & watchlist
    charts/             # Price chart (TradingView)
    order-book/         # Live order book
    trading/            # Paper / live order entry
  lib/                  # Utility libraries (WebSocket client, API helpers)
  store/                # Zustand stores
  types/                # Shared TypeScript types & interfaces
e2e/                    # Playwright end-to-end tests
.github/workflows/      # GitHub Actions CI
```

---

## Deployment (Vercel)

Push to `main` — Vercel picks it up automatically via the GitHub integration. No extra configuration is required for the current skeleton.

```bash
# Or deploy manually
pnpm build   # verify the build passes locally first
```

---

## Planned Roadmap

1. **Live BTC/USD price** — WebSocket feed from a public exchange API
2. **Real-time chart** — TradingView Lightweight Charts with streaming candles
3. **Instrument selector** — switch between crypto, equity, and forex pairs
4. **Order book** — live bid/ask ladder with depth visualisation
5. **Paper trading** — simulated order entry and position tracking
6. **AI market summary** — LLM-generated commentary on current market conditions
