import type { SortKey } from '@/entities/coin';

export interface ColumnDef {
  key: string;
  label: string;
  numeric: boolean;
  sortKey?: SortKey;
}

// Column order is shared by the header and the skeleton; CoinRow renders its cells to match.
// `sortKey` marks the sortable columns (the sparkline column is not sortable).
export const COLUMNS: readonly ColumnDef[] = [
  { key: 'rank', label: '#', numeric: true, sortKey: 'rank' },
  { key: 'name', label: 'Asset', numeric: false, sortKey: 'name' },
  { key: 'price', label: 'Price', numeric: true, sortKey: 'price' },
  { key: 'h1', label: '1h', numeric: true, sortKey: 'h1' },
  { key: 'h24', label: '24h', numeric: true, sortKey: 'h24' },
  { key: 'd7', label: '7d', numeric: true, sortKey: 'd7' },
  { key: 'mcap', label: 'Market cap', numeric: true, sortKey: 'mcap' },
  { key: 'vol', label: 'Volume (24h)', numeric: true, sortKey: 'vol' },
  { key: 'spark', label: 'Last 7d', numeric: true },
];

export const COLUMN_COUNT = COLUMNS.length;
