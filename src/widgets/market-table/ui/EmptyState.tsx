import styles from './MarketTable.module.scss';

interface EmptyStateProps {
  colSpan: number;
  onClear?: () => void;
}

export function EmptyState({ colSpan, onClear }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.stateCell}>
        <div className={styles.emptyPanel}>
          <div className={styles.emptyTitle}>No assets match your search</div>
          {onClear && (
            <button type="button" className={styles.clear} onClick={onClear}>
              Clear search
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
