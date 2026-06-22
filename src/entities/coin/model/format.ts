// Pure presentation logic for market figures. No side effects, no time, no DOM — these are
// the domain's number→string rules and are unit-tested. Movement is expressed as a direction
// (never a colour) so callers can satisfy "don't encode meaning by colour alone" (CLAUDE.md §10).

/** A change is treated as flat below this magnitude (matches the design's neutral threshold). */
export const FLAT_THRESHOLD = 0.05;

export type ChangeDirection = 'up' | 'down' | 'flat';

/** Tiered price precision: more decimals as the price shrinks, exponential for dust. */
export function formatPrice(price: number): string {
  if (!Number.isFinite(price)) return '—';
  if (price >= 1000) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price >= 1) return '$' + price.toFixed(2);
  if (price >= 0.01) return '$' + price.toFixed(4);
  if (price >= 0.0001) return '$' + price.toFixed(6);
  if (price <= 0) return '$0.00';
  return '$' + price.toExponential(2);
}

/** Compact magnitude for market cap / volume: $1.23T, $4.5B, $678.9M, $12.3K. */
export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e12) return '$' + (value / 1e12).toFixed(2) + 'T';
  if (abs >= 1e9) return '$' + (value / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return '$' + (value / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return '$' + (value / 1e3).toFixed(1) + 'K';
  return '$' + value.toFixed(0);
}

/** Signed percentage, e.g. "+2.41%" / "-0.88%". */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return sign + value.toFixed(2) + '%';
}

/** Percentage cell text, rendering an em dash when the window is unavailable. */
export function formatChange(value: number | null): string {
  return value === null || !Number.isFinite(value) ? '—' : formatPercent(value);
}

export function changeDirection(value: number | null): ChangeDirection {
  if (value === null || !Number.isFinite(value) || Math.abs(value) < FLAT_THRESHOLD) {
    return 'flat';
  }
  return value > 0 ? 'up' : 'down';
}
