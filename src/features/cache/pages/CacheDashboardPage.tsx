import { useState } from 'react';
import { Plus, Trash2, Key } from 'lucide-react';
import { useCacheEntries } from '../hooks/useCacheEntries';
import { useDeleteCacheEntry } from '../hooks/useDeleteCacheEntry';
import { useCreateCacheEntry } from '../hooks/useCreateCacheEntry';
import type { CacheEntry } from '../types/cache.types';

export function CacheDashboardPage() {
  const [pattern, setPattern] = useState('*');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newTtl, setNewTtl] = useState<number | undefined>();

  const { data, isLoading } = useCacheEntries(pattern);
  const deleteMutation = useDeleteCacheEntry();
  const createMutation = useCreateCacheEntry();

  const entries = data?.entries || [];
  const total = data?.total || 0;

  const handleCreate = () => {
    createMutation.mutate(
      { key: newKey, value: newValue, ttl: newTtl },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          setNewKey('');
          setNewValue('');
          setNewTtl(undefined);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cache Redis</h1>
          <p className="text-muted-foreground">Gerenciamento de chaves no Redis</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-redis px-4 py-2 text-sm font-medium text-black hover:bg-redis/90"
        >
          <Plus className="h-4 w-4" />
          Nova Chave
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total de Chaves</p>
          <p className="text-2xl font-bold text-redis">{total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Filtrar por padrão (ex: user:*)"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center">
            <Key className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nenhuma chave encontrada</h3>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Key</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium">TTL</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry) => (
                <tr key={entry.key} className="hover:bg-accent/50">
                  <td className="px-4 py-3 font-mono text-sm">{entry.key}</td>
                  <td className="px-4 py-3 max-w-md truncate text-sm">{entry.value}</td>
                  <td className="px-4 py-3 text-sm">
                    {entry.ttl === -1 ? 'Sem expiração' : `${entry.ttl}s`}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteMutation.mutate(entry.key)}
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Nova Chave</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Key"
                className="w-full rounded-lg border px-3 py-2"
              />
              <textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value"
                rows={3}
                className="w-full rounded-lg border px-3 py-2"
              />
              <input
                type="number"
                value={newTtl || ''}
                onChange={(e) => setNewTtl(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="TTL (segundos, opcional)"
                className="w-full rounded-lg border px-3 py-2"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-lg border px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newKey || !newValue}
                  className="flex-1 rounded-lg bg-redis px-4 py-2 text-black hover:bg-redis/90 disabled:opacity-50"
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
