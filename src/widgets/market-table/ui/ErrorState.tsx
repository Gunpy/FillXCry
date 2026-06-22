import styles from './MarketTable.module.scss';

interface ErrorStateProps {
  colSpan: number;
  onRetry: () => void;
}

export function ErrorState({ colSpan, onRetry }: ErrorStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.stateCell}>
        <div className={styles.errorPanel}>
          <div className={styles.errorIcon} aria-hidden="true">
            !
          </div>
          <div className={styles.errorTitle}>Couldn&rsquo;t load market data</div>
          <p className={styles.errorBody}>
            We couldn&rsquo;t reach the price feed. Check your connection and try again.
          </p>
          <button type="button" className={styles.retry} onClick={onRetry}>
            <span className={styles.retryIcon} aria-hidden="true">
              ↻
            </span>
            Retry
          </button>
        </div>
      </td>
    </tr>
  );
}
