import { create } from 'zustand';

interface SearchState {
  query: string;
  filter: string;
  setQuery: (query: string) => void;
  setFilter: (filter: string) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  query: '',
  filter: 'all',
  setQuery: (query: string) => set({ query }),
  setFilter: (filter: string) => set({ filter }),
  reset: () => set({ query: '', filter: 'all' }),
}));
