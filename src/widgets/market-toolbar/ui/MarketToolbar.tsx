import { useMemo } from 'react';
import { useMarkets, useFreshness, filterCoins } from '@/entities/coin';
import { selectVsCurrency } from '@/entities/preferences';
import { SearchInput, useSearchQuery } from '@/features/search';
import { SortSelect } from '@/features/sort';
import { DensityToggle } from '@/features/density';
import { RefreshButton } from '@/features/refresh';
import { useAppSelector } from '@/shared/lib/store';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { FreshnessBadge } from './FreshnessBadge';
import { StaleBanner } from './StaleBanner';
import styles from './MarketToolbar.module.scss';

const COUNT_DEBOUNCE_MS = 200;

export function MarketToolbar() {
  const vsCurrency = useAppSelector(selectVsCurrency);
  const { data } = useMarkets(vsCurrency);
  const freshness = useFreshness(vsCurrency);
  const { query } = useSearchQuery();
  const debouncedQuery = useDebouncedValue(query, COUNT_DEBOUNCE_MS);

  const total = data?.coins.length ?? 0;
  const visible = useMemo(
    () => (data ? filterCoins(data.coins, debouncedQuery).length : 0),
    [data, debouncedQuery],
  );
  const countText = debouncedQuery.trim() === '' ? `${total} assets` : `${visible} of ${total}`;

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.brand}>
          <span className={styles.title}>Markets</span>
          <span className={styles.count}>{countText}</span>
        </div>
        <SearchInput />
        <SortSelect />
        <DensityToggle />
        <div className={styles.spacer} />
        <FreshnessBadge freshness={freshness} />
        <RefreshButton />
      </div>
      {freshness.status === 'stale' && <StaleBanner isMock={freshness.isMock} />}
    </>
  );
}
