/**
 * Hook to fetch single usuario by ID
 */

import { useQuery } from '@tanstack/react-query';
import { usuarioService } from '@/api/services/usuarioService';

export function useUsuario(id: string | undefined) {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => usuarioService.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  });
}
