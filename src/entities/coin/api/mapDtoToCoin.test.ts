import { describe, it, expect } from 'vitest';
import { mapDtoToCoin, mapMarketEntries } from './mapDtoToCoin';
import { MarketError } from './errors';
import type { CoinMarketDTO } from './dto';

const fullDto: CoinMarketDTO = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.test/btc.png',
  current_price: 64000,
  market_cap: 1.32e12,
  market_cap_rank: 1,
  total_volume: 2.1e10,
  price_change_percentage_1h_in_currency: 0.4,
  price_change_percentage_24h_in_currency: -1.2,
  price_change_percentage_7d_in_currency: 5.6,
  sparkline_in_7d: { price: [100, 101, 102] },
  last_updated: '2026-06-22T00:00:00.000Z',
};

describe('mapDtoToCoin', () => {
  it('maps a complete entry and uppercases the ticker', () => {
    const coin = mapDtoToCoin(fullDto, 0);
    expect(coin).toEqual({
      id: 'bitcoin',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      image: 'https://example.test/btc.png',
      price: 64000,
      change1h: 0.4,
      change24h: -1.2,
      change7d: 5.6,
      marketCap: 1.32e12,
      volume24h: 2.1e10,
      sparkline7d: [100, 101, 102],
    });
  });

  it('fills sane defaults when fields are null', () => {
    const sparse: CoinMarketDTO = {
      ...fullDto,
      image: null,
      current_price: null,
      market_cap: null,
      market_cap_rank: null,
      total_volume: null,
      price_change_percentage_1h_in_currency: null,
      price_change_percentage_24h_in_currency: null,
      price_change_percentage_7d_in_currency: null,
      sparkline_in_7d: null,
    };
    const coin = mapDtoToCoin(sparse, 7);

    expect(coin.rank).toBe(8); // index + 1 fallback
    expect(coin.image).toBe('');
    expect(coin.price).toBe(0);
    expect(coin.change1h).toBeNull();
    expect(coin.change24h).toBeNull();
    expect(coin.change7d).toBeNull();
    expect(coin.marketCap).toBe(0);
    expect(coin.volume24h).toBe(0);
    expect(coin.sparkline7d).toEqual([]);
  });
});

describe('mapMarketEntries', () => {
  it('threads the array index into the rank fallback', () => {
    const noRank: CoinMarketDTO = { ...fullDto, market_cap_rank: null };
    const coins = mapMarketEntries([fullDto, noRank]);
    expect(coins.map((c) => c.rank)).toEqual([1, 2]); // second entry: index 1 → rank 2
  });

  it('normalizes a malformed entry into a parse MarketError', () => {
    expect(() => mapMarketEntries([fullDto, { id: 'broken' }])).toThrow(MarketError);
    try {
      mapMarketEntries([{ name: 'no symbol' }]);
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(MarketError);
      expect((error as MarketError).kind).toBe('parse');
    }
  });
});
