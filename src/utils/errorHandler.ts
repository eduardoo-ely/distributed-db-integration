/**
 * Error handling utilities
 */

import type { ApiError } from '@/types';
import { HTTP_STATUS } from './constants';

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'Erro desconhecido';

  // ApiError type
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message;
  }

  // Standard Error
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return 'Erro desconhecido ao processar requisição';
}

/**
 * Get user-friendly error message based on status code
 */
export function getHttpErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Requisição inválida. Verifique os dados enviados.';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Não autorizado. Faça login novamente.';
    case HTTP_STATUS.FORBIDDEN:
      return 'Acesso negado. Você não tem permissão.';
    case HTTP_STATUS.NOT_FOUND:
      return 'Recurso não encontrado.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    default:
      if (statusCode >= 500) {
        return 'Erro no servidor. Tente novamente mais tarde.';
      }
      if (statusCode >= 400) {
        return 'Erro na requisição. Verifique os dados e tente novamente.';
      }
      return 'Erro desconhecido';
  }
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Network Error') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('ECONNREFUSED')
    );
  }
  return false;
}

/**
 * Log error with context (development only)
 */
export function logError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}

/**
 * Format validation errors
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  const messages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');

  return messages || 'Erro de validação';
}
