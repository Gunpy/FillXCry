import type { Coin } from './types';

export type SortKey = 'rank' | 'name' | 'price' | 'h1' | 'h24' | 'd7' | 'mcap' | 'vol';
export type SortDir = 'asc' | 'desc';

export const SORT_KEYS: readonly SortKey[] = [
  'rank',
  'name',
  'price',
  'h1',
  'h24',
  'd7',
  'mcap',
  'vol',
];

const NUMERIC_FIELD: Record<Exclude<SortKey, 'name'>, (coin: Coin) => number | null> = {
  rank: (coin) => coin.rank,
  price: (coin) => coin.price,
  h1: (coin) => coin.change1h,
  h24: (coin) => coin.change24h,
  d7: (coin) => coin.change7d,
  mcap: (coin) => coin.marketCap,
  vol: (coin) => coin.volume24h,
};

/**
 * Stable-ish copy sort. Null change windows always sink to the bottom regardless of direction
 * so missing data never masquerades as a top or bottom mover.
 */
export function sortCoins(coins: Coin[], key: SortKey, dir: SortDir): Coin[] {
  const factor = dir === 'asc' ? 1 : -1;
  const sorted = [...coins];

  if (key === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name) * factor);
    return sorted;
  }

  const pick = NUMERIC_FIELD[key];
  sorted.sort((a, b) => {
    const av = pick(a);
    const bv = pick(b);
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    if (av === bv) return 0;
    return (av < bv ? -1 : 1) * factor;
  });
  return sorted;
}

export function isSortKey(value: string | null): value is SortKey {
  return value !== null && (SORT_KEYS as readonly string[]).includes(value);
}

export function isSortDir(value: string | null): value is SortDir {
  return value === 'asc' || value === 'desc';
}

/** Header clicks default to ascending for the label columns, descending for figures. */
export function defaultDirFor(key: SortKey): SortDir {
  return key === 'name' || key === 'rank' ? 'asc' : 'desc';
}
