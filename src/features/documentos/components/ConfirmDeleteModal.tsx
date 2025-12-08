import { AlertTriangle, Loader2, X } from 'lucide-react';
import type { Documento } from '../types/documento.types';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documento: Documento | null;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({ open, onClose, onConfirm, documento, isDeleting = false }: ConfirmDeleteModalProps) {
  if (!open || !documento) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Confirmar Exclusão</h2>
              <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-accent" disabled={isDeleting}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-6 rounded-lg bg-muted p-4">
          <p className="text-sm">
            Tem certeza que deseja excluir o documento <span className="font-semibold">{documento.titulo}</span>?
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Categoria: {documento.categoria}
            <br />
            Autor: {documento.autor}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isDeleting} className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50">
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
