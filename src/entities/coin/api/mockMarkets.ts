import type { Coin } from '../model/types';
import { mapMarketEntries } from './mapDtoToCoin';

/**
 * Bundled fallback: a captured CoinGecko snapshot, mapped through the same DTO→domain path as
 * the live fetch. Lazily imported so the ~900 KB JSON is a separate chunk loaded only on
 * fallback (rate-limited / offline / VITE_USE_MOCK).
 */
export async function loadMockMarkets(): Promise<Coin[]> {
  const snapshot = await import('./markets.mock.json');
  return mapMarketEntries(snapshot.default);
}
