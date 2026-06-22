import clsx from 'clsx';
import { useSort } from '@/features/sort';
import type { SortKey } from '@/entities/coin';
import { COLUMNS } from './columns';
import styles from './MarketTable.module.scss';

export function MarketTableHeader() {
  const { sortKey, sortDir, toggleKey } = useSort();

  return (
    <thead className={styles.head}>
      <tr>
        {COLUMNS.map((column) => {
          const active = column.sortKey !== undefined && column.sortKey === sortKey;
          const alignClass = column.numeric ? styles.right : styles.left;

          if (column.sortKey === undefined) {
            return (
              <th key={column.key} scope="col" className={clsx(styles.th, alignClass)}>
                {column.label}
              </th>
            );
          }

          const headerSortKey: SortKey = column.sortKey;
          return (
            <th
              key={column.key}
              scope="col"
              className={clsx(styles.th, alignClass)}
              aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => toggleKey(headerSortKey)}
              >
                {column.label}
                {active && (
                  <span className={styles.sortArrow} aria-hidden="true">
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
