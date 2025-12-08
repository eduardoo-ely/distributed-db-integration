import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/store/appStore'; // <--- ESTA IMPORTAÇÃO ESTAVA FALTANDO
import { cn } from '@/lib/utils';

export function MainLayout() {
  // Agora o useAppStore está definido e pode ser usado
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>

        {/* Footer (Opcional, se você tiver um componente Footer) */}
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          © 2024 DataServer Integration. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}