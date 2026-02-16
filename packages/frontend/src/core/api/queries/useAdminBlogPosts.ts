import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, BlogPost } from '@/types';

export function useAdminBlogPosts() {
  return useQuery({
    queryKey: queryKeys.admin.blog.all,
    queryFn: async () => {
      // Fetch all blog posts including unpublished ones
      const response = await apiClient.get<ApiResponse<BlogPost[]>>('/blog');
      return response.data.data;
    },
  });
}

export function useAdminBlogPostById(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.blog.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<BlogPost>>(`/blog/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}
