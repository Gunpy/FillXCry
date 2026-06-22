import { describe, it, expect } from 'vitest';
import { MarketError, httpStatusToMarketError, shouldFallbackToMock } from './errors';

describe('httpStatusToMarketError', () => {
  it('maps 429 to a rate-limit error', () => {
    const error = httpStatusToMarketError(429);
    expect(error).toBeInstanceOf(MarketError);
    expect(error.kind).toBe('rateLimited');
    expect(error.status).toBe(429);
  });

  it('maps other statuses to a generic http error', () => {
    const error = httpStatusToMarketError(503);
    expect(error.kind).toBe('http');
    expect(error.status).toBe(503);
  });
});

describe('shouldFallbackToMock', () => {
  it('is true only for rate limiting', () => {
    expect(shouldFallbackToMock(httpStatusToMarketError(429))).toBe(true);
    expect(shouldFallbackToMock(httpStatusToMarketError(500))).toBe(false);
    expect(shouldFallbackToMock(new MarketError('network', 'offline'))).toBe(false);
    expect(shouldFallbackToMock(new Error('plain'))).toBe(false);
  });
});
