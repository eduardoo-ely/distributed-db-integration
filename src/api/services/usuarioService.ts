/**
 * Usuario API Service (PostgreSQL)
 */

import apiClient from '../axios.config';
import { ENDPOINTS as endpoints } from '../endpoints';
import type {
  Usuario,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UsuariosListResponse,
  UsuarioFilters,
} from '@/features/usuarios/types/usuario.types';
import type { PaginationParams } from '@/types';
import { buildQueryString } from '@/utils/helpers';

export const usuarioService = {
  /**
   * Get all usuarios with pagination and filters
   */
  async getAll(
    pagination: PaginationParams,
    filters?: UsuarioFilters
  ): Promise<UsuariosListResponse> {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    };

    const queryString = buildQueryString(params);
    const { data } = await apiClient.get<UsuariosListResponse>(
      `${endpoints.POSTGRES.USUARIOS.LIST}?${queryString}`
    );

    return data;
  },

  /**
   * Get usuario by ID
   */
  async getById(id: string): Promise<Usuario> {
    const { data } = await apiClient.get<Usuario>(endpoints.POSTGRES.USUARIOS.BY_ID(id));
    return data;
  },

  /**
   * Create new usuario
   */
  async create(usuario: CreateUsuarioDto): Promise<Usuario> {
    const { data } = await apiClient.post<Usuario>(endpoints.POSTGRES.USUARIOS.CREATE, usuario);
    return data;
  },

  /**
   * Update usuario
   */
  async update(id: string, usuario: UpdateUsuarioDto): Promise<Usuario> {
    const { data } = await apiClient.put<Usuario>(endpoints.POSTGRES.USUARIOS.UPDATE(id), usuario);
    return data;
  },

  /**
   * Delete usuario
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(endpoints.POSTGRES.USUARIOS.DELETE(id));
  },

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    try {
      const { data } = await apiClient.get<{ exists: boolean }>(
        endpoints.POSTGRES.USUARIOS.EMAIL_EXISTS,
        {
          params: { email, excludeId },
        }
      );
      return data.exists;
    } catch {
      return false;
    }
  },
};
