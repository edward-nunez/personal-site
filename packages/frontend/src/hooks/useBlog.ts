import { useQuery } from '@tanstack/react-query';
import type { BlogPostDisplay } from '@/types';
import { fetchBlogPosts, fetchBlogPostBySlug, apiBlogToDisplay } from '@/lib/blog-api';

const BLOG_KEYS = {
  all: ['blog'] as const,
  list: (options?: Record<string, unknown>) => ['blog', 'list', options] as const,
  slug: (slug: string) => ['blog', 'slug', slug] as const,
};

/**
 * Fetch all published blog posts for the blog section and archive.
 * Returns data as BlogPostDisplay[] (with content as blocks, date, volume, readTime).
 */
export function useBlogPosts(options: { published?: boolean; limit?: number } = {}) {
  const query = useQuery({
    queryKey: BLOG_KEYS.list({ published: true, ...options }),
    queryFn: async () => {
      const posts = await fetchBlogPosts({
        published: true,
        orderBy: 'publishedAt',
        orderDirection: 'desc',
        ...options,
      });
      return posts.map((p, i) => apiBlogToDisplay(p, i)) as BlogPostDisplay[];
    },
  });
  return {
    ...query,
    posts: query.data ?? [],
  };
}

/**
 * Fetch a single blog post by slug. Returns null if not found.
 */
export function useBlogPostBySlug(slug: string | undefined) {
  const query = useQuery({
    queryKey: BLOG_KEYS.slug(slug ?? ''),
    queryFn: async () => {
      if (!slug) return null;
      const post = await fetchBlogPostBySlug(slug);
      return post ? apiBlogToDisplay(post) : null;
    },
    enabled: !!slug,
  });
  return {
    ...query,
    post: query.data ?? null,
  };
}
