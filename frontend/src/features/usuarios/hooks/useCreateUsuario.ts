/**
 * Hook to create new usuario
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService } from '@/api/services/usuarioService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import type { CreateUsuarioDto } from '../types/usuario.types';
import { getErrorMessage } from '@/utils/errorHandler';

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    mutationFn: (usuario: CreateUsuarioDto) => usuarioService.create(usuario),
    onSuccess: (data) => {
      // Invalidate usuarios list query
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });

      // Show success message
      success('Usuário criado com sucesso!');

      // Add activity
      addActivity({
        type: 'create',
        database: 'postgres',
        description: `Usuário "${data.nome}" criado`,
      });
    },
    onError: (err) => {
      error(getErrorMessage(err), 'Erro ao criar usuário');
    },
  });
}
