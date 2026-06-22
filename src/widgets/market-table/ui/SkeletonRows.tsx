import clsx from 'clsx';
import styles from './MarketTable.module.scss';

const SKELETON_ROW_COUNT = 12;

// Bar dimensions per column, matching the design's loading placeholders.
const CELLS: ReadonlyArray<{ width: number; height: number; avatar?: boolean }> = [
  { width: 14, height: 9 },
  { width: 96, height: 10, avatar: true },
  { width: 62, height: 10 },
  { width: 38, height: 10 },
  { width: 38, height: 10 },
  { width: 38, height: 10 },
  { width: 78, height: 10 },
  { width: 70, height: 10 },
  { width: 88, height: 18 },
];

export function SkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIndex) => (
        <tr key={rowIndex}>
          {CELLS.map((cell, cellIndex) => (
            <td key={cellIndex} className={styles.cell}>
              <div className={clsx(styles.skeletonCell, cell.avatar && styles.skeletonLead)}>
                {cell.avatar && <span className={styles.skeletonAvatar} />}
                <span
                  className={styles.skeletonBar}
                  style={{ width: cell.width, height: cell.height }}
                />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
