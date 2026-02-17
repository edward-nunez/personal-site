import { useQuery } from '@tanstack/react-query';
import type { Experience } from '@/types';
import { fetchExperiences, type ExperienceListOptions } from '@/lib/experience-api';

const EXPERIENCE_KEYS = {
  all: ['experiences'] as const,
  list: (options?: Record<string, unknown>) => ['experiences', 'list', options] as const,
};

/**
 * Fetch all experiences for the experience section.
 * Default: order by startDate desc (most recent first).
 */
export function useExperiences(options: ExperienceListOptions = {}) {
  const query = useQuery({
    queryKey: EXPERIENCE_KEYS.list(options),
    queryFn: () =>
      fetchExperiences({
        orderBy: 'startDate',
        orderDirection: 'desc',
        ...options,
      }),
  });
  return {
    ...query,
    experiences: query.data ?? [],
  };
}
