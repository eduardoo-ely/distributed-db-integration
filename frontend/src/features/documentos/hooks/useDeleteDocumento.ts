/**
 * Hook to delete documento
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentoService } from '@/api/services/documentoService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import { getErrorMessage } from '@/utils/errorHandler';

export function useDeleteDocumento() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    mutationFn: (id: string) => documentoService.delete(id),
    onSuccess: (_, id) => {
      // Invalidate documentos list query
      queryClient.invalidateQueries({ queryKey: ['documentos'] });

      // Show success message
      success('Documento excluído com sucesso!');

      // Add activity
      addActivity({
        type: 'delete',
        database: 'mongodb',
        description: `Documento excluído (ID: ${id})`,
      });
    },
    onError: (err) => {
      error(getErrorMessage(err), 'Erro ao excluir documento');
    },
  });
}
