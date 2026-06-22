import { STALE_AFTER_MS } from '@/shared/config/api';
import type { MarketSource } from './types';

export type FreshnessStatus = 'live' | 'stale' | 'error';

export interface FreshnessInput {
  hasData: boolean;
  source: MarketSource | null;
  /** Timestamp (ms) of the last successful fetch, or null if none yet. */
  lastUpdatedAt: number | null;
  /** Caller-supplied "now" — the domain never reads the clock itself. */
  now: number;
  isError: boolean;
}

/**
 * Map query + data age onto the three visible states. Mock data and a failed refetch over
 * last-good data both read as "stale"; only a failure with nothing cached is a hard "error".
 */
export function deriveFreshness(input: FreshnessInput): FreshnessStatus {
  if (!input.hasData) {
    return input.isError ? 'error' : 'live';
  }
  if (input.source === 'mock' || input.isError) {
    return 'stale';
  }
  if (input.lastUpdatedAt !== null && input.now - input.lastUpdatedAt > STALE_AFTER_MS) {
    return 'stale';
  }
  return 'live';
}

/** Human "updated N ago" caption; pure, with `now` supplied by the caller. */
export function describeUpdatedAt(
  status: FreshnessStatus,
  lastUpdatedAt: number | null,
  now: number,
): string {
  if (status === 'error') return 'failed to update';
  if (lastUpdatedAt === null) return '';

  const seconds = Math.floor(Math.max(0, now - lastUpdatedAt) / 1000);
  if (seconds < 10) return 'updated just now';
  if (seconds < 60) return `updated ${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `updated ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `updated ${hours}h ago`;
}
