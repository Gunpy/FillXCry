import type { SortKey } from '@/entities/coin';

/** The dropdown's five figure-based sorts (column headers cover the rest). */
export const SORT_OPTIONS: ReadonlyArray<{ key: SortKey; label: string }> = [
  { key: 'mcap', label: 'Market cap' },
  { key: 'price', label: 'Price' },
  { key: 'h24', label: '24h change' },
  { key: 'd7', label: '7d change' },
  { key: 'vol', label: 'Volume' },
];
