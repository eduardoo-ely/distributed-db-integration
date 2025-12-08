import { useState } from 'react';
import { Plus, Trash2, Network, GitBranch } from 'lucide-react';
import { useGraph } from '../hooks/useGraph';
import { useCreateNode } from '../hooks/useCreateNode';
import type { Node } from '../types/grafo.types';

export function GrafoPage() {
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newPropKey, setNewPropKey] = useState('');
  const [newPropValue, setNewPropValue] = useState('');

  const { data, isLoading } = useGraph();
  const createNodeMutation = useCreateNode();

  const nodes = data?.nodes || [];
  const relationships = data?.relationships || [];

  const handleCreateNode = () => {
    const properties: Record<string, any> = {};
    if (newPropKey && newPropValue) {
      properties[newPropKey] = newPropValue;
    }

    createNodeMutation.mutate(
      { label: newLabel, properties },
      {
        onSuccess: () => {
          setShowNodeModal(false);
          setNewLabel('');
          setNewPropKey('');
          setNewPropValue('');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grafo Neo4j</h1>
          <p className="text-muted-foreground">Visualização de nós e relacionamentos</p>
        </div>
        <button
          onClick={() => setShowNodeModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-neo4j px-4 py-2 text-sm font-medium text-white hover:bg-neo4j/90"
        >
          <Plus className="h-4 w-4" />
          Novo Nó
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-neo4j" />
            <p className="text-sm text-muted-foreground">Nós</p>
          </div>
          <p className="text-2xl font-bold text-neo4j">{nodes.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-neo4j" />
            <p className="text-sm text-muted-foreground">Relacionamentos</p>
          </div>
          <p className="text-2xl font-bold text-neo4j">{relationships.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Labels Únicos</p>
          <p className="text-2xl font-bold">
            {new Set(nodes.map((n) => n.label)).size}
          </p>
        </div>
      </div>

      {/* Graph Visualization Placeholder */}
      <div className="rounded-lg border bg-card p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Visualização do Grafo</h2>
          <div className="text-sm text-muted-foreground">
            {nodes.length} nós, {relationships.length} relacionamentos
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">Carregando grafo...</div>
          </div>
        ) : nodes.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <Network className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum nó encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Crie seu primeiro nó para começar
              </p>
            </div>
          </div>
        ) : (
          <div className="min-h-96 space-y-4">
            {/* Simple list view of nodes */}
            <div>
              <h3 className="mb-2 font-medium">Nós:</h3>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {nodes.map((node) => (
                  <div key={node.id} className="rounded-lg border bg-muted/50 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-neo4j" />
                          <span className="font-medium">{node.label}</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">ID: {node.id}</div>
                        {Object.keys(node.properties).length > 0 && (
                          <div className="mt-2 text-xs">
                            {Object.entries(node.properties).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {relationships.length > 0 && (
              <div>
                <h3 className="mb-2 font-medium">Relacionamentos:</h3>
                <div className="space-y-2">
                  {relationships.map((rel) => (
                    <div key={rel.id} className="rounded-lg border bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">({rel.startNodeId})</span>
                        <span className="text-neo4j">-[{rel.type}]-&gt;</span>
                        <span className="font-medium">({rel.endNodeId})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Node Modal */}
      {showNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNodeModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Novo Nó</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Label *</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Person, Company, etc"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Propriedade (opcional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPropKey}
                    onChange={(e) => setNewPropKey(e.target.value)}
                    placeholder="nome"
                    className="w-1/2 rounded-lg border px-3 py-2"
                  />
                  <input
                    type="text"
                    value={newPropValue}
                    onChange={(e) => setNewPropValue(e.target.value)}
                    placeholder="valor"
                    className="w-1/2 rounded-lg border px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNodeModal(false)}
                  className="flex-1 rounded-lg border px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateNode}
                  disabled={!newLabel}
                  className="flex-1 rounded-lg bg-neo4j px-4 py-2 text-white hover:bg-neo4j/90 disabled:opacity-50"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
