import { useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMarkets, CoinRow, filterCoins, sortCoins, type Coin } from '@/entities/coin';
import { selectDensity, selectVsCurrency } from '@/entities/preferences';
import { useSearchQuery } from '@/features/search';
import { useSort } from '@/features/sort';
import { useCoinSelection } from '@/features/coin-detail';
import { useAppSelector } from '@/shared/lib/store';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { MarketTableHeader } from './MarketTableHeader';
import { SkeletonRows } from './SkeletonRows';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { COLUMN_COUNT } from './columns';
import styles from './MarketTable.module.scss';

const ROW_ESTIMATE = 38;
const OVERSCAN = 12;
const SEARCH_DEBOUNCE_MS = 200;

// Stable reference so the useMemo below doesn't re-run while data is still loading.
const EMPTY_COINS: Coin[] = [];

export function MarketTable() {
  const vsCurrency = useAppSelector(selectVsCurrency);
  const density = useAppSelector(selectDensity);
  const { data, isLoading, isError, refetch } = useMarkets(vsCurrency);

  const { query, setQuery } = useSearchQuery();
  const { sortKey, sortDir } = useSort();
  const { open } = useCoinSelection();
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  const coins = data?.coins ?? EMPTY_COINS;
  const visibleCoins = useMemo(
    () => sortCoins(filterCoins(coins, debouncedQuery), sortKey, sortDir),
    [coins, debouncedQuery, sortKey, sortDir],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: visibleCoins.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_ESTIMATE,
    overscan: OVERSCAN,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  const showSkeleton = isLoading && coins.length === 0;
  const showError = isError && coins.length === 0;
  const showEmpty = !showSkeleton && !showError && visibleCoins.length === 0;
  const showRows = visibleCoins.length > 0;

  return (
    <div ref={scrollRef} className={styles.scroll}>
      <table className={clsx(styles.table, styles[density])}>
        <MarketTableHeader />
        <tbody>
          {showSkeleton && <SkeletonRows />}
          {showError && <ErrorState colSpan={COLUMN_COUNT} onRetry={() => void refetch()} />}
          {showEmpty && <EmptyState colSpan={COLUMN_COUNT} onClear={() => setQuery('')} />}

          {showRows && (
            <>
              {paddingTop > 0 && (
                <tr aria-hidden="true">
                  <td colSpan={COLUMN_COUNT} style={{ height: paddingTop }} />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const coin = visibleCoins[virtualRow.index];
                return (
                  <CoinRow
                    key={coin.id}
                    coin={coin}
                    onOpen={open}
                    ref={virtualizer.measureElement}
                    data-index={virtualRow.index}
                  />
                );
              })}
              {paddingBottom > 0 && (
                <tr aria-hidden="true">
                  <td colSpan={COLUMN_COUNT} style={{ height: paddingBottom }} />
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
