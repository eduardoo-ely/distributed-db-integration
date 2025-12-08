/**
 * Modal for creating/editing usuarios
 */

import { X } from 'lucide-react';
import { UsuarioForm } from '@/components/forms/UsuarioForm';
import { useCreateUsuario } from '../hooks/useCreateUsuario';
import { useUpdateUsuario } from '../hooks/useUpdateUsuario';
import type { UsuarioFormData, Usuario } from '../types/usuario.types';

interface UsuarioFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  usuario?: Usuario;
}

export function UsuarioFormModal({ open, onClose, mode, usuario }: UsuarioFormModalProps) {
  const createMutation = useCreateUsuario();
  const updateMutation = useUpdateUsuario(usuario?.id || '');

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (data: UsuarioFormData) => {
    if (mode === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => {
          onClose();
        },
      });
    } else if (mode === 'edit' && usuario) {
      updateMutation.mutate(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-accent"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <UsuarioForm
          onSubmit={handleSubmit}
          defaultValues={usuario}
          isLoading={isLoading}
          submitLabel={mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
        />
      </div>
    </div>
  );
}
