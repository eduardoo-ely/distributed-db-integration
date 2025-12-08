import { useQuery } from '@tanstack/react-query';
import { cacheService } from '@/api/services/cacheService';

export function useCacheEntries(pattern?: string) {
  return useQuery({
    queryKey: ['cache-entries', pattern],
    queryFn: () => cacheService.getAll(pattern),
    staleTime: 10000,
  });
}
