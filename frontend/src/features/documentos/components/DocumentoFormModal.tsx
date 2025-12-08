import { X } from 'lucide-react';
import { DocumentoForm } from '@/components/forms/DocumentoForm';
import { useCreateDocumento } from '../hooks/useCreateDocumento';
import { useUpdateDocumento } from '../hooks/useUpdateDocumento';
import type { DocumentoFormData, Documento } from '../types/documento.types';

interface DocumentoFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  documento?: Documento;
}

export function DocumentoFormModal({ open, onClose, mode, documento }: DocumentoFormModalProps) {
  const createMutation = useCreateDocumento();
  const updateMutation = useUpdateDocumento(documento?.id || '');
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (data: DocumentoFormData) => {
    if (mode === 'create') {
      createMutation.mutate(data, { onSuccess: () => onClose() });
    } else if (mode === 'edit' && documento) {
      updateMutation.mutate(data, { onSuccess: () => onClose() });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-lg border bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{mode === 'create' ? 'Novo Documento' : 'Editar Documento'}</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-accent" disabled={isLoading}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <DocumentoForm
          onSubmit={handleSubmit}
          defaultValues={documento}
          isLoading={isLoading}
          submitLabel={mode === 'create' ? 'Criar Documento' : 'Salvar Alterações'}
        />
      </div>
    </div>
  );
}
