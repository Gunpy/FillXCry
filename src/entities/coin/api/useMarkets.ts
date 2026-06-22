import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { DEFAULT_VS_CURRENCY } from '@/shared/config/api';
import type { MarketData } from '../model/types';
import { fetchMarkets } from './fetchMarkets';
import { loadMockMarkets } from './mockMarkets';
import { shouldFallbackToMock, type MarketError } from './errors';

const MOCK_ONLY = import.meta.env.VITE_USE_MOCK === 'true';

async function loadMarkets(vsCurrency: string): Promise<MarketData> {
  if (MOCK_ONLY) {
    return { coins: await loadMockMarkets(), source: 'mock' };
  }
  try {
    return { coins: await fetchMarkets(vsCurrency), source: 'live' };
  } catch (error) {
    // 429 → serve the snapshot flagged as stale rather than an error wall. Any other failure
    // propagates so React Query keeps last-good data (stale) or shows the error panel.
    if (shouldFallbackToMock(error)) {
      return { coins: await loadMockMarkets(), source: 'mock' };
    }
    throw error;
  }
}

export function useMarkets(
  vsCurrency: string = DEFAULT_VS_CURRENCY,
): UseQueryResult<MarketData, MarketError> {
  return useQuery<MarketData, MarketError>({
    queryKey: ['markets', vsCurrency],
    queryFn: () => loadMarkets(vsCurrency),
  });
}
