/**
 * Neo4j - Graph page (placeholder)
 */

import { GitBranch, Plus } from 'lucide-react';

export function Neo4jGraphPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Neo4j</h1>
          <p className="text-muted-foreground">
            Visualização e gerenciamento de grafos
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-neo4j px-4 py-2 text-sm font-medium text-white hover:bg-neo4j/90">
          <Plus className="h-4 w-4" />
          Novo Nó
        </button>
      </div>

      <div className="rounded-lg border border-dashed bg-card p-12 text-center">
        <GitBranch className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Em desenvolvimento</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A interface do Neo4j está sendo construída.
        </p>
      </div>
    </div>
  );
}
