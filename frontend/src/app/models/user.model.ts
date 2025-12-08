export interface User {
  userId?: string;
  email: string;
  password?: string;

  // Dados Mongo
  age?: number;
  country?: string;
  genres?: string[];

  // Dados Redis
  loginCount?: number;

  // Metadados do Sistema Distribuído
  savedIn?: string[];
}
