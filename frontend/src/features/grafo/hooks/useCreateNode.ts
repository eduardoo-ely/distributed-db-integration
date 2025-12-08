import { useMutation, useQueryClient } from '@tanstack/react-query';
import { grafoService } from '@/api/services/grafoService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import { getErrorMessage } from '@/utils/errorHandler';
import type { NodeFormData } from '../types/grafo.types';

export function useCreateNode() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    mutationFn: (data: NodeFormData) => grafoService.createNode(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['graph'] });
      success('Nó criado com sucesso!');
      addActivity({ type: 'create', database: 'neo4j', description: `Nó criado: ${data.label}` });
    },
    onError: (err) => {
      error(getErrorMessage(err), 'Erro ao criar nó');
    },
  });
}
