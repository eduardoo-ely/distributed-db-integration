/**
 * Modal for exporting usuarios to CSV
 */

import { useState } from 'react';
import { X, FileDown, FileText, Users } from 'lucide-react';

interface ExportCsvModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (selectedFields: string[]) => Promise<void>;
  totalRecords: number;
}

const AVAILABLE_FIELDS = [
  { id: 'ID', label: 'ID', checked: true },
  { id: 'Nome', label: 'Nome', checked: true },
  { id: 'Email', label: 'Email', checked: true },
  { id: 'Idade', label: 'Idade', checked: true },
];

export function ExportCsvModal({ open, onClose, onExport, totalRecords }: ExportCsvModalProps) {
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    AVAILABLE_FIELDS.reduce((acc, field) => ({ ...acc, [field.id]: field.checked }), {})
  );
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleToggleField = (fieldId: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleExport = async () => {
    const fields = Object.entries(selectedFields)
      .filter(([_, checked]) => checked)
      .map(([field]) => field);

    if (fields.length === 0) {
      alert('Selecione pelo menos um campo para exportar');
      return;
    }

    setIsExporting(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onExport(fields);
      setProgress(100);

      setTimeout(() => {
        clearInterval(progressInterval);
        setIsExporting(false);
        setProgress(0);
        onClose();
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      setIsExporting(false);
      setProgress(0);
      console.error('Error exporting CSV:', error);
    }
  };

  const estimatedSize = ((totalRecords * 100) / 1024).toFixed(1); // Approximate KB
  const sizeText = parseFloat(estimatedSize) > 1024
    ? `${(parseFloat(estimatedSize) / 1024).toFixed(1)} MB`
    : `${estimatedSize} KB`;

  const selectedCount = Object.values(selectedFields).filter(Boolean).length;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="mx-4 rounded-xl border bg-background shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-postgres to-postgres/80 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <FileDown className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Exportar Dados para CSV</h2>
                  <p className="text-sm text-white/80">Selecione os campos que deseja exportar</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-white/20 transition-colors"
                disabled={isExporting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Preview Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="group rounded-lg border-2 border-border p-4 hover:border-postgres/50 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-3 shadow-sm">
                    <FileText className="h-8 w-8 text-postgres" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Arquivo CSV</h3>
                    <p className="text-xl font-bold">~{sizeText}</p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border-2 border-border p-4 hover:border-postgres/50 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-3 shadow-sm">
                    <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Registros</h3>
                    <p className="text-xl font-bold">{totalRecords} usuários</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                Selecione os campos ({selectedCount} de {AVAILABLE_FIELDS.length})
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {AVAILABLE_FIELDS.map((field) => (
                  <label
                    key={field.id}
                    className={`
                      group relative flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer
                      transition-all duration-200
                      ${selectedFields[field.id]
                        ? 'border-postgres bg-postgres/5 shadow-sm'
                        : 'border-border hover:border-postgres/30 hover:bg-accent'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields[field.id]}
                      onChange={() => handleToggleField(field.id)}
                      className="h-5 w-5 rounded border-gray-300 text-postgres focus:ring-2 focus:ring-postgres cursor-pointer"
                    />
                    <span className={`font-medium ${selectedFields[field.id] ? 'text-postgres' : ''}`}>
                      {field.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            {isExporting && (
              <div className="space-y-3 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-4 animate-in slide-in-from-top-2">
                <div className="h-8 overflow-hidden rounded-full bg-white dark:bg-gray-900 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-postgres to-green-500 transition-all duration-300 ease-out flex items-center justify-center"
                    style={{ width: `${progress}%` }}
                  >
                    {progress > 10 && (
                      <span className="text-xs font-bold text-white">{progress}%</span>
                    )}
                  </div>
                </div>
                <p className="text-center font-medium text-sm">
                  {progress < 100 ? `Exportando dados... ${progress}%` : 'Exportação concluída! 🎉'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t bg-muted/30 px-6 py-4">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="rounded-lg border px-4 py-2 font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || selectedCount === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-6 py-2 font-semibold text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200"
            >
              <FileDown className="h-4 w-4" />
              {isExporting ? 'Exportando...' : 'Exportar Agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
