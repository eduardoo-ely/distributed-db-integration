/**
 * Usuario Filters Component
 */

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import type { UsuarioFilters } from '../types/usuario.types';

interface UsuarioFiltersProps {
  onFilterChange: (filters: UsuarioFilters) => void;
}

export function UsuarioFiltersComponent({ onFilterChange }: UsuarioFiltersProps) {
  const [search, setSearch] = useState('');
  const [idadeMin, setIdadeMin] = useState('');
  const [idadeMax, setIdadeMax] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(search, 500);

  // Apply filters when debounced search changes
  useState(() => {
    const filters: UsuarioFilters = {};

    if (debouncedSearch) {
      filters.search = debouncedSearch;
    }
    if (idadeMin) {
      filters.idadeMin = parseInt(idadeMin);
    }
    if (idadeMax) {
      filters.idadeMax = parseInt(idadeMax);
    }

    onFilterChange(filters);
  });

  const clearFilters = () => {
    setSearch('');
    setIdadeMin('');
    setIdadeMax('');
    onFilterChange({});
  };

  const hasActiveFilters = search || idadeMin || idadeMax;

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
            Limpar
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid gap-4 border-t pt-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="idadeMin" className="text-sm font-medium">
              Idade Mínima
            </label>
            <input
              id="idadeMin"
              type="number"
              value={idadeMin}
              onChange={(e) => setIdadeMin(e.target.value)}
              placeholder="18"
              min="1"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="idadeMax" className="text-sm font-medium">
              Idade Máxima
            </label>
            <input
              id="idadeMax"
              type="number"
              value={idadeMax}
              onChange={(e) => setIdadeMax(e.target.value)}
              placeholder="65"
              min="1"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      )}
    </div>
  );
}
