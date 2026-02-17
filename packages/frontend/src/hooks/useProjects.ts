import { useQuery } from '@tanstack/react-query';
import type { ProjectDisplay } from '@/types';
import {
  fetchProjects,
  fetchProjectBySlug,
  apiProjectToDisplay,
  type ProjectListOptions,
} from '@/lib/project-api';

const PROJECT_KEYS = {
  all: ['projects'] as const,
  list: (options?: Record<string, unknown>) => ['projects', 'list', options] as const,
  slug: (slug: string) => ['projects', 'slug', slug] as const,
};

/**
 * Fetch all projects for the projects section and archive.
 */
export function useProjects(options: ProjectListOptions = {}) {
  const query = useQuery({
    queryKey: PROJECT_KEYS.list(options),
    queryFn: async () => {
      const list = await fetchProjects({
        orderBy: 'order',
        orderDirection: 'asc',
        ...options,
      });
      return list.map((p, i) => apiProjectToDisplay(p, i)) as ProjectDisplay[];
    },
  });
  return {
    ...query,
    projects: query.data ?? [],
  };
}

/**
 * Fetch a single project by slug.
 */
export function useProjectBySlug(slug: string | undefined) {
  const query = useQuery({
    queryKey: PROJECT_KEYS.slug(slug ?? ''),
    queryFn: async () => {
      if (!slug) return null;
      const project = await fetchProjectBySlug(slug);
      return project ? apiProjectToDisplay(project) : null;
    },
    enabled: !!slug,
  });
  return {
    ...query,
    project: query.data ?? null,
  };
}
