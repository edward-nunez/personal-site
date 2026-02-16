import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '@/types';

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBlogPostInput) => {
      const response = await apiClient.post<ApiResponse<BlogPost>>('/blog', input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.blog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
      toast.success('Blog post created successfully');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to create blog post';
      toast.error(message);
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBlogPostInput }) => {
      const response = await apiClient.put<ApiResponse<BlogPost>>(`/blog/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.blog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.blog.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
      toast.success('Blog post updated successfully');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to update blog post';
      toast.error(message);
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.blog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
      toast.success('Blog post deleted successfully');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to delete blog post';
      toast.error(message);
    },
  });
}
