/**
 * Route paths constants
 */

export const ROUTES = {
  // Main
  HOME: '/',
  DASHBOARD: '/',

  // PostgreSQL - Usuarios
  USUARIOS: '/usuarios',
  USUARIOS_CREATE: '/usuarios/novo',
  USUARIOS_DETAIL: '/usuarios/:id',

  // MongoDB
  MONGODB: '/mongodb',
  MONGODB_COLLECTIONS: '/mongodb/colecoes',
  MONGODB_DOCUMENTS: '/mongodb/colecoes/:collection',
  MONGODB_QUERY: '/mongodb/query',

  // Redis
  REDIS: '/redis',
  REDIS_KEYS: '/redis/keys',
  REDIS_STATS: '/redis/stats',

  // Neo4j
  NEO4J: '/neo4j',
  NEO4J_GRAPH: '/neo4j/grafo',
  NEO4J_NODES: '/neo4j/nos',
  NEO4J_RELATIONSHIPS: '/neo4j/relacionamentos',
  NEO4J_QUERY: '/neo4j/query',

  // Error pages
  NOT_FOUND: '*',
} as const;

/**
 * Helper to build route with params
 */
export function buildRoute(path: string, params: Record<string, string>): string {
  let route = path;
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, value);
  });
  return route;
}
