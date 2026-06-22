import clsx from 'clsx';
import { useRefresh } from '../model/useRefresh';
import styles from './RefreshButton.module.scss';

export function RefreshButton() {
  const { refresh, isRefreshing } = useRefresh();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={refresh}
      disabled={isRefreshing}
      aria-label="Refresh market data"
    >
      <span className={clsx(styles.icon, isRefreshing && styles.spinning)} aria-hidden="true">
        ↻
      </span>
      Refresh
    </button>
  );
}
