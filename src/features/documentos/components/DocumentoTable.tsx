/**
 * Documento Table Component
 */

import { Edit2, Eye, Trash2, FileText, Calendar, User, Tags } from 'lucide-react';
import type { Documento } from '../types/documento.types';

interface DocumentoTableProps {
  documentos: Documento[];
  onEdit: (documento: Documento) => void;
  onDelete: (documento: Documento) => void;
  onView: (documento: Documento) => void;
  isLoading?: boolean;
}

export function DocumentoTable({
  documentos,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: DocumentoTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-mongodb border-r-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Carregando documentos...</p>
      </div>
    );
  }

  if (documentos.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum documento encontrado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Crie seu primeiro documento usando o botão acima.
        </p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Título</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Categoria</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Autor</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Tags</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Data Criação</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {documentos.map((documento) => (
              <tr key={documento.id} className="hover:bg-accent/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-mongodb" />
                    <span className="font-medium">{documento.titulo}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-mongodb/10 px-2 py-1 text-xs font-medium text-mongodb">
                    {documento.categoria}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {documento.autor}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Tags className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {documento.tags.length} tag{documento.tags.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(documento.dataCriacao)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onView(documento)}
                      className="rounded-lg p-2 hover:bg-accent"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(documento)}
                      className="rounded-lg p-2 hover:bg-accent"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(documento)}
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
