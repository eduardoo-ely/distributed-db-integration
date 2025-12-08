// ==================== AUTH ====================
export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
}

// ==================== USER (Agregado de todos os bancos) ====================
export interface UserDTO {
  // PostgreSQL
  userId: string;
  email: string;
  password?: string;

  // MongoDB
  age?: number;
  country?: string;
  genres?: string[];

  // Redis
  loginCount?: number;

  // Neo4j
  followingIds?: string[];

  // Metadados
  savedIn?: string[];
}

// ==================== LOGS (Sistema) ====================
export interface UserLog {
  timestamp: string;
  action: string;
  user?: string;
  system?: string;
}

// ==================== NETWORK (Neo4j) ====================
export interface NetworkNode {
  id: string;
  group: string; // 'me' ou 'friend'
}

export interface NetworkLink {
  source: string;
  target: string;
}

export interface NetworkResponse {
  nodes: NetworkNode[];
  links: NetworkLink[];
}
