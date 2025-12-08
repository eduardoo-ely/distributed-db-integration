import { useQuery } from '@tanstack/react-query';
import { grafoService } from '@/api/services/grafoService';

export function useGraph() {
  return useQuery({
    queryKey: ['graph'],
    queryFn: () => grafoService.getGraph(),
    staleTime: 30000,
  });
}
