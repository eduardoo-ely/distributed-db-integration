/**
 * Documento Form Component
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X } from 'lucide-react';
import { documentoSchema, type DocumentoFormData, type Documento } from '@/features/documentos/types/documento.types';
import { useState } from 'react';

interface DocumentoFormProps {
  onSubmit: (data: DocumentoFormData) => void;
  defaultValues?: Documento;
  isLoading?: boolean;
  submitLabel?: string;
}

export function DocumentoForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  submitLabel = 'Salvar',
}: DocumentoFormProps) {
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DocumentoFormData>({
    resolver: zodResolver(documentoSchema),
    defaultValues: defaultValues
      ? {
          titulo: defaultValues.titulo,
          conteudo: defaultValues.conteudo,
          categoria: defaultValues.categoria,
          tags: defaultValues.tags,
          autor: defaultValues.autor,
        }
      : {
          tags: [],
        },
  });

  const tags = watch('tags') || [];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue(
      'tags',
      tags.filter((t) => t !== tag)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Título */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium mb-1">
          Título *
        </label>
        <input
          {...register('titulo')}
          type="text"
          id="titulo"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Digite o título do documento"
          disabled={isLoading}
        />
        {errors.titulo && (
          <p className="mt-1 text-sm text-destructive">{errors.titulo.message}</p>
        )}
      </div>

      {/* Conteúdo */}
      <div>
        <label htmlFor="conteudo" className="block text-sm font-medium mb-1">
          Conteúdo *
        </label>
        <textarea
          {...register('conteudo')}
          id="conteudo"
          rows={6}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Digite o conteúdo do documento"
          disabled={isLoading}
        />
        {errors.conteudo && (
          <p className="mt-1 text-sm text-destructive">{errors.conteudo.message}</p>
        )}
      </div>

      {/* Categoria e Autor */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium mb-1">
            Categoria *
          </label>
          <input
            {...register('categoria')}
            type="text"
            id="categoria"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Ex: Tutorial, Artigo, etc"
            disabled={isLoading}
          />
          {errors.categoria && (
            <p className="mt-1 text-sm text-destructive">{errors.categoria.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="autor" className="block text-sm font-medium mb-1">
            Autor *
          </label>
          <input
            {...register('autor')}
            type="text"
            id="autor"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Nome do autor"
            disabled={isLoading}
          />
          {errors.autor && (
            <p className="mt-1 text-sm text-destructive">{errors.autor.message}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tag-input" className="block text-sm font-medium mb-1">
          Tags *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Digite uma tag e pressione Enter"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="inline-flex items-center gap-2 rounded-lg bg-mongodb px-4 py-2 text-sm font-medium text-white hover:bg-mongodb/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || !tagInput.trim()}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </div>

        {/* Tags List */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-mongodb/10 px-3 py-1 text-sm text-mongodb"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-mongodb/80"
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {errors.tags && <p className="mt-1 text-sm text-destructive">{errors.tags.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-mongodb px-6 py-2 text-sm font-medium text-white hover:bg-mongodb/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
