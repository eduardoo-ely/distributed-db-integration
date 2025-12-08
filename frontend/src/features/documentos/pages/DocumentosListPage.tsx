/**
 * MongoDB - Documentos list page
 */

import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useDocumentos } from '../hooks/useDocumentos';
import { useDeleteDocumento } from '../hooks/useDeleteDocumento';
import { DocumentoTable } from '../components/DocumentoTable';
import { TablePagination } from '@/components/tables/TablePagination';
import { DocumentoFormModal } from '../components/DocumentoFormModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { usePagination } from '@/hooks/usePagination';
import { downloadCSV } from '@/utils/helpers';
import type { Documento } from '../types/documento.types';

export function DocumentosListPage() {
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const pagination = usePagination({ initialPage: 1, initialLimit: 10, totalItems: 0 });
  const { data, isLoading } = useDocumentos({ page: pagination.page, limit: pagination.limit });
  const deleteMutation = useDeleteDocumento();

  const handleCreate = () => setShowCreateModal(true);

  const handleEdit = (documento: Documento) => {
    setSelectedDocumento(documento);
    setShowEditModal(true);
  };

  const handleDelete = (documento: Documento) => {
    setSelectedDocumento(documento);
    setShowDeleteModal(true);
  };

  const handleView = (documento: Documento) => {
    console.log('View documento:', documento);
  };

  const confirmDelete = () => {
    if (selectedDocumento) {
      deleteMutation.mutate(selectedDocumento.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedDocumento(null);
        },
      });
    }
  };

  const handleExport = () => {
    if (data?.documentos) {
      downloadCSV(data.documentos, 'documentos');
    }
  };

  const documentos = data?.documentos || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">Gerenciamento de documentos no MongoDB</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={documentos.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-mongodb px-4 py-2 text-sm font-medium text-white hover:bg-mongodb/90"
          >
            <Plus className="h-4 w-4" />
            Novo Documento
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total de Documentos</p>
          <p className="text-2xl font-bold text-mongodb">{total}</p>
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

      <DocumentoTable
        documentos={documentos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        isLoading={isLoading}
      />

      {documentos.length > 0 && (
        <TablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={total}
          itemsPerPage={pagination.limit}
          onPageChange={pagination.goToPage}
          onItemsPerPageChange={pagination.setLimit}
        />
      )}

      <DocumentoFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        mode="create"
      />

      <DocumentoFormModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDocumento(null);
        }}
        mode="edit"
        documento={selectedDocumento || undefined}
      />

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDocumento(null);
        }}
        onConfirm={confirmDelete}
        documento={selectedDocumento}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
