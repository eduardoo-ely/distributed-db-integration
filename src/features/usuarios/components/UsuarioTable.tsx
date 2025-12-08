/**
 * Usuario Table Component with actions
 */

import { useState } from 'react';
import { Edit, Trash2, Eye, Mail, User as UserIcon } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import type { Usuario } from '../types/usuario.types';

interface UsuarioTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  onView: (usuario: Usuario) => void;
  isLoading?: boolean;
}

export function UsuarioTable({
  usuarios,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: UsuarioTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-sm text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum usuário encontrado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Comece criando um novo usuário.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Idade</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Criado em</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {usuarios.map((usuario) => (
              <UsuarioRow
                key={usuario.id}
                usuario={usuario}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface UsuarioRowProps {
  usuario: Usuario;
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  onView: (usuario: Usuario) => void;
}

function UsuarioRow({ usuario, onEdit, onDelete, onView }: UsuarioRowProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr
      className="hover:bg-muted/30 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-postgres/10">
            <UserIcon className="h-4 w-4 text-postgres" />
          </div>
          <span className="font-medium">{usuario.nome}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3 w-3" />
          {usuario.email}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {usuario.idade} anos
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {usuario.createdAt ? formatDate(usuario.createdAt, 'dd/MM/yyyy HH:mm') : '-'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {showActions && (
            <>
              <button
                onClick={() => onView(usuario)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                title="Visualizar"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEdit(usuario)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(usuario)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
