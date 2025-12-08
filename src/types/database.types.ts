/**
 * Database-specific types
 */

// PostgreSQL Database Types
export type DatabaseType = 'postgres' | 'mongodb' | 'redis' | 'neo4j';

export interface DatabaseStatus {
  type: DatabaseType;
  connected: boolean;
  responseTime: number; // in ms
  lastChecked: string;
  version?: string;
  error?: string;
}

export interface DatabaseStats {
  type: DatabaseType;
  totalRecords: number;
  storageUsed: string; // e.g., "1.2 GB"
  lastUpdate: string;
  operations24h: number;
}

// PostgreSQL - Usuarios
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  idade: number;
  createdAt?: string;
  updatedAt?: string;
}

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

// MongoDB - Documents
export interface MongoDocument {
  _id: string;
  [key: string]: any; // Dynamic fields
}

export interface MongoCollection {
  name: string;
  count: number;
  size: number;
  avgObjSize: number;
}

export interface MongoQuery {
  collection: string;
  filter: Record<string, any>;
  projection?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
}

// Redis - Cache
export interface RedisKey {
  key: string;
  type: 'string' | 'list' | 'set' | 'zset' | 'hash';
  ttl: number; // -1 for no expiry, -2 for expired
  size: number;
}

export interface RedisValue {
  key: string;
  value: string | Record<string, any>;
  type: string;
  ttl: number;
}

export interface RedisStats {
  totalKeys: number;
  usedMemory: string;
  usedMemoryHuman: string;
  connectedClients: number;
  totalCommandsProcessed: number;
  keyspaceHits: number;
  keyspaceMisses: number;
  hitRate: number;
}

// Neo4j - Graph
export interface Neo4jNode {
  id: string;
  labels: string[];
  properties: Record<string, any>;
}

export interface Neo4jRelationship {
  id: string;
  type: string;
  startNode: string;
  endNode: string;
  properties: Record<string, any>;
}

export interface Neo4jGraph {
  nodes: Neo4jNode[];
  relationships: Neo4jRelationship[];
}

export interface CypherQuery {
  query: string;
  parameters?: Record<string, any>;
}

export interface CypherResult {
  columns: string[];
  data: any[][];
  summary?: {
    nodesCreated: number;
    relationshipsCreated: number;
    propertiesSet: number;
    executionTime: number;
  };
}
