/**
 * React Query key factory — ensures consistent cache keys.
 * Convention: [entity, ...params]
 */
export const queryKeys = {
  experiences: {
    all: ['experiences'] as const,
    detail: (id: number) => ['experiences', id] as const,
  },
  projects: {
    all: ['projects'] as const,
    detail: (slug: string) => ['projects', slug] as const,
    featured: ['projects', 'featured'] as const,
  },
  blog: {
    all: ['blog'] as const,
    detail: (slug: string) => ['blog', slug] as const,
    byCategory: (category: string) => ['blog', 'category', category] as const,
  },
  search: {
    results: (query: string) => ['search', query] as const,
  },
  admin: {
    submissions: {
      contacts: ['admin', 'contacts'] as const,
      consultations: ['admin', 'consultations'] as const,
    },
  },
} as const;
