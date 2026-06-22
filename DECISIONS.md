# DECISIONS

The key engineering decisions and why they were made this way.

## Screen structure (FSD)

`app → pages → widgets → features → entities → shared`, imports go strictly downward, same-layer
slices don't know about each other, and the outside reaches a slice only through its `index.ts`.

- **`pages/market`** only composes widgets, with no logic or markup of its own:
  `MarketToolbar` + `MarketTable` + `CoinDetailModal`.
- **`widgets`** are self-contained blocks (`market-toolbar`, `market-table`, `coin-detail-modal`);
  each pulls its own data from React Query (deduped by `queryKey`) and reads the URL/Redux — so
  **no prop-drilling between widgets** is needed and the page is trivial.
- **`features`** are user scenarios (`search`, `sort`, `refresh`, `density`, `coin-detail`);
  shared logic is lifted into `entities`/`shared`, and features never import each other.
- **`entities/coin`** holds the domain (`Coin`, formatters, sort/filter, freshness, sparkline and
  chart geometry — all pure functions), `api` (DTO ≠ domain, a pure fetcher, normalized errors,
  the `useMarkets` hook), and `ui` (`CoinRow`, `Sparkline`, `CoinLogo`, `ChangeCell`).
- **`entities/preferences`** is the single Redux slice (client state).

Putting `FreshnessBadge` *inside* the toolbar widget (instead of making it a sibling widget) is a
deliberate call to avoid the forbidden "widget imports widget"; all freshness logic lives in
`entities/coin` (`useFreshness` + the pure `deriveFreshness`).

## Fetching and state boundaries

- **Server state → React Query** — the single source of market data, never duplicated. Transport
  (`fetchMarkets`) is separate from the hook: a pure function does the request and DTO→domain
  mapping, while the thin `useMarkets` just wraps it and implements the `429 → stale/mock` policy.
- **Shared UI state → URL** (`useSearchParams`): `q`, `sort`, `dir`, `coin`. The URL is the source
  of truth, so state is linkable and survives reload. Search writes to the URL instantly while the
  expensive filtering is debounced (`useDebouncedValue`) — no local state, no sync effects.
- **Client state → Redux Toolkit** (`density`, `vsCurrency`), persisted via a thin store
  subscription. Redux holds client state only; market data never goes in there.
- **Local ephemeral → `useState`** (modal focus/handlers). Derived state isn't stored — it's
  computed in `useMemo`.

Errors are normalized into a typed `MarketError` (`network | rateLimited | http | parse`); a raw
`Response`/exception never reaches the UI. A corrupt entry inside the array also becomes a typed
`parse` error rather than a bare `TypeError`.

## Visualizing movement

- **Sparkline** — a light inline SVG (`<polyline>`), no chart library; geometry is a pure function
  over a fixed `viewBox`.
- **Modal** — a hand-rolled area chart (`<polygon>` 8% fill + `<polyline>` line) on 720×240, with
  gridlines, price Y-labels and date X-labels. "Now" is passed in as an argument — the domain
  never reads the clock.
- **Colour is not the only signal**: gains/losses are duplicated with a `+/-` sign
  (`changeDirection` returns a direction, not a colour); the "flat" threshold is `|Δ| < 0.05%`.

## Performance

- 250 rows virtualized, only the visible ones render; `key` is the coin `id` (not the index).
- `CoinRow` is wrapped in `React.memo`; the `onOpen` callback is stable (`useCallback` inside
  `useCoinSelection`).
- Heavy filter/sort run in `useMemo`; the empty-array fallback is referentially stable.
- Search is debounced; the mock (901 KB) is a lazy `import()` — a separate chunk loaded only on
  the fallback path.

## What I'd improve with more time

- A currency switcher (the `vsCurrency` slice is already wired into the `queryKey`).
- A full focus trap in the modal (currently: focus the close button + Esc + focus restore).
- Tests for `deriveFreshness` and the chart geometry; an e2e pass over the URL flows.
- A watchlist (a second Redux slice) and a `prefers-color-scheme` dark theme.
