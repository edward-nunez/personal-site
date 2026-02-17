import type { BlogPost, BlogPostDisplay } from '@/types';
import { apiGet } from './api';
import { parseBlogContent } from './parseBlogContent';
import { formatReadTime, formatVolume } from '@/utils/formatters';

const BLOG_BASE = '/api/blog';

export type BlogListOptions = {
  published?: boolean;
  featured?: boolean;
  category?: string;
  tag?: string;
  orderBy?: 'publishedAt' | 'createdAt' | 'views';
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

/**
 * Fetch all blog posts from the API.
 */
export async function fetchBlogPosts(options: BlogListOptions = {}): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  if (options.published !== undefined) params.set('published', String(options.published));
  if (options.featured !== undefined) params.set('featured', String(options.featured));
  if (options.category) params.set('category', options.category);
  if (options.tag) params.set('tag', options.tag);
  if (options.orderBy) params.set('orderBy', options.orderBy);
  if (options.orderDirection) params.set('orderDirection', options.orderDirection);
  if (options.limit !== undefined) params.set('limit', String(options.limit));
  if (options.offset !== undefined) params.set('offset', String(options.offset));
  const query = params.toString();
  const path = query ? `${BLOG_BASE}?${query}` : BLOG_BASE;
  return apiGet<BlogPost[]>(path);
}

/**
 * Fetch a single blog post by slug.
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await apiGet<BlogPost>(`${BLOG_BASE}/slug/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toISOString().slice(0, 10);
}

/**
 * Convert API BlogPost to BlogPostDisplay (content as blocks, formatted date/readTime/volume).
 */
export function apiBlogToDisplay(post: BlogPost, index?: number): BlogPostDisplay {
  return {
    ...post,
    content: parseBlogContent(post.content),
    date: formatDate(post.publishedAt),
    volume: index !== undefined ? formatVolume(index) : undefined,
    readTime: post.readTime != null ? formatReadTime(post.readTime) : '0 min',
  };
}
