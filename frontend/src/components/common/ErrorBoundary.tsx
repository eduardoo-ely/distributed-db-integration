/**
 * Error boundary component
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="mb-4 text-2xl font-bold">Algo deu errado</h1>
            <p className="mb-6 text-muted-foreground">
              Ocorreu um erro inesperado. Por favor, recarregue a página e tente novamente.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 rounded-lg bg-muted p-4 text-left">
                <p className="mb-2 font-mono text-sm text-destructive">
                  {this.state.error.message}
                </p>
                <pre className="overflow-auto text-xs text-muted-foreground">
                  {this.state.error.stack}
                </pre>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
