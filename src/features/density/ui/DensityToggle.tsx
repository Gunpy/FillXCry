import clsx from 'clsx';
import type { Density } from '@/entities/preferences';
import { useDensity } from '../model/useDensity';
import styles from './DensityToggle.module.scss';

const OPTIONS: ReadonlyArray<{ value: Density; label: string }> = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Cozy' },
];

export function DensityToggle() {
  const { density, choose } = useDensity();

  return (
    <div className={styles.toggle} role="group" aria-label="Row density">
      {OPTIONS.map((option) => {
        const active = option.value === density;
        return (
          <button
            key={option.value}
            type="button"
            className={clsx(styles.option, active && styles.active)}
            aria-pressed={active}
            onClick={() => choose(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
