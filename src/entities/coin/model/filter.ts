import type { Coin } from './types';

/** Case-insensitive match on name or ticker. Returns the input untouched when query is blank. */
export function filterCoins(coins: Coin[], query: string): Coin[] {
  const needle = query.trim().toLowerCase();
  if (needle === '') return coins;
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(needle) || coin.symbol.toLowerCase().includes(needle),
  );
}
