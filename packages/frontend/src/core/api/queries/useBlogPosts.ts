import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../keys';
import type { ApiResponse, BlogPost } from '@/types';

interface UseBlogPostsOptions {
  published?: boolean;
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export function useBlogPosts(options?: UseBlogPostsOptions) {
  return useQuery({
    queryKey: options?.category ? queryKeys.blog.byCategory(options.category) : queryKeys.blog.all,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.published !== undefined) {
        params.append('published', String(options.published));
      }
      if (options?.category) {
        params.append('category', options.category);
      }
      if (options?.featured !== undefined) {
        params.append('featured', String(options.featured));
      }
      if (options?.limit) {
        params.append('limit', String(options.limit));
      }
      if (options?.offset) {
        params.append('offset', String(options.offset));
      }

      const url = `/blog${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<ApiResponse<BlogPost[]>>(url);
      return response.data.data;
    },
  });
}

export function useBlogPostBySlug(slug: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.blog.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<BlogPost>>(`/blog/slug/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  const incrementViews = useMutation({
    mutationFn: async (slug: string) => {
      await apiClient.post(`/blog/slug/${slug}/views`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.detail(slug) });
    },
  });

  return { ...query, incrementViews };
}
