/**
 * Hook to update existing usuario
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService } from '@/api/services/usuarioService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import type { UpdateUsuarioDto } from '../types/usuario.types';
import { getErrorMessage } from '@/utils/errorHandler';

export function useUpdateUsuario(id: string) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    mutationFn: (usuario: UpdateUsuarioDto) => usuarioService.update(id, usuario),
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', id] });

      // Show success message
      success('Usuário atualizado com sucesso!');

      // Add activity
      addActivity({
        type: 'update',
        database: 'postgres',
        description: `Usuário "${data.nome}" atualizado`,
      });
    },
    onError: (err) => {
      error(getErrorMessage(err), 'Erro ao atualizar usuário');
    },
  });
}
