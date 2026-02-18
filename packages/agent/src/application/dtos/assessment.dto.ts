import { z } from 'zod';

// Job Fit Assessment Request DTO
export const JobFitRequestSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required').max(200),
  jobDescription: z.string().min(1, 'Job description is required').max(5000),
  company: z.string().max(200).optional(),
  requiredSkills: z.array(z.string()).optional(),
  yearsExperience: z.number().int().positive().optional(),
  location: z.string().max(200).optional(),
  type: z.enum(['full-time', 'contract', 'part-time']).optional(),
});

export type JobFitRequest = z.infer<typeof JobFitRequestSchema>;

// Conversation Message Request DTO
export const ConversationRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000),
  context: z.enum(['general', 'technical', 'culture']).optional(),
  sessionId: z.string().uuid().optional(), // Optional session ID to continue conversation
});

export type ConversationRequest = z.infer<typeof ConversationRequestSchema>;

// Standard API Response wrapper
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
