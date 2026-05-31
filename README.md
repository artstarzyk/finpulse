# FinPulse

[![CI](https://github.com/artstarzyk/finpulse/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/artstarzyk/finpulse/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/vercel-deployed-brightgreen?logo=vercel)](https://finpulse.vercel.app)

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
| Real-time data | WebSocket (Kraken v2) |
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

Push to `master` — Vercel picks it up automatically via the GitHub integration. Pull requests automatically get a **deploy preview URL** posted as a status check on the PR.

No extra configuration is required for the current skeleton.

```bash
# Or deploy manually
pnpm build   # verify the build passes locally first
```


---

## Iterations

### Iteration 1 — Live BTC/USD Ticker (complete)

- Browser connects directly to the **Kraken WebSocket v2** public endpoint (`wss://ws.kraken.com/v2`)
- Subscribes to the `ticker` channel for `BTC/USD`
- Displays live last price, bid, ask, connection status badge, and last update time
- Connection state machine: `idle → connecting → connected → disconnected / error`
- Zustand store holds all ticker state; no TanStack Query for WebSocket data
- Fully deployable to Vercel (no backend required)

---

## Planned Roadmap

1. ~~**Live BTC/USD price** — WebSocket feed from a public exchange API~~ ✓ done
2. **Real-time chart** — TradingView Lightweight Charts with streaming candles
3. **Instrument selector** — switch between crypto, equity, and forex pairs
4. **Reconnect logic** — automatic exponential-backoff reconnect on disconnect
5. **Order book** — live bid/ask ladder with depth visualization
6. **Paper trading** — simulated order entry and position tracking
7. **AI market summary** — LLM-generated commentary on current market conditions
