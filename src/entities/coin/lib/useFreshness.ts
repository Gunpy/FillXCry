import { useEffect, useState } from 'react';
import { DEFAULT_VS_CURRENCY } from '@/shared/config/api';
import { useMarkets } from '../api/useMarkets';
import { deriveFreshness, describeUpdatedAt, type FreshnessStatus } from '../model/freshness';

const TICK_MS = 15_000;

const LABELS: Record<FreshnessStatus, string> = {
  live: 'Live',
  stale: 'Stale',
  error: 'Error',
};

export interface Freshness {
  status: FreshnessStatus;
  label: string;
  timeText: string;
  isMock: boolean;
}

/**
 * Live view of data freshness: re-derives the pure status against a ticking clock so the
 * caption ages and the badge can flip to "stale" without a refetch. Reads the same query as
 * the table (deduped by React Query).
 */
export function useFreshness(vsCurrency: string = DEFAULT_VS_CURRENCY): Freshness {
  const { data, isError, dataUpdatedAt } = useMarkets(vsCurrency);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const lastUpdatedAt = dataUpdatedAt > 0 ? dataUpdatedAt : null;
  const status = deriveFreshness({
    hasData: data !== undefined,
    source: data?.source ?? null,
    lastUpdatedAt,
    now,
    isError,
  });

  return {
    status,
    label: LABELS[status],
    timeText: describeUpdatedAt(status, lastUpdatedAt, now),
    isMock: data?.source === 'mock',
  };
}
