/**
 * MongoDB Documento Service
 */

import apiClient from '../axios.config';
import { ENDPOINTS } from '../endpoints';
import type {
  Documento,
  DocumentoFormData,
  DocumentosResponse,
  DocumentoFilters,
} from '@/features/documentos/types/documento.types';
import type { PaginationParams } from '@/types/common.types';

export const documentoService = {
  /**
   * Get all documentos with pagination
   */
  async getAll(
    params: PaginationParams,
    filters?: DocumentoFilters
  ): Promise<DocumentosResponse> {
    const response = await apiClient.get<DocumentosResponse>(
      ENDPOINTS.MONGO.DOCUMENTOS.LIST,
      {
        params: {
          ...params,
          ...filters,
        },
      }
    );
    return response.data;
  },

  /**
   * Get documento by ID
   */
  async getById(id: string): Promise<Documento> {
    const response = await apiClient.get<Documento>(
      ENDPOINTS.MONGO.DOCUMENTOS.BY_ID(id)
    );
    return response.data;
  },

  /**
   * Create new documento
   */
  async create(data: DocumentoFormData): Promise<Documento> {
    const response = await apiClient.post<Documento>(
      ENDPOINTS.MONGO.DOCUMENTOS.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Update documento
   */
  async update(id: string, data: DocumentoFormData): Promise<Documento> {
    const response = await apiClient.put<Documento>(
      ENDPOINTS.MONGO.DOCUMENTOS.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Delete documento
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.MONGO.DOCUMENTOS.DELETE(id));
  },

  /**
   * Search documentos by text
   */
  async search(query: string): Promise<Documento[]> {
    const response = await apiClient.get<Documento[]>(
      ENDPOINTS.MONGO.DOCUMENTOS.SEARCH,
      {
        params: { q: query },
      }
    );
    return response.data;
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<string[]>(
      ENDPOINTS.MONGO.DOCUMENTOS.CATEGORIES
    );
    return response.data;
  },

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    const response = await apiClient.get<string[]>(ENDPOINTS.MONGO.DOCUMENTOS.TAGS);
    return response.data;
  },
};
