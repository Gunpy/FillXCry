// Pure geometry for the inline 7-day sparkline. Maps a price series onto the design's
// 90×30 viewBox (4px horizontal padding, plotted between y=4 and y=26).

const VIEW_WIDTH = 90;
const VIEW_HEIGHT = 30;
const PAD_X = 4;
const TOP = 4;
const BOTTOM = 26;

export const SPARKLINE_VIEWBOX = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;

/** SVG polyline `points` for the series, or '' when there is nothing to plot. */
export function buildSparklinePoints(values: readonly number[]): string {
  if (values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const lastIndex = values.length - 1;
  const span = VIEW_WIDTH - PAD_X * 2;
  const amplitude = BOTTOM - TOP;

  return values
    .map((value, index) => {
      const x = PAD_X + (span * index) / lastIndex;
      const y = BOTTOM - ((value - min) / range) * amplitude;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

/** Sign of the 7-day move inferred from the series (used when the % field is null). */
export function sparklineTrend(values: readonly number[]): number {
  if (values.length < 2) return 0;
  return values[values.length - 1] - values[0];
}
