/**
 * Header component - Top navigation bar
 */

import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAppStore } from '@/store/appStore';

export function Header() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section - Menu button (mobile) */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden rounded-lg p-2 hover:bg-accent transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold lg:hidden">DataServer</h1>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Database status indicators */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-postgres animate-pulse" />
              <span className="text-xs text-muted-foreground">PG</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-mongodb animate-pulse" />
              <span className="text-xs text-muted-foreground">Mongo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-redis animate-pulse" />
              <span className="text-xs text-muted-foreground">Redis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-neo4j animate-pulse" />
              <span className="text-xs text-muted-foreground">Neo4j</span>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
