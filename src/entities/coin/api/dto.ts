// Raw CoinGecko /coins/markets entry. Lives only in the api segment and is mapped to the
// domain Coin before anything else sees it. Nullable where the API can omit values.

export interface CoinSparklineDTO {
  price: number[];
}

export interface CoinMarketDTO {
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  sparkline_in_7d: CoinSparklineDTO | null;
  last_updated: string;
}
