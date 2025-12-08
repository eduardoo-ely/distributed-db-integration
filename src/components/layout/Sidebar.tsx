import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Database,
  Zap,
  GitBranch,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Usuários (PostgreSQL)',
    href: '/usuarios',
    icon: Users,
    color: 'text-postgres',
  },
  {
    name: 'Documentos (MongoDB)',
    href: '/mongodb',
    icon: Database,
    color: 'text-mongodb',
  },
  {
    name: 'Cache (Redis)',
    href: '/redis',
    icon: Zap,
    color: 'text-redis',
  },
  {
    name: 'Grafos (Neo4j)',
    href: '/neo4j',
    icon: GitBranch,
    color: 'text-neo4j',
  },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center gap-3 border-b p-4 relative">
            {!sidebarCollapsed ? (
              <>
                <img
                  src="/data_server.png"
                  alt="DataServer Logo"
                  className="h-12 w-12 object-contain flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-xl truncate">DataServer</h2>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="rounded-lg p-1.5 hover:bg-accent flex-shrink-0"
                  aria-label="Collapse sidebar"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="rounded-lg p-1.5 hover:bg-accent"
                aria-label="Expand sidebar"
              >
                <img
                  src="/data_server.png"
                  alt="DataServer Logo"
                  className="h-8 w-8 object-contain"
                />
              </button>
            )}
          </div>

          {/* Main Label */}
          {!sidebarCollapsed && (
            <div className="px-4 pt-4 pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                MAIN
              </span>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    sidebarCollapsed ? 'justify-center' : '',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )
                }
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', item.color)} />
                {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Settings Label */}
          {!sidebarCollapsed && (
            <div className="px-4 pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                SETTINGS
              </span>
            </div>
          )}

          {/* Footer info */}
          <div className="border-t p-3 mt-auto">
            {!sidebarCollapsed ? (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">DataServer</span>
                <span>v1.0.0</span>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="h-2 w-2 rounded-full bg-green-500" title="v1.0.0" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}