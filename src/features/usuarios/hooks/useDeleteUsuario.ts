/**
 * Hook to delete usuario
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService } from '@/api/services/usuarioService';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/appStore';
import { getErrorMessage } from '@/utils/errorHandler';

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  
  // Garantindo que a seleção do estado no Zustand está correta
  const addActivity = useAppStore((state) => state.addActivity);

  return useMutation({
    // Definindo explicitamente o tipo do parâmetro para evitar conflitos
    mutationFn: (id: string) => usuarioService.delete(id),
    
    onSuccess: (_, id) => {
      // Invalida a query para atualizar a lista de usuários automaticamente
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });

      // Feedback visual positivo
      success('Usuário excluído com sucesso!');

      // Registra a atividade no dashboard (PostgreSQL conforme seu log)
      addActivity({
        type: 'delete',
        database: 'postgres',
        description: `Usuário excluído (ID: ${id})`,
      });
    },
    
    onError: (err: any) => {
      // Captura o erro formatado através do seu utilitário
      error(getErrorMessage(err), 'Erro ao excluir usuário');
    },
  });
}