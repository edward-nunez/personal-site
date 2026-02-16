import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  closeMobileMenu: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
