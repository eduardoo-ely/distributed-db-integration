/**
 * Hook to fetch all usuarios with pagination and filters
 */

import { useQuery } from '@tanstack/react-query';
import { usuarioService } from '@/api/services/usuarioService';
import type { PaginationParams } from '@/types';
import type { UsuarioFilters } from '../types/usuario.types';

export function useUsuarios(pagination: PaginationParams, filters?: UsuarioFilters) {
  return useQuery({
    queryKey: ['usuarios', pagination, filters],
    queryFn: () => usuarioService.getAll(pagination, filters),
    staleTime: 1000 * 60, // 1 minute
  });
}
