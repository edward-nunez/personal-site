import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, ConsultationSubmission } from '@/types';

export function useMarkConsultationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const response = await apiClient.patch<ApiResponse<ConsultationSubmission>>(
        `/consultation/${id}/read`,
        { notes }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.submissions.consultations });
      toast.success('Consultation marked as read');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to mark consultation as read';
      toast.error(message);
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/consultation/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.submissions.consultations });
      toast.success('Consultation deleted successfully');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to delete consultation';
      toast.error(message);
    },
  });
}
