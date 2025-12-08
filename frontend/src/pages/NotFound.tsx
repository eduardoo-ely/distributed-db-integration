/**
 * 404 Not Found page
 */

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
        <h2 className="mt-4 text-3xl font-bold">Página não encontrada</h2>
        <p className="mt-2 text-muted-foreground">
          A página que você está procurando não existe.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Home className="h-4 w-4" />
          Ir para Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>
    </div>
  );
}
