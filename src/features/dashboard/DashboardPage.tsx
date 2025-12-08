/**
 * Dashboard page - Main overview
 */

import { Database, Activity } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral de todos os bancos de dados conectados
        </p>
      </div>

      {/* Database stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* PostgreSQL Card */}
        <div className="group relative overflow-hidden rounded-lg border-l-4 border-postgres bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">PostgreSQL</p>
              <p className="text-3xl font-bold text-postgres">0</p>
              <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
            </div>
            <div className="rounded-lg bg-postgres/10 p-2">
              <img 
                src="/logos/postgres.png" 
                alt="PostgreSQL Logo" 
                className="h-8 w-8 object-contain" 
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Conectado</span>
            </div>
          </div>
        </div>

        {/* MongoDB Card */}
        <div className="group relative overflow-hidden rounded-lg border-l-4 border-mongodb bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">MongoDB</p>
              <p className="text-3xl font-bold text-mongodb">0</p>
              <p className="text-xs text-muted-foreground">Documentos armazenados</p>
            </div>
            <div className="rounded-lg bg-mongodb/10 p-2">
              <img 
                src="/logos/mongodb.png" 
                alt="MongoDB Logo" 
                className="h-8 w-8 object-contain" 
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Conectado</span>
            </div>
          </div>
        </div>

        {/* Redis Card */}
        <div className="group relative overflow-hidden rounded-lg border-l-4 border-redis bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Redis</p>
              <p className="text-3xl font-bold text-redis">0</p>
              <p className="text-xs text-muted-foreground">Keys em cache</p>
            </div>
            <div className="rounded-lg bg-redis/10 p-2">
              <img 
                src="/logos/redis.png" 
                alt="Redis Logo" 
                className="h-8 w-8 object-contain" 
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Conectado</span>
            </div>
          </div>
        </div>

        {/* Neo4j Card */}
        <div className="group relative overflow-hidden rounded-lg border-l-4 border-neo4j bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Neo4j</p>
              <p className="text-3xl font-bold text-neo4j">0</p>
              <p className="text-xs text-muted-foreground">Nós no grafo</p>
            </div>
            <div className="rounded-lg bg-neo4j/10 p-2">
              <img 
                src="/logos/neo4j.png" 
                alt="Neo4j Logo" 
                className="h-8 w-8 object-contain" 
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Conectado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Atividades Recentes</h2>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma atividade registrada ainda.
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Informações do Sistema</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Versão</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bancos Ativos</span>
              <span className="font-medium">4 / 4</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Última Atualização</span>
              <span className="font-medium">Agora</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                Operacional
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome message */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold">Bem-vindo ao DataServer! 🚀</h3>
        <p className="text-sm text-muted-foreground max-w-lg">
          Gerencie múltiplos bancos de dados de forma integrada. Navegue pelo menu lateral para acessar cada banco.
        </p>
      </div>
    </div>
  );
}