import styles from './MarketToolbar.module.scss';

interface StaleBannerProps {
  isMock: boolean;
}

export function StaleBanner({ isMock }: StaleBannerProps) {
  return (
    <div className={styles.banner} role="status">
      <span className={styles.bannerDot} aria-hidden="true" />
      {isMock
        ? 'Showing a cached snapshot — the live price feed is unavailable.'
        : 'Showing cached prices — data hasn’t refreshed recently.'}
    </div>
  );
}
