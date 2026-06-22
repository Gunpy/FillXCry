import { useCallback } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

interface RefreshControl {
  refresh: () => void;
  isRefreshing: boolean;
}

// Manual refetch of the market data. `isRefreshing` reflects any in-flight markets query so the
// icon can spin without this feature needing to know the active vs-currency.
export function useRefresh(): RefreshControl {
  const queryClient = useQueryClient();
  const isRefreshing = useIsFetching({ queryKey: ['markets'] }) > 0;

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['markets'] });
  }, [queryClient]);

  return { refresh, isRefreshing };
}
