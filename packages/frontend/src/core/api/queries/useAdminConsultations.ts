import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, ConsultationSubmission } from '@/types';

interface UseAdminConsultationsOptions {
  read?: boolean;
}

export function useAdminConsultations(options?: UseAdminConsultationsOptions) {
  return useQuery({
    queryKey: queryKeys.admin.submissions.consultations,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.read !== undefined) {
        params.append('read', String(options.read));
      }
      params.append('orderDirection', 'desc');

      const url = `/consultation${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<ApiResponse<ConsultationSubmission[]>>(url);
      return response.data.data;
    },
  });
}
