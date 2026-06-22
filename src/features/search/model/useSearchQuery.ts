import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SearchQuery {
  query: string;
  setQuery: (value: string) => void;
}

// The URL `q` param is the source of truth for search, so it survives reload and is shareable.
export function useSearchQuery(): SearchQuery {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';

  const setQuery = useCallback(
    (value: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === '') {
            next.delete('q');
          } else {
            next.set('q', value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  return { query, setQuery };
}
