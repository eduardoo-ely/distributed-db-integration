// Resposta do Login (Redis)
export interface AuthResponse {
  token: string;
  username: string;
}

// Perfil (PostgreSQL)
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  department: string;
}

// Logs (MongoDB)
export interface UserLog {
  id: string;
  action: string;
  timestamp: string;
}

// Grafo (Neo4j)
export interface UserConnection {
  targetUser: string;
  relationType: string;
}
