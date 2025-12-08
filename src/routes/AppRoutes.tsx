/**
 * Application routes configuration
 */

import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { NotFoundPage } from '@/pages/NotFound';
import { ROUTES } from './routePaths';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';
import { LoadingPage } from '@/components/common/LoadingSpinner';

// Dashboard
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);

// PostgreSQL - Usuarios (to be created)
const UsuariosListPage = lazy(() =>
  import('@/features/usuarios/pages/UsuariosListPage').then((m) => ({
    default: m.UsuariosListPage,
  }))
);

// MongoDB - Documentos
const DocumentosListPage = lazy(() =>
  import('@/features/documentos/pages/DocumentosListPage').then((m) => ({
    default: m.DocumentosListPage,
  }))
);

// Redis - Cache
const CacheDashboardPage = lazy(() =>
  import('@/features/cache/pages/CacheDashboardPage').then((m) => ({
    default: m.CacheDashboardPage,
  }))
);

// Neo4j - Grafo
const GrafoPage = lazy(() =>
  import('@/features/grafo/pages/GrafoPage').then((m) => ({
    default: m.GrafoPage,
  }))
);

/**
 * Suspense wrapper for lazy loaded components
 */
function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingPage />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Dashboard */}
        <Route
          index
          element={
            <LazyPage>
              <DashboardPage />
            </LazyPage>
          }
        />

        {/* PostgreSQL - Usuarios */}
        <Route
          path={ROUTES.USUARIOS}
          element={
            <LazyPage>
              <UsuariosListPage />
            </LazyPage>
          }
        />

        {/* MongoDB - Documentos */}
        <Route
          path={ROUTES.MONGODB}
          element={
            <LazyPage>
              <DocumentosListPage />
            </LazyPage>
          }
        />

        {/* Redis - Cache */}
        <Route
          path={ROUTES.REDIS}
          element={
            <LazyPage>
              <CacheDashboardPage />
            </LazyPage>
          }
        />

        {/* Neo4j - Grafo */}
        <Route
          path={ROUTES.NEO4J}
          element={
            <LazyPage>
              <GrafoPage />
            </LazyPage>
          }
        />

        {/* 404 */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
