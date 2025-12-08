import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cacheService } from '@/api/services/cacheService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import { getErrorMessage } from '@/utils/errorHandler';
import type { CacheEntryFormData } from '../types/cache.types';

export function useCreateCacheEntry() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    mutationFn: (data: CacheEntryFormData) => cacheService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cache-entries'] });
      success('Chave criada com sucesso!');
      addActivity({ type: 'create', database: 'redis', description: `Chave criada: ${data.key}` });
    },
    onError: (err) => {
      error(getErrorMessage(err), 'Erro ao criar chave');
    },
  });
}
