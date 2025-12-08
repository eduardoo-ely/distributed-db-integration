/**
 * Footer component
 */

import { Heart, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-6 px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left section */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Desenvolvido com</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>usando React + TypeScript</span>
          </div>

          {/* Center section - Database badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-postgres/10 px-3 py-1 text-xs font-medium text-postgres">
              PostgreSQL
            </span>
            <span className="rounded-full bg-mongodb/10 px-3 py-1 text-xs font-medium text-mongodb">
              MongoDB
            </span>
            <span className="rounded-full bg-redis/10 px-3 py-1 text-xs font-medium text-redis">
              Redis
            </span>
            <span className="rounded-full bg-neo4j/10 px-3 py-1 text-xs font-medium text-neo4j">
              Neo4j
            </span>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© {currentYear} DataServer</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
