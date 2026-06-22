import clsx from 'clsx';
import { changeDirection, formatChange } from '../model/format';
import styles from './ChangeCell.module.scss';

interface ChangeCellProps {
  value: number | null;
}

// The leading +/- sign carries direction textually, so meaning never rests on colour alone.
export function ChangeCell({ value }: ChangeCellProps) {
  const direction = changeDirection(value);
  return <span className={clsx(styles.change, styles[direction])}>{formatChange(value)}</span>;
}
