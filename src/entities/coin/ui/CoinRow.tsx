import { forwardRef, memo, type HTMLAttributes } from 'react';
import clsx from 'clsx';
import type { Coin } from '../model/types';
import { formatPrice, formatCompact } from '../model/format';
import { sparklineTrend } from '../model/sparkline';
import { CoinLogo } from './CoinLogo';
import { Sparkline } from './Sparkline';
import { ChangeCell } from './ChangeCell';
import styles from './CoinRow.module.scss';

interface CoinRowProps extends HTMLAttributes<HTMLTableRowElement> {
  coin: Coin;
  onOpen?: (id: string) => void;
}

// Memoized: in a virtualized 250-row table only the handful of visible rows should re-render.
// The ref + spread carry the virtualizer's measureElement wiring (data-index) onto the <tr>.
export const CoinRow = memo(
  forwardRef<HTMLTableRowElement, CoinRowProps>(function CoinRow(
    { coin, onOpen, className, ...rest },
    ref,
  ) {
    const positive7d = (coin.change7d ?? sparklineTrend(coin.sparkline7d)) >= 0;

    return (
      <tr ref={ref} className={clsx(styles.row, className)} {...rest}>
        <td className={clsx(styles.cell, styles.rank)}>{coin.rank}</td>
        <td className={clsx(styles.cell, styles.asset)}>
          <div className={styles.assetInner}>
            <CoinLogo symbol={coin.symbol} image={coin.image} />
            <span className={styles.name}>{coin.name}</span>
            <span className={styles.ticker}>{coin.symbol}</span>
          </div>
        </td>
        <td className={clsx(styles.cell, styles.price)}>{formatPrice(coin.price)}</td>
        <td className={clsx(styles.cell, styles.num)}>
          <ChangeCell value={coin.change1h} />
        </td>
        <td className={clsx(styles.cell, styles.num)}>
          <ChangeCell value={coin.change24h} />
        </td>
        <td className={clsx(styles.cell, styles.num)}>
          <ChangeCell value={coin.change7d} />
        </td>
        <td className={clsx(styles.cell, styles.mcap)}>{formatCompact(coin.marketCap)}</td>
        <td className={clsx(styles.cell, styles.vol)}>{formatCompact(coin.volume24h)}</td>
        <td className={clsx(styles.cell, styles.spark)}>
          {onOpen ? (
            <button
              type="button"
              className={styles.sparkButton}
              onClick={() => onOpen(coin.id)}
              aria-label={`View 7-day chart for ${coin.name}`}
            >
              <Sparkline values={coin.sparkline7d} positive={positive7d} />
            </button>
          ) : (
            <Sparkline values={coin.sparkline7d} positive={positive7d} />
          )}
        </td>
      </tr>
    );
  }),
);
