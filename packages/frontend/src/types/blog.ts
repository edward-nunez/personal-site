/**
 * BlogPost types aligned with backend entity and DTOs.
 * API response/request shapes; display type for current UI (blocks, date, volume).
 */

import type { ContentBlock } from './content';

/** BlogPost as returned from API (matches backend entity) */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  category: string;
  tags: string[];
  coverImage?: string | null;
  published: boolean;
  publishedAt?: Date | string | null;
  featured: boolean;
  views: number;
  readTime?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Display type for UI: content as blocks, formatted date/volume/readTime for rendering.
 */
export interface BlogPostDisplay extends Omit<BlogPost, 'content' | 'readTime'> {
  content: ContentBlock[];
  /** Formatted date string for display (e.g. from publishedAt) */
  date?: string;
  /** Display label e.g. "Vol.01" (computed from index or stored) */
  volume?: string;
  /** Formatted read time e.g. "6 min" */
  readTime: string;
}
