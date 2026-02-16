import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type {
  ApiResponse,
  Experience,
  CreateExperienceInput,
  UpdateExperienceInput,
} from '@/types';

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateExperienceInput) => {
      const response = await apiClient.post<ApiResponse<Experience>>('/experiences', input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.experiences.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.all });
      toast.success('Experience created successfully');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to create experience';
      toast.error(message);
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExperienceInput }) => {
      const response = await apiClient.put<ApiResponse<Experience>>(`/experiences/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.experiences.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.experiences.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.all });
      toast.success('Experience updated successfully');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to update experience';
      toast.error(message);
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/experiences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.experiences.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.all });
      toast.success('Experience deleted successfully');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to delete experience';
      toast.error(message);
    },
  });
}
