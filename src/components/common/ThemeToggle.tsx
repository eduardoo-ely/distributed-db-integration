/**
 * Theme toggle component - switches between dark and light mode
 */

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 hover:bg-accent transition-colors"
      aria-label="Alternar tema"
      title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
}
