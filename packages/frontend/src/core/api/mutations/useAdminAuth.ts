import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { ApiResponse, LoginInput, LoginResponse } from '@/types';

export function useAdminLogin() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', input);
      return response.data.data;
    },
  });
}
