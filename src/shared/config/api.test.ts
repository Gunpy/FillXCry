import { describe, it, expect } from 'vitest';
import { buildMarketsUrl, PER_PAGE } from './api';

describe('buildMarketsUrl', () => {
  it('targets the single-batch markets endpoint with the required params', () => {
    const url = new URL(buildMarketsUrl('usd'));
    expect(url.pathname).toBe('/api/v3/coins/markets');

    const params = url.searchParams;
    expect(params.get('vs_currency')).toBe('usd');
    expect(params.get('order')).toBe('market_cap_desc');
    expect(params.get('per_page')).toBe(String(PER_PAGE));
    expect(PER_PAGE).toBe(250); // one request for the whole dataset, no pagination
    expect(params.get('page')).toBe('1');
    expect(params.get('sparkline')).toBe('true');
    expect(params.get('price_change_percentage')).toBe('1h,24h,7d');
  });

  it('reflects the requested vs-currency', () => {
    const url = new URL(buildMarketsUrl('eur'));
    expect(url.searchParams.get('vs_currency')).toBe('eur');
  });
});
