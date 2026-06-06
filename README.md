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

### Iteration 2 — Production-grade WebSocket connection management (complete)

- **Heartbeat handling** — Kraken sends periodic `heartbeat` messages; the client detects them and updates `lastMessageAt` without touching price state or re-rendering the price display
- **Stale detection** — if no message (ticker or heartbeat) is received for **30 seconds** while connected, status transitions to `stale` and the UI surfaces a warning; the connection recovers automatically as soon as the next message arrives
- **Automatic reconnect** — on any unexpected WebSocket close, status transitions to `reconnecting` and the client reconnects after a fixed **3-second delay**; subscription is re-sent automatically on the new connection; `reconnectAttempts` is tracked in the store and reset to 0 on successful reconnect
- **No duplicate sockets** — any pending reconnect timer is cancelled on `disconnect()`, so intentional teardown (e.g. component unmount) never leaks a second connection
- **Expanded connection states**: `idle | connecting | connected | reconnecting | stale | disconnected | error`
- **UI observability** — card now shows: connection status badge, last update time, and seconds since last message (live, updated every second)

---

## Planned Roadmap

1. ~~**Live BTC/USD price** — WebSocket feed from a public exchange API~~ ✓ done
2. ~~**Production-grade connection management** — heartbeat, stale detection, auto-reconnect~~ ✓ done
3. **Real-time chart** — TradingView Lightweight Charts with streaming candles
4. **Instrument selector** — switch between crypto, equity, and forex pairs
5. **Order book** — live bid/ask ladder with depth visualization
6. **Paper trading** — simulated order entry and position tracking
7. **AI market summary** — LLM-generated commentary on current market conditions
