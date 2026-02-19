import type { Experience } from '@/types';
import { apiGet } from './api';

const EXPERIENCES_BASE = '/experiences';

export type ExperienceListOptions = {
  featured?: boolean;
  orderBy?: 'startDate' | 'order';
  orderDirection?: 'asc' | 'desc';
};

/**
 * Fetch all experiences from the API.
 */
export async function fetchExperiences(options: ExperienceListOptions = {}): Promise<Experience[]> {
  const params = new URLSearchParams();
  if (options.featured !== undefined) params.set('featured', String(options.featured));
  if (options.orderBy) params.set('orderBy', options.orderBy);
  if (options.orderDirection) params.set('orderDirection', options.orderDirection);
  const query = params.toString();
  const path = query ? `${EXPERIENCES_BASE}?${query}` : EXPERIENCES_BASE;
  return apiGet<Experience[]>(path);
}
