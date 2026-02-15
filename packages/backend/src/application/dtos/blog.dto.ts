import { z } from 'zod';

/**
 * Validation schema for creating a blog post
 */
export const CreateBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(1000).nullable().optional(),
  category: z.string().min(1, 'Category is required').max(100),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().url().nullable().optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().or(z.date()).nullable().optional(),
  featured: z.boolean().default(false),
  readTime: z.number().int().min(1).nullable().optional(),
});

/**
 * Validation schema for updating a blog post
 */
export const UpdateBlogPostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(1000).nullable().optional(),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().nullable().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().datetime().or(z.date()).nullable().optional(),
  featured: z.boolean().optional(),
  readTime: z.number().int().min(1).nullable().optional(),
});

export type CreateBlogPostDTO = z.infer<typeof CreateBlogPostSchema>;
export type UpdateBlogPostDTO = z.infer<typeof UpdateBlogPostSchema>;
