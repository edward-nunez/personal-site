import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, Experience } from '@/types';

export function useAdminExperiences() {
  return useQuery({
    queryKey: queryKeys.admin.experiences.all,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Experience[]>>('/experiences');
      return response.data.data;
    },
  });
}

export function useAdminExperienceById(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.experiences.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Experience>>(`/experiences/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}
