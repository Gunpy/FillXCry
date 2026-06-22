import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatCompact,
  formatPercent,
  formatChange,
  changeDirection,
} from './format';

describe('formatPrice', () => {
  it('groups thousands with two decimals', () => {
    expect(formatPrice(64000)).toBe('$64,000.00');
    expect(formatPrice(1234.5)).toBe('$1,234.50');
  });

  it('uses two decimals between 1 and 1000', () => {
    expect(formatPrice(72)).toBe('$72.00');
    expect(formatPrice(1)).toBe('$1.00');
  });

  it('adds precision as the price shrinks', () => {
    expect(formatPrice(0.52)).toBe('$0.5200');
    expect(formatPrice(0.0023)).toBe('$0.002300');
  });

  it('falls back to exponential for dust', () => {
    expect(formatPrice(0.000023)).toBe('$2.30e-5');
  });

  it('guards non-finite and non-positive input', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(Number.NaN)).toBe('—');
  });
});

describe('formatCompact', () => {
  it('renders trillions, billions, millions and thousands', () => {
    expect(formatCompact(1.32e12)).toBe('$1.32T');
    expect(formatCompact(4.5e9)).toBe('$4.50B');
    expect(formatCompact(6.78e8)).toBe('$678.0M');
    expect(formatCompact(12_300)).toBe('$12.3K');
  });

  it('renders bare dollars below a thousand', () => {
    expect(formatCompact(640)).toBe('$640');
  });

  it('guards non-finite input', () => {
    expect(formatCompact(Number.NaN)).toBe('—');
    expect(formatCompact(Number.POSITIVE_INFINITY)).toBe('—');
  });
});

describe('formatPercent / formatChange', () => {
  it('prefixes a sign', () => {
    expect(formatPercent(2.41)).toBe('+2.41%');
    expect(formatPercent(-0.88)).toBe('-0.88%');
    expect(formatPercent(0)).toBe('+0.00%');
  });

  it('renders an em dash for a missing or non-finite window', () => {
    expect(formatChange(null)).toBe('—');
    expect(formatChange(Number.NaN)).toBe('—');
    expect(formatChange(1.5)).toBe('+1.50%');
  });
});

describe('changeDirection', () => {
  it('classifies up, down and near-zero as flat', () => {
    expect(changeDirection(3.2)).toBe('up');
    expect(changeDirection(-1.1)).toBe('down');
    expect(changeDirection(0.04)).toBe('flat');
    expect(changeDirection(-0.049)).toBe('flat');
  });

  it('treats the exact threshold (0.05) as a real move, not flat', () => {
    // The comparison is strict `<`, so ±0.05 sits just outside the flat band.
    expect(changeDirection(0.05)).toBe('up');
    expect(changeDirection(-0.05)).toBe('down');
  });

  it('treats null and non-finite values as flat', () => {
    expect(changeDirection(null)).toBe('flat');
    expect(changeDirection(Number.NaN)).toBe('flat');
  });
});
