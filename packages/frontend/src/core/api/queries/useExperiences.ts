import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, Experience } from '@/types';

interface UseExperiencesOptions {
  featured?: boolean;
  orderBy?: 'startDate' | 'order';
  orderDirection?: 'asc' | 'desc';
}

export function useExperiences(options?: UseExperiencesOptions) {
  return useQuery({
    queryKey: queryKeys.experiences.all,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.featured !== undefined) {
        params.append('featured', String(options.featured));
      }
      if (options?.orderBy) {
        params.append('orderBy', options.orderBy);
      }
      if (options?.orderDirection) {
        params.append('orderDirection', options.orderDirection);
      }

      const url = `/experiences${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<ApiResponse<Experience[]>>(url);
      return response.data.data;
    },
  });
}

export function useExperienceById(id: string) {
  return useQuery({
    queryKey: queryKeys.experiences.detail(Number(id)),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Experience>>(`/experiences/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}
