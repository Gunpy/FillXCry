import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  useMarkets,
  CoinLogo,
  formatPrice,
  formatCompact,
  formatPercent,
  priceRange,
} from '@/entities/coin';
import { selectVsCurrency } from '@/entities/preferences';
import { useCoinSelection } from '@/features/coin-detail';
import { useAppSelector } from '@/shared/lib/store';
import { PriceAreaChart } from './PriceAreaChart';
import styles from './CoinDetailModal.module.scss';

const TITLE_ID = 'coin-detail-title';

export function CoinDetailModal() {
  const vsCurrency = useAppSelector(selectVsCurrency);
  const { data } = useMarkets(vsCurrency);
  const { selectedId, close } = useCoinSelection();
  const coin = selectedId ? (data?.coins.find((item) => item.id === selectedId) ?? null) : null;

  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (coin === null) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [coin, close]);

  if (coin === null) return null;

  const positive = (coin.change7d ?? 0) >= 0;
  const range = priceRange(coin.sparkline7d);

  return (
    <div className={styles.backdrop} onClick={close}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <CoinLogo symbol={coin.symbol} image={coin.image} size={30} />
          <div className={styles.heading}>
            <div className={styles.titleRow}>
              <span id={TITLE_ID} className={styles.name}>
                {coin.name}
              </span>
              <span className={styles.ticker}>{coin.symbol}</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(coin.price)}</span>
              {coin.change7d !== null && (
                <span className={clsx(styles.pill, positive ? styles.pillUp : styles.pillDown)}>
                  {formatPercent(coin.change7d)} · 7d
                </span>
              )}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={close}
            aria-label="Close details"
          >
            ×
          </button>
        </header>

        <PriceAreaChart values={coin.sparkline7d} positive={positive} />

        <dl className={styles.stats}>
          <Stat label="7d high" value={range ? formatPrice(range.high) : '—'} />
          <Stat label="7d low" value={range ? formatPrice(range.low) : '—'} />
          <Stat label="Market cap" value={formatCompact(coin.marketCap)} />
          <Stat label="Volume (24h)" value={formatCompact(coin.volume24h)} />
        </dl>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statLabel}>{label}</dt>
      <dd className={styles.statValue}>{value}</dd>
    </div>
  );
}
