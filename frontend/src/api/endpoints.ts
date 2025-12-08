/**
 * API Endpoints - Organized by database
 */

export const ENDPOINTS = {
  // PostgreSQL - Usuarios
  POSTGRES: {
    USUARIOS: {
      LIST: `/postgres/usuarios`,
      BY_ID: (id: string) => `/postgres/usuarios/${id}`,
      CREATE: `/postgres/usuarios`,
      UPDATE: (id: string) => `/postgres/usuarios/${id}`,
      DELETE: (id: string) => `/postgres/usuarios/${id}`,
      EMAIL_EXISTS: `/postgres/usuarios/email-exists`,
    },
  },

  // MongoDB - Documentos
  MONGO: {
    DOCUMENTOS: {
      LIST: `/mongo/documentos`,
      BY_ID: (id: string) => `/mongo/documentos/${id}`,
      CREATE: `/mongo/documentos`,
      UPDATE: (id: string) => `/mongo/documentos/${id}`,
      DELETE: (id: string) => `/mongo/documentos/${id}`,
      SEARCH: `/mongo/documentos/search`,
      CATEGORIES: `/mongo/documentos/categories`,
      STATS: `/mongo/documentos/stats`,
      TAGS: `/mongo/documentos/tags`,
    },
  },

  // Redis - Cache/Keys
  REDIS: {
    KEYS: {
      LIST: `/redis/keys`,
      BY_KEY: (key: string) => `/redis/keys/${encodeURIComponent(key)}`,
      CREATE: `/redis/keys`,
      UPDATE: (key: string) => `/redis/keys/${encodeURIComponent(key)}`,
      DELETE: (key: string) => `/redis/keys/${encodeURIComponent(key)}`,
      STATS: `/redis/stats`,
      FLUSH: `/redis/flush`,
    },
  },

  // Neo4j - Nodes & Relationships
  NEO4J: {
    NODES: {
      LIST: `/neo4j/nodes`,
      BY_ID: (id: string) => `/neo4j/nodes/${id}`,
      CREATE: `/neo4j/nodes`,
      UPDATE: (id: string) => `/neo4j/nodes/${id}`,
      DELETE: (id: string) => `/neo4j/nodes/${id}`,
    },
    RELATIONSHIPS: {
      LIST: `/neo4j/relationships`,
      BY_ID: (id: string) => `/neo4j/relationships/${id}`,
      CREATE: `/neo4j/relationships`,
      DELETE: (id: string) => `/neo4j/relationships/${id}`,
    },
    GRAPH: `/neo4j/graph`,
    QUERY: `/neo4j/query`,
  },

  // Health & Status
  HEALTH: {
    STATUS: `/health`,
    DATABASES: `/health/databases`,
  },
};

export default ENDPOINTS;
