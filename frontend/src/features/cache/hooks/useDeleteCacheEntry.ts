import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cacheService } from '@/api/services/cacheService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import { getErrorMessage } from '@/utils/errorHandler';

export function useDeleteCacheEntry() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    mutationFn: (key: string) => cacheService.delete(key),
    onSuccess: (_, key) => {
      queryClient.invalidateQueries({ queryKey: ['cache-entries'] });
      success('Chave excluída com sucesso!');
      addActivity({ type: 'delete', database: 'redis', description: `Chave excluída: ${key}` });
    },
    onError: (err) => {
      error(getErrorMessage(err), 'Erro ao excluir chave');
    },
  });
}
