import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, Project } from '@/types';

export function useAdminProjects() {
  return useQuery({
    queryKey: queryKeys.admin.projects.all,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
      return response.data.data;
    },
  });
}

export function useAdminProjectById(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.projects.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}
