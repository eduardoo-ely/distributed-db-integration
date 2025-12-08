/**
 * MongoDB Document Types
 */

import { z } from 'zod';

export interface Documento {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  tags: string[];
  autor: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface DocumentoFilters {
  titulo?: string;
  categoria?: string;
  autor?: string;
  tag?: string;
}

// Zod validation schema
export const documentoSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  conteudo: z
    .string()
    .min(10, 'Conteúdo deve ter no mínimo 10 caracteres')
    .max(10000, 'Conteúdo deve ter no máximo 10.000 caracteres'),
  categoria: z
    .string()
    .min(2, 'Categoria deve ter no mínimo 2 caracteres')
    .max(50, 'Categoria deve ter no máximo 50 caracteres'),
  tags: z
    .array(z.string())
    .min(1, 'Adicione pelo menos uma tag')
    .max(10, 'Máximo de 10 tags'),
  autor: z
    .string()
    .min(3, 'Nome do autor deve ter no mínimo 3 caracteres')
    .max(100, 'Nome do autor deve ter no máximo 100 caracteres'),
});

export type DocumentoFormData = z.infer<typeof documentoSchema>;

export interface DocumentosResponse {
  documentos: Documento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
