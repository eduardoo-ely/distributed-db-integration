/**
 * Hook to create documento
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentoService } from '@/api/services/documentoService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import { getErrorMessage } from '@/utils/errorHandler';
import type { DocumentoFormData } from '../types/documento.types';

export function useCreateDocumento() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    mutationFn: (data: DocumentoFormData) => documentoService.create(data),
    onSuccess: (data) => {
      // Invalidate documentos list query
      queryClient.invalidateQueries({ queryKey: ['documentos'] });

      // Show success message
      success('Documento criado com sucesso!');

      // Add activity
      addActivity({
        type: 'create',
        database: 'mongodb',
        description: `Documento criado: ${data.titulo}`,
      });
    },
    onError: (err) => {
      error(getErrorMessage(err), 'Erro ao criar documento');
    },
  });
}
