import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface CoinSelection {
  selectedId: string | null;
  open: (id: string) => void;
  close: () => void;
}

// Selected coin lives in the URL (`coin` param) so the detail view is deep-linkable and
// browser Back closes it. Opening pushes history; closing replaces it.
export function useCoinSelection(): CoinSelection {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('coin');

  const open = useCallback(
    (id: string) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('coin', id);
        return next;
      });
    },
    [setParams],
  );

  const close = useCallback(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('coin');
        return next;
      },
      { replace: true },
    );
  }, [setParams]);

  return { selectedId, open, close };
}
