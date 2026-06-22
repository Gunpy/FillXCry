import { useState, type CSSProperties } from 'react';
import clsx from 'clsx';
import { logoHue, monogram } from '../lib/logo';
import styles from './CoinLogo.module.scss';

interface CoinLogoProps {
  symbol: string;
  image: string;
  size?: number;
}

export function CoinLogo({ symbol, image, size = 22 }: CoinLogoProps) {
  const [failed, setFailed] = useState(false);
  const sizeVar = { '--logo-size': `${size}px` } as CSSProperties;

  if (image !== '' && !failed) {
    return (
      <img
        className={styles.logo}
        style={sizeVar}
        src={image}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  // Decorative: the asset name sits right next to it, so screen readers don't need the glyph.
  return (
    <span
      className={clsx(styles.logo, styles.fallback)}
      style={{ ...sizeVar, '--logo-hue': logoHue(symbol) } as CSSProperties}
      aria-hidden="true"
    >
      {monogram(symbol)}
    </span>
  );
}
