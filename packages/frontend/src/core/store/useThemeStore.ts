import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true, // Dark mode is default
      toggle: () =>
        set((state) => {
          const newDark = !state.isDark;
          if (newDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDark: newDark };
        }),
      setDark: (dark: boolean) =>
        set(() => {
          if (dark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDark: dark };
        }),
    }),
    {
      name: 'theme-preference',
    }
  )
);
