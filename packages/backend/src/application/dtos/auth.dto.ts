import { z } from 'zod';

/**
 * Validation schema for admin login
 */
export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Validation schema for creating admin user
 */
export const CreateAdminUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  firstName: z.string().max(100).nullable().optional(),
  lastName: z.string().max(100).nullable().optional(),
  active: z.boolean().default(true),
});

/**
 * Validation schema for updating admin user
 */
export const UpdateAdminUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(100).optional(),
  firstName: z.string().max(100).nullable().optional(),
  lastName: z.string().max(100).nullable().optional(),
  active: z.boolean().optional(),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
export type CreateAdminUserDTO = z.infer<typeof CreateAdminUserSchema>;
export type UpdateAdminUserDTO = z.infer<typeof UpdateAdminUserSchema>;
