# Crypto Market Sensemaking UI

A dense, light "terminal" for quickly making sense of the crypto market: a table of 250 assets
with inline sparklines, search/sort kept in the URL, explicit data-freshness states
(Live / Stale / Error), and a detail modal with a 7-day chart. React + TypeScript + Vite, built
on **Feature-Sliced Design**.

## Getting started

Requires Node 18+ and pnpm.

```bash
pnpm install
cp .env.example .env.local   # optional: set VITE_CG_KEY (CoinGecko demo key)
pnpm dev                     # http://localhost:5173
```

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | `tsc --noEmit` + Vite production build |
| `pnpm test` | Vitest (pure-logic unit tests) |
| `pnpm lint` | ESLint (`any` and `console` are errors) |
| `pnpm typecheck` | Type check without building |

**The API key is optional** — the public endpoint works without it (lower rate limits). When
`VITE_CG_KEY` is set it is sent as the `x-cg-demo-api-key` header. The key is **never committed**
(`.env.local` is gitignored).

## What's implemented

- **Market table** — 250 coins in a single request, virtualized (`@tanstack/react-virtual`),
  columns `# / Asset / Price / 1h / 24h / 7d / Market cap / Volume (24h) / Last 7d`.
- **Exploration** — debounced search and sorting (dropdown + clickable headers), fully synced to
  the URL (`?q=`, `?sort=`, `?dir=`): links survive reload and are shareable.
- **Data freshness** — Live / Stale / Error badge with a ticking "updated N ago", manual Refresh,
  and a banner when data is stale. `429` → last good snapshot served as **stale** (never a blank
  screen).
- **Coin modal** — opens from the sparkline or via `?coin=<id>` (deep-link; closes via
  Back / Esc / backdrop): a 7-day area chart (hand-rolled SVG), 7d high/low, market cap, volume.
- **Density** — Compact / Cozy toggle on Redux Toolkit, persisted to `localStorage`.
- **States** — loading skeleton, error + retry, empty (no matches), stale.
- a11y basics: semantic `<table>`, `aria-sort`, keyboard support, modal focus management, and a
  `+/-` sign that duplicates the up/down colour.

## Data source

CoinGecko `GET /api/v3/coins/markets` (`per_page=250`, `page=1`, `sparkline=true`,
`price_change_percentage=1h,24h,7d`). No pagination — the whole dataset arrives in one call.
The raw DTO is mapped to a clean `Coin` domain model in the `api` segment; React Query caches it
(`staleTime`/`refetchInterval` ~60s). 7d high/low and the chart are derived from
`sparkline_in_7d.price` (the endpoint only ships 24h extremes).

**Mock fallback** — a captured snapshot at `entities/coin/api/markets.mock.json` (a lazy chunk,
loaded only on failure / `429` / `VITE_USE_MOCK=true`), flagged in the UI as **Stale**.

## Trade-offs / limitations

- Single currency (USD): `vsCurrency` lives in Redux and feeds the `queryKey`, but no currency
  switcher was added — the design doesn't call for one.
- The mock is a static snapshot of real data; its sparklines are not "live".
- Virtualization measures row height dynamically (`measureElement`) — correct across density
  changes, at the cost of a couple of extra layout passes.
