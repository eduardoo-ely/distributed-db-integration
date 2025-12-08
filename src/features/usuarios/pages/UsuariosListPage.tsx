/**
 * PostgreSQL - Usuarios list page
 */

import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios';
import { useDeleteUsuario } from '../hooks/useDeleteUsuario';
import { UsuarioTable } from '../components/UsuarioTable';
import { UsuarioFiltersComponent } from '../components/UsuarioFilters';
import { TablePagination } from '@/components/tables/TablePagination';
import { UsuarioFormModal } from '../components/UsuarioFormModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { ExportCsvModal } from '../components/ExportCsvModal';
import { usePagination } from '@/hooks/usePagination';
import { exportUsuariosToCSV } from '../services/exportService';
import type { Usuario, UsuarioFilters } from '../types/usuario.types';

export function UsuariosListPage() {
  // State
  const [filters, setFilters] = useState<UsuarioFilters>({});
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Pagination
  const pagination = usePagination({
    initialPage: 1,
    initialLimit: 10,
    totalItems: 0, // Will be updated from query
  });

  // Query
  const { data, isLoading } = useUsuarios(
    {
      page: pagination.page,
      limit: pagination.limit,
    },
    filters
  );

  // Mutation
  const deleteMutation = useDeleteUsuario();

  // Update total items when data changes
  useState(() => {
    if (data?.total) {
      pagination.totalPages = Math.ceil(data.total / pagination.limit);
    }
  });

  // Handlers
  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowEditModal(true);
  };

  const handleDelete = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowDeleteModal(true);
  };

  const handleView = (usuario: Usuario) => {
    // TODO: Navigate to detail page or open detail modal
    console.log('View usuario:', usuario);
  };

  const confirmDelete = () => {
    if (selectedUsuario) {
      deleteMutation.mutate(selectedUsuario.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedUsuario(null);
        },
      });
    }
  };

  const handleExport = async (selectedFields: string[]) => {
    await exportUsuariosToCSV(selectedFields);
  };

  const usuarios = data?.usuarios || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerenciamento de usuários no PostgreSQL
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            disabled={usuarios.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-postgres px-4 py-2 text-sm font-medium text-white hover:bg-postgres/90"
          >
            <Plus className="h-4 w-4" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total de Usuários</p>
          <p className="text-2xl font-bold text-postgres">{total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Página Atual</p>
          <p className="text-2xl font-bold">
            {pagination.page} / {pagination.totalPages || 1}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Itens por Página</p>
          <p className="text-2xl font-bold">{pagination.limit}</p>
        </div>
      </div>

      {/* Filters */}
      <UsuarioFiltersComponent onFilterChange={setFilters} />

      {/* Table */}
      <UsuarioTable
        usuarios={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {usuarios.length > 0 && (
        <TablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={total}
          itemsPerPage={pagination.limit}
          onPageChange={pagination.goToPage}
          onItemsPerPageChange={pagination.setLimit}
        />
      )}

      {/* Modals */}
      <UsuarioFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        mode="create"
      />

      <UsuarioFormModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUsuario(null);
        }}
        mode="edit"
        usuario={selectedUsuario || undefined}
      />

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUsuario(null);
        }}
        onConfirm={confirmDelete}
        usuario={selectedUsuario}
        isDeleting={deleteMutation.isPending}
      />

      <ExportCsvModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        totalRecords={total}
      />
    </div>
  );
}
