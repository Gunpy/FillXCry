import { buildMarketsUrl } from '@/shared/config/api';
import type { Coin } from '../model/types';
import { mapMarketEntries } from './mapDtoToCoin';
import { MarketError, httpStatusToMarketError } from './errors';

function buildHeaders(): HeadersInit | undefined {
  const key = import.meta.env.VITE_CG_KEY;
  return key ? { 'x-cg-demo-api-key': key } : undefined;
}

/**
 * Pure transport: fetch all markets, map DTO → domain, and surface only a normalized
 * MarketError. Knows nothing about React Query or the mock fallback.
 */
export async function fetchMarkets(vsCurrency: string): Promise<Coin[]> {
  let response: Response;
  try {
    response = await fetch(buildMarketsUrl(vsCurrency), { headers: buildHeaders() });
  } catch (cause) {
    throw new MarketError('network', 'Could not reach the price feed', { cause });
  }

  if (!response.ok) {
    throw httpStatusToMarketError(response.status);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new MarketError('parse', 'Received a malformed market response', { cause });
  }

  if (!Array.isArray(payload)) {
    throw new MarketError('parse', 'Expected an array of market entries');
  }

  return mapMarketEntries(payload);
}
