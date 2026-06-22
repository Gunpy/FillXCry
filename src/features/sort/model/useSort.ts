import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isSortKey, isSortDir, defaultDirFor, type SortKey, type SortDir } from '@/entities/coin';

const DEFAULT_KEY: SortKey = 'mcap';
const DEFAULT_DIR: SortDir = 'desc';

interface SortControl {
  sortKey: SortKey;
  sortDir: SortDir;
  /** Dropdown choice — always descending (all options are figures). */
  selectKey: (key: SortKey) => void;
  /** Header click — flip direction if already active, else the column's natural default. */
  toggleKey: (key: SortKey) => void;
}

export function useSort(): SortControl {
  const [params, setParams] = useSearchParams();
  const rawKey = params.get('sort');
  const rawDir = params.get('dir');
  const sortKey = isSortKey(rawKey) ? rawKey : DEFAULT_KEY;
  const sortDir = isSortDir(rawDir) ? rawDir : DEFAULT_DIR;

  const apply = useCallback(
    (key: SortKey, dir: SortDir) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('sort', key);
          next.set('dir', dir);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const selectKey = useCallback((key: SortKey) => apply(key, 'desc'), [apply]);

  const toggleKey = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        apply(key, sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        apply(key, defaultDirFor(key));
      }
    },
    [apply, sortKey, sortDir],
  );

  return { sortKey, sortDir, selectKey, toggleKey };
}
