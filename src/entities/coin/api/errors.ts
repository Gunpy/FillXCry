// Normalized market errors. The UI never sees a raw Response/exception — only this typed
// shape, discriminated by `kind`, so each data state maps to a real cause (CLAUDE.md §6).

export type MarketErrorKind = 'network' | 'rateLimited' | 'http' | 'parse';

export class MarketError extends Error {
  readonly kind: MarketErrorKind;
  readonly status?: number;

  constructor(
    kind: MarketErrorKind,
    message: string,
    options?: { status?: number; cause?: unknown },
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'MarketError';
    this.kind = kind;
    this.status = options?.status;
  }
}

export function httpStatusToMarketError(status: number): MarketError {
  if (status === 429) {
    return new MarketError('rateLimited', 'CoinGecko rate limit reached', { status });
  }
  return new MarketError('http', `Market request failed (${status})`, { status });
}

/** Rate limiting falls back to the cached snapshot instead of blanking the table. */
export function shouldFallbackToMock(error: unknown): boolean {
  return error instanceof MarketError && error.kind === 'rateLimited';
}
