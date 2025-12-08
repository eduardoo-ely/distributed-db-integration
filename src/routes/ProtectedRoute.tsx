/**
 * Protected route wrapper (for future authentication)
 */

import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
}

export function ProtectedRoute({
  isAllowed = true, // For now, all routes are accessible
  redirectPath = '/',
  children,
}: ProtectedRouteProps) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
