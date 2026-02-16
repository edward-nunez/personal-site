import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../client';
import type { ApiResponse, ContactSubmission, CreateContactInput } from '@/types';

export function useCreateContact() {
  return useMutation({
    mutationFn: async (input: CreateContactInput) => {
      const response = await apiClient.post<ApiResponse<ContactSubmission>>('/contact', input);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to send message. Please try again.';
      toast.error(message);
    },
  });
}
