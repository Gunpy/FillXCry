import clsx from 'clsx';
import { buildSparklinePoints, SPARKLINE_VIEWBOX } from '../model/sparkline';
import styles from './Sparkline.module.scss';

interface SparklineProps {
  values: number[];
  positive: boolean;
}

export function Sparkline({ values, positive }: SparklineProps) {
  const points = buildSparklinePoints(values);
  if (points === '') {
    return <span className={styles.empty} aria-hidden="true" />;
  }

  return (
    <svg
      className={clsx(styles.spark, positive ? styles.up : styles.down)}
      width="88"
      height="26"
      viewBox={SPARKLINE_VIEWBOX}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={points} fill="none" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
