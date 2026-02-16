import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, ContactSubmission } from '@/types';

interface UseAdminContactsOptions {
  read?: boolean;
}

export function useAdminContacts(options?: UseAdminContactsOptions) {
  return useQuery({
    queryKey: queryKeys.admin.submissions.contacts,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.read !== undefined) {
        params.append('read', String(options.read));
      }
      params.append('orderDirection', 'desc');

      const url = `/contact${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<ApiResponse<ContactSubmission[]>>(url);
      return response.data.data;
    },
  });
}
