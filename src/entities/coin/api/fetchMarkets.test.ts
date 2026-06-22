import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchMarkets } from './fetchMarkets';
import type { CoinMarketDTO } from './dto';

const dto: CoinMarketDTO = {
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
  sparkline_in_7d: { price: [100, 101] },
  last_updated: '2026-06-22T00:00:00.000Z',
};

function makeResponse(body: unknown, init?: { ok?: boolean; status?: number; throwOnJson?: boolean }): Response {
  return {
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    json: init?.throwOnJson
      ? () => Promise.reject(new Error('bad json'))
      : () => Promise.resolve(body),
  } as unknown as Response;
}

afterEach(() => vi.unstubAllGlobals());

describe('fetchMarkets', () => {
  it('maps a successful response to domain coins', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse([dto])));
    const coins = await fetchMarkets('usd');
    expect(coins).toHaveLength(1);
    expect(coins[0].symbol).toBe('BTC');
    expect(coins[0].price).toBe(64000);
  });

  it('threads each array index into the rank fallback', async () => {
    const noRank = { ...dto, market_cap_rank: null };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse([dto, noRank])));
    const coins = await fetchMarkets('usd');
    expect(coins.map((c) => c.rank)).toEqual([1, 2]);
  });

  it('normalizes a malformed array entry to a parse MarketError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse([dto, { id: 'broken' }])));
    await expect(fetchMarkets('usd')).rejects.toMatchObject({ kind: 'parse' });
  });

  it('normalizes 429 to a rateLimited MarketError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse(null, { ok: false, status: 429 })));
    await expect(fetchMarkets('usd')).rejects.toMatchObject({ kind: 'rateLimited', status: 429 });
  });

  it('normalizes other failing statuses to an http MarketError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse(null, { ok: false, status: 500 })));
    await expect(fetchMarkets('usd')).rejects.toMatchObject({ kind: 'http', status: 500 });
  });

  it('normalizes a fetch rejection to a network MarketError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(fetchMarkets('usd')).rejects.toMatchObject({ kind: 'network' });
  });

  it('normalizes a non-array payload to a parse MarketError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse({ oops: true })));
    await expect(fetchMarkets('usd')).rejects.toMatchObject({ kind: 'parse' });
  });

  it('normalizes malformed JSON to a parse MarketError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse(null, { throwOnJson: true })));
    await expect(fetchMarkets('usd')).rejects.toMatchObject({ kind: 'parse' });
  });
});
