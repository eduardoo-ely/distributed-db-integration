/**
 * Types for Usuario (PostgreSQL)
 */

import { z } from 'zod';

// Usuario entity from database
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  idade: number;
  createdAt?: string;
  updatedAt?: string;
}

// Zod schema for validation
export const usuarioSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  email: z
    .string()
    .email('Email inválido')
    .min(5, 'Email deve ter no mínimo 5 caracteres')
    .max(100, 'Email deve ter no máximo 100 caracteres')
    .toLowerCase()
    .trim(),
  idade: z
    .number()
    .int('Idade deve ser um número inteiro')
    .min(1, 'Idade deve ser maior que 0')
    .max(150, 'Idade deve ser menor que 150'),
});

// Types inferred from schema
export type UsuarioFormData = z.infer<typeof usuarioSchema>;

// DTOs for API
export interface CreateUsuarioDto {
  nome: string;
  email: string;
  idade: number;
}

export interface UpdateUsuarioDto {
  nome?: string;
  email?: string;
  idade?: number;
}

// Filters for listing
export interface UsuarioFilters {
  search?: string;
  idadeMin?: number;
  idadeMax?: number;
}

// List response
export interface UsuariosListResponse {
  usuarios: Usuario[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
