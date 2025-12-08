/**
 * Hook to update documento
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentoService } from '@/api/services/documentoService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import { getErrorMessage } from '@/utils/errorHandler';
import type { DocumentoFormData } from '../types/documento.types';

export function useUpdateDocumento(id: string) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    mutationFn: (data: DocumentoFormData) => documentoService.update(id, data),
    onSuccess: (data) => {
      // Invalidate documentos list and detail queries
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      queryClient.invalidateQueries({ queryKey: ['documento', id] });

      // Show success message
      success('Documento atualizado com sucesso!');

      // Add activity
      addActivity({
        type: 'update',
        database: 'mongodb',
        description: `Documento atualizado: ${data.titulo}`,
      });
    },
    onError: (err) => {
      error(getErrorMessage(err), 'Erro ao atualizar documento');
    },
  });
}
