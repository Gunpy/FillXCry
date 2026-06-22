import type { Coin } from '../model/types';
import type { CoinMarketDTO } from './dto';
import { MarketError } from './errors';

/**
 * Map a list of raw entries to the domain, normalizing any per-entry shape corruption into a
 * typed `parse` MarketError. This is the single DTO→domain call site shared by the live fetch
 * and the mock fallback, so the UI never sees a raw TypeError from a malformed element.
 */
export function mapMarketEntries(entries: readonly unknown[]): Coin[] {
  try {
    return entries.map((entry, index) => mapDtoToCoin(entry as CoinMarketDTO, index));
  } catch (cause) {
    throw new MarketError('parse', 'Received a malformed market entry', { cause });
  }
}

/**
 * Map a raw CoinGecko entry into the domain model. `index` provides a rank fallback for the
 * rare asset CoinGecko returns without `market_cap_rank` (response is already cap-ordered).
 */
export function mapDtoToCoin(dto: CoinMarketDTO, index = 0): Coin {
  return {
    id: dto.id,
    rank: dto.market_cap_rank ?? index + 1,
    name: dto.name,
    symbol: dto.symbol.toUpperCase(),
    image: dto.image ?? '',
    price: dto.current_price ?? 0,
    change1h: dto.price_change_percentage_1h_in_currency ?? null,
    change24h: dto.price_change_percentage_24h_in_currency ?? null,
    change7d: dto.price_change_percentage_7d_in_currency ?? null,
    marketCap: dto.market_cap ?? 0,
    volume24h: dto.total_volume ?? 0,
    sparkline7d: dto.sparkline_in_7d?.price ?? [],
  };
}
