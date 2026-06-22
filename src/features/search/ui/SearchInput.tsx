import { useSearchQuery } from '../model/useSearchQuery';
import styles from './SearchInput.module.scss';

export function SearchInput() {
  const { query, setQuery } = useSearchQuery();

  return (
    <div className={styles.field}>
      <input
        className={styles.input}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search asset or ticker"
        spellCheck={false}
        aria-label="Search assets"
      />
    </div>
  );
}
