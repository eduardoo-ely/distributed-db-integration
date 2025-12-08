/**
 * API-related types
 */

import type { AxiosError, AxiosRequestConfig } from 'axios';

export interface ApiConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retries?: number;
}

export interface ApiEndpoints {
  // PostgreSQL - Usuarios
  usuarios: {
    getAll: string;
    getById: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };

  // MongoDB
  mongodb: {
    collections: string;
    documents: (collection: string) => string;
    documentById: (collection: string, id: string) => string;
    query: string;
  };

  // Redis
  redis: {
    keys: string;
    getValue: (key: string) => string;
    setValue: string;
    deleteKey: (key: string) => string;
    stats: string;
    flush: string;
  };

  // Neo4j
  neo4j: {
    nodes: string;
    relationships: string;
    graph: string;
    query: string;
    createNode: string;
    createRelationship: string;
    deleteNode: (id: string) => string;
    deleteRelationship: (id: string) => string;
  };

  // Health & Stats
  health: {
    status: string;
    databases: string;
  };
}

export interface HttpError extends AxiosError {
  statusCode?: number;
  message: string;
}

export interface RequestOptions {
  showLoader?: boolean;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}
