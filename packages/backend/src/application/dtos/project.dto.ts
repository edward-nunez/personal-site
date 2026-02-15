import { z } from 'zod';

/**
 * Validation schema for creating a project
 */
export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().max(500).nullable().optional(),
  technologies: z.array(z.string()).default([]),
  category: z.string().min(1, 'Category is required').max(100),
  tags: z.array(z.string()).default([]),
  githubUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
  godotWebExport: z.string().url().nullable().optional(),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
  startDate: z.string().datetime().or(z.date()).nullable().optional(),
  endDate: z.string().datetime().or(z.date()).nullable().optional(),
  order: z.number().int().min(0).default(0),
});

/**
 * Validation schema for updating a project
 */
export const UpdateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().max(500).nullable().optional(),
  technologies: z.array(z.string()).optional(),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
  githubUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
  godotWebExport: z.string().url().nullable().optional(),
  images: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['completed', 'in-progress', 'archived']).optional(),
  startDate: z.string().datetime().or(z.date()).nullable().optional(),
  endDate: z.string().datetime().or(z.date()).nullable().optional(),
  order: z.number().int().min(0).optional(),
});

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectSchema>;
