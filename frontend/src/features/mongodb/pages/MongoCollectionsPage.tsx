/**
 * MongoDB - Collections page (placeholder)
 */

import { Database, FolderOpen } from 'lucide-react';

export function MongoCollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MongoDB</h1>
          <p className="text-muted-foreground">
            Gerenciamento de coleções e documentos
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-mongodb px-4 py-2 text-sm font-medium text-white hover:bg-mongodb/90">
          <FolderOpen className="h-4 w-4" />
          Nova Coleção
        </button>
      </div>

      <div className="rounded-lg border border-dashed bg-card p-12 text-center">
        <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Em desenvolvimento</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A interface do MongoDB está sendo construída.
        </p>
      </div>
    </div>
  );
}
