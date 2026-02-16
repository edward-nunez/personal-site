import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, Project } from '@/types';

interface UseProjectsOptions {
  featured?: boolean;
  category?: string;
}

export function useProjects(options?: UseProjectsOptions) {
  return useQuery({
    queryKey: options?.featured ? queryKeys.projects.featured : queryKeys.projects.all,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.featured !== undefined) {
        params.append('featured', String(options.featured));
      }
      if (options?.category) {
        params.append('category', options.category);
      }

      const url = `/projects${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<ApiResponse<Project[]>>(url);
      return response.data.data;
    },
  });
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Project>>(`/projects/slug/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
}
