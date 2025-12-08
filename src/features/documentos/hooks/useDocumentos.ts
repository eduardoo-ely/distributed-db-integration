/**
 * Hook to fetch documentos list
 */

import { useQuery } from '@tanstack/react-query';
import { documentoService } from '@/api/services/documentoService';
import type { PaginationParams } from '@/types/common.types';
import type { DocumentoFilters } from '../types/documento.types';

export function useDocumentos(params: PaginationParams, filters?: DocumentoFilters) {
  return useQuery({
    queryKey: ['documentos', params, filters],
    queryFn: () => documentoService.getAll(params, filters),
    staleTime: 30000, // 30 seconds
  });
}
