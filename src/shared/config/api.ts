// CoinGecko market endpoint configuration. All 250 assets arrive in a single request
// (no pagination — the long list is virtualized). Tunables live here, never inline.

export const CG_BASE_URL = 'https://api.coingecko.com/api/v3';

export const PER_PAGE = 250;
export const MARKETS_PAGE = 1;

/** React Query staleTime / background refetch cadence. */
export const STALE_MS = 60_000;
export const REFETCH_MS = 60_000;

/** Freshness flips from "live" to "stale" once data is older than this. */
export const STALE_AFTER_MS = 120_000;

export const DEFAULT_VS_CURRENCY = 'usd';

/** Build the markets URL for a given fiat/crypto vs-currency. */
export function buildMarketsUrl(vsCurrency: string): string {
  const params = new URLSearchParams({
    vs_currency: vsCurrency,
    order: 'market_cap_desc',
    per_page: String(PER_PAGE),
    page: String(MARKETS_PAGE),
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d',
  });
  return `${CG_BASE_URL}/coins/markets?${params.toString()}`;
}
