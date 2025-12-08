/**
 * Usuario Form Component with validation
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { usuarioSchema } from '@/features/usuarios/types/usuario.types';
import type { UsuarioFormData, Usuario } from '@/features/usuarios/types/usuario.types';

interface UsuarioFormProps {
  onSubmit: (data: UsuarioFormData) => void;
  defaultValues?: Partial<Usuario>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function UsuarioForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  submitLabel = 'Salvar',
}: UsuarioFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: defaultValues
      ? {
          nome: defaultValues.nome || '',
          email: defaultValues.email || '',
          idade: defaultValues.idade || 0,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nome Field */}
      <div className="space-y-2">
        <label htmlFor="nome" className="text-sm font-medium">
          Nome <span className="text-destructive">*</span>
        </label>
        <input
          id="nome"
          type="text"
          {...register('nome')}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Digite o nome completo"
          disabled={isLoading}
        />
        {errors.nome && (
          <p className="text-sm text-destructive">{errors.nome.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="exemplo@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Idade Field */}
      <div className="space-y-2">
        <label htmlFor="idade" className="text-sm font-medium">
          Idade <span className="text-destructive">*</span>
        </label>
        <input
          id="idade"
          type="number"
          {...register('idade', { valueAsNumber: true })}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="18"
          min="1"
          max="150"
          disabled={isLoading}
        />
        {errors.idade && (
          <p className="text-sm text-destructive">{errors.idade.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-postgres px-4 py-2 text-sm font-medium text-white hover:bg-postgres/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
