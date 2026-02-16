import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from '@/core/store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDark = useThemeStore((s) => s.isDark);

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return <>{children}</>;
}
