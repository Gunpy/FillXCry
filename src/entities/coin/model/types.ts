/** Clean domain model the UI works with. No DTO/transport shape leaks past the api segment. */
export interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image: string;
  price: number;
  /** Percent change; null when CoinGecko omits the window for this asset. */
  change1h: number | null;
  change24h: number | null;
  change7d: number | null;
  marketCap: number;
  volume24h: number;
  /** Hourly prices across the last 7 days (~168 points). Drives sparkline + detail chart. */
  sparkline7d: number[];
}

/** Where the rendered data came from — drives the freshness badge. */
export type MarketSource = 'live' | 'mock';

export interface MarketData {
  coins: Coin[];
  source: MarketSource;
}
