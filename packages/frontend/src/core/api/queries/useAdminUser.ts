import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, AdminUser } from '@/types';

export function useAdminUser() {
  return useQuery({
    queryKey: queryKeys.admin.user,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AdminUser>>('/auth/me');
      return response.data.data;
    },
  });
}
