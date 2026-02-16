import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../client';
import type { ApiResponse, ConsultationSubmission, CreateConsultationInput } from '@/types';

export function useCreateConsultation() {
  return useMutation({
    mutationFn: async (input: CreateConsultationInput) => {
      const response = await apiClient.post<ApiResponse<ConsultationSubmission>>(
        '/consultation',
        input
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Consultation request submitted! We'll review and contact you soon.");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to submit request. Please try again.';
      toast.error(message);
    },
  });
}
