import clsx from 'clsx';
import type { Freshness } from '@/entities/coin';
import styles from './MarketToolbar.module.scss';

interface FreshnessBadgeProps {
  freshness: Freshness;
}

const DOT_CLASS = {
  live: 'dotLive',
  stale: 'dotStale',
  error: 'dotError',
} as const;

const LABEL_CLASS = {
  live: 'labelLive',
  stale: 'labelStale',
  error: 'labelError',
} as const;

export function FreshnessBadge({ freshness }: FreshnessBadgeProps) {
  const { status, label, timeText } = freshness;

  return (
    <div className={styles.badge} role="status" aria-live="polite">
      <span className={clsx(styles.dot, styles[DOT_CLASS[status]])} aria-hidden="true" />
      <span className={clsx(styles.badgeLabel, styles[LABEL_CLASS[status]])}>{label}</span>
      {timeText !== '' && <span className={styles.badgeTime}>{timeText}</span>}
    </div>
  );
}
