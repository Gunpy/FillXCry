import type { SortKey } from '@/entities/coin';
import { useSort } from '../model/useSort';
import { SORT_OPTIONS } from '../lib/options';
import styles from './SortSelect.module.scss';

export function SortSelect() {
  const { sortKey, selectKey } = useSort();
  // When a header-only column (e.g. 1h) is active, no option matches — show the placeholder.
  const matched = SORT_OPTIONS.some((option) => option.key === sortKey);

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Sort</span>
      <select
        className={styles.select}
        value={matched ? sortKey : ''}
        onChange={(event) => selectKey(event.target.value as SortKey)}
        aria-label="Sort assets by"
      >
        {!matched && (
          <option value="" disabled hidden>
            Custom
          </option>
        )}
        {SORT_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
