import { useMemo, type CSSProperties } from 'react';
import clsx from 'clsx';
import { buildAreaChart } from '@/entities/coin';
import styles from './CoinDetailModal.module.scss';

interface PriceAreaChartProps {
  values: number[];
  positive: boolean;
}

export function PriceAreaChart({ values, positive }: PriceAreaChartProps) {
  const chart = useMemo(() => buildAreaChart(values, Date.now()), [values]);
  if (chart === null) return null;

  const tone = positive ? styles.up : styles.down;

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartCaption}>PRICE · LAST 7 DAYS</div>
      <svg className={styles.chart} viewBox={chart.viewBox} preserveAspectRatio="xMidYMid meet">
        {chart.gridYs.map((y) => (
          <line key={y} className={styles.grid} x1="2" x2="718" y1={y} y2={y} />
        ))}
        <polygon className={clsx(styles.area, tone)} points={chart.area} />
        <polyline
          className={clsx(styles.line, tone)}
          points={chart.line}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        {chart.yLabels.map((tick) => (
          <text key={tick.label} className={styles.yLabel} x="716" y={tick.y} dy="-3" textAnchor="end">
            {tick.label}
          </text>
        ))}
      </svg>
      <div className={styles.xAxis}>
        {chart.xLabels.map((tick) => (
          <span key={tick.label} className={styles.xTick} style={{ left: tick.pct } as CSSProperties}>
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  );
}
