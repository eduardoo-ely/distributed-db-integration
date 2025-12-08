export interface UserCredential {
  userId: string;
  email: string;
}

export interface UserProfile {
  country: string;
  age: number;
  subscriptionType: string;
  device: string;
  gender: string;
  genres: string[];
}

export interface UserRelations {
  followers: string[];
  following: string[];
}

export interface AggregatedUser {
  userId: string;          // Chave unificadora
  credentials?: UserCredential; // Postgres
  profile?: UserProfile;        // MongoDB
  loginCount: number;           // Redis
  relations?: UserRelations;    // Neo4j
}
