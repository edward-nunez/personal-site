import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, ContactSubmission } from '@/types';

export function useMarkContactAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const response = await apiClient.patch<ApiResponse<ContactSubmission>>(
        `/contact/${id}/read`,
        { notes }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.submissions.contacts });
      toast.success('Contact marked as read');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to mark contact as read';
      toast.error(message);
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.submissions.contacts });
      toast.success('Contact deleted successfully');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to delete contact';
      toast.error(message);
    },
  });
}
