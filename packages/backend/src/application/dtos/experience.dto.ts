import { z } from 'zod';

/**
 * Validation schema for creating an experience
 */
export const CreateExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  location: z.string().max(200).nullable().optional(),
  employmentType: z.string().max(100).nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

/**
 * Validation schema for updating an experience
 */
export const UpdateExperienceSchema = z.object({
  company: z.string().min(1).max(200).optional(),
  role: z.string().min(1).max(200).optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  achievements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  location: z.string().max(200).nullable().optional(),
  employmentType: z.string().max(100).nullable().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type CreateExperienceDTO = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceDTO = z.infer<typeof UpdateExperienceSchema>;
