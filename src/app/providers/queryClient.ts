import { QueryClient } from '@tanstack/react-query';
import { REFETCH_MS, STALE_MS } from '@/shared/config/api';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_MS,
        refetchInterval: REFETCH_MS,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
