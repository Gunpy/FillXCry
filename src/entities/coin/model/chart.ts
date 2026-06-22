import { formatPrice } from './format';

// Detail-chart geometry on the design's 720×240 viewBox. Pure: `nowMs` is supplied so the
// x-axis date labels never read the clock here.
const W = 720;
const H = 240;
const PAD_L = 2;
const PAD_R = 2;
const PAD_T = 16;
const PAD_B = 8;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const GRID_FRACTIONS = [0, 0.25, 0.5, 0.75, 1];
const X_TICK_DAYS = [6, 4, 2, 0];
const DAY_MS = 86_400_000;

export interface AreaChart {
  viewBox: string;
  line: string;
  area: string;
  gridYs: number[];
  yLabels: ReadonlyArray<{ y: number; label: string }>;
  xLabels: ReadonlyArray<{ pct: string; label: string }>;
}

export function buildAreaChart(values: number[], nowMs: number): AreaChart | null {
  const count = values.length;
  if (count < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const x = (index: number) => PAD_L + (PLOT_W * index) / (count - 1);
  const y = (value: number) => PAD_T + PLOT_H * (1 - (value - min) / range);

  const line = values.map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(' ');
  const area = `${line} ${x(count - 1).toFixed(1)},${H - PAD_B} ${x(0).toFixed(1)},${H - PAD_B}`;
  const gridYs = GRID_FRACTIONS.map((fraction) => Number((PAD_T + PLOT_H * fraction).toFixed(1)));

  const yLabels = [max, min + range / 2, min].map((value, index) => ({
    y: Number((PAD_T + PLOT_H * (index * 0.5)).toFixed(1)),
    label: formatPrice(value),
  }));

  const xLabels = X_TICK_DAYS.map((daysAgo) => ({
    pct: `${((100 * (6 - daysAgo)) / 6).toFixed(1)}%`,
    label: new Date(nowMs - daysAgo * DAY_MS).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return { viewBox: `0 0 ${W} ${H}`, line, area, gridYs, yLabels, xLabels };
}

/** 7-day high/low straight from the sparkline series (the markets endpoint only carries 24h). */
export function priceRange(values: number[]): { high: number; low: number } | null {
  if (values.length === 0) return null;
  return { high: Math.max(...values), low: Math.min(...values) };
}
