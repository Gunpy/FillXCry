import { MarketToolbar } from '@/widgets/market-toolbar';
import { MarketTable } from '@/widgets/market-table';
import { CoinDetailModal } from '@/widgets/coin-detail-modal';
import styles from './MarketPage.module.scss';

export function MarketPage() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <MarketToolbar />
        <MarketTable />
      </section>
      <CoinDetailModal />
    </main>
  );
}
